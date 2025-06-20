import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import GameSetup from "./GameSetup";

const meta = {
  component: GameSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onStartGame: fn(),
  },
} satisfies Meta<typeof GameSetup>;

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
          "デフォルトのGameSetup。ユーザーはCPUの難易度と石の色を選択してゲームを開始できます。",
      },
    },
  },
};
