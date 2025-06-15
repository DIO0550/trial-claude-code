import { CpuPlayer } from "@/types/cpuPlayer";
import { StoneColor } from "@/types/stone";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";
import { BOARD_SIZE } from "@/constants/board";

const getAvailablePositions = (board: Board): Position[] => {
  const positions: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (StoneColor.isNone(board[row][col])) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
};

export const createBeginnerCpuPlayer = (color: StoneColor): CpuPlayer => ({
  difficulty: "beginner",
  color,
  calculateNextMove: (board: Board, moveHistory: Position[]): Position | null => {
    const availablePositions = getAvailablePositions(board);
    
    if (availablePositions.length === 0) {
      return null;
    }

    // Beginner CPU: completely random move selection
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  },
});