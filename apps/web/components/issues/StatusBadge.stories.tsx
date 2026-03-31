// components/issues/StatusBadge.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./StatusBadge";
import { IssueStatus } from "@civicpulse/shared";

const meta: Meta<typeof StatusBadge> = {
  title: "Issues/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"], // generates documentation automatically from props
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

// Each named export is one story — one variant of the component
export const Pending: Story = {
  args: { status: IssueStatus.PENDING },
};

export const UnderReview: Story = {
  args: { status: IssueStatus.UNDER_REVIEW },
};

export const InProgress: Story = {
  args: { status: IssueStatus.IN_PROGRESS },
};

export const Resolved: Story = {
  args: { status: IssueStatus.RESOLVED },
};

export const Rejected: Story = {
  args: { status: IssueStatus.REJECTED },
};

// A story showing all variants together — useful for quick visual comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-4">
      {Object.values(IssueStatus).map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
