import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "dark", value: "#0F0F0F" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals?.backgrounds?.value === "#0F0F0F";
      return (
        <div className={isDark ? "dark" : ""} style={{ padding: "1rem" }}>
          <Story />
        </div>
      );
    },
  ],
};
export default preview;
