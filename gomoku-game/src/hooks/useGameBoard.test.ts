import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameBoard } from "./useGameBoard";

describe("useGameBoard", () => {
  describe("初期化", () => {
    it("15x15の空のボードで初期化される", () => {
      const { result } = renderHook(() => useGameBoard());

      expect(result.current.board).toHaveLength(15);
      expect(result.current.board[0]).toHaveLength(15);

      // 全てのセルがnullで初期化されていることを確認
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          expect(result.current.board[row][col]).toBe(null);
        }
      }
    });
  });

  describe("石の配置", () => {
    it("空のセルに黒石を配置できる", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        const success = result.current.placeStone(7, 7, "black");
        expect(success).toBe(true);
      });

      expect(result.current.board[7][7]).toBe("black");
    });

    it("空のセルに白石を配置できる", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        const success = result.current.placeStone(7, 7, "white");
        expect(success).toBe(true);
      });

      expect(result.current.board[7][7]).toBe("white");
    });

    it("既に石が置かれているセルには配置できない", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        result.current.placeStone(7, 7, "black");
      });

      act(() => {
        const success = result.current.placeStone(7, 7, "white");
        expect(success).toBe(false);
      });

      expect(result.current.board[7][7]).toBe("black");
    });

    it("範囲外の座標には配置できない", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        const success1 = result.current.placeStone(-1, 7, "black");
        const success2 = result.current.placeStone(7, -1, "black");
        const success3 = result.current.placeStone(15, 7, "black");
        const success4 = result.current.placeStone(7, 15, "black");

        expect(success1).toBe(false);
        expect(success2).toBe(false);
        expect(success3).toBe(false);
        expect(success4).toBe(false);
      });
    });
  });

  describe("石の取得", () => {
    it("配置した石を正しく取得できる", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        result.current.placeStone(3, 5, "black");
        result.current.placeStone(10, 12, "white");
      });

      expect(result.current.getStone(3, 5)).toBe("black");
      expect(result.current.getStone(10, 12)).toBe("white");
      expect(result.current.getStone(0, 0)).toBe(null);
    });

    it("範囲外の座標はnullを返す", () => {
      const { result } = renderHook(() => useGameBoard());

      expect(result.current.getStone(-1, 0)).toBe(null);
      expect(result.current.getStone(0, -1)).toBe(null);
      expect(result.current.getStone(15, 0)).toBe(null);
      expect(result.current.getStone(0, 15)).toBe(null);
    });
  });

  describe("ボードのリセット", () => {
    it("ボードを初期状態にリセットできる", () => {
      const { result } = renderHook(() => useGameBoard());

      // いくつかの石を配置
      act(() => {
        result.current.placeStone(7, 7, "black");
        result.current.placeStone(7, 8, "white");
        result.current.placeStone(8, 7, "black");
      });

      // リセット実行
      act(() => {
        result.current.resetBoard();
      });

      // 全てのセルがnullになっていることを確認
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          expect(result.current.board[row][col]).toBe(null);
        }
      }
    });
  });

  describe("境界値テスト", () => {
    it("ボードの四隅に石を配置できる", () => {
      const { result } = renderHook(() => useGameBoard());

      act(() => {
        const corner1 = result.current.placeStone(0, 0, "black");
        const corner2 = result.current.placeStone(0, 14, "white");
        const corner3 = result.current.placeStone(14, 0, "black");
        const corner4 = result.current.placeStone(14, 14, "white");

        expect(corner1).toBe(true);
        expect(corner2).toBe(true);
        expect(corner3).toBe(true);
        expect(corner4).toBe(true);
      });

      expect(result.current.board[0][0]).toBe("black");
      expect(result.current.board[0][14]).toBe("white");
      expect(result.current.board[14][0]).toBe("black");
      expect(result.current.board[14][14]).toBe("white");
    });
  });
});
