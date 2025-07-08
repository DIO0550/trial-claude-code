import { useCallback, useReducer, useEffect } from "react";
import { useCpuPlayer } from "@/features/cpu/hooks/useCpuPlayer";
import { useGameHistory } from "./useGameHistory";
import { StoneColor } from "@/features/board/utils/stone";
import { Board, WinningLine } from "@/features/board/utils/board";
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
  winningLine: WinningLine | null;
  showResultModal: boolean;
  canUndo: boolean;
  undoMove: () => void;
}

export interface GameState {
  gameBoard: GameBoard;
  currentPlayer: StoneColor;
  gameStatus: GameStatus;
  winner: StoneColor | null;
  moveHistory: Position[];
  winningLine: WinningLine | null;
  showResultModal: boolean;
}

export type GameAction =
  | { type: "MAKE_MOVE"; position: Position }
  | { type: "UNDO_MOVE"; previousState: GameState }
  | { type: "SET_WINNER"; winner: StoneColor }
  | { type: "SET_DRAW" }
  | { type: "RESET_GAME" }
  | { type: "SHOW_RESULT_MODAL" };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "UNDO_MOVE": {
      // 履歴から復元した状態を返す
      return action.previousState;
    }
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
        const winningLine = Board.findWinningLine(newGameBoard.board, position);
        return {
          ...state,
          gameBoard: newGameBoard,
          gameStatus: "won",
          winner,
          winningLine,
          showResultModal: false, // 初期状態では非表示
          moveHistory: [...state.moveHistory, position],
        };
      }

      // 引き分け判定
      if (Board.isFull(newGameBoard.board)) {
        return {
          ...state,
          gameBoard: newGameBoard,
          gameStatus: "draw",
          showResultModal: false, // 初期状態では非表示
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
    case "SHOW_RESULT_MODAL":
      return {
        ...state,
        showResultModal: true,
      };
    case "RESET_GAME":
      return {
        gameBoard: GameBoard.createEmpty(),
        currentPlayer: "black",
        gameStatus: "playing",
        winner: null,
        moveHistory: [],
        winningLine: null,
        showResultModal: false,
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
  const { addToHistory, undoLastMove, canUndo, clearHistory } = useGameHistory();

  const [gameState, dispatch] = useReducer(gameReducer, {
    gameBoard: GameBoard.createEmpty(),
    currentPlayer: "black",
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
    winningLine: null,
    showResultModal: false,
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

  // makeMove後に状態を履歴に保存するuseEffect
  useEffect(() => {
    if (gameState.moveHistory.length > 0) {
      addToHistory(gameState);
    }
  }, [gameState.moveHistory.length, gameState, addToHistory]);

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

  // 勝利時の遅延表示機能
  useEffect(() => {
    if (
      (gameState.gameStatus === "won" || gameState.gameStatus === "draw") &&
      !gameState.showResultModal
    ) {
      const timer = setTimeout(() => {
        dispatch({ type: "SHOW_RESULT_MODAL" });
      }, 2000); // 2秒遅延

      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.showResultModal]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
    clearHistory(); // 履歴もクリア
  }, [clearHistory]);

  const undoMove = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;
    if (!canUndo()) return;

    const previousState = undoLastMove();
    if (previousState) {
      // reducerではなく、直接状態を設定する仕組みが必要
      // 今回は簡単にするため、setStateアプローチを使用
      dispatch({ type: "UNDO_MOVE", previousState });
    }
  }, [gameState.gameStatus, canUndo, undoLastMove]);

  const canMakeMove = useCallback((row: number, col: number): boolean => {
    return (
      gameState.gameStatus === "playing" &&
      isPlayerTurn &&
      GameBoard.canPlaceStone(gameState.gameBoard, row, col)
    );
  }, [gameState.gameStatus, gameState.gameBoard, isPlayerTurn]);

  // undo可能な条件を制限
  const canUndoMove = useCallback((): boolean => {
    return gameState.gameStatus === "playing" && canUndo();
  }, [gameState.gameStatus, canUndo]);

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
    winningLine: gameState.winningLine,
    showResultModal: gameState.showResultModal,
    canUndo: canUndoMove(),
    undoMove,
  };
};