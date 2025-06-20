import type { Meta, StoryObj } from "@storybook/nextjs";
import TurnIndicator from "./TurnIndicator";

const meta = {
  component: TurnIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TurnIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayerTurn: Story = {
  args: {
    playerColor: "black",
  },
  parameters: {
    docs: {
      description: {
        story:
          "プレイヤー（黒石）のターンを表示。プレイヤーが先手の場合の手番表示。",
      },
    },
  },
};

export const CpuTurn: Story = {
  args: {
    playerColor: "white",
  },
  parameters: {
    docs: {
      description: {
        story:
          "CPU（先手）のターンを表示。プレイヤーが白石（後手）の場合の手番表示。",
      },
    },
  },
};