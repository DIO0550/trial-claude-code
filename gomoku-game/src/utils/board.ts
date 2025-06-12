import { StoneColor } from "../types/stone";

export type Board = (StoneColor)[][];

export const Board = {
  createEmpty: (): Board => {
    return Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => "none"));
  },

  isValidPosition: (row: number, col: number): boolean => {
    return row >= 0 && row < 15 && col >= 0 && col < 15 && Number.isInteger(row) && Number.isInteger(col);
  },
} as const;