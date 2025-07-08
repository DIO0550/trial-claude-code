import type { GameState } from "../hooks/useGomokuGame";

/**
 * ゲーム履歴の単一エントリを表す型
 */
export interface GameHistoryEntry {
  /** その時点のゲーム状態 */
  gameState: GameState;
  /** 履歴エントリの作成時刻 */
  timestamp: number;
  /** 手番数（0から開始） */
  moveCount: number;
}