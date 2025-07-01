import { Board } from "@/features/board/utils/board";
import { StoneColor } from "@/features/board/utils/stone";
import { Position } from "@/features/board/utils/position";

// 方向定数
const DIRECTIONS = [
  { deltaRow: 0, deltaCol: 1, name: "horizontal" },
  { deltaRow: 1, deltaCol: 0, name: "vertical" },
  { deltaRow: 1, deltaCol: 1, name: "diagonal_right" },
  { deltaRow: 1, deltaCol: -1, name: "diagonal_left" },
] as const;

/**
 * 指定した位置から双方向に同じ色の石を数える
 * @param board - ゲームボード
 * @param row - 中心行
 * @param col - 中心列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @param color - 対象の石の色
 * @returns 双方向の連続した石の数（中心を含む）
 */
export const countBidirectionalStones = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  color: StoneColor
): number => {
  const forwardCount = Board.countConsecutiveStonesInDirection(
    board,
    row + deltaRow,
    col + deltaCol,
    deltaRow,
    deltaCol,
    color
  );

  const backwardCount = Board.countConsecutiveStonesInDirection(
    board,
    row - deltaRow,
    col - deltaCol,
    -deltaRow,
    -deltaCol,
    color
  );

  return forwardCount + backwardCount + 1;
};

/**
 * 指定した位置に石を配置した場合の全方向の連続石数を計算する
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @returns 各方向の連続数の配列（水平、垂直、右斜め、左斜めの順）
 */
export const calculateConsecutiveCounts = (
  board: Board,
  position: Position,
  color: StoneColor
): number[] => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);

  return DIRECTIONS.map((direction) =>
    countBidirectionalStones(
      tempBoard,
      position.row,
      position.col,
      direction.deltaRow,
      direction.deltaCol,
      color
    )
  );
};
