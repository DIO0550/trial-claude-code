import { describe, test, expect } from "vitest";
import { getOpeningMove } from "./gameStrategy";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

type GamePhase = 'early' | 'mid' | 'late';

describe("gameStrategy", () => {
  describe("getOpeningMove", () => {
    test("序盤フェーズでない場合はnullを返す", () => {
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];
      
      const result = getOpeningMove(board, moveHistory, "mid");
      
      expect(result).toBe(null);
    });

    test("空の盤面では中央付近の位置を返す", () => {
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];
      
      const result = getOpeningMove(board, moveHistory, "early");
      
      expect(result).not.toBe(null);
      if (result) {
        expect(result.row).toBeGreaterThanOrEqual(5);
        expect(result.row).toBeLessThanOrEqual(9);
        expect(result.col).toBeGreaterThanOrEqual(5);
        expect(result.col).toBeLessThanOrEqual(9);
      }
    });

    test("中央が埋まっている場合は戦略的位置を返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 7, "black");
      const moveHistory: Position[] = [{ row: 7, col: 7 }];
      
      const result = getOpeningMove(board, moveHistory, "early");
      
      expect(result).not.toBe(null);
      if (result) {
        expect(board[result.row][result.col]).toBe("none");
      }
    });
  });
});