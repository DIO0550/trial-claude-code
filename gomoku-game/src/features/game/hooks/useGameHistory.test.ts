import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameHistory } from "./useGameHistory";
import { GameBoard } from "@/features/board/utils/gameBoard";
import type { GameState } from "./useGomokuGame";

describe("useGameHistory", () => {
  const createTestGameState = (currentPlayer = "black" as const): GameState => ({
    gameBoard: GameBoard.createEmpty(),
    currentPlayer,
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
    winningLine: null,
    showResultModal: false,
  });

  test("初期状態では履歴が空である", () => {
    const { result } = renderHook(() => useGameHistory());
    
    expect(result.current.history).toEqual([]);
    expect(result.current.canUndo()).toBe(false);
  });

  test("addToHistoryでゲーム状態を履歴に追加できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState = createTestGameState();

    act(() => {
      result.current.addToHistory(gameState);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].gameState).toEqual(gameState);
    expect(result.current.history[0].moveCount).toBe(0);
    expect(result.current.canUndo()).toBe(false); // 1つの履歴ではundo不可
  });

  test("複数の状態を順次追加できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState1 = createTestGameState("black");
    const gameState2 = createTestGameState("white");

    act(() => {
      result.current.addToHistory(gameState1);
    });

    act(() => {
      result.current.addToHistory(gameState2);
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].moveCount).toBe(0);
    expect(result.current.history[1].moveCount).toBe(1);
    expect(result.current.canUndo()).toBe(true); // 2つ以上の履歴でundo可能
  });

  test("undoLastMoveで最後の状態を取得し履歴から削除できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState1 = createTestGameState("black");
    const gameState2 = createTestGameState("white");

    act(() => {
      result.current.addToHistory(gameState1);
      result.current.addToHistory(gameState2);
    });

    let undoResult: GameState | null = null;
    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toEqual(gameState1);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].gameState).toEqual(gameState1);
  });

  test("履歴が1つ以下の時にundoLastMoveはnullを返す", () => {
    const { result } = renderHook(() => useGameHistory());

    // 空の状態
    let undoResult: GameState | null = null;
    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toBeNull();
    expect(result.current.history).toHaveLength(0);

    // 1つの履歴がある状態
    const gameState = createTestGameState();
    act(() => {
      result.current.addToHistory(gameState);
    });

    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toBeNull();
    expect(result.current.history).toHaveLength(1);
  });

  test("履歴上限（20手）を超えると古い履歴が削除される", () => {
    const { result } = renderHook(() => useGameHistory());
    
    // 21手分の履歴を追加
    act(() => {
      for (let i = 0; i < 21; i++) {
        const gameState = createTestGameState(i % 2 === 0 ? "black" : "white");
        result.current.addToHistory(gameState);
      }
    });

    expect(result.current.history).toHaveLength(20);
    expect(result.current.history[0].moveCount).toBe(1); // 最初の履歴が削除されている
    expect(result.current.history[19].moveCount).toBe(20);
  });
});