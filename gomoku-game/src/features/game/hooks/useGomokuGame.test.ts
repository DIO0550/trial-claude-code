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

  describe("勝利判定", () => {
    it("横方向に5つ連続で並んだ場合に勝利する", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 黒石を横に5つ並べる
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 7); // 白
      });
      act(() => {
        result.current.makeMove(7, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(7, 9); // 黒
      });
      act(() => {
        result.current.makeMove(8, 9); // 白
      });
      act(() => {
        result.current.makeMove(7, 10); // 黒
      });
      act(() => {
        result.current.makeMove(8, 10); // 白
      });
      act(() => {
        result.current.makeMove(7, 11); // 黒 - 5つ目
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("black");
    });

    it("縦方向に5つ連続で並んだ場合に勝利する", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 白石を縦に5つ並べる
      act(() => {
        result.current.makeMove(6, 6); // 黒
      });
      act(() => {
        result.current.makeMove(7, 7); // 白
      });
      act(() => {
        result.current.makeMove(6, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 7); // 白
      });
      act(() => {
        result.current.makeMove(6, 9); // 黒
      });
      act(() => {
        result.current.makeMove(9, 7); // 白
      });
      act(() => {
        result.current.makeMove(6, 10); // 黒
      });
      act(() => {
        result.current.makeMove(10, 7); // 白
      });
      act(() => {
        result.current.makeMove(5, 5); // 黒
      });
      act(() => {
        result.current.makeMove(11, 7); // 白 - 5つ目
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("white");
    });

    it("斜め方向（右下）に5つ連続で並んだ場合に勝利する", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 黒石を斜めに5つ並べる
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(7, 8); // 白
      });
      act(() => {
        result.current.makeMove(8, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 9); // 白
      });
      act(() => {
        result.current.makeMove(9, 9); // 黒
      });
      act(() => {
        result.current.makeMove(9, 10); // 白
      });
      act(() => {
        result.current.makeMove(10, 10); // 黒
      });
      act(() => {
        result.current.makeMove(10, 11); // 白
      });
      act(() => {
        result.current.makeMove(11, 11); // 黒 - 5つ目
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("black");
    });

    it("斜め方向（右上）に5つ連続で並んだ場合に勝利する", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 白石を斜めに5つ並べる
      act(() => {
        result.current.makeMove(5, 5); // 黒
      });
      act(() => {
        result.current.makeMove(11, 7); // 白
      });
      act(() => {
        result.current.makeMove(5, 6); // 黒
      });
      act(() => {
        result.current.makeMove(10, 8); // 白
      });
      act(() => {
        result.current.makeMove(5, 7); // 黒
      });
      act(() => {
        result.current.makeMove(9, 9); // 白
      });
      act(() => {
        result.current.makeMove(5, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 10); // 白
      });
      act(() => {
        result.current.makeMove(6, 6); // 黒
      });
      act(() => {
        result.current.makeMove(7, 11); // 白 - 5つ目
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("white");
    });

    it("勝利後は石を置くことができない", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 黒石を横に5つ並べて勝利させる
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 7); // 白
      });
      act(() => {
        result.current.makeMove(7, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(7, 9); // 黒
      });
      act(() => {
        result.current.makeMove(8, 9); // 白
      });
      act(() => {
        result.current.makeMove(7, 10); // 黒
      });
      act(() => {
        result.current.makeMove(8, 10); // 白
      });
      act(() => {
        result.current.makeMove(7, 11); // 黒 - 5つ目
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.canMakeMove(0, 0)).toBe(false);
    });
  });

  describe("引き分け判定", () => {
    it("ボードが満杯で勝者がいない場合に引き分けになる", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // ボードを満杯にして引き分けにする（実際には簡単なパターンで確認）
      // このテストは実装後に調整が必要
      expect(result.current.gameStatus).toBe("playing");
      // TODO: ボード満杯のシナリオを実装
    });

    it("引き分け後は石を置くことができない", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      // 引き分け状態を作成（実装後に調整）
      // TODO: 引き分け状態のシナリオを実装
      expect(result.current.gameStatus).toBe("playing");
    });
  });
});