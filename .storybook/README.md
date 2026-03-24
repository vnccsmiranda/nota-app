# Storybook 8 Configuration for +NOTA

Storybook has been configured for the +NOTA Next.js project with full TypeScript support and Tailwind CSS integration.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Storybook
```bash
npm run storybook
```

Storybook will launch at `http://localhost:6006`

### Build Storybook (Production)
```bash
npm run build-storybook
```

## Configuration Files

- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Global preview settings with light/dark mode support

## Available Stories

### UI Components
- **Button** (`src/components/ui/button.stories.tsx`)
  - All variants: default, destructive, outline, secondary, ghost, link, success
  - All sizes: default, sm, lg, xl, icon
  - States: default, disabled

- **Input** (`src/components/ui/input.stories.tsx`)
  - Input types: text, email, password, number, date
  - States: default, disabled, with label, with value

- **Badge** (`src/components/ui/badge.stories.tsx`)
  - All variants including invoice statuses: default, secondary, destructive, outline, success, warning, error, draft, pending, authorized, rejected, cancelled
  - Invoice status badge compositions

- **Card** (`src/components/ui/card.stories.tsx`)
  - Basic card structure
  - Cards with header, title, description, content, footer
  - Real-world examples (invoice card)
  - Minimal card variant

### Shared Components
- **PaywallGate** (`src/components/shared/paywall-gate.stories.tsx`)
  - Allowed state (no gate)
  - Blocked state (gate active)
  - Various resource types and limits

- **UsageBadge** (`src/components/shared/usage-badge.stories.tsx`)
  - Low usage state
  - Medium usage state
  - High usage state (>70%)
  - At limit state
  - Exceeded limit state
  - Unlimited plan state

- **FreeBanner** (`src/components/shared/free-banner.stories.tsx`)
  - Visible state
  - Hidden state
  - Dashboard integration examples
  - Dark mode support

## Features

- **Light/Dark Mode Support**: Toggle between light and dark themes in the Storybook UI
- **TypeScript Strict Mode**: All stories use strict TypeScript typing
- **Responsive Design**: Test components at different viewport sizes
- **Interactive Controls**: Adjust props in real-time using Storybook controls
- **Tailwind CSS**: Full integration with project's Tailwind design tokens
- **shadcn/ui Components**: All components are built on shadcn/ui patterns

## Adding New Stories

Follow the CSF3 format when adding new stories:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@/components/my-component";

const meta = {
  title: "Category/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define prop controls here
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

## Tips

- Use the `render` function for complex stories with multiple components
- Use `argTypes` to control which props appear in the controls panel
- Tag stories with `["autodocs"]` to auto-generate documentation
- Use descriptive names for stories to improve discoverability
- Group related stories using the title hierarchy (e.g., "UI/Button", "Shared/PaywallGate")
