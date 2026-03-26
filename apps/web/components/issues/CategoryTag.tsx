// src/components/issues/CategoryTag.tsx
import { IssueCategory } from "@civicpulse/shared";

const categoryConfig: Record<IssueCategory, { label: string; emoji: string }> =
  {
    road_infrastructure: { label: "Road Infrastructure", emoji: "🛣️" },
    water_sanitation: { label: "Water & Sanitation", emoji: "💧" },
    electricity: { label: "Electricity", emoji: "⚡" },
    waste_management: { label: "Waste Management", emoji: "🗑️" },
    public_safety: { label: "Public Safety", emoji: "🚨" },
    environment: { label: "Environment", emoji: "🌿" },
    other: { label: "Other", emoji: "📌" },
  };

type CategoryTagProps = {
  category: IssueCategory;
};

export function CategoryTag({ category }: CategoryTagProps) {
  const config = categoryConfig[category];

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span role="img" aria-label={config.label}>
        {config.emoji}
      </span>
      {config.label}
    </span>
  );
}
