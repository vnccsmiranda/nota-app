import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "xl", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
    size: "default",
  },
};

export const Success: Story = {
  args: {
    children: "Approve",
    variant: "success",
    size: "default",
  },
};

export const SmallSize: Story = {
  args: {
    children: "Small",
    variant: "default",
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    children: "Large",
    variant: "default",
    size: "lg",
  },
};

export const ExtraLargeSize: Story = {
  args: {
    children: "Extra Large",
    variant: "default",
    size: "xl",
  },
};

export const IconButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    children: "✓",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    variant: "default",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon">+</Button>
    </div>
  ),
};
