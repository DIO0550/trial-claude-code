import { StoneColor } from "@/features/board/utils/stone";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE, MIN_COORDINATE, MAX_COORDINATE } from "@/features/board/constants/dimensions";

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

  isEmpty: (board: Board): boolean => {
    return board.flat().every(cell => StoneColor.isNone(cell));
  },

  getStonePositions: (board: Board, color: StoneColor): Position[] => {
    const positions: Position[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === color) {
          positions.push({ row, col });
        }
      }
    }
    
    return positions;
  },
} as const;