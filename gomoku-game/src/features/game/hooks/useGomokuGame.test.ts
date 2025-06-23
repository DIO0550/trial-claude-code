import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGomokuGame, GameSettings } from "./useGomokuGame";
import { Board } from "@/features/board/utils/board";

describe("useGomokuGame", () => {
  const defaultSettings: GameSettings = {
    playerColor: "black",
    cpuLevel: "easy",
  };

  describe("初期状態のテスト", () => {
    it("初期状態で空のボードが作成される", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.board).toEqual(Board.createEmpty());
    });

    it("初期状態でゲームステータスがplayingである", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.gameStatus).toBe("playing");
    });

    it("初期状態で現在のプレイヤーがblackである", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.currentPlayer).toBe("black");
    });

    it("初期状態で勝者がnullである", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.winner).toBeNull();
    });

    it("初期状態で移動履歴が空である", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.moveHistory).toEqual([]);
    });
  });

  describe("プレイヤーターンの管理", () => {
    it("プレイヤーがblackの場合、初期状態でisPlayerTurnがtrueである", () => {
      const settings: GameSettings = { playerColor: "black", cpuLevel: "easy" };
      const { result } = renderHook(() => useGomokuGame(settings));

      expect(result.current.isPlayerTurn).toBe(true);
      expect(result.current.isCpuTurn).toBe(false);
    });

    it("プレイヤーがwhiteの場合、初期状態でisPlayerTurnがfalseである", () => {
      const settings: GameSettings = { playerColor: "white", cpuLevel: "easy" };
      const { result } = renderHook(() => useGomokuGame(settings));

      expect(result.current.isPlayerTurn).toBe(false);
      expect(result.current.isCpuTurn).toBe(true);
    });
  });

  describe("石を置く操作", () => {
    it("有効な位置に石を置くことができる", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      act(() => {
        result.current.makeMove(7, 7);
      });

      expect(result.current.board[7][7]).toBe("black");
      expect(result.current.currentPlayer).toBe("white");
      expect(result.current.moveHistory).toEqual([{ row: 7, col: 7 }]);
    });

    it("既に石がある位置には石を置けない", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      act(() => {
        result.current.makeMove(7, 7);
      });

      const boardBeforeSecondMove = result.current.board;
      const currentPlayerBeforeSecondMove = result.current.currentPlayer;

      act(() => {
        result.current.makeMove(7, 7);
      });

      expect(result.current.board).toEqual(boardBeforeSecondMove);
      expect(result.current.currentPlayer).toBe(currentPlayerBeforeSecondMove);
    });

    it("範囲外の位置には石を置けない", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      const boardBefore = result.current.board;
      const currentPlayerBefore = result.current.currentPlayer;

      act(() => {
        result.current.makeMove(-1, 0);
      });

      expect(result.current.board).toEqual(boardBefore);
      expect(result.current.currentPlayer).toBe(currentPlayerBefore);
    });
  });

  describe("移動可能判定", () => {
    it("空の位置で移動可能である", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.canMakeMove(7, 7)).toBe(true);
    });

    it("石がある位置では移動不可能である", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      act(() => {
        result.current.makeMove(7, 7);
      });

      expect(result.current.canMakeMove(7, 7)).toBe(false);
    });

    it("CPUのターンでは移動不可能である", () => {
      const settings: GameSettings = { playerColor: "white", cpuLevel: "easy" };
      const { result } = renderHook(() => useGomokuGame(settings));

      expect(result.current.canMakeMove(7, 7)).toBe(false);
    });
  });

  describe("ゲームリセット", () => {
    it("ゲームをリセットすると初期状態に戻る", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      act(() => {
        result.current.makeMove(7, 7);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.board).toEqual(Board.createEmpty());
      expect(result.current.currentPlayer).toBe("black");
      expect(result.current.gameStatus).toBe("playing");
      expect(result.current.winner).toBeNull();
      expect(result.current.moveHistory).toEqual([]);
    });
  });
});