import { describe, it, expect } from "vitest";
import { GameBoard } from "./gameBoard";
import { Board } from "./board";

describe("GameBoard", () => {
  describe("createEmpty", () => {
    it("空のゲームボードを作成する", () => {
      const gameBoard = GameBoard.createEmpty();

      expect(gameBoard.board).toEqual(Board.createEmpty());
    });
  });

  describe("canPlaceStone", () => {
    it("空の位置に石を置くことができる", () => {
      const gameBoard = GameBoard.createEmpty();

      expect(GameBoard.canPlaceStone(gameBoard, 7, 7)).toBe(true);
    });

    it("範囲外の位置には石を置くことができない", () => {
      const gameBoard = GameBoard.createEmpty();

      expect(GameBoard.canPlaceStone(gameBoard, -1, 0)).toBe(false);
      expect(GameBoard.canPlaceStone(gameBoard, 15, 0)).toBe(false);
      expect(GameBoard.canPlaceStone(gameBoard, 0, -1)).toBe(false);
      expect(GameBoard.canPlaceStone(gameBoard, 0, 15)).toBe(false);
    });

    it("既に石がある位置には石を置くことができない", () => {
      const gameBoard = GameBoard.createEmpty();
      const newGameBoard = GameBoard.placeStone(gameBoard, 7, 7, "black");

      expect(newGameBoard).not.toBeNull();
      expect(GameBoard.canPlaceStone(newGameBoard!, 7, 7)).toBe(false);
    });
  });

  describe("placeStone", () => {
    it("有効な位置に石を配置できる", () => {
      const gameBoard = GameBoard.createEmpty();

      const newGameBoard = GameBoard.placeStone(gameBoard, 7, 7, "black");

      expect(newGameBoard).not.toBeNull();
      expect(newGameBoard!.board[7][7]).toBe("black");
    });

    it("範囲外の位置に石を配置しようとするとnullを返す", () => {
      const gameBoard = GameBoard.createEmpty();

      const result = GameBoard.placeStone(gameBoard, -1, 0, "black");

      expect(result).toBeNull();
    });

    it("既に石がある位置に石を配置しようとするとnullを返す", () => {
      const gameBoard = GameBoard.createEmpty();
      const newGameBoard = GameBoard.placeStone(gameBoard, 7, 7, "black");

      const result = GameBoard.placeStone(newGameBoard!, 7, 7, "white");

      expect(result).toBeNull();
    });

    it("元のゲームボードは変更されない", () => {
      const gameBoard = GameBoard.createEmpty();

      GameBoard.placeStone(gameBoard, 7, 7, "black");

      expect(gameBoard.board[7][7]).toBe("none");
    });
  });

  describe("getStone", () => {
    it("指定位置の石を取得できる", () => {
      const gameBoard = GameBoard.createEmpty();
      const newGameBoard = GameBoard.placeStone(gameBoard, 7, 7, "black");

      expect(GameBoard.getStone(newGameBoard!, 7, 7)).toBe("black");
    });

    it("空の位置ではnoneを返す", () => {
      const gameBoard = GameBoard.createEmpty();

      expect(GameBoard.getStone(gameBoard, 7, 7)).toBe("none");
    });

    it("範囲外の位置ではnoneを返す", () => {
      const gameBoard = GameBoard.createEmpty();

      expect(GameBoard.getStone(gameBoard, -1, 0)).toBe("none");
      expect(GameBoard.getStone(gameBoard, 15, 0)).toBe("none");
    });
  });

  describe("reset", () => {
    it("ゲームボードをリセットする", () => {
      const resetBoard = GameBoard.reset();

      expect(resetBoard.board).toEqual(Board.createEmpty());
    });
  });
});