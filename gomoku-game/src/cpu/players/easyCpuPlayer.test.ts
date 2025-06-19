import { describe, test, expect } from "vitest";
import { createEasyCpuPlayer } from "./easyCpuPlayer";
import { Board } from "@/utils/board";
import { Position } from "@/features/board/utils/position";

describe("EasyCpuPlayer", () => {
  describe("作成", () => {
    test("白石でEasyCPUプレイヤーを作成できる", () => {
      const player = createEasyCpuPlayer("white");
      
      expect(player.cpuLevel).toBe("easy");
      expect(player.color).toBe("white");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("黒石でEasyCPUプレイヤーを作成できる", () => {
      const player = createEasyCpuPlayer("black");
      
      expect(player.cpuLevel).toBe("easy");
      expect(player.color).toBe("black");
      expect(typeof player.calculateNextMove).toBe("function");
    });
  });

  describe("calculateNextMove", () => {
    test("空のボードでは中央付近に手を打つ", () => {
      const player = createEasyCpuPlayer("white");
      const emptyBoard: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      const moveHistory: Position[] = [];

      const move = player.calculateNextMove(emptyBoard, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 中央（7,7）から半径3以内に打つ
        const centerDistance = Math.abs(move.row - 7) + Math.abs(move.col - 7);
        expect(centerDistance).toBeLessThanOrEqual(3);
      }
    });

    test("すべてのマスが埋まっている場合はnullを返す", () => {
      const player = createEasyCpuPlayer("white");
      const fullBoard: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
      const moveHistory: Position[] = [];

      const move = player.calculateNextMove(fullBoard, moveHistory);

      expect(move).toBeNull();
    });

    test("相手が4連続で並んでいる場合は阻止する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 横方向に4連続の黒石を配置（相手の石）
      board[7][3] = "black";
      board[7][4] = "black";
      board[7][5] = "black";
      board[7][6] = "black";
      // 阻止ポイント: (7, 2) または (7, 7)
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 阻止位置に打つ
        expect(
          (move.row === 7 && move.col === 2) || 
          (move.row === 7 && move.col === 7)
        ).toBe(true);
      }
    });

    test("自分が4連続で並んでいる場合は勝利する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 横方向に4連続の白石を配置（自分の石）
      board[7][3] = "white";
      board[7][4] = "white";
      board[7][5] = "white";
      board[7][6] = "white";
      // 勝利ポイント: (7, 2) または (7, 7)
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 勝利位置に打つ
        expect(
          (move.row === 7 && move.col === 2) || 
          (move.row === 7 && move.col === 7)
        ).toBe(true);
      }
    });

    test("縦方向の4連続も検出する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 縦方向に4連続の黒石を配置
      board[3][7] = "black";
      board[4][7] = "black";
      board[5][7] = "black";
      board[6][7] = "black";
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 阻止位置に打つ
        expect(
          (move.row === 2 && move.col === 7) || 
          (move.row === 7 && move.col === 7)
        ).toBe(true);
      }
    });

    test("斜め方向の4連続も検出する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 右下斜め方向に4連続の黒石を配置
      board[3][3] = "black";
      board[4][4] = "black";
      board[5][5] = "black";
      board[6][6] = "black";
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 阻止位置に打つ
        expect(
          (move.row === 2 && move.col === 2) || 
          (move.row === 7 && move.col === 7)
        ).toBe(true);
      }
    });

    test("有効な空きマスのみに手を打つ", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // いくつかのマスを埋める
      board[0][0] = "black";
      board[1][1] = "white";
      board[7][7] = "black";
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 空きマスに打つ
        expect(board[move.row][move.col]).toBe("none");
        // 有効な座標範囲内
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(15);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(15);
      }
    });
  });
});