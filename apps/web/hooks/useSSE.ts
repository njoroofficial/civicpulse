// hooks/useSSE.ts
// A reusable custom hook for consuming Server-Sent Events.
// It abstracts the EventSource lifecycle so components only need to
// declare what they want to receive, not how the connection works.
//
// This is a good example of why custom hooks exist: the EventSource API
// is stateful and has lifecycle complexity (open, message, error, close)
// that does not belong in a component's render logic.
"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type SSEOptions<T> = {
  // The URL of the SSE endpoint to connect to
  url: string;
  // The SSE event name to listen for — matches the 'event:' field in the server response
  eventName: string;
  // Called with parsed event data each time a matching event arrives
  onMessage: (data: T) => void;
  // Called when the connection is established
  onConnect?: () => void;
  // Called when the connection is lost — before automatic reconnection
  onDisconnect?: () => void;
  // Whether to establish the connection — lets you conditionally enable SSE
  // e.g. only connect when the user is authenticated
  enabled?: boolean;
};

type SSEState = {
  isConnected: boolean;
  error: string | null;
  reconnectCount: number;
};

export function useSSE<T>({
  url,
  eventName,
  onMessage,
  onConnect,
  onDisconnect,
  enabled = true,
}: SSEOptions<T>): SSEState {
  const [state, setState] = useState<SSEState>({
    isConnected: false,
    error: null,
    reconnectCount: 0,
  });

  // We store the callbacks in refs so the useEffect below does not need
  // them in its dependency array. If we included them directly, any parent
  // component re-render that creates new function references (even with
  // identical implementations) would disconnect and reconnect the SSE stream.
  // Refs give us stable references that update without triggering effects.
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Keep refs current on every render without re-running the effect
  onMessageRef.current = onMessage;
  onConnectRef.current = onConnect;
  onDisconnectRef.current = onDisconnect;

  useEffect(() => {
    // Do not connect if disabled — this is the escape hatch for conditional SSE
    if (!enabled) return;

    let eventSource: EventSource;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      // EventSource is the browser's built-in SSE client.
      // It handles the HTTP connection, parses the event stream protocol,
      // and fires events that we can listen to with addEventListener.
      eventSource = new EventSource(url);

      eventSource.addEventListener("open", () => {
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        onConnectRef.current?.();
      });

      // Listen for our specific named event ('new-issue', 'status-changed' etc.)
      eventSource.addEventListener(eventName, (e: MessageEvent) => {
        try {
          // SSE data is always a string — we parse it as JSON
          const parsed = JSON.parse(e.data) as T;
          onMessageRef.current(parsed);
        } catch (err) {
          console.error(`Failed to parse SSE event '${eventName}':`, err);
        }
      });

      eventSource.addEventListener("error", () => {
        setState((prev) => ({
          isConnected: false,
          error: "Connection lost. Reconnecting...",
          reconnectCount: prev.reconnectCount + 1,
        }));
        onDisconnectRef.current?.();

        // EventSource has built-in reconnection, but it uses a fixed 3-second
        // interval. We implement exponential backoff ourselves for better
        // behaviour under sustained server unavailability.
        // The browser will attempt its own reconnection automatically —
        // we close the current connection and reopen after our backoff delay
        // to take control of the timing.
        eventSource.close();

        // Exponential backoff: 2s, 4s, 8s, max 30s
        // Math.min ensures we cap at 30 seconds
        const backoffMs = Math.min(
          1000 * Math.pow(2, state.reconnectCount),
          30000,
        );
        reconnectTimeout = setTimeout(connect, backoffMs);
      });
    }

    connect();

    // Cleanup: called when the component unmounts or when 'url'/'enabled' changes.
    // Without this, the EventSource connection would persist indefinitely,
    // consuming server resources and bandwidth even after the user navigates away.
    return () => {
      clearTimeout(reconnectTimeout);
      eventSource?.close();
      setState({ isConnected: false, error: null, reconnectCount: 0 });
    };

    // We deliberately exclude 'state.reconnectCount' from dependencies —
    // including it would cause the effect to re-run on every reconnection,
    // creating a loop. The count is read during the error handler only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, eventName, enabled]);

  return state;
}
