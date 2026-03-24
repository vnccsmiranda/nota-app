import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description or subtitle</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with description in the header.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card has a footer with actions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMultipleSections: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Complete Card</CardTitle>
        <CardDescription>A card with all possible sections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Section 1</h4>
          <p className="text-sm text-muted-foreground">
            Content for the first section.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Section 2</h4>
          <p className="text-sm text-muted-foreground">
            Content for the second section.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const InvoiceCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Nota Fiscal #NF-001</CardTitle>
        <CardDescription>Emitida em 23 de março de 2026</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Cliente</p>
            <p className="font-medium">Empresa XYZ</p>
          </div>
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="font-medium">R$ 1.234,56</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Visualizar
        </Button>
        <Button variant="outline" className="flex-1">
          Baixar
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const MinimalCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent className="pt-6">
        <p>Minimal card with only content.</p>
      </CardContent>
    </Card>
  ),
};
