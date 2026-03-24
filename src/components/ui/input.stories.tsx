import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "date"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    type: "text",
  },
  render: (args) => <Input {...args} />,
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Digite seu email...",
    type: "text",
  },
  render: (args) => <Input {...args} />,
};

export const Email: Story = {
  args: {
    placeholder: "seu@email.com",
    type: "email",
  },
  render: (args) => <Input {...args} />,
};

export const Password: Story = {
  args: {
    placeholder: "Sua senha",
    type: "password",
  },
  render: (args) => <Input {...args} />,
};

export const Number: Story = {
  args: {
    placeholder: "12.345",
    type: "number",
  },
  render: (args) => <Input {...args} />,
};

export const Date: Story = {
  args: {
    type: "date",
  },
  render: (args) => <Input {...args} />,
};

export const Disabled: Story = {
  args: {
    placeholder: "Desabilitado",
    type: "text",
    disabled: true,
  },
  render: (args) => <Input {...args} />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="seu@email.com" type="email" />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    type: "text",
    defaultValue: "Valor pré-preenchido",
  },
  render: (args) => <Input {...args} />,
};

export const AllTypes: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <Label htmlFor="text">Text</Label>
        <Input id="text" placeholder="Text input" type="text" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Email input" type="email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Password input" type="password" />
      </div>
      <div>
        <Label htmlFor="number">Number</Label>
        <Input id="number" placeholder="Number input" type="number" />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
    </div>
  ),
};
