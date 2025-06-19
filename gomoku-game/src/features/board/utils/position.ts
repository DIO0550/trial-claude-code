import { MIN_COORDINATE, MAX_COORDINATE } from "@/constants/board";

export interface Position {
  row: number;
  col: number;
}

const isValidCoordinate = (coordinate: number): boolean => {
  return (
    Number.isInteger(coordinate) &&
    coordinate >= MIN_COORDINATE &&
    coordinate <= MAX_COORDINATE
  );
};

export const Position = {
  isValid: (position: Position): boolean => {
    return isValidCoordinate(position.row) && isValidCoordinate(position.col);
  },

  equals: (a: Position, b: Position): boolean => {
    return a.row === b.row && a.col === b.col;
  },

  toString: (position: Position): string => {
    return `(${position.row}, ${position.col})`;
  },

  create: (row: number, col: number): Position => {
    return { row, col };
  },
} as const;