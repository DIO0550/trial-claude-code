import { useState, useCallback } from "react";
import type { GameHistoryEntry } from "../types/gameHistory";
import type { GameState } from "./useGomokuGame";

const HISTORY_LIMIT = 20;

/**
 * ゲーム履歴管理のカスタムフック
 * 手番履歴の保存、取得、undo操作を提供する
 */
export const useGameHistory = () => {
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);

  /**
   * ゲーム状態を履歴に追加
   */
  const addToHistory = useCallback((gameState: GameState) => {
    setHistory((prevHistory) => {
      const newEntry: GameHistoryEntry = {
        gameState,
        timestamp: Date.now(),
        moveCount: prevHistory.length,
      };

      const newHistory = [...prevHistory, newEntry];

      // 履歴上限を超えた場合、古い履歴を削除
      if (newHistory.length > HISTORY_LIMIT) {
        return newHistory.slice(1);
      }

      return newHistory;
    });
  }, []);

  /**
   * 最後の履歴を削除し、その前の状態を取得
   * @returns 前のゲーム状態、または履歴が1つ以下の場合はnull
   */
  const undoLastMove = useCallback((): GameState | null => {
    if (history.length <= 1) {
      return null;
    }

    // 最後の履歴を削除
    setHistory((prevHistory) => prevHistory.slice(0, -1));

    // 削除後の最後の履歴の状態を返す
    return history[history.length - 2].gameState;
  }, [history]);

  /**
   * プレイヤーの前の手番まで戻る
   * CPUの手が間にある場合は、それも含めて戻る
   * @param playerColor プレイヤーの石の色
   * @returns 戻った後のゲーム状態、または戻れない場合はnull
   */
  const undoToPlayerTurn = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _playerColor: "black" | "white"
    ): GameState | null => {
      // 履歴が1つ以下の場合は戻れない
      if (history.length <= 1) {
        return null;
      }

      // 常にプレイヤーとCPUの1ペア分（2手）を取り消す
      // 現在から2手前に戻る（最小値は初期状態）
      const targetIndex = Math.max(0, history.length - 3);
      const state = history[targetIndex].gameState;
      setHistory((prevHistory) => prevHistory.slice(0, targetIndex + 1));
      return state;
    },
    [history]
  );

  /**
   * Undo可能かどうかを判定
   */
  const canUndo = useCallback((): boolean => {
    return history.length > 1;
  }, [history]);

  /**
   * プレイヤーの手番まで戻ることが可能かどうかを判定
   * @param playerColor プレイヤーの石の色
   */
  const canUndoToPlayerTurn = useCallback((): boolean => {
    // 最低でも3つの履歴が必要（初期状態 + プレイヤーの手 + CPUの手）
    // プレイヤーとCPUが1手ずつ打った後から待った可能
    // ただし、履歴長2の場合でも待ったを許可する（1手ずつ打った後の状態）
    return history.length >= 2;
  }, [history]);

  /**
   * 履歴をクリア
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    undoLastMove,
    undoToPlayerTurn,
    canUndo,
    canUndoToPlayerTurn,
    clearHistory,
  };
};
