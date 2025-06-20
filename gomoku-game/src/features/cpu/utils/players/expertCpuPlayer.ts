import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";

// 方向定数
const DIRECTIONS = [
  { deltaRow: 0, deltaCol: 1, name: "horizontal" },
  { deltaRow: 1, deltaCol: 0, name: "vertical" },
  { deltaRow: 1, deltaCol: 1, name: "diagonal_right" },
  { deltaRow: 1, deltaCol: -1, name: "diagonal_left" },
] as const;

// ゲーム定数（Expertレベル用の高度設定）
const GAME_CONSTANTS = {
  EARLY_GAME_MOVE_COUNT: 8,
  MID_GAME_MOVE_COUNT: 50,
  LATE_GAME_MOVE_COUNT: 150,
  CENTER_RADIUS: 6,
  WIN_LENGTH: 5,
  THREAT_LENGTH: 4,
  THREE_LENGTH: 3,
  TWO_LENGTH: 2,
  MINIMAX_MAX_POSITIONS: 12,
  MINIMAX_DEPTH: 3,
  EXPERT_MINIMAX_DEPTH: 4,
  TERRITORY_RADIUS: 3,
  MINIMAX_THRESHOLD: 500,
  FUTURE_SCORE_WEIGHT: 0.3,
  COMPLEX_PATTERN_RADIUS: 4,
  ENDGAME_OPTIMIZATION_THRESHOLD: 0.8,
} as const;

// 評価値定数（Expertレベル用の精密な重み付け）
const EVALUATION_SCORES = {
  WIN: 1000000,
  BLOCK_WIN: 500000,
  FOUR: 100000,
  BLOCK_FOUR: 80000,
  THREE_OPEN: 50000,
  THREE: 10000,
  BLOCK_THREE: 5000,
  TWO_OPEN: 2000,
  TWO: 500,
  FORK: 150000,
  BLOCK_FORK: 120000,
  COMPLEX_FORK: 200000,
  CENTER: 20,
  TERRITORY: 10,
  STRATEGIC_POSITION: 100,
  PATTERN_DISRUPTION: 300,
  ENDGAME_EFFICIENCY: 1000,
} as const;

// 戦略的要所（中央からの重要ポジション）
const STRATEGIC_POSITIONS = [
  { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  { row: -2, col: -1 }, { row: -2, col: 0 }, { row: -2, col: 1 },
  { row: -1, col: -2 }, { row: 0, col: -2 }, { row: 1, col: -2 },
  { row: 2, col: -1 }, { row: 2, col: 0 }, { row: 2, col: 1 },
  { row: -1, col: 2 }, { row: 0, col: 2 }, { row: 1, col: 2 },
] as const;

/**
 * ゲーム進行段階を判定
 */
type GamePhase = 'early' | 'mid' | 'late';

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
 * ゲーム進行段階を判定する
 */
const getGamePhase = (moveHistory: Position[]): GamePhase => {
  const moveCount = moveHistory.length;
  if (moveCount < GAME_CONSTANTS.EARLY_GAME_MOVE_COUNT) return 'early';
  if (moveCount < GAME_CONSTANTS.MID_GAME_MOVE_COUNT) return 'mid';
  return 'late';
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
 * 複雑なパターン分析（間隔攻撃、複数方向脅威等）
 */
const analyzeComplexPatterns = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  let score = 0;
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  
  // 間隔攻撃パターンの検出
  for (const direction of DIRECTIONS) {
    score += analyzeGappedPattern(tempBoard, position, color, direction);
  }
  
  // 複数方向同時脅威の検出
  score += analyzeMultiDirectionalThreats(tempBoard, position, color);
  
  return score;
};

/**
 * 間隔攻撃パターンを分析
 */
const analyzeGappedPattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  direction: typeof DIRECTIONS[number]
): number => {
  let score = 0;
  const { deltaRow, deltaCol } = direction;
  
  // 前後3マスずつの範囲で間隔パターンをチェック
  for (let gap = 1; gap <= 2; gap++) {
    let forwardStones = 0;
    let backwardStones = 0;
    
    // 前方向のチェック
    for (let i = 1; i <= 3; i++) {
      const checkRow = position.row + deltaRow * (i + gap);
      const checkCol = position.col + deltaCol * (i + gap);
      
      if (Board.isValidPosition(checkRow, checkCol) && board[checkRow][checkCol] === color) {
        forwardStones++;
      }
    }
    
    // 後方向のチェック
    for (let i = 1; i <= 3; i++) {
      const checkRow = position.row - deltaRow * (i + gap);
      const checkCol = position.col - deltaCol * (i + gap);
      
      if (Board.isValidPosition(checkRow, checkCol) && board[checkRow][checkCol] === color) {
        backwardStones++;
      }
    }
    
    // 間隔攻撃のスコア計算
    const totalStones = forwardStones + backwardStones + 1;
    if (totalStones >= GAME_CONSTANTS.THREE_LENGTH) {
      score += EVALUATION_SCORES.PATTERN_DISRUPTION * gap;
    }
  }
  
  return score;
};

/**
 * 複数方向同時脅威を分析
 */
const analyzeMultiDirectionalThreats = (
  board: Board,
  position: Position,
  color: StoneColor
): number => {
  let threatCount = 0;
  let openThreatCount = 0;
  
  for (const direction of DIRECTIONS) {
    const consecutive = countBidirectionalStones(
      board,
      position.row,
      position.col,
      direction.deltaRow,
      direction.deltaCol,
      color
    );
    
    if (consecutive >= GAME_CONSTANTS.THREE_LENGTH) {
      threatCount++;
      
      if (isPatternOpen(board, position.row, position.col, 
                        direction.deltaRow, direction.deltaCol)) {
        openThreatCount++;
      }
    }
  }
  
  // 複数方向脅威のスコア計算
  if (threatCount >= 2) {
    if (openThreatCount >= 2) {
      return EVALUATION_SCORES.COMPLEX_FORK;
    } else if (threatCount >= 3) {
      return EVALUATION_SCORES.FORK * 1.5;
    } else {
      return EVALUATION_SCORES.FORK;
    }
  }
  
  return 0;
};

/**
 * 攻撃パターンの評価を計算する（Expert版）
 */
const evaluateOffensivePattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  gamePhase: GamePhase
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
        score += evaluateThreePattern(board, position, color, direction, gamePhase);
        break;
      case 'two':
        score += evaluateTwoPattern(board, position, color, direction, gamePhase);
        break;
    }
  }
  
  // 複雑なパターン分析を追加
  score += analyzeComplexPatterns(board, position, color);
  
  return score;
};

/**
 * 3連続パターンの詳細評価（ゲーム段階考慮版）
 */
const evaluateThreePattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  direction: typeof DIRECTIONS[number],
  gamePhase: GamePhase
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  const isOpen = isPatternOpen(tempBoard, position.row, position.col, 
                              direction.deltaRow, direction.deltaCol);
  
  let baseScore = isOpen ? EVALUATION_SCORES.THREE_OPEN : EVALUATION_SCORES.THREE;
  
  // ゲーム段階による調整
  switch (gamePhase) {
    case 'early':
      baseScore *= 1.2; // 序盤では3連続を重視
      break;
    case 'mid':
      baseScore *= 1.5; // 中盤では最重要
      break;
    case 'late':
      baseScore *= 2.0; // 終盤では決定的
      break;
  }
  
  return baseScore;
};

/**
 * 2連続パターンの詳細評価（ゲーム段階考慮版）
 */
const evaluateTwoPattern = (
  board: Board,
  position: Position,
  color: StoneColor,
  direction: typeof DIRECTIONS[number],
  gamePhase: GamePhase
): number => {
  const tempBoard = Board.placeStone(board, position.row, position.col, color);
  const isOpen = isPatternOpen(tempBoard, position.row, position.col,
                              direction.deltaRow, direction.deltaCol);
  
  let baseScore = isOpen ? EVALUATION_SCORES.TWO_OPEN : EVALUATION_SCORES.TWO;
  
  // ゲーム段階による調整
  switch (gamePhase) {
    case 'early':
      baseScore *= 1.5; // 序盤では2連続が重要
      break;
    case 'mid':
      baseScore *= 1.0; // 中盤では標準
      break;
    case 'late':
      baseScore *= 0.5; // 終盤では優先度低下
      break;
  }
  
  return baseScore;
};

/**
 * 防御パターンの評価を計算する（Expert版）
 */
const evaluateDefensivePattern = (
  board: Board,
  position: Position,
  opponentColor: StoneColor,
  gamePhase: GamePhase
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
        score += EVALUATION_SCORES.BLOCK_THREE * getGamePhaseMultiplier(gamePhase, 'defense');
        break;
    }
  }
  
  // 相手の複雑パターン阻止
  const opponentComplexScore = analyzeComplexPatterns(board, position, opponentColor);
  if (opponentComplexScore > 0) {
    score += EVALUATION_SCORES.BLOCK_FORK;
  }
  
  return score;
};

/**
 * ゲーム段階による倍率を取得
 */
const getGamePhaseMultiplier = (gamePhase: GamePhase, type: 'offense' | 'defense'): number => {
  if (type === 'offense') {
    switch (gamePhase) {
      case 'early': return 1.0;
      case 'mid': return 1.3;
      case 'late': return 1.8;
    }
  } else {
    switch (gamePhase) {
      case 'early': return 0.8;
      case 'mid': return 1.2;
      case 'late': return 2.0;
    }
  }
};

/**
 * 戦略的位置ボーナスを計算する（Expert版）
 */
const evaluateStrategicPosition = (
  board: Board,
  position: Position,
  color: StoneColor,
  gamePhase: GamePhase
): number => {
  let score = 0;
  const center = Math.floor(BOARD_SIZE / 2);
  
  // 中央からの距離ボーナス
  const distanceFromCenter = Math.abs(position.row - center) + Math.abs(position.col - center);
  if (distanceFromCenter <= GAME_CONSTANTS.CENTER_RADIUS) {
    score += EVALUATION_SCORES.CENTER * (GAME_CONSTANTS.CENTER_RADIUS - distanceFromCenter + 1);
  }
  
  // 戦略的要所ボーナス
  for (const offset of STRATEGIC_POSITIONS) {
    const strategicRow = center + offset.row;
    const strategicCol = center + offset.col;
    
    if (position.row === strategicRow && position.col === strategicCol) {
      score += EVALUATION_SCORES.STRATEGIC_POSITION * getGamePhaseMultiplier(gamePhase, 'offense');
      break;
    }
  }
  
  return score;
};

/**
 * 領域支配スコアを計算する（Expert版）
 */
const evaluateTerritoryControl = (
  board: Board,
  position: Position,
  color: StoneColor,
  gamePhase: GamePhase
): number => {
  let territoryScore = 0;
  let influenceScore = 0;
  
  for (let dr = -GAME_CONSTANTS.TERRITORY_RADIUS; dr <= GAME_CONSTANTS.TERRITORY_RADIUS; dr++) {
    for (let dc = -GAME_CONSTANTS.TERRITORY_RADIUS; dc <= GAME_CONSTANTS.TERRITORY_RADIUS; dc++) {
      const r = position.row + dr;
      const c = position.col + dc;
      
      if (Board.isValidPosition(r, c)) {
        const distance = Math.abs(dr) + Math.abs(dc);
        
        if (board[r][c] === color) {
          territoryScore += EVALUATION_SCORES.TERRITORY / (distance + 1);
        } else if (board[r][c] === getOpponentColor(color)) {
          // 相手の影響を妨害
          influenceScore += EVALUATION_SCORES.PATTERN_DISRUPTION / (distance + 1);
        }
      }
    }
  }
  
  const totalScore = territoryScore + influenceScore;
  return totalScore * getGamePhaseMultiplier(gamePhase, 'offense');
};

/**
 * 終盤効率性を評価する
 */
const evaluateEndgameEfficiency = (
  board: Board,
  position: Position,
  color: StoneColor,
  availablePositions: Position[]
): number => {
  const totalSpaces = BOARD_SIZE * BOARD_SIZE;
  const remainingSpaces = availablePositions.length;
  const occupiedRatio = (totalSpaces - remainingSpaces) / totalSpaces;
  
  if (occupiedRatio < GAME_CONSTANTS.ENDGAME_OPTIMIZATION_THRESHOLD) {
    return 0;
  }
  
  // 終盤では最短勝利路を重視
  let efficiencyScore = 0;
  const myConsecutiveCounts = calculateConsecutiveCounts(board, position, color);
  
  for (const consecutive of myConsecutiveCounts) {
    if (consecutive >= GAME_CONSTANTS.THREE_LENGTH) {
      const movesToWin = GAME_CONSTANTS.WIN_LENGTH - consecutive;
      efficiencyScore += EVALUATION_SCORES.ENDGAME_EFFICIENCY / movesToWin;
    }
  }
  
  return efficiencyScore;
};

/**
 * 統合的な位置評価（Expert版）
 */
const evaluatePosition = (
  board: Board,
  position: Position,
  color: StoneColor,
  opponentColor: StoneColor,
  gamePhase: GamePhase,
  availablePositions: Position[]
): number => {
  return evaluateOffensivePattern(board, position, color, gamePhase) +
         evaluateDefensivePattern(board, position, opponentColor, gamePhase) +
         evaluateStrategicPosition(board, position, color, gamePhase) +
         evaluateTerritoryControl(board, position, color, gamePhase) +
         evaluateEndgameEfficiency(board, position, color, availablePositions);
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
 * 序盤の定石配置を取得する（Expert版）
 */
const getOpeningMove = (
  board: Board,
  moveHistory: Position[],
  gamePhase: GamePhase
): Position | null => {
  if (gamePhase !== 'early') {
    return null;
  }
  
  const center = Math.floor(BOARD_SIZE / 2);
  
  // 最初の手は中央
  if (moveHistory.length === 0) {
    return { row: center, col: center };
  }
  
  // 2手目以降は戦略的要所
  for (const offset of STRATEGIC_POSITIONS) {
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
 * 候補手をスコア順にソートする（Expert版）
 */
const getSortedCandidates = (
  board: Board,
  availablePositions: Position[],
  color: StoneColor,
  opponentColor: StoneColor,
  gamePhase: GamePhase,
  maxCount: number
): Position[] => {
  return availablePositions
    .map(pos => ({
      position: pos,
      score: evaluatePosition(board, pos, color, opponentColor, gamePhase, availablePositions)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map(item => item.position);
};

/**
 * 高度なミニマックス法による5手先読み（Expert版）
 */
const minimaxExpert = (
  board: Board,
  color: StoneColor,
  depth: number,
  isMaximizing: boolean,
  gamePhase: GamePhase,
  alpha: number = -Infinity,
  beta: number = Infinity
): number => {
  if (depth === 0) {
    return 0;
  }
  
  const availablePositions = getAvailablePositions(board);
  const currentColor = isMaximizing ? color : getOpponentColor(color);
  const opponentColor = getOpponentColor(currentColor);
  
  // 動的候補数調整（深い探索では候補を絞る）
  const maxCandidates = Math.max(
    GAME_CONSTANTS.MINIMAX_MAX_POSITIONS - depth * 3,
    3
  );
  
  const sortedPositions = getSortedCandidates(
    board, 
    availablePositions, 
    currentColor, 
    opponentColor,
    gamePhase,
    maxCandidates
  );
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const position of sortedPositions) {
      const tempBoard = Board.placeStone(board, position.row, position.col, currentColor);
      const evaluation = minimaxExpert(tempBoard, color, depth - 1, false, gamePhase, alpha, beta);
      
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
      const evaluation = minimaxExpert(tempBoard, color, depth - 1, true, gamePhase, alpha, beta);
      
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
 * 最適手を選択する関数（Expert版）
 */
const selectBestMove = (
  board: Board,
  color: StoneColor,
  opponentColor: StoneColor,
  gamePhase: GamePhase
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
      gamePhase, 
      availablePositions
    );
    
    // 有望な手について5手先読み
    let totalScore = positionScore;
    if (positionScore > GAME_CONSTANTS.MINIMAX_THRESHOLD) {
      const tempBoard = Board.placeStone(board, position.row, position.col, color);
      const futureScore = minimaxExpert(
        tempBoard, 
        color, 
        GAME_CONSTANTS.EXPERT_MINIMAX_DEPTH, 
        false,
        gamePhase
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
 * ExpertレベルのCPUプレイヤーを作成する
 * 
 * 戦略（Hardからの進化）:
 * 1. 即座勝利または防御が必要な手を最優先
 * 2. 序盤では戦略的要所の確保
 * 3. 5手先読みによる深い戦略的思考
 * 4. 複雑パターン認識（間隔攻撃、複数方向脅威）
 * 5. 動的戦略調整（ゲーム進行段階による重み変更）
 * 6. 終盤最適化（効率的勝利路の選択）
 * 7. 高度な領域支配と相手妨害
 * 8. アルファベータ法による効率的な深い探索
 */
export const createExpertCpuPlayer = (color: StoneColor): CpuPlayer => {
  if (StoneColor.isNone(color)) {
    throw new Error("CPU player color cannot be 'none'");
  }

  return {
    cpuLevel: "expert",
    color,
    calculateNextMove: (board: Board, moveHistory: Position[]): Position | null => {
      const availablePositions = getAvailablePositions(board);
      
      if (availablePositions.length === 0) {
        return null;
      }

      const opponentColor = getOpponentColor(color);
      const gamePhase = getGamePhase(moveHistory);

      // 1. 即座勝利または防御チェック
      const criticalMove = findCriticalMove(board, color, opponentColor);
      if (criticalMove) {
        return criticalMove;
      }

      // 2. 序盤定石
      const openingMove = getOpeningMove(board, moveHistory, gamePhase);
      if (openingMove) {
        return openingMove;
      }

      // 3. Expert級の高度な評価関数による最適手選択
      return selectBestMove(board, color, opponentColor, gamePhase);
    },
  };
};