import { useReducer, useCallback } from "react";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";

export interface UseGameBoardReturn {
  board: Board;
  canPlaceStone: (row: number, col: number) => boolean;
  placeStone: (row: number, col: number, color: StoneColor) => void;
  resetBoard: () => void;
  getStone: (row: number, col: number) => StoneColor;
}

type GameBoardAction =
  | { type: "PLACE_STONE"; row: number; col: number; color: StoneColor }
  | { type: "RESET_BOARD" };

interface GameBoardState {
  board: Board;
}

/**
 * 石を配置するアクション処理
 */
const placeStoneAction = (state: GameBoardState, row: number, col: number, color: StoneColor): GameBoardState => {
  return {
    board: Board.placeStone(state.board, row, col, color),
  };
};

/**
 * ボードをリセットするアクション処理
 */
const resetBoardAction = (): GameBoardState => {
  return {
    board: Board.createEmpty(),
  };
};

/**
 * ゲームボードの状態を管理するreducer
 */
const gameBoardReducer = (state: GameBoardState, action: GameBoardAction): GameBoardState => {
  switch (action.type) {
    case "PLACE_STONE": {
      const { row, col, color } = action;
      return placeStoneAction(state, row, col, color);
    }
    case "RESET_BOARD":
      return resetBoardAction();
    default:
      return state;
  }
};

export const useGameBoard = (): UseGameBoardReturn => {
  const [state, dispatch] = useReducer(gameBoardReducer, {
    board: Board.createEmpty(),
  });

  const canPlaceStone = useCallback((row: number, col: number): boolean => {
    if (!Board.isValidPosition(row, col)) {
      return false;
    }

    if (state.board[row][col] !== "none") {
      return false;
    }

    return true;
  }, [state.board]);

  const placeStone = useCallback((row: number, col: number, color: StoneColor): void => {
    if (!canPlaceStone(row, col)) {
      return;
    }

    dispatch({ type: "PLACE_STONE", row, col, color });
  }, [canPlaceStone]);

  const resetBoard = useCallback(() => {
    dispatch({ type: "RESET_BOARD" });
  }, []);

  const getStone = useCallback((row: number, col: number): StoneColor => {
    if (!Board.isValidPosition(row, col)) {
      return "none";
    }
    return state.board[row][col];
  }, [state.board]);

  return {
    board: state.board,
    canPlaceStone,
    placeStone,
    resetBoard,
    getStone,
  };
};