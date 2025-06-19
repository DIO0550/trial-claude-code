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

// ゲーム定数（マジックナンバー排除）
const GAME_CONSTANTS = {
  EARLY_GAME_MOVE_COUNT: 6,
  CENTER_RADIUS: 5,
  WIN_LENGTH: 5,
  THREAT_LENGTH: 4,
  THREE_LENGTH: 3,
  TWO_LENGTH: 2,
  MINIMAX_MAX_POSITIONS: 15,
  MINIMAX_DEPTH: 2,
  ADVANCED_MINIMAX_DEPTH: 3,
  TERRITORY_RADIUS: 2,
  MINIMAX_THRESHOLD: 100,
  FUTURE_SCORE_WEIGHT: 0.2,
} as const;

// 評価値定数（より詳細な分離）
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
} as const;

// 序盤定石位置
const OPENING_POSITIONS = [
  { row: -1, col: -1 }, { row: -1, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: -1, col: 0 }, { row: 1, col: 0 },
  { row: -2, col: 0 }, { row: 2, col: 0 },
  { row: 0, col: -2 }, { row: 0, col: 2 },
] as const;

/**
 * 連続数の種類を定義
 */
type ConsecutiveType = 'win' | 'four' | 'three' | 'two' | 'none';

/**
 * 連続数から種類を判定する
 */
const getConsecutiveType = (consecutive: number): ConsecutiveType => {
  if (consecutive >= GAME_CONSTANTS.WIN_LENGTH) return 'win';
  if (consecutive === GAME_CONSTANTS.THREAT_LENGTH) return 'four';
  if (consecutive === GAME_CONSTANTS.THREE_LENGTH) return 'three';
  if (consecutive === GAME_CONSTANTS.TWO_LENGTH) return 'two';
  return 'none';
};

/**
 * ボード上の空いているポジションを取得する
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
    Board.isValidPosition(currentRow, currentCol) &&
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

/**
 * 指定位置に石を置いた場合の連続数を各方向で計算する
 */
const calculateConsecutiveCounts = (
  board: Board,
  position: Position,
  color: StoneColor
): number[] => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  
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
 * 攻撃パターンの評価を計算する
 */
const evaluateOffensivePattern = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  let score = 0;
  const myConsecutiveCounts = calculateConsecutiveCounts(board, position, color);
  
  for (let i = 0; i < myConsecutiveCounts.length; i++) {
    const consecutive = myConsecutiveCounts[i];
    const direction = DIRECTIONS[i];
    const consecutiveType = getConsecutiveType(consecutive);
    
    switch (consecutiveType) {
      case 'win':
        score += EVALUATION_SCORES.WIN;
        break;
      case 'four':
        score += EVALUATION_SCORES.FOUR;
        break;
      case 'three':
        score += evaluateThreePattern(board, position, color, direction);
        break;
      case 'two':
        score += evaluateTwoPattern(board, position, color, direction);
        break;
    }
  }
  
  return score;
};

/**
 * 3連続パターンの詳細評価
 */
const evaluateThreePattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  direction: typeof DIRECTIONS[number]
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  
  return isPatternOpen(tempBoard, position.row, position.col, 
                      direction.deltaRow, direction.deltaCol)
    ? EVALUATION_SCORES.THREE_OPEN 
    : EVALUATION_SCORES.THREE;
};

/**
 * 2連続パターンの詳細評価
 */
const evaluateTwoPattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  direction: typeof DIRECTIONS[number]
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  
  return isPatternOpen(tempBoard, position.row, position.col,
                      direction.deltaRow, direction.deltaCol)
    ? EVALUATION_SCORES.TWO_OPEN
    : EVALUATION_SCORES.TWO;
};

/**
 * 防御パターンの評価を計算する
 */
const evaluateDefensivePattern = (
  board: Board,
  position: Position,
  opponentColor: StoneColor
): number => {
  let score = 0;
  const opponentConsecutiveCounts = calculateConsecutiveCounts(board, position, opponentColor);
  
  for (const consecutive of opponentConsecutiveCounts) {
    const consecutiveType = getConsecutiveType(consecutive);
    
    switch (consecutiveType) {
      case 'win':
        score += EVALUATION_SCORES.BLOCK_WIN;
        break;
      case 'four':
        score += EVALUATION_SCORES.BLOCK_FOUR;
        break;
      case 'three':
        score += EVALUATION_SCORES.BLOCK_THREE;
        break;
    }
  }
  
  return score;
};

/**
 * フォーク攻撃の可能性を検出する
 */
const evaluateForkThreats = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor
): number => {
  let score = 0;
  
  // 自分のフォーク攻撃
  const myForkScore = detectForkThreat(board, position, color);
  score += myForkScore;
  
  // 相手のフォーク攻撃阻止
  const opponentForkScore = detectForkThreat(board, position, opponentColor);
  if (opponentForkScore > 0) {
    score += EVALUATION_SCORES.BLOCK_FORK;
  }
  
  return score;
};

/**
 * フォーク攻撃スコアを計算する
 */
const detectForkThreat = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  
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
    
    if (consecutive >= GAME_CONSTANTS.THREE_LENGTH) {
      threatCount++;
    }
  }
  
  return threatCount >= 2 ? EVALUATION_SCORES.FORK : 0;
};

/**
 * 位置的ボーナスを計算する
 */
const evaluatePositionalBonus = (position: Position): number => {
  const center = Math.floor(BOARD_SIZE / 2);
  const distanceFromCenter = Math.abs(position.row - center) + Math.abs(position.col - center);
  
  if (distanceFromCenter <= GAME_CONSTANTS.CENTER_RADIUS) {
    return EVALUATION_SCORES.CENTER * (GAME_CONSTANTS.CENTER_RADIUS - distanceFromCenter + 1);
  }
  
  return 0;
};

/**
 * 領域支配スコアを計算する
 */
const evaluateTerritoryControl = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  let territoryScore = 0;
  
  for (let dr = -GAME_CONSTANTS.TERRITORY_RADIUS; dr <= GAME_CONSTANTS.TERRITORY_RADIUS; dr++) {
    for (let dc = -GAME_CONSTANTS.TERRITORY_RADIUS; dc <= GAME_CONSTANTS.TERRITORY_RADIUS; dc++) {
      const r = position.row + dr;
      const c = position.col + dc;
      
      if (Board.isValidPosition(r, c) && board[r][c] === color) {
        territoryScore += EVALUATION_SCORES.TERRITORY;
      }
    }
  }
  
  return territoryScore;
};

/**
 * 統合的な位置評価（責任分離版）
 */
const evaluatePosition = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor
): number => {
  return evaluateOffensivePattern(board, position, color) +
         evaluateDefensivePattern(board, position, opponentColor) +
         evaluateForkThreats(board, position, color, opponentColor) +
         evaluatePositionalBonus(position) +
         evaluateTerritoryControl(board, position, color);
};

/**
 * 即座勝利または防御が必要な手を見つける
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
      Board.isValidPosition(position.row, position.col) &&
      StoneColor.isNone(board[position.row][position.col])
    ) {
      return position;
    }
  }
  
  return null;
};

/**
 * 候補手をスコア順にソートする
 */
const getSortedCandidates = (
  board: Board,
  availablePositions: Position[],
  color: StoneColor,
  opponentColor: StoneColor,
  maxCount: number
): Position[] => {
  return availablePositions
    .map(pos => ({
      position: pos,
      score: evaluatePosition(board, pos, color, opponentColor)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map(item => item.position);
};

/**
 * ミニマックス法による探索（アルファベータ剪定付き）
 */
const minimax = (
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
  const opponentColor = getOpponentColor(currentColor);
  
  const sortedPositions = getSortedCandidates(
    board, 
    availablePositions, 
    currentColor, 
    opponentColor,
    GAME_CONSTANTS.MINIMAX_MAX_POSITIONS
  );
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const position of sortedPositions) {
      const tempBoard = Board.placeStone(board, position.row, position.col, currentColor);
      const evaluation = minimax(tempBoard, color, depth - 1, false, alpha, beta);
      
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
      const tempBoard = Board.placeStone(board, position.row, position.col, currentColor);
      const evaluation = minimax(tempBoard, color, depth - 1, true, alpha, beta);
      
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
 * 最適手を選択する関数（責任分離版）
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
    
    // 有望な手について3手先読み
    let totalScore = positionScore;
    if (positionScore > GAME_CONSTANTS.MINIMAX_THRESHOLD) {
      const tempBoard = Board.placeStone(board, position.row, position.col, color);
      const futureScore = minimax(
        tempBoard, 
        color, 
        GAME_CONSTANTS.ADVANCED_MINIMAX_DEPTH, 
        false
      );
      totalScore = positionScore + futureScore * GAME_CONSTANTS.FUTURE_SCORE_WEIGHT;
    }
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPosition = position;
    }
  }

  return bestPosition;
};

/**
 * HardレベルのCPUプレイヤーを作成する（リファクタリング版）
 * 
 * 改善点:
 * 1. 責任分離：評価関数を目的別に分割
 * 2. マジックナンバー排除：すべて定数化
 * 3. Board責任：copy/placeStoneをBoard側に移動
 * 4. 型安全性：ConsecutiveType等で型レベルでの制約
 * 5. 可読性：複雑な条件分岐をswitch文と専用関数に分離
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
      return selectBestMove(board, color, opponentColor);
    },
  };
};