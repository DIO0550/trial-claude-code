import { describe, it, expect } from "vitest";
import { Board } from "./board";

describe("Board", () => {
  describe("createEmpty", () => {
    it("15x15の空のボードを作成する", () => {
      const board = Board.createEmpty();
      
      expect(board).toHaveLength(15);
      expect(board[0]).toHaveLength(15);
      
      // 全てのセルが"none"で初期化されていることを確認
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          expect(board[row][col]).toBe("none");
        }
      }
    });

    it("新しい配列インスタンスを返す", () => {
      const board1 = Board.createEmpty();
      const board2 = Board.createEmpty();
      
      expect(board1).not.toBe(board2);
      expect(board1[0]).not.toBe(board2[0]);
    });
  });

  describe("isValidPosition", () => {
    describe("正常系", () => {
      it("有効な座標でtrueを返す", () => {
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(7, 7)).toBe(true);
        expect(Board.isValidPosition(14, 14)).toBe(true);
      });

      it("境界値の座標でtrueを返す", () => {
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(0, 14)).toBe(true);
        expect(Board.isValidPosition(14, 0)).toBe(true);
        expect(Board.isValidPosition(14, 14)).toBe(true);
      });
    });

    describe("異常系", () => {
      it("負の座標でfalseを返す", () => {
        expect(Board.isValidPosition(-1, 0)).toBe(false);
        expect(Board.isValidPosition(0, -1)).toBe(false);
        expect(Board.isValidPosition(-1, -1)).toBe(false);
      });

      it("範囲外の座標でfalseを返す", () => {
        expect(Board.isValidPosition(15, 0)).toBe(false);
        expect(Board.isValidPosition(0, 15)).toBe(false);
        expect(Board.isValidPosition(15, 15)).toBe(false);
      });

      it("大きく範囲外の座標でfalseを返す", () => {
        expect(Board.isValidPosition(100, 50)).toBe(false);
        expect(Board.isValidPosition(-10, -5)).toBe(false);
      });
    });

    describe("境界値テスト", () => {
      it("境界値直前はtrue、境界値はfalse", () => {
        // 上限境界
        expect(Board.isValidPosition(14, 14)).toBe(true);
        expect(Board.isValidPosition(15, 14)).toBe(false);
        expect(Board.isValidPosition(14, 15)).toBe(false);
        
        // 下限境界
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(-1, 0)).toBe(false);
        expect(Board.isValidPosition(0, -1)).toBe(false);
      });
    });

    describe("引数の型テスト", () => {
      it("小数点を含む数値でfalseを返す", () => {
        expect(Board.isValidPosition(7.5, 7)).toBe(false);
        expect(Board.isValidPosition(7, 7.5)).toBe(false);
      });

      it("非常に大きな数値でfalseを返す", () => {
        expect(Board.isValidPosition(Number.MAX_SAFE_INTEGER, 7)).toBe(false);
        expect(Board.isValidPosition(7, Number.MAX_SAFE_INTEGER)).toBe(false);
      });
    });
  });
});