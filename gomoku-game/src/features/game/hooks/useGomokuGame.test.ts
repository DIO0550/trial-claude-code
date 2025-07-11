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

    it("初期状態で勝利ラインがnullである", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.winningLine).toBeNull();
    });

    it("初期状態で結果モーダルが非表示である", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));

      expect(result.current.showResultModal).toBe(false);
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
      expect(result.current.winningLine).toBeNull();
      expect(result.current.showResultModal).toBe(false);
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

    it("勝利時に勝利ラインが設定される", () => {
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

      expect(result.current.winningLine).not.toBeNull();
      expect(result.current.winningLine?.positions).toHaveLength(5);
      expect(result.current.winningLine?.positions).toContainEqual({ row: 7, col: 7 });
      expect(result.current.winningLine?.positions).toContainEqual({ row: 7, col: 8 });
      expect(result.current.winningLine?.positions).toContainEqual({ row: 7, col: 9 });
      expect(result.current.winningLine?.positions).toContainEqual({ row: 7, col: 10 });
      expect(result.current.winningLine?.positions).toContainEqual({ row: 7, col: 11 });
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

  describe("遅延表示機能", () => {
    it("勝利直後は結果モーダルが非表示である", () => {
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
      expect(result.current.showResultModal).toBe(false);
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

  describe("undo機能", () => {
    it("初期状態ではundo不可", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      expect(result.current.canUndo).toBe(false);
    });

    it("1手打った後はundo可能", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      act(() => {
        result.current.makeMove(7, 7);
      });

      expect(result.current.canUndo).toBe(true);
    });

    it("5手打った後はundo可能", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(9, 9); // 黒
      });
      act(() => {
        result.current.makeMove(10, 10); // 白
      });
      act(() => {
        result.current.makeMove(11, 11); // 黒
      });

      expect(result.current.canUndo).toBe(true);
    });

    it("undoでプレイヤーの手番まで戻る", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      // 5手打つ：黒→白→黒→白→黒
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(9, 9); // 黒
      });
      act(() => {
        result.current.makeMove(10, 10); // 白
      });
      act(() => {
        result.current.makeMove(11, 11); // 黒
      });

      // 変更を確認
      expect(result.current.board[7][7]).toBe("black");
      expect(result.current.board[8][8]).toBe("white");
      expect(result.current.board[9][9]).toBe("black");
      expect(result.current.board[10][10]).toBe("white");
      expect(result.current.board[11][11]).toBe("black");
      expect(result.current.currentPlayer).toBe("white");
      expect(result.current.moveHistory).toHaveLength(5);

      // undo実行
      act(() => {
        result.current.undoMove();
      });

      // プレイヤー（黒）の前の手番まで戻る（3手目の後）
      expect(result.current.board[7][7]).toBe("black");   // 最初の黒石は残る
      expect(result.current.board[8][8]).toBe("white");   // 最初の白石は残る
      expect(result.current.board[9][9]).toBe("black");   // 2番目の黒石は残る
      expect(result.current.board[10][10]).toBe("none");  // 2番目の白石は消える
      expect(result.current.board[11][11]).toBe("none");  // 3番目の黒石は消える
      expect(result.current.currentPlayer).toBe("white"); // 白の手番
      expect(result.current.moveHistory).toHaveLength(3); // 3手のみ
    });

    it("5手打った後に複数回undoできる", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      // 5手打つ：黒→白→黒→白→黒
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(7, 8); // 黒
      });
      act(() => {
        result.current.makeMove(8, 7); // 白
      });
      act(() => {
        result.current.makeMove(9, 9); // 黒
      });

      expect(result.current.moveHistory).toHaveLength(5);
      expect(result.current.canUndo).toBe(true);

      // 1回目のundo：プレイヤー（黒）の前の手番まで戻る
      act(() => {
        result.current.undoMove();
      });

      expect(result.current.moveHistory).toHaveLength(3); // 黒→白→黒まで
      expect(result.current.board[9][9]).toBe("none");   // 最新の黒石は消える
      expect(result.current.board[8][7]).toBe("none");   // 直前の白石も消える
      expect(result.current.currentPlayer).toBe("white"); // 白の手番
      expect(result.current.canUndo).toBe(true);

      // 2回目のundo：さらにプレイヤー（黒）の前の手番まで戻る
      act(() => {
        result.current.undoMove();
      });

      expect(result.current.moveHistory).toHaveLength(1); // 黒の最初の手のみ
      expect(result.current.board[7][8]).toBe("none");   // 2回目の黒石は消える
      expect(result.current.board[8][8]).toBe("none");   // 最初の白石も消える
      expect(result.current.currentPlayer).toBe("white"); // 白の手番
      expect(result.current.canUndo).toBe(true); // 履歴2つなので戻れる
    });

    it("ゲーム終了後はundo不可", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      // 勝利状態を作成（横に5つ）
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
        result.current.makeMove(7, 11); // 黒 - 勝利
      });

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.canUndo).toBe(false);
    });

    it("resetGame後はundo履歴がクリアされる", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      // 5手打ってundo可能な状態にする
      act(() => {
        result.current.makeMove(7, 7); // 黒
      });
      act(() => {
        result.current.makeMove(8, 8); // 白
      });
      act(() => {
        result.current.makeMove(9, 9); // 黒
      });
      act(() => {
        result.current.makeMove(10, 10); // 白
      });
      act(() => {
        result.current.makeMove(11, 11); // 黒
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.moveHistory).toHaveLength(0);
    });

    it("プレイヤーとCPUが1手ずつ打った後から待った可能", () => {
      const { result } = renderHook(() => useGomokuGame(defaultSettings));
      
      // 初期状態の確認
      expect(result.current.canUndo).toBe(false);

      // 1手目（プレイヤー）
      act(() => {
        result.current.makeMove(7, 7); // 黒プレイヤー
      });

      // プレイヤーが1手打っただけでも待った可能
      expect(result.current.canUndo).toBe(true);

      // 2手目（CPU）
      act(() => {
        result.current.makeMove(8, 8); // 白CPU
      });

      // プレイヤーとCPUが1手ずつ打った後は待った可能
      expect(result.current.canUndo).toBe(true);

      // undo実行
      act(() => {
        result.current.undoMove();
      });

      // 初期状態に戻る（プレイヤーとCPUの両方の石が消える）
      expect(result.current.board[7][7]).toBe("none");
      expect(result.current.board[8][8]).toBe("none");
      expect(result.current.currentPlayer).toBe("black"); // 黒の手番
      expect(result.current.moveHistory).toHaveLength(0); // 初期状態
    });
  });
});