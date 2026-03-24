import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "success",
        "warning",
        "error",
        "draft",
        "pending",
        "authorized",
        "rejected",
        "cancelled",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const Draft: Story = {
  args: {
    children: "Draft",
    variant: "draft",
  },
};

export const Pending: Story = {
  args: {
    children: "Pending",
    variant: "pending",
  },
};

export const Authorized: Story = {
  args: {
    children: "Authorized",
    variant: "authorized",
  },
};

export const Rejected: Story = {
  args: {
    children: "Rejected",
    variant: "rejected",
  },
};

export const Cancelled: Story = {
  args: {
    children: "Cancelled",
    variant: "cancelled",
  },
};

export const InvoiceStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="draft">Rascunho</Badge>
      <Badge variant="pending">Pendente</Badge>
      <Badge variant="authorized">Autorizada</Badge>
      <Badge variant="rejected">Rejeitada</Badge>
      <Badge variant="cancelled">Cancelada</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};
