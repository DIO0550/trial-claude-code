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

  describe("isEmpty", () => {
    it("空のボードに対してtrueを返す", () => {
      const board = Board.createEmpty();
      
      expect(Board.isEmpty(board)).toBe(true);
    });

    it("石が1つでも置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      
      expect(Board.isEmpty(board)).toBe(false);
    });

    it("複数の石が置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      board[7][8] = "white";
      board[8][7] = "black";
      
      expect(Board.isEmpty(board)).toBe(false);
    });

    it("全ての位置に石が置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      
      // 全ての位置に石を配置
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          board[row][col] = (row + col) % 2 === 0 ? "black" : "white";
        }
      }
      
      expect(Board.isEmpty(board)).toBe(false);
    });
  });

  describe("getStonePositions", () => {
    it("指定された色の石の位置を全て取得する", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      board[8][8] = "black";
      board[9][9] = "white";
      
      const blackPositions = Board.getStonePositions(board, "black");
      const whitePositions = Board.getStonePositions(board, "white");
      
      expect(blackPositions).toHaveLength(2);
      expect(blackPositions).toContainEqual({ row: 7, col: 7 });
      expect(blackPositions).toContainEqual({ row: 8, col: 8 });
      
      expect(whitePositions).toHaveLength(1);
      expect(whitePositions).toContainEqual({ row: 9, col: 9 });
    });

    it("該当する色の石がない場合は空配列を返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      
      const whitePositions = Board.getStonePositions(board, "white");
      const nonePositions = Board.getStonePositions(board, "none");
      
      expect(whitePositions).toHaveLength(0);
      expect(nonePositions.length).toBeGreaterThan(0); // 空きマスは多数ある
    });

    it("空のボードで'none'を指定すると全位置を返す", () => {
      const board = Board.createEmpty();
      
      const nonePositions = Board.getStonePositions(board, "none");
      
      expect(nonePositions).toHaveLength(15 * 15);
    });
  });
});