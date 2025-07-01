import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";
import { countBidirectionalStones, calculateConsecutiveCounts } from "@/features/cpu/utils/analysis/boardAnalysis";

// 方向定数
const DIRECTIONS = [
  { deltaRow: 0, deltaCol: 1, name: "horizontal" },
  { deltaRow: 1, deltaCol: 0, name: "vertical" },
  { deltaRow: 1, deltaCol: 1, name: "diagonal_right" },
  { deltaRow: 1, deltaCol: -1, name: "diagonal_left" },
] as const;

// ゲーム定数
const GAME_CONSTANTS = {
  EARLY_GAME_MOVE_COUNT: 6,
  CENTER_RADIUS: 4,
  WIN_LENGTH: 5,
  THREAT_LENGTH: 4,
  MINIMAX_MAX_POSITIONS: 10,
  MINIMAX_DEPTH: 1,
} as const;

// 評価値定数
const EVALUATION_SCORES = {
  WIN: 10000,
  BLOCK_WIN: 5000,
  FOUR: 1000,
  BLOCK_FOUR: 800,
  THREE: 100,
  BLOCK_THREE: 50,
  TWO: 10,
  CENTER: 5,
  PROXIMITY_BASE: 20,
  PROXIMITY_MAX: 60,
} as const;

// 近接評価定数
const PROXIMITY_CONSTANTS = {
  MAX_DISTANCE: 3,
  CENTER_RANGE: 2,
} as const;

// 序盤定石位置
const OPENING_POSITIONS = [
  { row: -1, col: -1 }, { row: -1, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: -1, col: 0 }, { row: 1, col: 0 },
] as const;

/**
 * ボード上の空いているポジション（石が置かれていない位置）を取得する
 * @param board - ゲームボード
 * @returns 空きポジションの配列
 * @example
 * ```typescript
 * const positions = getAvailablePositions(board);
 * // [{ row: 0, col: 0 }, { row: 0, col: 1 }, ...]
 * ```
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
 * 指定された石の色の相手の色を取得する
 * @param color - プレイヤーの石の色
 * @returns 相手の石の色
 * @throws {Error} "none"が渡された場合（プレイヤーカラーとして無効）
 * @example
 * ```typescript
 * const opponent = getOpponentColor("black"); // "white"
 * ```
 */
const getOpponentColor = (color: StoneColor): StoneColor => {
  switch (color) {
    case "black": return "white";
    case "white": return "black";
    case "none":
      throw new Error(`Invalid player color: ${color}`);
    default:
      throw new Error(`Invalid player color: ${color satisfies never}`);
  }
};





/**
 * 指定位置から最も近いプレイヤーの石までの距離を計算する
 * @param position - 評価する位置
 * @param playerPositions - プレイヤーの石の位置の配列
 * @returns 最も近い石までのマンハッタン距離（石がない場合はInfinity）
 * @example
 * ```typescript
 * const distance = calculateMinDistanceToPlayer(
 *   { row: 7, col: 7 },
 *   [{ row: 5, col: 5 }, { row: 9, col: 9 }]
 * ); // 4
 * ```
 */
const calculateMinDistanceToPlayer = (
  position: Position,
  playerPositions: Position[]
): number => {
  if (playerPositions.length === 0) {
    return Infinity;
  }
  
  let minDistance = Infinity;
  for (const playerPos of playerPositions) {
    const distance = Math.abs(position.row - playerPos.row) + Math.abs(position.col - playerPos.col);
    minDistance = Math.min(minDistance, distance);
  }
  
  return minDistance;
};

/**
 * 近接ボーナスを計算する
 * @param position - 評価する位置
 * @param playerPositions - プレイヤーの石の位置の配列
 * @returns 近接ボーナス値
 * @example
 * ```typescript
 * const bonus = calculateProximityBonus(
 *   { row: 7, col: 7 },
 *   [{ row: 5, col: 5 }]
 * );
 * ```
 */
const calculateProximityBonus = (
  position: Position,
  playerPositions: Position[]
): number => {
  const minDistance = calculateMinDistanceToPlayer(position, playerPositions);
  
  if (minDistance === Infinity || minDistance > PROXIMITY_CONSTANTS.MAX_DISTANCE) {
    return 0;
  }
  
  // 距離に応じたボーナス計算（近いほど高い）
  const distanceRatio = (PROXIMITY_CONSTANTS.MAX_DISTANCE - minDistance) / PROXIMITY_CONSTANTS.MAX_DISTANCE;
  return EVALUATION_SCORES.PROXIMITY_BASE + 
         (EVALUATION_SCORES.PROXIMITY_MAX - EVALUATION_SCORES.PROXIMITY_BASE) * distanceRatio;
};

/**
 * 指定位置に石を置いた場合の評価値を計算する
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @param opponentColor - 相手の石の色
 * @returns 評価値
 * @example
 * ```typescript
 * const score = evaluatePosition(board, { row: 7, col: 7 }, "white", "black");
 * ```
 */
const evaluatePosition = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor
): number => {
  let score = 0;
  
  // 自分の連続数による評価
  const myConsecutiveCounts = calculateConsecutiveCounts(board, position, color);
  for (const consecutive of myConsecutiveCounts) {
    if (consecutive >= GAME_CONSTANTS.WIN_LENGTH) {
      score += EVALUATION_SCORES.WIN;
    } else if (consecutive === GAME_CONSTANTS.THREAT_LENGTH) {
      score += EVALUATION_SCORES.FOUR;
    } else if (consecutive === 3) {
      score += EVALUATION_SCORES.THREE;
    } else if (consecutive === 2) {
      score += EVALUATION_SCORES.TWO;
    }
  }
  
  // 相手の脅威阻止による評価
  const opponentConsecutiveCounts = calculateConsecutiveCounts(board, position, opponentColor);
  for (const consecutive of opponentConsecutiveCounts) {
    if (consecutive >= GAME_CONSTANTS.WIN_LENGTH) {
      score += EVALUATION_SCORES.BLOCK_WIN;
    } else if (consecutive === GAME_CONSTANTS.THREAT_LENGTH) {
      score += EVALUATION_SCORES.BLOCK_FOUR;
    } else if (consecutive === 3) {
      score += EVALUATION_SCORES.BLOCK_THREE;
    }
  }
  
  // 中央付近のボーナス
  const center = Math.floor(BOARD_SIZE / 2);
  const distanceFromCenter = Math.abs(position.row - center) + Math.abs(position.col - center);
  if (distanceFromCenter <= GAME_CONSTANTS.CENTER_RADIUS) {
    score += EVALUATION_SCORES.CENTER * (GAME_CONSTANTS.CENTER_RADIUS - distanceFromCenter + 1);
  }
  
  // 近接ボーナス（プレイヤーの石の近くを重点評価）
  const playerPositions = Board.getStonePositions(board, opponentColor);
  const proximityBonus = calculateProximityBonus(position, playerPositions);
  score += proximityBonus;
  
  return score;
};

/**
 * 即座勝利または防御が必要な手を見つける
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param opponentColor - 相手の石の色
 * @returns 重要な手のポジション（なければnull）
 * @example
 * ```typescript
 * const criticalMove = findCriticalMove(board, "white", "black");
 * if (criticalMove) {
 *   // 即座に打つべき手が見つかった
 * }
 * ```
 */
const findCriticalMove = (
  board: Board,
  color: StoneColor,
  opponentColor: StoneColor
): Position | null => {
  const availablePositions = getAvailablePositions(board);
  
  // 勝利手をチェック
  for (const position of availablePositions) {
    const myCounts = calculateConsecutiveCounts(board, position, color);
    if (myCounts.some(count => count >= GAME_CONSTANTS.WIN_LENGTH)) {
      return position;
    }
  }
  
  // 相手の勝利阻止手をチェック
  for (const position of availablePositions) {
    const opponentCounts = calculateConsecutiveCounts(board, position, opponentColor);
    if (opponentCounts.some(count => count >= GAME_CONSTANTS.WIN_LENGTH)) {
      return position;
    }
  }
  
  return null;
};

/**
 * 初手時の中央付近の位置を取得する（7±2の範囲）
 * @param board - ゲームボード
 * @returns 中央付近の空き位置（ランダム選択）、なければnull
 * @example
 * ```typescript
 * const centerMove = getInitialCenterMove(board);
 * ```
 */
const getInitialCenterMove = (board: Board): Position | null => {
  const center = Math.floor(BOARD_SIZE / 2);
  const availablePositions: Position[] = [];
  
  // 中央付近（7±2）の空き位置を収集
  for (let row = center - PROXIMITY_CONSTANTS.CENTER_RANGE; row <= center + PROXIMITY_CONSTANTS.CENTER_RANGE; row++) {
    for (let col = center - PROXIMITY_CONSTANTS.CENTER_RANGE; col <= center + PROXIMITY_CONSTANTS.CENTER_RANGE; col++) {
      if (
        row >= 0 && row < BOARD_SIZE &&
        col >= 0 && col < BOARD_SIZE &&
        StoneColor.isNone(board[row][col])
      ) {
        availablePositions.push({ row, col });
      }
    }
  }
  
  if (availablePositions.length === 0) {
    return null;
  }
  
  // ランダムに選択
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  return availablePositions[randomIndex];
};

/**
 * 序盤の定石配置を取得する
 * @param board - ゲームボード
 * @param moveHistory - 手順履歴
 * @returns 定石位置（なければnull）
 * @example
 * ```typescript
 * const openingMove = getOpeningMove(board, moveHistory);
 * ```
 */
const getOpeningMove = (board: Board, moveHistory: Position[]): Position | null => {
  if (moveHistory.length >= GAME_CONSTANTS.EARLY_GAME_MOVE_COUNT) {
    return null;
  }
  
  const center = Math.floor(BOARD_SIZE / 2);
  
  // 最初の手は中央付近（7±2）
  if (moveHistory.length === 0) {
    return getInitialCenterMove(board);
  }
  
  // 2手目以降は中央周辺の良い位置
  for (const offset of OPENING_POSITIONS) {
    const position = { 
      row: center + offset.row, 
      col: center + offset.col 
    };
    
    if (
      position.row >= 0 && position.row < BOARD_SIZE &&
      position.col >= 0 && position.col < BOARD_SIZE &&
      StoneColor.isNone(board[position.row][position.col])
    ) {
      return position;
    }
  }
  
  return null;
};

/**
 * ミニマックス法による2手先読み（簡略版）
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param depth - 探索深度
 * @param isMaximizing - 最大化プレイヤーかどうか
 * @returns 評価値
 */
const minimax = (
  board: Board,
  color: StoneColor,
  depth: number,
  isMaximizing: boolean
): number => {
  if (depth === 0) {
    return 0;
  }
  
  const availablePositions = getAvailablePositions(board);
  const currentColor = isMaximizing ? color : getOpponentColor(color);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const position of availablePositions.slice(0, GAME_CONSTANTS.MINIMAX_MAX_POSITIONS)) {
      const tempBoard = Board.placeStone(board, position.row, position.col, currentColor);
      
      const evaluation = minimax(tempBoard, color, depth - 1, false);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const position of availablePositions.slice(0, GAME_CONSTANTS.MINIMAX_MAX_POSITIONS)) {
      const tempBoard = Board.placeStone(board, position.row, position.col, currentColor);
      
      const evaluation = minimax(tempBoard, color, depth - 1, true);
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
};

/**
 * 最適手を選択する関数（評価関数とミニマックスを組み合わせ）
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param opponentColor - 相手の石の色
 * @returns 最適手のポジション
 */
const selectBestMove = (
  board: Board,
  color: StoneColor,
  opponentColor: StoneColor
): Position => {
  const availablePositions = getAvailablePositions(board);
  let bestPosition = availablePositions[0];
  let bestScore = -Infinity;

  for (const position of availablePositions) {
    const positionScore = evaluatePosition(board, position, color, opponentColor);
    
    // 有望な手について2手先読み
    let totalScore = positionScore;
    if (positionScore > 50) {
      const tempBoard = Board.placeStone(board, position.row, position.col, color);
      const futureScore = minimax(tempBoard, color, GAME_CONSTANTS.MINIMAX_DEPTH, false);
      totalScore = positionScore + futureScore * 0.1;
    }
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPosition = position;
    }
  }

  return bestPosition;
};

/**
 * NormalレベルのCPUプレイヤーを作成する
 * 
 * 戦略:
 * 1. 即座勝利または防御が必要な手を最優先
 * 2. 序盤では定石配置
 * 3. 評価関数による最適手選択（2手先読み考慮）
 * 4. 3連続・2連続のパターン認識
 * 
 * @param color - CPUプレイヤーの石の色
 * @returns NormalレベルのCPUプレイヤー
 * @throws {Error} 無効な石の色が渡された場合
 * @example
 * ```typescript
 * const normalCpu = createNormalCpuPlayer("white");
 * const nextMove = normalCpu.calculateNextMove(board, moveHistory);
 * ```
 */
export const createNormalCpuPlayer = (color: StoneColor): CpuPlayer => {
  if (StoneColor.isNone(color)) {
    throw new Error("CPU player color cannot be 'none'");
  }

  return {
    cpuLevel: "normal",
    color,
    calculateNextMove: (board: Board, moveHistory: Position[]): Position | null => {
      const availablePositions = getAvailablePositions(board);
      
      if (availablePositions.length === 0) {
        return null;
      }

      const opponentColor = getOpponentColor(color);

      // 1. 即座勝利または防御チェック
      const criticalMove = findCriticalMove(board, color, opponentColor);
      if (criticalMove) {
        return criticalMove;
      }

      // 2. 序盤定石
      const openingMove = getOpeningMove(board, moveHistory);
      if (openingMove) {
        return openingMove;
      }

      // 3. 評価関数による最適手選択
      return selectBestMove(board, color, opponentColor);
    },
  };
};