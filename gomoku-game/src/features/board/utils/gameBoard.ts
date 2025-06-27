import { StoneColor } from "@/features/board/utils/stone";
import { Board } from "@/features/board/utils/board";

export interface GameBoard {
  board: Board;
}

export const GameBoard = {
  /**
   * 空のゲームボードを作成する
   * @returns 初期化されたゲームボード
   */
  createEmpty: (): GameBoard => ({
    board: Board.createEmpty(),
  }),

  /**
   * 指定位置に石を配置する
   * @param gameBoard 現在のゲームボード
   * @param row 行座標
   * @param col 列座標
   * @param color 配置する石の色
   * @returns 石を配置した新しいゲームボード、配置できない場合はnull
   */
  placeStone: (gameBoard: GameBoard, row: number, col: number, color: StoneColor): GameBoard | null => {
    if (!GameBoard.canPlaceStone(gameBoard, row, col)) {
      return null;
    }
    
    return {
      ...gameBoard,
      board: Board.placeStone(gameBoard.board, row, col, color),
    };
  },

  /**
   * 指定位置に石を配置できるかチェックする
   * @param gameBoard ゲームボード
   * @param row 行座標
   * @param col 列座標
   * @returns 配置可能な場合true
   */
  canPlaceStone: (gameBoard: GameBoard, row: number, col: number): boolean => {
    return Board.isValidPosition(row, col) && gameBoard.board[row][col] === "none";
  },

  /**
   * ゲームボードをリセットする
   * @returns 初期化されたゲームボード
   */
  reset: (): GameBoard => {
    return GameBoard.createEmpty();
  },

  /**
   * 指定位置の石を取得する
   * @param gameBoard ゲームボード
   * @param row 行座標
   * @param col 列座標
   * @returns 指定位置の石の色
   */
  getStone: (gameBoard: GameBoard, row: number, col: number): StoneColor => {
    if (!Board.isValidPosition(row, col)) {
      return "none";
    }
    return gameBoard.board[row][col];
  },
} as const;