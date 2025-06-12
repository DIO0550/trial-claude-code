import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import DifficultySelector from "./DifficultySelector";

const meta = {
  component: DifficultySelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onDifficultyChange: fn(),
  },
} satisfies Meta<typeof DifficultySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDifficulty: "medium",
    onDifficultyChange: fn(),
  },
};

export const BeginnerSelected: Story = {
  args: {
    selectedDifficulty: "beginner",
    onDifficultyChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "入門レベルが選択された状態のDifficultySelector。",
      },
    },
  },
};

export const EasySelected: Story = {
  args: {
    selectedDifficulty: "easy",
    onDifficultyChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "やさしいレベルが選択された状態のDifficultySelector。",
      },
    },
  },
};

export const HardSelected: Story = {
  args: {
    selectedDifficulty: "hard",
    onDifficultyChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "むずかしいレベルが選択された状態のDifficultySelector。",
      },
    },
  },
};

export const ExpertSelected: Story = {
  args: {
    selectedDifficulty: "expert",
    onDifficultyChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "エキスパートレベルが選択された状態のDifficultySelector。",
      },
    },
  },
};