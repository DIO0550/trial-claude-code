import { StoneColor } from "@/features/board/utils/stone";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE, MIN_COORDINATE, MAX_COORDINATE, WIN_LENGTH } from "@/features/board/constants/dimensions";

export type Board = (StoneColor)[][];

/**
 * 勝利した石の位置を表す
 */
export interface WinningLine {
  positions: Position[];
}

/**
 * 方向ベクトルを表す型
 */
type Direction = readonly [number, number];

/**
 * 五目並べの4方向（横、縦、斜め）
 */
const DIRECTIONS: readonly Direction[] = [
  [0, 1],   // 横（右方向）
  [1, 0],   // 縦（下方向）  
  [1, 1],   // 斜め（右下方向）
  [1, -1]   // 斜め（右上方向）
] as const;

export const Board = {
  createEmpty: (): Board => {
    return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => "none"));
  },

  isValidPosition: (row: number, col: number): boolean => {
    return (
      Number.isInteger(row) &&
      Number.isInteger(col) &&
      row >= MIN_COORDINATE &&
      row <= MAX_COORDINATE &&
      col >= MIN_COORDINATE &&
      col <= MAX_COORDINATE
    );
  },

  copy: (board: Board): Board => {
    return board.map(row => [...row]);
  },

  placeStone: (board: Board, row: number, col: number, color: StoneColor): Board => {
    const newBoard = Board.copy(board);
    newBoard[row][col] = color;
    return newBoard;
  },

  isEmpty: (board: Board): boolean => {
    return board.flat().every(cell => StoneColor.isNone(cell));
  },

  getStonePositions: (board: Board, color: StoneColor): Position[] => {
    const positions: Position[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === color) {
          positions.push({ row, col });
        }
      }
    }
    
    return positions;
  },

  getNearbyPositions: (centerPosition: Position, radius: number): Position[] => {
    const positions: Position[] = [];
    
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const row = centerPosition.row + dr;
        const col = centerPosition.col + dc;
        
        if (Board.isValidPosition(row, col)) {
          positions.push({ row, col });
        }
      }
    }
    
    return Board.sortByDistanceFromCenter(positions, centerPosition);
  },

  /**
   * 中央からの距離順に位置をソートする
   */
  sortByDistanceFromCenter: (positions: Position[], center: Position): Position[] => {
    return positions.sort((a, b) => {
      const distA = Math.abs(a.row - center.row) + Math.abs(a.col - center.col);
      const distB = Math.abs(b.row - center.row) + Math.abs(b.col - center.col);
      return distA - distB;
    });
  },

  getCenterPosition: (): Position => {
    const center = Math.floor(BOARD_SIZE / 2);
    return { row: center, col: center };
  },

  /**
   * 指定した位置から指定方向に連続した石の数を数える
   * @param board - ゲームボード
   * @param row - 開始行
   * @param col - 開始列
   * @param deltaRow - 行方向の移動量
   * @param deltaCol - 列方向の移動量
   * @param color - 対象の石の色
   * @returns 連続した石の数
   */
  countConsecutiveStonesInDirection: (
    board: Board,
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
    color: StoneColor
  ): number => {
    let count = 0;
    let currentRow = row;
    let currentCol = col;
    
    while (
      Board.isValidPosition(currentRow, currentCol) &&
      board[currentRow][currentCol] === color
    ) {
      count++;
      currentRow += deltaRow;
      currentCol += deltaCol;
    }
    
    return count;
  },

  /**
   * 指定位置から連続する同色の石の数を数える
   * @param board ゲームボード
   * @param position 基準となる位置
   * @returns その位置を含む最大連続数
   */
  countConsecutiveStones: (board: Board, position: Position): number => {
    const { row, col } = position;
    const stoneColor = board[row][col];
    
    if (StoneColor.isNone(stoneColor)) {
      return 0;
    }
    
    let maxCount = 1; // 現在の石を含む最小値は1
    
    for (const [dr, dc] of DIRECTIONS) {
      const totalCount = Board.countConsecutiveStonesInBothDirections(board, row, col, dr, dc, stoneColor);
      maxCount = Math.max(maxCount, totalCount);
    }
    
    return maxCount;
  },

  /**
   * 指定方向の前後両方向で連続する石の数を数える
   */
  countConsecutiveStonesInBothDirections: (
    board: Board,
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
    color: StoneColor
  ): number => {
    const forwardCount = Board.countConsecutiveStonesInDirection(board, row + deltaRow, col + deltaCol, deltaRow, deltaCol, color);
    const backwardCount = Board.countConsecutiveStonesInDirection(board, row - deltaRow, col - deltaCol, -deltaRow, -deltaCol, color);
    return forwardCount + backwardCount + 1; // 現在の石を含む
  },

  /**
   * ボードが満杯かどうかを判定する
   * @param board ゲームボード
   * @returns ボードが満杯の場合true
   */
  isFull: (board: Board): boolean => {
    return board.flat().every(cell => !StoneColor.isNone(cell));
  },

  /**
   * 勝利した石の位置を検出する
   * @param board ゲームボード
   * @param position 最後に置かれた石の位置
   * @returns 勝利している場合は勝利位置のライン、そうでなければnull
   */
  findWinningLine: (board: Board, position: Position): WinningLine | null => {
    const { row, col } = position;
    const stoneColor = board[row][col];
    
    if (StoneColor.isNone(stoneColor)) {
      return null;
    }
    
    for (const [dr, dc] of DIRECTIONS) {
      const totalCount = Board.countConsecutiveStonesInBothDirections(board, row, col, dr, dc, stoneColor);
      
      if (totalCount >= WIN_LENGTH) {
        const winningPositions = Board.generateWinningLinePositions(board, row, col, dr, dc, stoneColor);
        return { positions: winningPositions };
      }
    }
    
    return null;
  },

  /**
   * 勝利ラインの位置を生成する
   */
  generateWinningLinePositions: (
    board: Board,
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
    color: StoneColor
  ): Position[] => {
    const backwardCount = Board.countConsecutiveStonesInDirection(board, row - deltaRow, col - deltaCol, -deltaRow, -deltaCol, color);
    const startRow = row - backwardCount * deltaRow;
    const startCol = col - backwardCount * deltaCol;
    
    const positions: Position[] = [];
    for (let i = 0; i < WIN_LENGTH; i++) {
      positions.push({
        row: startRow + i * deltaRow,
        col: startCol + i * deltaCol
      });
    }
    
    return positions;
  },
} as const;