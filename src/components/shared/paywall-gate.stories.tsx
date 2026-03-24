import type { Meta, StoryObj } from "@storybook/react";
import { PaywallGate } from "@/components/shared/paywall-gate";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Shared/PaywallGate",
  component: PaywallGate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    allowed: {
      control: "boolean",
    },
    current: {
      control: "number",
    },
    limit: {
      control: "number",
    },
    resource: {
      control: "text",
    },
  },
} satisfies Meta<typeof PaywallGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Allowed: Story = {
  args: {
    allowed: true,
    current: 0,
    limit: 1,
    resource: "notas",
    children: (
      <Button>
        Criar Nova Nota
      </Button>
    ),
  },
};

export const Blocked: Story = {
  args: {
    allowed: false,
    current: 1,
    limit: 1,
    resource: "notas",
    children: (
      <Button>
        Criar Nova Nota
      </Button>
    ),
  },
};

export const BlockedMultipleResources: Story = {
  args: {
    allowed: false,
    current: 5,
    limit: 3,
    resource: "empresas",
    children: (
      <Button>
        Adicionar Empresa
      </Button>
    ),
  },
};

export const BlockedProducts: Story = {
  args: {
    allowed: false,
    current: 10,
    limit: 10,
    resource: "produtos",
    children: (
      <Button variant="secondary">
        Novo Produto
      </Button>
    ),
  },
};

export const AllowedHighUsage: Story = {
  args: {
    allowed: true,
    current: 8,
    limit: 10,
    resource: "clientes",
    children: (
      <Button variant="outline">
        Adicionar Cliente
      </Button>
    ),
  },
};

export const WrappedContent: Story = {
  args: {
    allowed: false,
    current: 1,
    limit: 1,
    resource: "notas fiscais",
    children: (
      <div className="w-96 p-4 border rounded-lg bg-card">
        <h3 className="font-semibold mb-2">Próxima Nota Fiscal</h3>
        <p className="text-sm text-muted-foreground">
          Clique para emitir uma nova nota fiscal
        </p>
      </div>
    ),
  },
};
