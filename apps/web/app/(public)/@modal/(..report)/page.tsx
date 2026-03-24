// app/(public)/@modal/(..report)/page.tsx
// The MODAL version — shown when navigating from within the app.
// Same URL (/report), but a completely different presentation.
// 'use client' is needed here because the modal needs to close on backdrop click,
// which requires a browser event listener.
"use client";

import { useRouter } from "next/navigation";

export default function ReportModal() {
  const router = useRouter();

  return (
    // Fixed backdrop — covers the entire screen
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => router.back()} // clicking the backdrop closes the modal
    >
      {/* The modal panel — stopPropagation prevents backdrop click from firing
          when clicking inside the panel itself */}
      <div
        className="bg-background rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Report an Issue</h2>
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground text-center py-8">
            Multi-step reporting form — coming in Week 6
          </p>
        </div>
      </div>
    </div>
  );
}
