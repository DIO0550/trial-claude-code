import { StoneColor } from "@/types/stone";
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
} as const;