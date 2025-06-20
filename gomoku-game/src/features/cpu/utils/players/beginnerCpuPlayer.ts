import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";

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
  cpuLevel: "beginner",
  color,
  calculateNextMove: (board: Board): Position | null => {
    const availablePositions = getAvailablePositions(board);
    
    if (availablePositions.length === 0) {
      return null;
    }

    // Beginner CPU: completely random move selection
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  },
});