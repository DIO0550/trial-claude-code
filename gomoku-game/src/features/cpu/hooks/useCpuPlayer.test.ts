import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCpuPlayer } from "./useCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { StoneColor } from "@/features/board/utils/stone";

describe("useCpuPlayer", () => {
  describe("getNextMove", () => {
    it("空のボードで有効な手を返す", () => {
      const { result } = renderHook(() => useCpuPlayer("black"));
      const emptyBoard = Board.createEmpty();

      const move = result.current.getNextMove(emptyBoard);

      expect(move).toBeDefined();
      expect(move!.row).toBeGreaterThanOrEqual(0);
      expect(move!.row).toBeLessThan(15);
      expect(move!.col).toBeGreaterThanOrEqual(0);
      expect(move!.col).toBeLessThan(15);
    });

    it("満杯のボードでnullを返す", () => {
      const { result } = renderHook(() => useCpuPlayer("white"));
      const fullBoard = Array.from({ length: 15 }, () =>
        Array.from({ length: 15 }, () => "black" as StoneColor)
      );

      const move = result.current.getNextMove(fullBoard);

      expect(move).toBeNull();
    });

    it("一つだけ空きがあるボードでその位置を返す", () => {
      const { result } = renderHook(() => useCpuPlayer("white"));
      const almostFullBoard = Array.from({ length: 15 }, (_, row) =>
        Array.from({ length: 15 }, (_, col) => {
          if (row === 7 && col === 7) return "none" as StoneColor;
          return "black" as StoneColor;
        })
      );

      const move = result.current.getNextMove(almostFullBoard);

      expect(move).toEqual({ row: 7, col: 7 });
    });

    it("複数の空きがあるボードで有効な手を返す", () => {
      const { result } = renderHook(() => useCpuPlayer("black"));
      const partialBoard = Board.createEmpty();
      partialBoard[7][7] = "black";
      partialBoard[7][8] = "white";

      const move = result.current.getNextMove(partialBoard);

      expect(move).toBeDefined();
      expect(partialBoard[move!.row][move!.col]).toBe("none");
    });
  });
});
