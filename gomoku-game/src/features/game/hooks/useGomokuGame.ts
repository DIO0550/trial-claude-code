import { useCallback, useReducer, useEffect } from "react";
import { useCpuPlayer } from "@/features/cpu/hooks/useCpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { GameBoard } from "@/features/board/utils/gameBoard";
import { Position } from "@/features/board/utils/position";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { WIN_LENGTH } from "@/features/board/constants/dimensions";

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
  gameBoard: GameBoard;
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
    case "MAKE_MOVE": {
      const { position } = action;
      
      // 石を置く
      const newGameBoard = GameBoard.placeStone(state.gameBoard, position.row, position.col, state.currentPlayer);
      if (!newGameBoard) {
        return state; // 石を置けない場合は状態を変更しない
      }
      
      // 勝利判定
      const consecutiveCount = Board.countConsecutiveStones(newGameBoard.board, position);
      if (consecutiveCount >= WIN_LENGTH) {
        const winner = newGameBoard.board[position.row][position.col];
        return {
          ...state,
          gameBoard: newGameBoard,
          gameStatus: "won",
          winner,
          moveHistory: [...state.moveHistory, position],
        };
      }

      // 引き分け判定
      if (Board.isFull(newGameBoard.board)) {
        return {
          ...state,
          gameBoard: newGameBoard,
          gameStatus: "draw",
          moveHistory: [...state.moveHistory, position],
        };
      }

      // 通常の手番交代
      return {
        ...state,
        gameBoard: newGameBoard,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
        moveHistory: [...state.moveHistory, position],
      };
    }
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
        gameBoard: GameBoard.createEmpty(),
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
 * GameBoardとuseCpuPlayerを統合してゲーム進行を制御する
 * @param settings ゲーム設定（プレイヤー色、CPU難易度）
 * @returns ゲーム状態と操作メソッド
 */
export const useGomokuGame = (settings: GameSettings): UseGomokuGameReturn => {
  const cpuColor = settings.playerColor === "black" ? "white" : "black";
  const { getNextMove } = useCpuPlayer(cpuColor, settings.cpuLevel);

  const [gameState, dispatch] = useReducer(gameReducer, {
    gameBoard: GameBoard.createEmpty(),
    currentPlayer: "black",
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
  });

  const isPlayerTurn = gameState.currentPlayer === settings.playerColor;
  const isCpuTurn = gameState.currentPlayer === cpuColor;

  const makeMove = useCallback((row: number, col: number): void => {
    if (gameState.gameStatus !== "playing") return;
    if (!GameBoard.canPlaceStone(gameState.gameBoard, row, col)) return;

    dispatch({
      type: "MAKE_MOVE",
      position: { row, col },
    });
  }, [
    gameState.gameStatus,
    gameState.gameBoard,
  ]);

  useEffect(() => {
    if (
      gameState.gameStatus === "playing" &&
      isCpuTurn
    ) {
      const timer = setTimeout(() => {
        const cpuMove = getNextMove(gameState.gameBoard.board, gameState.moveHistory);
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
    gameState.gameBoard.board,
    gameState.moveHistory,
    makeMove,
  ]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const canMakeMove = useCallback((row: number, col: number): boolean => {
    return (
      gameState.gameStatus === "playing" &&
      isPlayerTurn &&
      GameBoard.canPlaceStone(gameState.gameBoard, row, col)
    );
  }, [gameState.gameStatus, gameState.gameBoard, isPlayerTurn]);

  return {
    board: gameState.gameBoard.board,
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