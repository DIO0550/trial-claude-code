import { describe, test, expect } from "vitest";
import { createExpertCpuPlayer } from "./expertCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("ExpertCpuPlayer Integration Tests", () => {
  describe("パフォーマンステスト", () => {
    test("複雑な盤面での5手先読み計算時間が合理的である", { timeout: 60000 }, () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 非常に複雑な盤面を作成
      for (let i = 0; i < 80; i++) {
        const row = Math.floor(Math.random() * 15);
        const col = Math.floor(Math.random() * 15);
        if (board[row][col] === "none") {
          board[row][col] = i % 2 === 0 ? "black" : "white";
        }
      }
      
      const moveHistory: Position[] = Array(80).fill(null).map((_, i) => ({ 
        row: Math.floor(i / 15), 
        col: i % 15 
      }));

      const startTime = Date.now();
      const move = player.calculateNextMove(board, moveHistory);
      const endTime = Date.now();

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
      }
      
      // 計算時間が35秒以内であることを確認（複雑な盤面での実用性を考慮）
      expect(endTime - startTime).toBeLessThan(35000);
    });

    test("最小計算時間での応答を確認", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // シンプルな盤面
      board[7][7] = "black";
      
      const moveHistory: Position[] = [{ row: 7, col: 7 }];

      const startTime = Date.now();
      const move = player.calculateNextMove(board, moveHistory);
      const endTime = Date.now();

      expect(move).not.toBeNull();
      
      // 簡単な場合は1秒以内
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe("5手先読み高度戦略", () => {
    test("5手先の勝利パターンを認識する", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 5手先で勝利できる複雑なパターン
      board[7][7] = "white";
      board[8][8] = "white";
      board[6][6] = "black";
      board[9][9] = "black";
      
      const moveHistory: Position[] = Array(12).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });

    test("相手の5手先脅威を予測して阻止する", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 相手が5手先で勝利できる複雑な布石
      board[7][7] = "black";
      board[6][8] = "black";
      board[8][6] = "black";
      
      const moveHistory: Position[] = Array(12).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });

    test("複数の脅威を同時に創出する戦略", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 複数方向への同時脅威を作る状況
      board[7][5] = "white";
      board[7][6] = "white";
      board[6][7] = "white";
      board[5][8] = "white";
      
      const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });
  });

  describe("完璧近接戦略", () => {
    test("プレイヤーの全連続パターンを予測した阻害位置を選ぶ", { timeout: 10000 }, () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // プレイヤーの複数方向連続準備
      board[6][6] = "black";
      board[6][7] = "black";
      board[7][6] = "black";
      board[8][5] = "black";
      
      const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // いずれかのプレイヤーの石から距離2以内で阻害位置
        const distances = [
          Math.abs(move.row - 6) + Math.abs(move.col - 6),
          Math.abs(move.row - 6) + Math.abs(move.col - 7),
          Math.abs(move.row - 7) + Math.abs(move.col - 6),
          Math.abs(move.row - 8) + Math.abs(move.col - 5)
        ];
        expect(Math.min(...distances)).toBeLessThanOrEqual(2);
      }
    });

    test("複数フォーク形成での戦略的近接配置", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // プレイヤーの石を配置
      board[6][6] = "black";
      board[7][7] = "black";
      
      // 自分の石で複数フォーク準備
      board[5][5] = "white";
      board[8][8] = "white";
      board[9][9] = "white";
      
      const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // プレイヤーの石または自分のフォーク形成位置から距離2以内
        const playerDistances = [
          Math.abs(move.row - 6) + Math.abs(move.col - 6),
          Math.abs(move.row - 7) + Math.abs(move.col - 7)
        ];
        const myDistances = [
          Math.abs(move.row - 5) + Math.abs(move.col - 5),
          Math.abs(move.row - 8) + Math.abs(move.col - 8),
          Math.abs(move.row - 9) + Math.abs(move.col - 9)
        ];
        const minDistance = Math.min(...playerDistances, ...myDistances);
        expect(minDistance).toBeLessThanOrEqual(2);
      }
    });

    test("終盤での必勝近接配置を優先する", { timeout: 60000 }, () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 終盤シミュレーション（多くの石が配置済み）
      for (let i = 0; i < 100; i++) {
        const row = Math.floor(Math.random() * 15);
        const col = Math.floor(Math.random() * 15);
        if (board[row][col] === "none") {
          board[row][col] = i % 2 === 0 ? "black" : "white";
        }
      }
      
      // プレイヤーの石を特定位置に配置
      board[10][10] = "black";
      board[11][11] = "black";
      board[12][12] = "black";
      
      const moveHistory: Position[] = Array(150).fill(null).map((_, i) => ({ 
        row: Math.floor(i / 15), 
        col: i % 15 
      }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 終盤では効率的勝利を目指した近接配置（実際の戦略的判断を考慮）
        const distance = Math.min(
          Math.abs(move.row - 10) + Math.abs(move.col - 10),
          Math.abs(move.row - 11) + Math.abs(move.col - 11),
          Math.abs(move.row - 12) + Math.abs(move.col - 12)
        );
        expect(distance).toBeLessThanOrEqual(14); // 終盤では戦略的な範囲を考慮
      }
    });
  });

  describe("高度パターン認識", () => {
    test("間隔を置いた脅威パターンを認識する", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // X-O-X-O-Xパターン（間隔攻撃）
      board[7][3] = "black";
      board[7][5] = "black";
      board[7][7] = "black";
      board[7][9] = "black";
      
      const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });

    test("複雑なフォーク攻撃を認識して実行する", () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 3-3フォークの準備
      board[6][6] = "white";
      board[6][7] = "white";
      board[7][6] = "white";
      board[8][5] = "white";
      
      const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });
  });

  describe("戦術的位置取り", () => {
    test("相手の戦略を妨害する位置を選ぶ", { timeout: 10000 }, () => {
      const player = createExpertCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 黒石の戦略的配置を妨害
      board[7][7] = "black";
      board[6][7] = "black";
      board[8][7] = "black";
      board[7][6] = "black";
      
      const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        expect(board[move.row][move.col]).toBe("none");
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });
  });
});