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
   * Undo可能かどうかを判定
   */
  const canUndo = useCallback((): boolean => {
    return history.length > 1;
  }, [history]);

  return {
    history,
    addToHistory,
    undoLastMove,
    canUndo,
  };
};