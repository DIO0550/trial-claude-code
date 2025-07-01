import { Board } from "@/features/board/utils/board";
import { StoneColor } from "@/features/board/utils/stone";

/**
 * パターンが両端で開いているかどうかを判定する
 * @param board - ゲームボード
 * @param row - 判定する石の行
 * @param col - 判定する石の列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @returns 両端が開いている場合true、そうでなければfalse
 */
export const isPatternOpen = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number
): boolean => {
  const forwardCount = Board.countConsecutiveStonesInDirection(
    board, row + deltaRow, col + deltaCol, deltaRow, deltaCol, 
    board[row][col]
  );
  
  const backwardCount = Board.countConsecutiveStonesInDirection(
    board, row - deltaRow, col - deltaCol, -deltaRow, -deltaCol, 
    board[row][col]
  );
  
  // 前方の開放チェック
  const forwardEnd = {
    row: row + deltaRow * (forwardCount + 1),
    col: col + deltaCol * (forwardCount + 1)
  };
  
  const forwardOpen = (
    Board.isValidPosition(forwardEnd.row, forwardEnd.col) &&
    StoneColor.isNone(board[forwardEnd.row][forwardEnd.col])
  );
  
  // 後方の開放チェック
  const backwardEnd = {
    row: row - deltaRow * (backwardCount + 1),
    col: col - deltaCol * (backwardCount + 1)
  };
  
  const backwardOpen = (
    Board.isValidPosition(backwardEnd.row, backwardEnd.col) &&
    StoneColor.isNone(board[backwardEnd.row][backwardEnd.col])
  );
  
  return forwardOpen && backwardOpen;
};