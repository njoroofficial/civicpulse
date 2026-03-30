// app/(public)/report/page.tsx
// This is a Server Component. The form's action is a Server Action —
// a function that runs on the server when the form is submitted.
// No API route needed, no fetch() call from the client — React handles
// the network boundary automatically.

import { SubmitButton } from "@/components/ui/SubmitButton";
import { redirect } from "next/navigation";

// The 'use server' directive makes this an async function that runs
// on the server when the form is submitted. It receives the FormData
// object populated by the browser's native form serialisation.
// We will move this to a separate actions.ts file in Week 6 —
// for now it lives here for clarity.
async function submitIssueAction(formData: FormData) {
  "use server";

  // Extract values from the form submission
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  // Basic server-side validation — never trust client-side validation alone
  if (!title || title.length < 10) {
    // In Week 6 we use useFormState to send errors back to the form.
    // For now, we demonstrate the happy path.
    throw new Error("Title must be at least 10 characters");
  }

  // In Week 12, this becomes a real call to our FastAPI backend.
  // For now, simulate the async work of saving to the database.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // After a successful submission, redirect to the issues list.
  // redirect() in a Server Action sends a 302 response — the browser
  // navigates to /issues automatically.
  redirect("/issues");
}

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
      <p className="text-muted-foreground mb-8">
        Help improve Nairobi by reporting infrastructure problems in your area.
      </p>

      {/* The 'action' prop on <form> accepts a Server Action directly.
          When submitted, React serialises the form data and calls the
          server function — no fetch(), no API route, no client JS for the submission itself. */}
      <form action={submitIssueAction} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Issue Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Large pothole on Ngong Road near Junction Mall"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            placeholder="Describe the issue in detail — location, severity, how long it has been there..."
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a category...</option>
            <option value="road_infrastructure">🛣️ Road Infrastructure</option>
            <option value="water_sanitation">💧 Water & Sanitation</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="waste_management">🗑️ Waste Management</option>
            <option value="public_safety">🚨 Public Safety</option>
            <option value="environment">🌿 Environment</option>
            <option value="other">📌 Other</option>
          </select>
        </div>

        {/* SubmitButton sits inside the form and reads its submission state
            via useFormStatus — zero prop drilling from this parent component. */}
        <SubmitButton
          label="Submit Issue Report"
          pendingLabel="Submitting your report..."
          className="w-full"
        />
      </form>
    </div>
  );
}
