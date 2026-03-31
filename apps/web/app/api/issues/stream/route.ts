// app/api/issues/stream/route.ts
// This Route Handler implements a Server-Sent Events endpoint.
// When a client connects to GET /api/issues/stream, Next.js keeps the
// HTTP connection open and this handler pushes events down it as they occur.
//
// The SSE protocol is simple plain text. Each event looks like:
//   data: {"id":"123","title":"Pothole on Ngong Road"}\n\n
// The double newline is the event delimiter — the browser's EventSource
// API splits the stream on \n\n and fires an event for each one.

import { NextRequest } from "next/server";
import type { IssueMapPin } from "@civicpulse/shared";

// In production (Week 16), this will be a Redis pub/sub subscription.
// For now, we simulate new issues arriving every few seconds so you can
// see the real-time mechanism working end-to-end before the backend exists.
function createMockIssueStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  // Mock issues that will be "pushed" to connected clients
  const mockNewIssues: IssueMapPin[] = [
    {
      id: "live-1",
      title: "Flooding on Mombasa Road near SGR station",
      category: "water_sanitation" as const,
      status: "pending" as const,
      location: {
        latitude: -1.3192,
        longitude: 36.8251,
        ward: "Makadara Ward",
      },
      voteCount: 0,
    },
    {
      id: "live-2",
      title: "Collapsed wall blocking pavement — Kilimani",
      category: "public_safety" as const,
      status: "pending" as const,
      location: {
        latitude: -1.2897,
        longitude: 36.7789,
        ward: "Kilimani Ward",
      },
      voteCount: 0,
    },
    {
      id: "live-3",
      title: "Overflowing manhole — Industrial Area",
      category: "water_sanitation" as const,
      status: "pending" as const,
      location: {
        latitude: -1.3041,
        longitude: 36.8219,
        ward: "Makongeni Ward",
      },
      voteCount: 0,
    },
  ];

  let issueIndex = 0;

  return new ReadableStream({
    start(controller) {
      // Send an initial connection confirmation event.
      // The SSE spec allows named events — 'connected' lets the client
      // distinguish this handshake event from actual issue events.
      const connectEvent = `event: connected\ndata: ${JSON.stringify({ message: "CivicPulse live feed connected" })}\n\n`;
      controller.enqueue(encoder.encode(connectEvent));

      // Push a new mock issue every 8 seconds to demonstrate real-time updates.
      // In production this interval is replaced by a Redis subscription that
      // fires instantly when a real citizen submits a new issue.
      const interval = setInterval(() => {
        if (issueIndex >= mockNewIssues.length) {
          // We have sent all mock issues — keep the connection alive with
          // a heartbeat comment. SSE comments start with ':' and are
          // ignored by EventSource but prevent proxy servers and load
          // balancers from closing idle connections due to timeout.
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
          return;
        }

        const issue = mockNewIssues[issueIndex];
        issueIndex++;

        // Format as a named SSE event — 'new-issue' is the event name
        // the client will listen for. Using named events lets us send
        // different event types over the same connection:
        // 'new-issue', 'status-changed', 'vote-updated' etc.
        const sseEvent = `event: new-issue\ndata: ${JSON.stringify(issue)}\n\n`;

        controller.enqueue(encoder.encode(sseEvent));
      }, 8000);

      // The cancel function runs when the client disconnects.
      // Clearing the interval prevents a memory leak — the interval
      // would otherwise keep running even with no one listening.
      return () => {
        clearInterval(interval);
      };
    },
  });
}

export async function GET(request: NextRequest) {
  // Read the Last-Event-ID header — the browser's EventSource API
  // automatically sends this when reconnecting after a dropped connection.
  // It tells us the ID of the last event the client received, so we can
  // replay any events they missed. In production we implement this with
  // Redis Streams. For now we log it and note it for Week 16.
  const lastEventId = request.headers.get("Last-Event-ID");
  if (lastEventId) {
    console.log(`Client reconnecting from event ID: ${lastEventId}`);
  }

  const stream = createMockIssueStream();

  return new Response(stream, {
    headers: {
      // text/event-stream is the MIME type that tells the browser
      // this is an SSE connection, not a regular HTTP response
      "Content-Type": "text/event-stream",

      // no-cache is required for SSE — it prevents the browser and
      // any intermediate proxies from buffering the response.
      // Buffering would mean events accumulate and arrive in batches
      // rather than individually as they are pushed.
      "Cache-Control": "no-cache, no-transform",

      // keep-alive tells the TCP layer to maintain the connection
      // even when no data is flowing (during the heartbeat gaps)
      Connection: "keep-alive",

      // This header is required for SSE to work through Next.js's
      // streaming infrastructure — it disables response buffering
      // at the Node.js HTTP layer
      "X-Accel-Buffering": "no",
    },
  });
}
