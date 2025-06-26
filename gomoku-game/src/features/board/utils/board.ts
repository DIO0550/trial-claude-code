import { StoneColor } from "@/features/board/utils/stone";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE, MIN_COORDINATE, MAX_COORDINATE } from "@/features/board/constants/dimensions";

export type Board = (StoneColor)[][];

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
    
    // 中央からの距離順にソート
    positions.sort((a, b) => {
      const distA = Math.abs(a.row - centerPosition.row) + Math.abs(a.col - centerPosition.col);
      const distB = Math.abs(b.row - centerPosition.row) + Math.abs(b.col - centerPosition.col);
      return distA - distB;
    });
    
    return positions;
  },

  getCenterPosition: (): Position => {
    const center = Math.floor(BOARD_SIZE / 2);
    return { row: center, col: center };
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
    
    // 空の位置では0を返す
    if (StoneColor.isNone(stoneColor)) {
      return 0;
    }
    
    // 4方向の検索ベクトル
    const directions = [
      [0, 1],   // 横（右方向）
      [1, 0],   // 縦（下方向）  
      [1, 1],   // 斜め（右下方向）
      [1, -1]   // 斜め（右上方向）
    ];
    
    let maxCount = 1; // 現在の石を含む最小値は1
    
    // 各方向について連続する石の数をカウント
    for (const [dr, dc] of directions) {
      let count = 1; // 現在の石を含む
      
      // 正方向に検索
      for (let i = 1; i < BOARD_SIZE; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (!Board.isValidPosition(newRow, newCol) || board[newRow][newCol] !== stoneColor) {
          break;
        }
        count++;
      }
      
      // 逆方向に検索
      for (let i = 1; i < BOARD_SIZE; i++) {
        const newRow = row - dr * i;
        const newCol = col - dc * i;
        
        if (!Board.isValidPosition(newRow, newCol) || board[newRow][newCol] !== stoneColor) {
          break;
        }
        count++;
      }
      
      // 最大値を更新
      maxCount = Math.max(maxCount, count);
    }
    
    return maxCount;
  },
} as const;