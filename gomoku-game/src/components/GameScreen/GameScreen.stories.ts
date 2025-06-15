import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test"; 
import GameScreen from "./GameScreen";

const meta = {
  component: GameScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onBackToStart: fn(),
  },
} satisfies Meta<typeof GameScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlackPlayerMedium: Story = {
  args: {
    difficulty: "medium",
    playerColor: "black",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "黒石でプレイ、難易度「ふつう」のゲーム画面。プレイヤーが先手で15×15のゲームボードが表示される。",
      },
    },
  },
};

export const WhitePlayerHard: Story = {
  args: {
    difficulty: "hard",
    playerColor: "white",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "白石でプレイ、難易度「むずかしい」のゲーム画面。CPUが先手でプレイヤーは後手となる。",
      },
    },
  },
};

export const BlackPlayerBeginner: Story = {
  args: {
    difficulty: "beginner",
    playerColor: "black", 
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "黒石でプレイ、難易度「入門」のゲーム画面。最も易しい難易度設定。",
      },
    },
  },
};

export const WhitePlayerExpert: Story = {
  args: {
    difficulty: "expert",
    playerColor: "white",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "白石でプレイ、難易度「エキスパート」のゲーム画面。最高難易度でCPUが5手先読みを行う。",
      },
    },
  },
};

export const BlackPlayerEasy: Story = {
  args: {
    difficulty: "easy",
    playerColor: "black",
    onBackToStart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "黒石でプレイ、難易度「やさしい」のゲーム画面。基本的な防御重視のCPU。",
      },
    },
  },
};