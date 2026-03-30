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
      className={`btn-primary w-full ${className}`}
    >
      {pending && (
        <span
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
