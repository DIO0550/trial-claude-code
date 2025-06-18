import { CpuPlayer } from "@/types/cpuPlayer";
import { StoneColor } from "@/types/stone";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";
import { CpuLevel } from "@/types/cpuLevel";
import { BOARD_SIZE } from "@/constants/board";

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
 * 指定した位置から指定方向に連続した石の数を数える
 * @param board - ゲームボード
 * @param row - 開始行
 * @param col - 開始列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @param color - 対象の石の色
 * @returns 連続した石の数
 * @example
 * ```typescript
 * const count = countConsecutiveStones(board, 7, 7, 0, 1, "white");
 * // 横方向に連続した白石の数
 * ```
 */
const countConsecutiveStones = (
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
    currentRow >= 0 && currentRow < BOARD_SIZE &&
    currentCol >= 0 && currentCol < BOARD_SIZE &&
    board[currentRow][currentCol] === color
  ) {
    count++;
    currentRow += deltaRow;
    currentCol += deltaCol;
  }
  
  return count;
};

/**
 * 指定した位置から双方向に連続した石の数を数える（中心を含む）
 * @param board - ゲームボード
 * @param row - 中心行
 * @param col - 中心列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @param color - 対象の石の色
 * @returns 双方向の連続した石の数（中心を含む）
 * @example
 * ```typescript
 * const total = countBidirectionalStones(board, 7, 7, 0, 1, "white");
 * // 横方向の両端を含む連続した白石の数
 * ```
 */
const countBidirectionalStones = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  color: StoneColor
): number => {
  const forwardCount = countConsecutiveStones(
    board, row + deltaRow, col + deltaCol, deltaRow, deltaCol, color
  );
  
  const backwardCount = countConsecutiveStones(
    board, row - deltaRow, col - deltaCol, -deltaRow, -deltaCol, color
  );
  
  return forwardCount + backwardCount + 1;
};

/**
 * ボードのコピーを作成する
 * @param board - 元のボード
 * @returns ボードのディープコピー
 */
const createBoardCopy = (board: Board): Board => {
  return board.map(row => [...row]);
};

/**
 * 指定位置に石を置いた場合の連続数を各方向で計算する
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @returns 各方向の連続数の配列
 */
const calculateConsecutiveCounts = (
  board: Board,
  position: Position,
  color: StoneColor
): number[] => {
  const tempBoard = createBoardCopy(board);
  tempBoard[position.row][position.col] = color;
  
  return DIRECTIONS.map(direction => 
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
  
  // 最初の手は中央
  if (moveHistory.length === 0) {
    return { row: center, col: center };
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
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = currentColor;
      
      const evaluation = minimax(tempBoard, color, depth - 1, false);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const position of availablePositions.slice(0, GAME_CONSTANTS.MINIMAX_MAX_POSITIONS)) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = currentColor;
      
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
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = color;
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
 * MediumレベルのCPUプレイヤーを作成する
 * 
 * 戦略:
 * 1. 即座勝利または防御が必要な手を最優先
 * 2. 序盤では定石配置
 * 3. 評価関数による最適手選択（2手先読み考慮）
 * 4. 3連続・2連続のパターン認識
 * 
 * @param color - CPUプレイヤーの石の色
 * @returns MediumレベルのCPUプレイヤー
 * @throws {Error} 無効な石の色が渡された場合
 * @example
 * ```typescript
 * const mediumCpu = createMediumCpuPlayer("white");
 * const nextMove = mediumCpu.calculateNextMove(board, moveHistory);
 * ```
 */
export const createMediumCpuPlayer = (color: StoneColor): CpuPlayer => {
  if (StoneColor.isNone(color)) {
    throw new Error("CPU player color cannot be 'none'");
  }

  return {
    cpuLevel: "medium",
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