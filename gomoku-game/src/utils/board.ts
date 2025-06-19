import { StoneColor } from "@/features/board/utils/stone";
import { BOARD_SIZE, MIN_COORDINATE, MAX_COORDINATE } from "@/constants/board";

export type Board = (StoneColor)[][];

export const Board = {
  createEmpty: (): Board => {
    return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => "none"));
  },

  isValidPosition: (row: number, col: number): boolean => {
    return (
      Number.isInteger(row) &&
      Number.isInteger(col) &&
      row >= MIN_COORDINATE &&
      row <= MAX_COORDINATE &&
      col >= MIN_COORDINATE &&
      col <= MAX_COORDINATE
    );
  },

  copy: (board: Board): Board => {
    return board.map(row => [...row]);
  },

  placeStone: (board: Board, row: number, col: number, color: StoneColor): Board => {
    const newBoard = Board.copy(board);
    newBoard[row][col] = color;
    return newBoard;
  },
} as const;