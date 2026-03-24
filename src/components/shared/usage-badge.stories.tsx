import type { Meta, StoryObj } from "@storybook/react";
import { UsageBadge } from "@/components/shared/usage-badge";

const meta = {
  title: "Shared/UsageBadge",
  component: UsageBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    current: {
      control: "number",
    },
    limit: {
      control: "number",
    },
    label: {
      control: "text",
    },
  },
} satisfies Meta<typeof UsageBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LowUsage: Story = {
  args: {
    current: 1,
    limit: 10,
    label: "notas",
  },
};

export const MediumUsage: Story = {
  args: {
    current: 5,
    limit: 10,
    label: "notas",
  },
};

export const HighUsage: Story = {
  args: {
    current: 8,
    limit: 10,
    label: "notas",
  },
};

export const AtLimit: Story = {
  args: {
    current: 10,
    limit: 10,
    label: "notas",
  },
};

export const ExceededLimit: Story = {
  args: {
    current: 11,
    limit: 10,
    label: "notas",
  },
};

export const UnlimitedPlan: Story = {
  args: {
    current: 100,
    limit: Infinity,
    label: "notas",
  },
};

export const Products: Story = {
  args: {
    current: 7,
    limit: 10,
    label: "produtos",
  },
};

export const Customers: Story = {
  args: {
    current: 9,
    limit: 10,
    label: "clientes",
  },
};

export const Companies: Story = {
  args: {
    current: 1,
    limit: 1,
    label: "empresas",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xs">
      <div>
        <p className="text-sm font-medium mb-2">Low Usage (1/10)</p>
        <UsageBadge current={1} limit={10} label="notas" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Medium Usage (5/10)</p>
        <UsageBadge current={5} limit={10} label="notas" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">High Usage (8/10)</p>
        <UsageBadge current={8} limit={10} label="notas" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">At Limit (10/10)</p>
        <UsageBadge current={10} limit={10} label="notas" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Unlimited</p>
        <UsageBadge current={100} limit={Infinity} label="notas" />
      </div>
    </div>
  ),
};
