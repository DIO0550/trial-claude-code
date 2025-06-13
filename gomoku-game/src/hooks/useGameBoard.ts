import { useState, useCallback } from "react";
import { StoneColor } from "@/types/stone";
import { Board } from "@/utils/board";

export interface UseGameBoardReturn {
  board: Board;
  placeStone: (row: number, col: number, color: StoneColor) => boolean;
  resetBoard: () => void;
  getStone: (row: number, col: number) => StoneColor;
}

export const useGameBoard = (): UseGameBoardReturn => {
  const [board, setBoard] = useState<Board>(Board.createEmpty);

  const placeStone = useCallback((row: number, col: number, color: StoneColor): boolean => {
    if (!Board.isValidPosition(row, col)) {
      return false;
    }

    if (board[row][col] !== "none") {
      return false;
    }

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      newBoard[row][col] = color;
      return newBoard;
    });

    return true;
  }, [board]);

  const resetBoard = useCallback(() => {
    setBoard(Board.createEmpty());
  }, []);

  const getStone = useCallback((row: number, col: number): StoneColor => {
    if (!Board.isValidPosition(row, col)) {
      return "none";
    }
    return board[row][col];
  }, [board]);

  return {
    board,
    placeStone,
    resetBoard,
    getStone,
  };
};