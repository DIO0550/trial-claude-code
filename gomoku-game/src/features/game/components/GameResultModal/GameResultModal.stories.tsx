import type { Meta, StoryObj } from "@storybook/nextjs";
import { GameResultModal } from "./GameResultModal";

// Mock function for actions
const fn = (name: string) => (...args: unknown[]) => console.log(`${name} called with:`, args);

const meta: Meta<typeof GameResultModal> = {
  component: GameResultModal,
  parameters: {
    layout: "centered",
  },
  args: {
    onRestart: fn("onRestart"),
    onBackToMenu: fn("onBackToMenu"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayerWin: Story = {
  args: {
    isOpen: true,
    winner: "black",
    playerColor: "black",
  },
};

export const PlayerLose: Story = {
  args: {
    isOpen: true,
    winner: "white",
    playerColor: "black",
  },
};

export const Draw: Story = {
  args: {
    isOpen: true,
    winner: null,
    playerColor: "black",
  },
};

export const PlayerWinWhite: Story = {
  args: {
    isOpen: true,
    winner: "white",
    playerColor: "white",
  },
};

export const PlayerLoseWhite: Story = {
  args: {
    isOpen: true,
    winner: "black",
    playerColor: "white",
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    winner: "black",
    playerColor: "black",
  },
};
