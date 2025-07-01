import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { StoneColor } from "@/features/board/utils/stone";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";

type GamePhase = 'early' | 'mid' | 'late';

// 戦略的位置（中央からのオフセット）
const STRATEGIC_POSITIONS = [
  { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  { row: -2, col: -1 }, { row: -2, col: 0 }, { row: -2, col: 1 },
  { row: -1, col: -2 }, { row: 0, col: -2 }, { row: 1, col: -2 },
  { row: 2, col: -1 }, { row: 2, col: 0 }, { row: 2, col: 1 },
  { row: -1, col: 2 }, { row: 0, col: 2 }, { row: 1, col: 2 },
] as const;

/**
 * 序盤の手を取得する
 * @param board - ゲームボード
 * @param moveHistory - 手の履歴
 * @param gamePhase - ゲームフェーズ（'early' | 'mid' | 'late'）
 * @returns 序盤での推奨手。序盤でない場合や適切な手がない場合はnull
 */
export const getOpeningMove = (
  board: Board,
  moveHistory: Position[],
  gamePhase: GamePhase
): Position | null => {
  if (gamePhase !== 'early') {
    return null;
  }
  
  // 初手時：中央付近配置
  if (Board.isEmpty(board)) {
    const centerPosition = Board.getCenterPosition();
    const centerNearbyPositions = Board.getNearbyPositions(centerPosition, 2);
    
    // 中央に最も近い位置を優先
    for (const position of centerNearbyPositions) {
      if (StoneColor.isNone(board[position.row][position.col])) {
        return position;
      }
    }
  }
  
  // 2手目以降は戦略的要所
  const center = Math.floor(BOARD_SIZE / 2);
  for (const offset of STRATEGIC_POSITIONS) {
    const position = { 
      row: center + offset.row, 
      col: center + offset.col 
    };
    
    if (
      Board.isValidPosition(position.row, position.col) &&
      StoneColor.isNone(board[position.row][position.col])
    ) {
      return position;
    }
  }
  
  return null;
};