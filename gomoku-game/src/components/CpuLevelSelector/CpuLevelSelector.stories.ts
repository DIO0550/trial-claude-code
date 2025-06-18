import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import CpuLevelSelector from "./CpuLevelSelector";

const meta = {
  component: CpuLevelSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onCpuLevelChange: fn(),
  },
} satisfies Meta<typeof CpuLevelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedCpuLevel: "medium",
    onCpuLevelChange: fn(),
  },
};

export const BeginnerSelected: Story = {
  args: {
    selectedCpuLevel: "beginner",
    onCpuLevelChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "入門レベルが選択された状態のCpuLevelSelector。",
      },
    },
  },
};

export const EasySelected: Story = {
  args: {
    selectedCpuLevel: "easy",
    onCpuLevelChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "やさしいレベルが選択された状態のCpuLevelSelector。",
      },
    },
  },
};

export const HardSelected: Story = {
  args: {
    selectedCpuLevel: "hard",
    onCpuLevelChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "むずかしいレベルが選択された状態のCpuLevelSelector。",
      },
    },
  },
};

export const ExpertSelected: Story = {
  args: {
    selectedCpuLevel: "expert",
    onCpuLevelChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "エキスパートレベルが選択された状態のCpuLevelSelector。",
      },
    },
  },
};