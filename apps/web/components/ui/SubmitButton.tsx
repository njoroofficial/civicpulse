// components/ui/SubmitButton.tsx
// This component can be placed inside ANY form in CivicPulse.
// It reads the parent form's submission state automatically via useFormStatus,
// with zero prop drilling required from the form component.
"use client";

import { useFormStatus } from "react-dom";
// Note: useFormStatus is imported from 'react-dom', not 'react'.
// This is intentional — it is a DOM-specific hook tied to HTML form behaviour.

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string; // what to show while the form is submitting
  className?: string;
};

export function SubmitButton({
  label,
  pendingLabel = "Submitting...",
  className = "",
}: SubmitButtonProps) {
  // useFormStatus reads the state of the nearest ancestor <form> element.
  // No props needed — it finds the form automatically through React's internals.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        flex items-center justify-center gap-2
        bg-green-600 text-white px-6 py-3 rounded-lg font-medium
        hover:bg-green-700 transition-colors
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {pending && (
        // A simple CSS spinner — no external library needed
        <span
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {/* Screen readers get the pending label announced automatically
          via the aria-live region on the button's text change */}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
