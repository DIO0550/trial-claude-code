import { describe, test, expect } from "vitest";
import { countBidirectionalStones, calculateConsecutiveCounts } from "./boardAnalysis";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("boardAnalysis", () => {
  describe("countBidirectionalStones", () => {
    test("空の盤面で1を返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 7, "black");
      
      const result = countBidirectionalStones(board, 7, 7, 0, 1, "black");
      
      expect(result).toBe(1);
    });

    test("横方向に3つの石がある場合に3を返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 6, "black");
      board = Board.placeStone(board, 7, 7, "black");
      board = Board.placeStone(board, 7, 8, "black");
      
      const result = countBidirectionalStones(board, 7, 7, 0, 1, "black");
      
      expect(result).toBe(3);
    });

    test("縦方向に5つの石がある場合に5を返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 5, 7, "black");
      board = Board.placeStone(board, 6, 7, "black");
      board = Board.placeStone(board, 7, 7, "black");
      board = Board.placeStone(board, 8, 7, "black");
      board = Board.placeStone(board, 9, 7, "black");
      
      const result = countBidirectionalStones(board, 7, 7, 1, 0, "black");
      
      expect(result).toBe(5);
    });

    test("異なる色の石は含まれない", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 6, "white");
      board = Board.placeStone(board, 7, 7, "black");
      board = Board.placeStone(board, 7, 8, "white");
      
      const result = countBidirectionalStones(board, 7, 7, 0, 1, "black");
      
      expect(result).toBe(1);
    });
  });

  describe("calculateConsecutiveCounts", () => {
    test("空の盤面で全方向1を返す", () => {
      const board = Board.createEmpty();
      const position: Position = { row: 7, col: 7 };
      
      const result = calculateConsecutiveCounts(board, position, "black");
      
      expect(result).toEqual([1, 1, 1, 1]); // 4方向すべて1
    });

    test("横方向に連続する場合の値を返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 6, "black");
      board = Board.placeStone(board, 7, 8, "black");
      const position: Position = { row: 7, col: 7 };
      
      const result = calculateConsecutiveCounts(board, position, "black");
      
      expect(result[0]).toBe(3); // 横方向は3
      expect(result[1]).toBe(1); // 縦方向は1
      expect(result[2]).toBe(1); // 右斜め方向は1
      expect(result[3]).toBe(1); // 左斜め方向は1
    });
  });
});