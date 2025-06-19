import { CpuPlayer } from "@/types/cpuPlayer";
import { StoneColor } from "@/types/stone";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";
import { BOARD_SIZE } from "@/constants/board";

// 方向定数
const DIRECTIONS = [
  { deltaRow: 0, deltaCol: 1, name: "horizontal" },
  { deltaRow: 1, deltaCol: 0, name: "vertical" },
  { deltaRow: 1, deltaCol: 1, name: "diagonal_right" },
  { deltaRow: 1, deltaCol: -1, name: "diagonal_left" },
] as const;

// ゲーム定数（Hardレベル用の調整）
const GAME_CONSTANTS = {
  EARLY_GAME_MOVE_COUNT: 6,
  CENTER_RADIUS: 5,
  WIN_LENGTH: 5,
  THREAT_LENGTH: 4,
  MINIMAX_MAX_POSITIONS: 15,
  MINIMAX_DEPTH: 2,
  ADVANCED_MINIMAX_DEPTH: 3,
  THREAT_SEARCH_DEPTH: 3,
} as const;

// 評価値定数（Hardレベル用の詳細化）
const EVALUATION_SCORES = {
  WIN: 100000,
  BLOCK_WIN: 50000,
  FOUR: 10000,
  BLOCK_FOUR: 8000,
  THREE_OPEN: 5000,
  THREE: 1000,
  BLOCK_THREE: 500,
  TWO_OPEN: 200,
  TWO: 50,
  FORK: 15000,
  BLOCK_FORK: 12000,
  CENTER: 10,
  TERRITORY: 5,
  PATTERN_BONUS: 100,
} as const;

// 序盤定石位置（拡張版）
const OPENING_POSITIONS = [
  { row: -1, col: -1 }, { row: -1, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: -1, col: 0 }, { row: 1, col: 0 },
  { row: -2, col: 0 }, { row: 2, col: 0 },
  { row: 0, col: -2 }, { row: 0, col: 2 },
] as const;

/**
 * ボード上の空いているポジションを取得する
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
 * 相手の石の色を取得する
 * @param color - プレイヤーの石の色
 * @returns 相手の石の色
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
 * パターンが開放されているかチェックする（両端が空いているか）
 * @param board - ゲームボード
 * @param row - 中心行
 * @param col - 中心列
 * @param deltaRow - 行方向の移動量
 * @param deltaCol - 列方向の移動量
 * @returns 開放されているかどうか
 */
const isPatternOpen = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number
): boolean => {
  const forwardCount = countConsecutiveStones(
    board, row + deltaRow, col + deltaCol, deltaRow, deltaCol, 
    board[row][col]
  );
  
  const backwardCount = countConsecutiveStones(
    board, row - deltaRow, col - deltaCol, -deltaRow, -deltaCol, 
    board[row][col]
  );
  
  // 前方の開放チェック
  const forwardEnd = {
    row: row + deltaRow * (forwardCount + 1),
    col: col + deltaCol * (forwardCount + 1)
  };
  
  const forwardOpen = (
    forwardEnd.row >= 0 && forwardEnd.row < BOARD_SIZE &&
    forwardEnd.col >= 0 && forwardEnd.col < BOARD_SIZE &&
    StoneColor.isNone(board[forwardEnd.row][forwardEnd.col])
  );
  
  // 後方の開放チェック
  const backwardEnd = {
    row: row - deltaRow * (backwardCount + 1),
    col: col - deltaCol * (backwardCount + 1)
  };
  
  const backwardOpen = (
    backwardEnd.row >= 0 && backwardEnd.row < BOARD_SIZE &&
    backwardEnd.col >= 0 && backwardEnd.col < BOARD_SIZE &&
    StoneColor.isNone(board[backwardEnd.row][backwardEnd.col])
  );
  
  return forwardOpen && backwardOpen;
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
 * フォーク攻撃の可能性を検出する
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @returns フォーク攻撃のスコア
 */
const detectForkThreat = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  const tempBoard = createBoardCopy(board);
  tempBoard[position.row][position.col] = color;
  
  let threatCount = 0;
  
  for (const direction of DIRECTIONS) {
    const consecutive = countBidirectionalStones(
      tempBoard,
      position.row,
      position.col,
      direction.deltaRow,
      direction.deltaCol,
      color
    );
    
    if (consecutive >= 3) {
      threatCount++;
    }
  }
  
  return threatCount >= 2 ? EVALUATION_SCORES.FORK : 0;
};

/**
 * 高度な位置評価（フォーク、開放パターン、領域支配を考慮）
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @param opponentColor - 相手の石の色
 * @returns 評価値
 */
const evaluatePositionAdvanced = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor
): number => {
  let score = 0;
  
  // 基本的な連続数による評価
  const myConsecutiveCounts = calculateConsecutiveCounts(board, position, color);
  for (let i = 0; i < myConsecutiveCounts.length; i++) {
    const consecutive = myConsecutiveCounts[i];
    const direction = DIRECTIONS[i];
    
    if (consecutive >= GAME_CONSTANTS.WIN_LENGTH) {
      score += EVALUATION_SCORES.WIN;
    } else if (consecutive === GAME_CONSTANTS.THREAT_LENGTH) {
      score += EVALUATION_SCORES.FOUR;
    } else if (consecutive === 3) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = color;
      
      if (isPatternOpen(tempBoard, position.row, position.col, 
                        direction.deltaRow, direction.deltaCol)) {
        score += EVALUATION_SCORES.THREE_OPEN;
      } else {
        score += EVALUATION_SCORES.THREE;
      }
    } else if (consecutive === 2) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = color;
      
      if (isPatternOpen(tempBoard, position.row, position.col,
                        direction.deltaRow, direction.deltaCol)) {
        score += EVALUATION_SCORES.TWO_OPEN;
      } else {
        score += EVALUATION_SCORES.TWO;
      }
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
  
  // フォーク攻撃の検出
  score += detectForkThreat(board, position, color);
  
  // 相手のフォーク攻撃阻止
  const opponentFork = detectForkThreat(board, position, opponentColor);
  if (opponentFork > 0) {
    score += EVALUATION_SCORES.BLOCK_FORK;
  }
  
  // 中央付近のボーナス
  const center = Math.floor(BOARD_SIZE / 2);
  const distanceFromCenter = Math.abs(position.row - center) + Math.abs(position.col - center);
  if (distanceFromCenter <= GAME_CONSTANTS.CENTER_RADIUS) {
    score += EVALUATION_SCORES.CENTER * (GAME_CONSTANTS.CENTER_RADIUS - distanceFromCenter + 1);
  }
  
  // 領域支配ボーナス
  const territoryScore = calculateTerritoryScore(board, position, color);
  score += territoryScore;
  
  return score;
};

/**
 * 領域支配スコアを計算する
 * @param board - ゲームボード
 * @param position - 評価する位置
 * @param color - 石の色
 * @returns 領域スコア
 */
const calculateTerritoryScore = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  let territoryScore = 0;
  const radius = 2;
  
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      const r = position.row + dr;
      const c = position.col + dc;
      
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === color) {
          territoryScore += EVALUATION_SCORES.TERRITORY;
        }
      }
    }
  }
  
  return territoryScore;
};

/**
 * 即座勝利または防御が必要な手を見つける
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param opponentColor - 相手の石の色
 * @returns 重要な手のポジション（なければnull）
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
 * 高度なミニマックス法による3手先読み
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param depth - 探索深度
 * @param isMaximizing - 最大化プレイヤーかどうか
 * @param alpha - アルファ値（アルファベータ法用）
 * @param beta - ベータ値（アルファベータ法用）
 * @returns 評価値
 */
const minimaxAdvanced = (
  board: Board,
  color: StoneColor,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): number => {
  if (depth === 0) {
    return 0;
  }
  
  const availablePositions = getAvailablePositions(board);
  const currentColor = isMaximizing ? color : getOpponentColor(color);
  
  // 有望な手を優先的に評価
  const sortedPositions = availablePositions
    .map(pos => ({
      position: pos,
      score: evaluatePositionAdvanced(board, pos, currentColor, getOpponentColor(currentColor))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, GAME_CONSTANTS.MINIMAX_MAX_POSITIONS)
    .map(item => item.position);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const position of sortedPositions) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = currentColor;
      
      const evaluation = minimaxAdvanced(tempBoard, color, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      
      if (beta <= alpha) {
        break; // アルファベータ剪定
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const position of sortedPositions) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = currentColor;
      
      const evaluation = minimaxAdvanced(tempBoard, color, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      
      if (beta <= alpha) {
        break; // アルファベータ剪定
      }
    }
    return minEval;
  }
};

/**
 * 最適手を選択する関数（高度な評価関数と3手先読みミニマックスを組み合わせ）
 * @param board - ゲームボード
 * @param color - 自分の石の色
 * @param opponentColor - 相手の石の色
 * @returns 最適手のポジション
 */
const selectBestMoveAdvanced = (
  board: Board,
  color: StoneColor,
  opponentColor: StoneColor
): Position => {
  const availablePositions = getAvailablePositions(board);
  let bestPosition = availablePositions[0];
  let bestScore = -Infinity;

  for (const position of availablePositions) {
    const positionScore = evaluatePositionAdvanced(board, position, color, opponentColor);
    
    // 有望な手について3手先読み
    let totalScore = positionScore;
    if (positionScore > 100) {
      const tempBoard = createBoardCopy(board);
      tempBoard[position.row][position.col] = color;
      const futureScore = minimaxAdvanced(
        tempBoard, 
        color, 
        GAME_CONSTANTS.ADVANCED_MINIMAX_DEPTH, 
        false
      );
      totalScore = positionScore + futureScore * 0.2;
    }
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPosition = position;
    }
  }

  return bestPosition;
};

/**
 * HardレベルのCPUプレイヤーを作成する
 * 
 * 戦略:
 * 1. 即座勝利または防御が必要な手を最優先
 * 2. 序盤では定石配置
 * 3. フォーク攻撃の認識と対処
 * 4. 開放パターンの重視
 * 5. 高度な評価関数による最適手選択（3手先読み考慮）
 * 6. 領域支配を意識した戦略
 * 7. アルファベータ法による効率的な探索
 * 
 * @param color - CPUプレイヤーの石の色
 * @returns HardレベルのCPUプレイヤー
 * @throws {Error} 無効な石の色が渡された場合
 */
export const createHardCpuPlayer = (color: StoneColor): CpuPlayer => {
  if (StoneColor.isNone(color)) {
    throw new Error("CPU player color cannot be 'none'");
  }

  return {
    cpuLevel: "hard",
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

      // 3. 高度な評価関数による最適手選択
      return selectBestMoveAdvanced(board, color, opponentColor);
    },
  };
};