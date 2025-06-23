import { useCallback, useReducer, useEffect } from "react";
import { useGameBoard } from "@/features/board/hooks/useGameBoard";
import { useCpuPlayer } from "@/features/cpu/hooks/useCpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";

export type GameStatus = "playing" | "won" | "draw";

export interface GameSettings {
  playerColor: StoneColor;
  cpuLevel: CpuLevel;
}

export interface UseGomokuGameReturn {
  board: Board;
  currentPlayer: StoneColor;
  gameStatus: GameStatus;
  winner: StoneColor | null;
  moveHistory: Position[];
  isPlayerTurn: boolean;
  isCpuTurn: boolean;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  canMakeMove: (row: number, col: number) => boolean;
}

interface GameState {
  currentPlayer: StoneColor;
  gameStatus: GameStatus;
  winner: StoneColor | null;
  moveHistory: Position[];
}

type GameAction =
  | { type: "MAKE_MOVE"; position: Position }
  | { type: "SET_WINNER"; winner: StoneColor }
  | { type: "SET_DRAW" }
  | { type: "RESET_GAME" };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "MAKE_MOVE":
      return {
        ...state,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
        moveHistory: [...state.moveHistory, action.position],
      };
    case "SET_WINNER":
      return {
        ...state,
        gameStatus: "won",
        winner: action.winner,
      };
    case "SET_DRAW":
      return {
        ...state,
        gameStatus: "draw",
      };
    case "RESET_GAME":
      return {
        currentPlayer: "black",
        gameStatus: "playing",
        winner: null,
        moveHistory: [],
      };
    default:
      return state;
  }
};

/**
 * 五目並べゲーム全体のロジックを管理するカスタムフック
 * useGameBoardとuseCpuPlayerを統合してゲーム進行を制御する
 * @param settings ゲーム設定（プレイヤー色、CPU難易度）
 * @returns ゲーム状態と操作メソッド
 */
export const useGomokuGame = (settings: GameSettings): UseGomokuGameReturn => {
  const { board, placeStone, resetBoard, canPlaceStone } = useGameBoard();
  const cpuColor = settings.playerColor === "black" ? "white" : "black";
  const { getNextMove } = useCpuPlayer(cpuColor, settings.cpuLevel);

  const [gameState, dispatch] = useReducer(gameReducer, {
    currentPlayer: "black",
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
  });

  const isPlayerTurn = gameState.currentPlayer === settings.playerColor;
  const isCpuTurn = gameState.currentPlayer === cpuColor;

  const makeMove = useCallback((row: number, col: number): void => {
    if (gameState.gameStatus !== "playing") return;
    if (!canPlaceStone(row, col)) return;

    const currentColor = gameState.currentPlayer;
    placeStone(row, col, currentColor);

    dispatch({
      type: "MAKE_MOVE",
      position: { row, col },
    });
  }, [
    gameState.gameStatus,
    gameState.currentPlayer,
    canPlaceStone,
    placeStone,
  ]);

  useEffect(() => {
    if (
      gameState.gameStatus === "playing" &&
      isCpuTurn
    ) {
      const timer = setTimeout(() => {
        const cpuMove = getNextMove(board, gameState.moveHistory);
        if (cpuMove) {
          makeMove(cpuMove.row, cpuMove.col);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    gameState.gameStatus,
    isCpuTurn,
    getNextMove,
    board,
    gameState.moveHistory,
    makeMove,
  ]);

  const resetGame = useCallback(() => {
    resetBoard();
    dispatch({ type: "RESET_GAME" });
  }, [resetBoard]);

  const canMakeMove = useCallback((row: number, col: number): boolean => {
    return (
      gameState.gameStatus === "playing" &&
      isPlayerTurn &&
      canPlaceStone(row, col)
    );
  }, [gameState.gameStatus, isPlayerTurn, canPlaceStone]);

  return {
    board,
    currentPlayer: gameState.currentPlayer,
    gameStatus: gameState.gameStatus,
    winner: gameState.winner,
    moveHistory: gameState.moveHistory,
    isPlayerTurn,
    isCpuTurn,
    makeMove,
    resetGame,
    canMakeMove,
  };
};