import { describe, test, expect } from "vitest";
// NOTE: 最初は型が存在しないため、このimportは失敗するはず
import type { GameHistoryEntry } from "./gameHistory";
import { GameBoard } from "@/features/board/utils/gameBoard";

describe("GameHistoryEntry型定義", () => {
  test("GameHistoryEntryが正しい構造を持つ", () => {
    const gameBoard = GameBoard.createEmpty();
    const gameState = {
      gameBoard,
      currentPlayer: "black" as const,
      gameStatus: "playing" as const,
      winner: null,
      moveHistory: [],
      winningLine: null,
      showResultModal: false,
    };

    const historyEntry: GameHistoryEntry = {
      gameState,
      timestamp: Date.now(),
      moveCount: 0,
    };

    expect(historyEntry.gameState).toBeDefined();
    expect(historyEntry.timestamp).toBeTypeOf("number");
    expect(historyEntry.moveCount).toBeTypeOf("number");
  });

  test("複数の履歴エントリを配列で管理できる", () => {
    const gameBoard = GameBoard.createEmpty();
    const gameState = {
      gameBoard,
      currentPlayer: "black" as const,
      gameStatus: "playing" as const,
      winner: null,
      moveHistory: [],
      winningLine: null,
      showResultModal: false,
    };

    const history: GameHistoryEntry[] = [
      {
        gameState,
        timestamp: Date.now(),
        moveCount: 0,
      },
      {
        gameState: { ...gameState, currentPlayer: "white" },
        timestamp: Date.now() + 1000,
        moveCount: 1,
      },
    ];

    expect(history).toHaveLength(2);
    expect(history[0].moveCount).toBe(0);
    expect(history[1].moveCount).toBe(1);
  });
});