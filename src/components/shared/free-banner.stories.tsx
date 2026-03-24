import type { Meta, StoryObj } from "@storybook/react";
import { FreeBanner } from "@/components/shared/free-banner";

const meta = {
  title: "Shared/FreeBanner",
  component: FreeBanner,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    show: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof FreeBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  args: {
    show: true,
  },
};

export const Hidden: Story = {
  args: {
    show: false,
  },
};

export const InDashboard: Story = {
  args: {
    show: true,
  },
  render: (args) => (
    <div className="w-full max-w-2xl space-y-4">
      <FreeBanner {...args} />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Dashboard Content</h2>
        <p className="text-sm text-muted-foreground">
          The free banner appears above other content
        </p>
      </div>
    </div>
  ),
};

export const HiddenInDashboard: Story = {
  args: {
    show: false,
  },
  render: (args) => (
    <div className="w-full max-w-2xl space-y-4">
      <FreeBanner {...args} />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Dashboard Content</h2>
        <p className="text-sm text-muted-foreground">
          No banner is shown for PRO users
        </p>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    show: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
