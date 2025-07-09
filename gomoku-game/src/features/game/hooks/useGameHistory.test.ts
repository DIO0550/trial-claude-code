import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameHistory } from "./useGameHistory";
import { GameBoard } from "@/features/board/utils/gameBoard";
import type { GameState } from "./useGomokuGame";

describe("useGameHistory", () => {
  const createTestGameState = (currentPlayer: "black" | "white" = "black"): GameState => ({
    gameBoard: GameBoard.createEmpty(),
    currentPlayer,
    gameStatus: "playing",
    winner: null,
    moveHistory: [],
    winningLine: null,
    showResultModal: false,
  });

  test("初期状態では履歴が空である", () => {
    const { result } = renderHook(() => useGameHistory());
    
    expect(result.current.history).toEqual([]);
    expect(result.current.canUndo()).toBe(false);
  });

  test("addToHistoryでゲーム状態を履歴に追加できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState = createTestGameState();

    act(() => {
      result.current.addToHistory(gameState);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].gameState).toEqual(gameState);
    expect(result.current.history[0].moveCount).toBe(0);
    expect(result.current.canUndo()).toBe(false); // 1つの履歴ではundo不可
  });

  test("複数の状態を順次追加できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState1 = createTestGameState("black");
    const gameState2 = createTestGameState("white");

    act(() => {
      result.current.addToHistory(gameState1);
    });

    act(() => {
      result.current.addToHistory(gameState2);
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].moveCount).toBe(0);
    expect(result.current.history[1].moveCount).toBe(1);
    expect(result.current.canUndo()).toBe(true); // 2つ以上の履歴でundo可能
  });

  test("undoLastMoveで最後の状態を取得し履歴から削除できる", () => {
    const { result } = renderHook(() => useGameHistory());
    const gameState1 = createTestGameState("black");
    const gameState2 = createTestGameState("white");

    act(() => {
      result.current.addToHistory(gameState1);
      result.current.addToHistory(gameState2);
    });

    let undoResult: GameState | null = null;
    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toEqual(gameState1);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].gameState).toEqual(gameState1);
  });

  test("履歴が1つ以下の時にundoLastMoveはnullを返す", () => {
    const { result } = renderHook(() => useGameHistory());

    // 空の状態
    let undoResult: GameState | null = null;
    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toBeNull();
    expect(result.current.history).toHaveLength(0);

    // 1つの履歴がある状態
    const gameState = createTestGameState();
    act(() => {
      result.current.addToHistory(gameState);
    });

    act(() => {
      undoResult = result.current.undoLastMove();
    });

    expect(undoResult).toBeNull();
    expect(result.current.history).toHaveLength(1);
  });

  test("履歴上限（20手）を超えると古い履歴が削除される", () => {
    const { result } = renderHook(() => useGameHistory());
    
    // 21手分の履歴を追加
    act(() => {
      for (let i = 0; i < 21; i++) {
        const gameState = createTestGameState(i % 2 === 0 ? "black" : "white");
        result.current.addToHistory(gameState);
      }
    });

    expect(result.current.history).toHaveLength(20);
    expect(result.current.history[0].moveCount).toBe(1); // 最初の履歴が削除されている
    expect(result.current.history[19].moveCount).toBe(20);
  });

  describe("undoToPlayerTurn", () => {
    test("プレイヤーの手番まで正しく戻る", () => {
      const { result } = renderHook(() => useGameHistory());
      
      // プレイヤー（黒）→ CPU（白）→ プレイヤー（黒）→ CPU（白）の順序で履歴追加
      const state1 = createTestGameState("black");  // 初期状態：黒の手番
      const state2 = createTestGameState("white");  // 黒が打った後：白の手番
      const state3 = createTestGameState("black");  // 白が打った後：黒の手番
      const state4 = createTestGameState("white");  // 黒が打った後：白の手番

      act(() => {
        result.current.addToHistory(state1);
        result.current.addToHistory(state2);
        result.current.addToHistory(state3);
        result.current.addToHistory(state4);
      });

      // 黒プレイヤーが待ったをした場合、前の黒の手番（state3）まで戻る
      let undoResult: GameState | null = null;
      act(() => {
        undoResult = result.current.undoToPlayerTurn("black");
      });

      expect(undoResult).toEqual(state2);
      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[1].gameState).toEqual(state2);
    });

    test("履歴が1つ以下の場合はnullを返す", () => {
      const { result } = renderHook(() => useGameHistory());
      
      // 1つの履歴のみ
      const state1 = createTestGameState("black");
      act(() => {
        result.current.addToHistory(state1);
      });

      let undoResult: GameState | null = null;
      act(() => {
        undoResult = result.current.undoToPlayerTurn("black");
      });

      expect(undoResult).toBeNull();
    });

    test("canUndoToPlayerTurnは適切な条件でtrueを返す", () => {
      const { result } = renderHook(() => useGameHistory());
      
      expect(result.current.canUndoToPlayerTurn()).toBe(false);

      // 1つの履歴では不可
      act(() => {
        result.current.addToHistory(createTestGameState("black"));  // 初期状態：黒手番
      });
      
      expect(result.current.canUndoToPlayerTurn()).toBe(false);

      // 2つの履歴で可能（プレイヤーが1手打った直後）
      act(() => {
        result.current.addToHistory(createTestGameState("white"));  // 黒が打った後：白手番  
      });
      
      expect(result.current.canUndoToPlayerTurn()).toBe(true);

      // 3つの履歴で可能（プレイヤーとCPUが1手ずつ打った状態）
      act(() => {
        result.current.addToHistory(createTestGameState("black"));  // 白が打った後：黒手番
      });
      
      expect(result.current.canUndoToPlayerTurn()).toBe(true);
    });

    test("プレイヤーとCPUが1手ずつ打った場合に初期状態に戻る", () => {
      const { result } = renderHook(() => useGameHistory());
      
      // 初期状態 + プレイヤー1手 + CPU1手 の履歴
      const initialState = createTestGameState("black");     // 初期状態：黒手番
      const afterPlayerMove = createTestGameState("white");  // 黒が打った後：白手番
      const afterCpuMove = createTestGameState("black");     // 白が打った後：黒手番

      act(() => {
        result.current.addToHistory(initialState);
        result.current.addToHistory(afterPlayerMove);
        result.current.addToHistory(afterCpuMove);
      });

      expect(result.current.canUndoToPlayerTurn()).toBe(true);

      // undo実行
      let undoResult: GameState | null = null;
      act(() => {
        undoResult = result.current.undoToPlayerTurn("black");
      });

      // 初期状態に戻る（プレイヤーとCPUの両方の手が取り消される）
      expect(undoResult).toEqual(initialState);
      expect(result.current.history).toHaveLength(1);
    });
  });
});