import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import GameBoard from "./GameBoard";

const meta = {
  component: GameBoard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onBackToStart: fn(),
  },
} satisfies Meta<typeof GameBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlackPlayerMedium: Story = {
  args: {
    cpuLevel: "normal",
    playerColor: "black",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "黒石でプレイ、CPUレベル「ふつう」のゲームボード。プレイヤーが先手で15×15のゲームボードが表示される。",
      },
    },
  },
};

export const WhitePlayerHard: Story = {
  args: {
    cpuLevel: "hard",
    playerColor: "white",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "白石でプレイ、難易度「むずかしい」のゲームボード。CPUが先手でプレイヤーは後手となる。",
      },
    },
  },
};

export const BlackPlayerBeginner: Story = {
  args: {
    cpuLevel: "beginner",
    playerColor: "black",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "黒石でプレイ、難易度「入門」のゲームボード。最も易しい難易度設定。",
      },
    },
  },
};

export const WhitePlayerExpert: Story = {
  args: {
    cpuLevel: "expert",
    playerColor: "white",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "白石でプレイ、難易度「エキスパート」のゲームボード。最高難易度でCPUが5手先読みを行う。",
      },
    },
  },
};

export const BlackPlayerEasy: Story = {
  args: {
    cpuLevel: "easy",
    playerColor: "black",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "黒石でプレイ、難易度「やさしい」のゲームボード。基本的な防御重視のCPU。",
      },
    },
  },
};
