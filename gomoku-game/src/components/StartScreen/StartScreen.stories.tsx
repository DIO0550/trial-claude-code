import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import StartScreen from "./StartScreen";

const meta = {
  component: StartScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onStartGame: fn(),
  },
} satisfies Meta<typeof StartScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStartGame: fn(),
  },
};

export const WithInteraction: Story = {
  args: {
    onStartGame: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "デフォルトのStartScreen。ユーザーはCPUの難易度と石の色を選択してゲームを開始できます。",
      },
    },
  },
};
