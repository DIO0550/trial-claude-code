import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";

const CENTER_RADIUS = 2;
const PROXIMITY_RADIUS = 2;

/**
 * ボード中央付近の空きポジションを取得する
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
 * 指定位置群の近接エリアの空きポジションを取得する
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
 * 相手の色を取得する
 */
const getOpponentColor = (color: StoneColor): StoneColor => {
  if (StoneColor.isBlack(color)) return "white";
  if (StoneColor.isWhite(color)) return "black";
  
  throw new Error(`Invalid player color: ${color}`);
};

/**
 * 全空きポジションを取得する
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

export const createBeginnerCpuPlayer = (color: StoneColor): CpuPlayer => ({
  cpuLevel: "beginner",
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

    // 2. プレイヤーの石の近接位置を優先
    const opponentColor = getOpponentColor(color);
    const playerPositions = getStonePositions(board, opponentColor);
    
    if (playerPositions.length > 0) {
      const proximityMoves = getProximityMoves(board, playerPositions);
      if (proximityMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * proximityMoves.length);
        return proximityMoves[randomIndex];
      }
    }

    // 3. フォールバック: 全盤面からランダム選択
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  },
});