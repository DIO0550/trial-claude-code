import type { GameHistoryEntry } from "../types/gameHistory";
import type { GameState } from "../hooks/useGomokuGame";
import type { StoneColor } from "@/features/board/utils/stone";

/**
 * ゲーム履歴操作のユーティリティ関数群
 */
export const GameHistoryUtils = {
  /**
   * ゲーム状態から履歴エントリを作成
   */
  createHistoryEntry: (gameState: GameState, moveCount = 0): GameHistoryEntry => {
    return {
      gameState,
      timestamp: Date.now(),
      moveCount,
    };
  },

  /**
   * Undo操作が有効かどうかを検証
   */
  validateUndoOperation: (history: GameHistoryEntry[]): boolean => {
    return history.length > 1;
  },

  /**
   * 指定されたプレイヤーの最後の手を見つける
   */
  findLastPlayerMove: (history: GameHistoryEntry[], playerColor: StoneColor): GameHistoryEntry | null => {
    // 履歴を逆順で検索
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (entry.gameState.currentPlayer === playerColor) {
        return entry;
      }
    }
    return null;
  },

  /**
   * 履歴のサイズを取得
   */
  getHistorySize: (history: GameHistoryEntry[]): number => {
    return history.length;
  },
};