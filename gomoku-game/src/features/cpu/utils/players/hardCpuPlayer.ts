import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";
import {
  countBidirectionalStones,
  calculateConsecutiveCounts,
} from "@/features/cpu/utils/analysis/boardAnalysis";
import { isPatternOpen } from "@/features/cpu/utils/analysis/patternEvaluation";
import { getOpeningMove } from "@/features/cpu/utils/analysis/gameStrategy";

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

/**
 * 連続数の種類を定義
 */
type ConsecutiveType = "win" | "four" | "three" | "two" | "none";

/**
 * 連続数から種類を判定する
 */
const getConsecutiveType = (consecutive: number): ConsecutiveType => {
  if (consecutive >= GAME_CONSTANTS.WIN_LENGTH) return "win";
  if (consecutive === GAME_CONSTANTS.THREAT_LENGTH) return "four";
  if (consecutive === GAME_CONSTANTS.THREE_LENGTH) return "three";
  if (consecutive === GAME_CONSTANTS.TWO_LENGTH) return "two";
  return "none";
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
    case "black":
      return "white";
    case "white":
      return "black";
    case "none":
      throw new Error(`Invalid player color: ${color}`);
    default:
      throw new Error(`Invalid player color: ${color satisfies never}`);
  }
};

/**
 * 攻撃パターンの評価を計算する
 */
const evaluateOffensivePattern = (
  board: Board,
  position: Position,
  color: StoneColor,
): number => {
  let score = 0;
  const myConsecutiveCounts = calculateConsecutiveCounts(
    board,
    position,
    color,
  );

  for (let i = 0; i < myConsecutiveCounts.length; i++) {
    const consecutive = myConsecutiveCounts[i];
    const direction = DIRECTIONS[i];
    const consecutiveType = getConsecutiveType(consecutive);

    switch (consecutiveType) {
      case "win":
        score += EVALUATION_SCORES.WIN;
        break;
      case "four":
        score += EVALUATION_SCORES.FOUR;
        break;
      case "three":
        score += evaluateThreePattern(board, position, color, direction);
        break;
      case "two":
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
  direction: (typeof DIRECTIONS)[number],
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);

  return isPatternOpen(
    tempBoard,
    position.row,
    position.col,
    direction.deltaRow,
    direction.deltaCol,
  )
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
  direction: (typeof DIRECTIONS)[number],
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);

  return isPatternOpen(
    tempBoard,
    position.row,
    position.col,
    direction.deltaRow,
    direction.deltaCol,
  )
    ? EVALUATION_SCORES.TWO_OPEN
    : EVALUATION_SCORES.TWO;
};

/**
 * 防御パターンの評価を計算する
 */
const evaluateDefensivePattern = (
  board: Board,
  position: Position,
  opponentColor: StoneColor,
): number => {
  let score = 0;
  const opponentConsecutiveCounts = calculateConsecutiveCounts(
    board,
    position,
    opponentColor,
  );

  for (const consecutive of opponentConsecutiveCounts) {
    const consecutiveType = getConsecutiveType(consecutive);

    switch (consecutiveType) {
      case "win":
        score += EVALUATION_SCORES.BLOCK_WIN;
        break;
      case "four":
        score += EVALUATION_SCORES.BLOCK_FOUR;
        break;
      case "three":
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
  opponentColor: StoneColor,
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
  color: StoneColor,
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
      color,
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
  const distanceFromCenter =
    Math.abs(position.row - center) + Math.abs(position.col - center);

  if (distanceFromCenter <= GAME_CONSTANTS.CENTER_RADIUS) {
    return (
      EVALUATION_SCORES.CENTER *
      (GAME_CONSTANTS.CENTER_RADIUS - distanceFromCenter + 1)
    );
  }

  return 0;
};

/**
 * 領域支配スコアを計算する
 */
const evaluateTerritoryControl = (
  board: Board,
  position: Position,
  color: StoneColor,
): number => {
  let territoryScore = 0;

  for (
    let dr = -GAME_CONSTANTS.TERRITORY_RADIUS;
    dr <= GAME_CONSTANTS.TERRITORY_RADIUS;
    dr++
  ) {
    for (
      let dc = -GAME_CONSTANTS.TERRITORY_RADIUS;
      dc <= GAME_CONSTANTS.TERRITORY_RADIUS;
      dc++
    ) {
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
 * 戦略的近接評価スコアを計算する（Hard版）
 * プレイヤーの戦略を予測した近接配置を評価
 */
const evaluateStrategicProximity = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor,
): number => {
  let proximityScore = 0;

  // プレイヤーの石の位置を取得
  const playerPositions = Board.getStonePositions(board, opponentColor);

  if (playerPositions.length === 0) {
    return 0;
  }

  // プレイヤーの石からの最短距離を計算
  let minDistance = Infinity;
  for (const playerPos of playerPositions) {
    const distance =
      Math.abs(position.row - playerPos.row) +
      Math.abs(position.col - playerPos.col);
    minDistance = Math.min(minDistance, distance);
  }

  // 距離2以内で高評価（仕様書に従い距離2以内を重視）
  if (minDistance <= 2) {
    const bonus = EVALUATION_SCORES.WIN / 2; // 勝利手の半分という極めて高いボーナス
    proximityScore += bonus;
  }

  // プレイヤーの連続形成を阻害する位置での近接ボーナス
  for (const playerPos of playerPositions) {
    const consecutiveCounts = calculateConsecutiveCounts(
      board,
      playerPos,
      opponentColor,
    );

    for (const count of consecutiveCounts) {
      if (count >= GAME_CONSTANTS.THREE_LENGTH) {
        const distanceToThreat =
          Math.abs(position.row - playerPos.row) +
          Math.abs(position.col - playerPos.col);
        if (distanceToThreat <= 2) {
          proximityScore += EVALUATION_SCORES.TERRITORY * 50; // プレイヤーの連続阻害での近接ボーナス
        }
      }
    }
  }

  // フォーク形成可能位置での戦略的近接ボーナス
  const myPositions = Board.getStonePositions(board, color);
  for (const myPos of myPositions) {
    const distanceToMy =
      Math.abs(position.row - myPos.row) + Math.abs(position.col - myPos.col);
    if (distanceToMy <= 2) {
      // 自分の石とプレイヤーの石の両方に近い場合、フォーク形成での戦略的価値
      for (const playerPos of playerPositions) {
        const distanceToPlayer =
          Math.abs(position.row - playerPos.row) +
          Math.abs(position.col - playerPos.col);
        if (distanceToPlayer <= 2) {
          proximityScore += EVALUATION_SCORES.TERRITORY * 80; // フォーク形成での近接ボーナス
        }
      }
    }
  }

  return proximityScore;
};

/**
 * 統合的な位置評価（責任分離版）
 */
const evaluatePosition = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor,
): number => {
  return (
    evaluateOffensivePattern(board, position, color) +
    evaluateDefensivePattern(board, position, opponentColor) +
    evaluateForkThreats(board, position, color, opponentColor) +
    evaluatePositionalBonus(position) +
    evaluateTerritoryControl(board, position, color) +
    evaluateStrategicProximity(board, position, color, opponentColor)
  );
};

/**
 * 即座勝利または防御が必要な手を見つける
 */
const findCriticalMove = (
  board: Board,
  color: StoneColor,
  opponentColor: StoneColor,
): Position | null => {
  const availablePositions = getAvailablePositions(board);

  // 1. 勝利手をチェック（最優先）
  for (const position of availablePositions) {
    const myCounts = calculateConsecutiveCounts(board, position, color);
    if (myCounts.some((count) => count >= GAME_CONSTANTS.WIN_LENGTH)) {
      return position;
    }
  }

  // 2. 相手の勝利阻止手をチェック
  for (const position of availablePositions) {
    const opponentCounts = calculateConsecutiveCounts(
      board,
      position,
      opponentColor,
    );
    if (opponentCounts.some((count) => count >= GAME_CONSTANTS.WIN_LENGTH)) {
      return position;
    }
  }

  // 3. 4連続を作る手をチェック
  for (const position of availablePositions) {
    const myCounts = calculateConsecutiveCounts(board, position, color);
    if (myCounts.some((count) => count >= GAME_CONSTANTS.THREAT_LENGTH)) {
      return position;
    }
  }

  // 4. 相手の4連続を阻止する手をチェック
  for (const position of availablePositions) {
    const opponentCounts = calculateConsecutiveCounts(
      board,
      position,
      opponentColor,
    );
    if (opponentCounts.some((count) => count >= GAME_CONSTANTS.THREAT_LENGTH)) {
      return position;
    }
  }

  // 5. 相手の3連続（両端開放）を阻止する手をチェック
  for (const position of availablePositions) {
    const tempBoard = Board.placeStone(
      board,
      position.row,
      position.col,
      opponentColor,
    );
    for (let i = 0; i < DIRECTIONS.length; i++) {
      const direction = DIRECTIONS[i];
      const consecutive = countBidirectionalStones(
        tempBoard,
        position.row,
        position.col,
        direction.deltaRow,
        direction.deltaCol,
        opponentColor,
      );

      if (consecutive >= GAME_CONSTANTS.THREE_LENGTH) {
        // 両端が開放されているかチェック
        if (
          isPatternOpen(
            tempBoard,
            position.row,
            position.col,
            direction.deltaRow,
            direction.deltaCol,
          )
        ) {
          return position;
        }
      }
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
  maxCount: number,
): Position[] => {
  return availablePositions
    .map((pos) => ({
      position: pos,
      score: evaluatePosition(board, pos, color, opponentColor),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map((item) => item.position);
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
  beta: number = Infinity,
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
    GAME_CONSTANTS.MINIMAX_MAX_POSITIONS,
  );

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const position of sortedPositions) {
      const tempBoard = Board.placeStone(
        board,
        position.row,
        position.col,
        currentColor,
      );
      const evaluation = minimax(
        tempBoard,
        color,
        depth - 1,
        false,
        alpha,
        beta,
      );

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
      const tempBoard = Board.placeStone(
        board,
        position.row,
        position.col,
        currentColor,
      );
      const evaluation = minimax(
        tempBoard,
        color,
        depth - 1,
        true,
        alpha,
        beta,
      );

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
  opponentColor: StoneColor,
): Position => {
  const availablePositions = getAvailablePositions(board);
  let bestPosition = availablePositions[0];
  let bestScore = -Infinity;

  for (const position of availablePositions) {
    const positionScore = evaluatePosition(
      board,
      position,
      color,
      opponentColor,
    );

    // 有望な手について3手先読み
    let totalScore = positionScore;
    if (positionScore > GAME_CONSTANTS.MINIMAX_THRESHOLD) {
      const tempBoard = Board.placeStone(
        board,
        position.row,
        position.col,
        color,
      );
      const futureScore = minimax(
        tempBoard,
        color,
        GAME_CONSTANTS.ADVANCED_MINIMAX_DEPTH,
        false,
      );
      totalScore =
        positionScore + futureScore * GAME_CONSTANTS.FUTURE_SCORE_WEIGHT;
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
    calculateNextMove: (
      board: Board,
      moveHistory: Position[],
    ): Position | null => {
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
      const openingMove = getOpeningMove(board, moveHistory, "early");
      if (openingMove) {
        return openingMove;
      }

      // 3. 高度な評価関数による最適手選択
      return selectBestMove(board, color, opponentColor);
    },
  };
};
