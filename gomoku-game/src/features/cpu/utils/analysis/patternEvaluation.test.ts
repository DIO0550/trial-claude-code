import { describe, test, expect } from "vitest";
import { isPatternOpen } from "./patternEvaluation";
import { Board } from "@/features/board/utils/board";

describe("patternEvaluation", () => {
  describe("isPatternOpen", () => {
    test("単独の石は両端が開いている場合にtrueを返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 7, "black");
      
      const result = isPatternOpen(board, 7, 7, 0, 1);
      
      expect(result).toBe(true);
    });

    test("端に近い石は片側しか開いていない場合にfalseを返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 0, 0, "black");
      
      const result = isPatternOpen(board, 0, 0, 0, 1);
      
      expect(result).toBe(false);
    });

    test("両端が相手の石に囲まれている場合にfalseを返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 6, "white");
      board = Board.placeStone(board, 7, 7, "black");
      board = Board.placeStone(board, 7, 8, "white");
      
      const result = isPatternOpen(board, 7, 7, 0, 1);
      
      expect(result).toBe(false);
    });

    test("連続した石の両端が開いている場合にtrueを返す", () => {
      let board = Board.createEmpty();
      board = Board.placeStone(board, 7, 6, "black");
      board = Board.placeStone(board, 7, 7, "black");
      board = Board.placeStone(board, 7, 8, "black");
      
      const result = isPatternOpen(board, 7, 7, 0, 1);
      
      expect(result).toBe(true);
    });
  });
});