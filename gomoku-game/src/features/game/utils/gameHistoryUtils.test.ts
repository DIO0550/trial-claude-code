import { describe, test, expect } from "vitest";
import { GameHistoryUtils } from "./gameHistoryUtils";
import { GameBoard } from "@/features/board/utils/gameBoard";
import type { GameState } from "../hooks/useGomokuGame";
import type { GameHistoryEntry } from "../types/gameHistory";

describe("GameHistoryUtils", () => {
  const createTestGameState = (currentPlayer = "black" as const): GameState => ({
    gameBoard: GameBoard.createEmpty(),
    currentPlayer,
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
    winningLine: null,
    showResultModal: false,
  });

  describe("createHistoryEntry", () => {
    test("ゲーム状態から履歴エントリを作成できる", () => {
      const gameState = createTestGameState();
      const entry = GameHistoryUtils.createHistoryEntry(gameState);

      expect(entry.gameState).toEqual(gameState);
      expect(entry.timestamp).toBeTypeOf("number");
      expect(entry.moveCount).toBe(0);
    });

    test("moveCountを指定して履歴エントリを作成できる", () => {
      const gameState = createTestGameState();
      const entry = GameHistoryUtils.createHistoryEntry(gameState, 5);

      expect(entry.moveCount).toBe(5);
    });
  });

  describe("validateUndoOperation", () => {
    test("空の履歴では無効", () => {
      const history: GameHistoryEntry[] = [];
      expect(GameHistoryUtils.validateUndoOperation(history)).toBe(false);
    });

    test("履歴が1つの場合は無効", () => {
      const gameState = createTestGameState();
      const history: GameHistoryEntry[] = [
        GameHistoryUtils.createHistoryEntry(gameState)
      ];
      expect(GameHistoryUtils.validateUndoOperation(history)).toBe(false);
    });

    test("履歴が2つ以上の場合は有効", () => {
      const gameState1 = createTestGameState("black");
      const gameState2 = createTestGameState("white");
      const history: GameHistoryEntry[] = [
        GameHistoryUtils.createHistoryEntry(gameState1, 0),
        GameHistoryUtils.createHistoryEntry(gameState2, 1)
      ];
      expect(GameHistoryUtils.validateUndoOperation(history)).toBe(true);
    });
  });

  describe("findLastPlayerMove", () => {
    test("空の履歴ではnullを返す", () => {
      const history: GameHistoryEntry[] = [];
      expect(GameHistoryUtils.findLastPlayerMove(history, "black")).toBeNull();
    });

    test("指定されたプレイヤーの最後の手を見つける", () => {
      const blackState = createTestGameState("black");
      const whiteState = createTestGameState("white");
      const history: GameHistoryEntry[] = [
        GameHistoryUtils.createHistoryEntry(blackState, 0),
        GameHistoryUtils.createHistoryEntry(whiteState, 1),
        GameHistoryUtils.createHistoryEntry(blackState, 2)
      ];

      const lastBlackMove = GameHistoryUtils.findLastPlayerMove(history, "black");
      expect(lastBlackMove?.moveCount).toBe(2);
      expect(lastBlackMove?.gameState.currentPlayer).toBe("black");
    });

    test("指定されたプレイヤーの手がない場合はnullを返す", () => {
      const whiteState = createTestGameState("white");
      const history: GameHistoryEntry[] = [
        GameHistoryUtils.createHistoryEntry(whiteState, 0)
      ];

      const lastBlackMove = GameHistoryUtils.findLastPlayerMove(history, "black");
      expect(lastBlackMove).toBeNull();
    });
  });

  describe("getHistorySize", () => {
    test("履歴のサイズを正確に返す", () => {
      const gameState = createTestGameState();
      const history: GameHistoryEntry[] = [
        GameHistoryUtils.createHistoryEntry(gameState, 0),
        GameHistoryUtils.createHistoryEntry(gameState, 1),
        GameHistoryUtils.createHistoryEntry(gameState, 2)
      ];

      expect(GameHistoryUtils.getHistorySize(history)).toBe(3);
    });

    test("空の履歴では0を返す", () => {
      const history: GameHistoryEntry[] = [];
      expect(GameHistoryUtils.getHistorySize(history)).toBe(0);
    });
  });
});