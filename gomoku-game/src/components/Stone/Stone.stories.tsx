import type { Meta, StoryObj } from "@storybook/nextjs";
import Stone from "./Stone";

const meta = {
  component: Stone,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlackStone: Story = {
  args: {
    color: "black",
  },
  parameters: {
    docs: {
      description: {
        story: "黒石の表示。先手のプレイヤーが使用する石。",
      },
    },
  },
};

export const WhiteStone: Story = {
  args: {
    color: "white",
  },
  parameters: {
    docs: {
      description: {
        story: "白石の表示。後手のプレイヤーが使用する石。",
      },
    },
  },
};

export const EmptySpace: Story = {
  args: {
    color: "none",
  },
  parameters: {
    docs: {
      description: {
        story: "空の盤面。石が置かれていない状態を表示。",
      },
    },
  },
};

export const StoneComparison: Story = {
  args: {
    color: "none", // ここはデフォルトの色を設定
  },
  render: () => (
    <div className="flex items-center space-x-4 p-4">
      <div className="text-center">
        <Stone color="black" />
        <p className="mt-2 text-sm text-gray-600">黒石（先手）</p>
      </div>
      <div className="text-center">
        <Stone color="white" />
        <p className="mt-2 text-sm text-gray-600">白石（後手）</p>
      </div>
      <div className="text-center">
        <Stone color="none" />
        <p className="mt-2 text-sm text-gray-600">空きマス</p>
      </div>
    </div>
  ),

  parameters: {
    docs: {
      description: {
        story:
          "黒石、白石、空きマスの比較表示。ゲーム内で使用される全ての石の状態。",
      },
    },
  },
};
