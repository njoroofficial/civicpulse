// app/(dashboard)/dashboard/@issuetable/page.tsx

import { cacheLife } from "next/cache";

async function getPendingIssues() {
  "use cache";
  cacheLife("seconds"); // Officials need near-real-time data
  return [
    {
      id: "1",
      title: "Pothole on Ngong Road",
      ward: "Kilimani",
      votes: 234,
      status: "pending",
    },
    {
      id: "2",
      title: "Water pipe burst — Westlands",
      ward: "Westlands",
      votes: 187,
      status: "in_progress",
    },
    {
      id: "3",
      title: "Broken street lights — Hurlingham",
      ward: "Dagoretti North",
      votes: 95,
      status: "under_review",
    },
  ];
}

export default async function IssueTableSlot() {
  const issues = await getPendingIssues();

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold">Issues Requiring Attention</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {["Issue", "Ward", "Votes", "Status"].map((h) => (
              <th
                key={h}
                className="text-left px-6 py-3 font-medium text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {issues.map((issue) => (
            <tr key={issue.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium">{issue.title}</td>
              <td className="px-6 py-4 text-muted-foreground">{issue.ward}</td>
              <td className="px-6 py-4 text-green-600 font-medium">
                ▲ {issue.votes}
              </td>
              <td className="px-6 py-4">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full capitalize">
                  {issue.status.replace(/_/g, " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
