import { describe, it, expect, vi } from "vitest";
import { createBeginnerCpuPlayer } from "./beginnerCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("createBeginnerCpuPlayer", () => {
  describe("factory function", () => {
    it("should create a beginner CPU player with black color", () => {
      const cpu = createBeginnerCpuPlayer("black");
      
      expect(cpu.cpuLevel).toBe("beginner");
      expect(cpu.color).toBe("black");
    });

    it("should create a beginner CPU player with white color", () => {
      const cpu = createBeginnerCpuPlayer("white");
      
      expect(cpu.cpuLevel).toBe("beginner");
      expect(cpu.color).toBe("white");
    });
  });

  describe("calculateNextMove", () => {
    it("should return a valid position on an empty board", () => {
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];

      const move = cpu.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      expect(Position.isValid(move!)).toBe(true);
    });

    it("should return a position that is not already occupied", () => {
      const cpu = createBeginnerCpuPlayer("white");
      const board = Board.createEmpty();
      
      // Place some stones on the board
      board[7][7] = "black";
      board[7][8] = "white";
      board[8][7] = "black";
      
      const moveHistory: Position[] = [
        { row: 7, col: 7 },
        { row: 7, col: 8 },
        { row: 8, col: 7 }
      ];

      const move = cpu.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      expect(Position.isValid(move!)).toBe(true);
      expect(board[move!.row][move!.col]).toBe("none");
    });

    it("should return null when the board is full", () => {
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      
      // Fill the entire board
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          board[row][col] = (row + col) % 2 === 0 ? "black" : "white";
        }
      }

      const moveHistory: Position[] = [];
      const move = cpu.calculateNextMove(board, moveHistory);

      expect(move).toBeNull();
    });

    it("should make random moves (test multiple times for randomness)", () => {
      // Mock Math.random to control randomness
      const mockRandom = vi.spyOn(Math, "random");
      
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];

      // Test with different random values
      mockRandom.mockReturnValueOnce(0.1);
      const move1 = cpu.calculateNextMove(board, moveHistory);

      mockRandom.mockReturnValueOnce(0.9);
      const move2 = cpu.calculateNextMove(board, moveHistory);

      expect(move1).not.toBeNull();
      expect(move2).not.toBeNull();
      expect(Position.isValid(move1!)).toBe(true);
      expect(Position.isValid(move2!)).toBe(true);

      mockRandom.mockRestore();
    });

    it("should handle a nearly full board correctly", () => {
      const cpu = createBeginnerCpuPlayer("white");
      const board = Board.createEmpty();
      
      // Fill almost the entire board, leaving only one spot
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          if (!(row === 14 && col === 14)) {
            board[row][col] = (row + col) % 2 === 0 ? "black" : "white";
          }
        }
      }

      const moveHistory: Position[] = [];
      const move = cpu.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      expect(move!.row).toBe(14);
      expect(move!.col).toBe(14);
    });
  });

  describe("対戦感向上のテスト", () => {
    it("should place stones in center area on first move (empty board)", () => {
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];

      // Board.isEmptyがtrueであることを確認
      expect(Board.isEmpty(board)).toBe(true);

      // 複数回テストして、すべて中央付近（7±2の範囲）に配置されることを確認
      for (let i = 0; i < 10; i++) {
        const move = cpu.calculateNextMove(board, moveHistory);
        
        expect(move).not.toBeNull();
        expect(move!.row).toBeGreaterThanOrEqual(5); // 7-2
        expect(move!.row).toBeLessThanOrEqual(9);    // 7+2
        expect(move!.col).toBeGreaterThanOrEqual(5); // 7-2
        expect(move!.col).toBeLessThanOrEqual(9);    // 7+2
      }
    });

    it("should prioritize positions near player stones", () => {
      const cpu = createBeginnerCpuPlayer("black");
      
      // 複数回テストして、プレイヤーの石から2マス以内に配置されることを確認
      let proximityCount = 0;
      const testRuns = 20;

      for (let i = 0; i < testRuns; i++) {
        const testBoard = Board.createEmpty();
        // プレイヤー（白）の石を配置
        testBoard[7][7] = "white";
        const moveHistory: Position[] = [{ row: 7, col: 7 }];
        
        const move = cpu.calculateNextMove(testBoard, moveHistory);
        
        expect(move).not.toBeNull();
        
        const rowDistance = Math.abs(move!.row - 7);
        const colDistance = Math.abs(move!.col - 7);
        if (rowDistance <= 2 && colDistance <= 2) {
          proximityCount++;
        }
      }

      // 80%以上は近接位置に配置されるべき（確率的テスト）
      expect(proximityCount / testRuns).toBeGreaterThan(0.8);
    });

    it("should fall back to random placement when no proximity moves available", () => {
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      
      // プレイヤーの石を角に配置し、周囲を埋める
      board[0][0] = "white";
      // 周囲2マス以内をすべて埋める
      for (let row = 0; row <= 2; row++) {
        for (let col = 0; col <= 2; col++) {
          if (!(row === 0 && col === 0)) {
            board[row][col] = "black";
          }
        }
      }
      
      const moveHistory: Position[] = [{ row: 0, col: 0 }];
      const move = cpu.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      expect(Position.isValid(move!)).toBe(true);
      expect(board[move!.row][move!.col]).toBe("none");
      
      // 近接範囲外に配置されることを確認
      const rowDistance = Math.abs(move!.row - 0);
      const colDistance = Math.abs(move!.col - 0);
      expect(rowDistance > 2 || colDistance > 2).toBe(true);
    });

    it("should handle multiple player stones correctly", () => {
      const cpu = createBeginnerCpuPlayer("black");
      const board = Board.createEmpty();
      
      // 複数のプレイヤー石を配置
      board[5][5] = "white";
      board[9][9] = "white";
      const moveHistory: Position[] = [
        { row: 5, col: 5 },
        { row: 9, col: 9 }
      ];

      const move = cpu.calculateNextMove(board, moveHistory);
      
      expect(move).not.toBeNull();
      
      // どちらかの石から2マス以内に配置されることを確認
      const row1Distance = Math.abs(move!.row - 5);
      const col1Distance = Math.abs(move!.col - 5);
      const row2Distance = Math.abs(move!.row - 9);
      const col2Distance = Math.abs(move!.col - 9);
      
      const isNearFirst = row1Distance <= 2 && col1Distance <= 2;
      const isNearSecond = row2Distance <= 2 && col2Distance <= 2;
      
      expect(isNearFirst || isNearSecond).toBe(true);
    });
  });
});