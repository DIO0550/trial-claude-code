import { describe, it, expect, vi } from "vitest";
import { createBeginnerCpuPlayer } from "./beginnerCpuPlayer";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";

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
});