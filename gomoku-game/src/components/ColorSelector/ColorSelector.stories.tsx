import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import ColorSelector from "./ColorSelector";

const meta = {
  component: ColorSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onColorChange: fn(),
  },
} satisfies Meta<typeof ColorSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedColor: "black",
    onColorChange: fn(),
  },
};

export const BlackSelected: Story = {
  args: {
    selectedColor: "black",
    onColorChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "黒（先手）が選択された状態のColorSelector。",
      },
    },
  },
};

export const WhiteSelected: Story = {
  args: {
    selectedColor: "white",
    onColorChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "白（後手）が選択された状態のColorSelector。",
      },
    },
  },
};

export const RandomSelected: Story = {
  args: {
    selectedColor: "random",
    onColorChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "ランダムが選択された状態のColorSelector。ゲーム開始時に色が決定される。",
      },
    },
  },
};
