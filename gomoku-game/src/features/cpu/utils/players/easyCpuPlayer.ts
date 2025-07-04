import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";

const THREAT_LENGTH = 4;
const CENTER_RADIUS = 2;  // 初手用中央範囲
const PROXIMITY_RADIUS = 3;  // 追跡配置用近接範囲

const DIRECTIONS = [
  { deltaRow: 0, deltaCol: 1, name: "横方向" },
  { deltaRow: 1, deltaCol: 0, name: "縦方向" },
  { deltaRow: 1, deltaCol: 1, name: "斜め方向（右下）" },
  { deltaRow: 1, deltaCol: -1, name: "斜め方向（左下）" },
] as const;

/**
 * ボード上の空いているポジション（石が置かれていない位置）を取得する
 * @param board - ゲームボード
 * @returns 空きポジションの配列
 */
const getAvailablePositions = (board: Board): Position[] => {
  const positions: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (StoneColor.isNone(board[row][col])) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
};

/**
 * 指定された開始位置から指定方向に連続した石があるかを確認する
 * @param board - ゲームボード
 * @param startRow - 開始行
 * @param startCol - 開始列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @param color - 確認する石の色
 * @param length - 確認する連続数
 * @returns 指定された連続数の石が存在する場合true
 */
const hasConsecutiveStones = (
  board: Board,
  startRow: number,
  startCol: number,
  deltaRow: number,
  deltaCol: number,
  color: StoneColor,
  length: number
): boolean => {
  for (let i = 0; i < length; i++) {
    const row = startRow + i * deltaRow;
    const col = startCol + i * deltaCol;
    
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return false;
    }
    
    if (board[row][col] !== color) {
      return false;
    }
  }
  
  return true;
};

/**
 * 指定方向で4連続の石がある場合、その両端の有効な位置を重要手として追加する
 * @param board - ゲームボード
 * @param row - 開始行
 * @param col - 開始列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @param color - 確認する石の色
 * @param criticalMoves - 重要手を格納する配列（参照渡し）
 */
const addCriticalMovesForDirection = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  color: StoneColor,
  criticalMoves: Position[]
): void => {
  if (hasConsecutiveStones(board, row, col, deltaRow, deltaCol, color, THREAT_LENGTH)) {
    // 開始点の前をチェック
    const prevRow = row - deltaRow;
    const prevCol = col - deltaCol;
    if (
      prevRow >= 0 && prevRow < BOARD_SIZE &&
      prevCol >= 0 && prevCol < BOARD_SIZE &&
      StoneColor.isNone(board[prevRow][prevCol])
    ) {
      criticalMoves.push({ row: prevRow, col: prevCol });
    }
    
    // 終了点の後をチェック
    const nextRow = row + THREAT_LENGTH * deltaRow;
    const nextCol = col + THREAT_LENGTH * deltaCol;
    if (
      nextRow >= 0 && nextRow < BOARD_SIZE &&
      nextCol >= 0 && nextCol < BOARD_SIZE &&
      StoneColor.isNone(board[nextRow][nextCol])
    ) {
      criticalMoves.push({ row: nextRow, col: nextCol });
    }
  }
};

/**
 * ボード上で4連続の脅威となる位置（勝利手・防御手）を見つける
 * @param board - ゲームボード
 * @param color - 確認する石の色
 * @returns 重要手のポジション配列
 */
const findCriticalMoves = (board: Board, color: StoneColor): Position[] => {
  const criticalMoves: Position[] = [];
  
  // 4連続を探して、その両端をチェック
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (const direction of DIRECTIONS) {
        addCriticalMovesForDirection(
          board,
          row,
          col,
          direction.deltaRow,
          direction.deltaCol,
          color,
          criticalMoves
        );
      }
    }
  }
  
  return criticalMoves;
};

/**
 * 指定された石の色の相手の色を取得する
 * @param color - プレイヤーの石の色
 * @returns 相手の石の色
 * @throws {Error} "none"が渡された場合（プレイヤーカラーとして無効）
 */
const getOpponentColor = (color: StoneColor): StoneColor => {
  if (StoneColor.isBlack(color)) return "white";
  if (StoneColor.isWhite(color)) return "black";
  
  // "none"の場合は想定外だが、型安全性のため処理
  throw new Error(`Invalid player color: ${color}`);
};

/**
 * ボード中央付近の空きポジションを取得する（初手用）
 * @param board - ゲームボード
 * @returns 中央付近の空きポジション配列
 */
const getCenterMoves = (board: Board): Position[] => {
  const center = Math.floor(BOARD_SIZE / 2); // 7
  const centerMoves: Position[] = [];
  
  for (let row = center - CENTER_RADIUS; row <= center + CENTER_RADIUS; row++) {
    for (let col = center - CENTER_RADIUS; col <= center + CENTER_RADIUS; col++) {
      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        if (StoneColor.isNone(board[row][col])) {
          centerMoves.push({ row, col });
        }
      }
    }
  }
  
  return centerMoves;
};

/**
 * 指定された色の石の位置をすべて取得する
 */
const getStonePositions = (board: Board, color: StoneColor): Position[] => {
  const positions: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === color) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
};

/**
 * 指定位置群の近接エリアの空きポジションを取得する（追跡配置用）
 */
const getProximityMoves = (board: Board, targetPositions: Position[]): Position[] => {
  const proximityMoves: Position[] = [];
  const addedPositions = new Set<string>();
  
  targetPositions.forEach(target => {
    for (let row = target.row - PROXIMITY_RADIUS; row <= target.row + PROXIMITY_RADIUS; row++) {
      for (let col = target.col - PROXIMITY_RADIUS; col <= target.col + PROXIMITY_RADIUS; col++) {
        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
          const key = `${row},${col}`;
          if (StoneColor.isNone(board[row][col]) && !addedPositions.has(key)) {
            proximityMoves.push({ row, col });
            addedPositions.add(key);
          }
        }
      }
    }
  });
  
  return proximityMoves;
};

/**
 * EasyレベルのCPUプレイヤーを作成する
 * 
 * 戦略:
 * 1. 自分が勝利できる手があれば最優先で打つ
 * 2. 相手の勝利を阻止する手があれば打つ
 * 3. 序盤では中央エリア（マンハッタン距離3以内）に打つ
 * 4. その他の場合はランダムに選択
 * 
 * @param color - CPUプレイヤーの石の色
 * @returns EasyレベルのCPUプレイヤー
 */
export const createEasyCpuPlayer = (color: StoneColor): CpuPlayer => ({
  cpuLevel: "easy",
  color,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateNextMove: (board: Board, _moveHistory: Position[]): Position | null => {
    const availablePositions = getAvailablePositions(board);
    
    if (availablePositions.length === 0) {
      return null;
    }

    // 1. 初手の場合は中央付近からランダム選択
    if (Board.isEmpty(board)) {
      const centerMoves = getCenterMoves(board);
      if (centerMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * centerMoves.length);
        return centerMoves[randomIndex];
      }
    }

    // 2. 自分が勝てる手があるかチェック
    const winningMoves = findCriticalMoves(board, color);
    if (winningMoves.length > 0) {
      return winningMoves[0];
    }

    // 3. 相手の勝利を阻止する手があるかチェック
    const opponentColor = getOpponentColor(color);
    const blockingMoves = findCriticalMoves(board, opponentColor);
    if (blockingMoves.length > 0) {
      return blockingMoves[0];
    }

    // 4. プレイヤーの石の近接位置を優先（追跡配置戦略）
    const playerPositions = getStonePositions(board, opponentColor);
    if (playerPositions.length > 0) {
      const proximityMoves = getProximityMoves(board, playerPositions);
      if (proximityMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * proximityMoves.length);
        return proximityMoves[randomIndex];
      }
    }

    // 5. フォールバック: 全盤面からランダム選択
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  },
});