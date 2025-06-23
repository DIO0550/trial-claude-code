import type { Meta, StoryObj } from "@storybook/nextjs";
import Board from "./Board";

const meta = {
  component: Board,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlackPlayerBoard: Story = {
  args: {
    playerColor: "black",
  },
  parameters: {
    docs: {
      description: {
        story: "黒石プレイヤー用のゲームボード。15×15のグリッドと座標ポイントが表示される。",
      },
    },
  },
};

export const WhitePlayerBoard: Story = {
  args: {
    playerColor: "white",
  },
  parameters: {
    docs: {
      description: {
        story: "白石プレイヤー用のゲームボード。15×15のグリッドと座標ポイントが表示される。",
      },
    },
  },
};

export const EmptyBoard: Story = {
  args: {
    playerColor: "black",
  },
  parameters: {
    docs: {
      description: {
        story: "初期状態の空のゲームボード。石は配置されておらず、すべてのマスがクリック可能。",
      },
    },
  },
};