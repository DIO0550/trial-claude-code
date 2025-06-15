import { describe, it, expect } from "vitest";
import { Position } from "./position";

describe("Position", () => {
  describe("interface", () => {
    it("should define Position with row and col properties", () => {
      const position: Position = { row: 7, col: 8 };
      
      expect(position.row).toBe(7);
      expect(position.col).toBe(8);
    });
  });

  describe("isValid", () => {
    it("should return true for valid positions within board bounds", () => {
      expect(Position.isValid({ row: 0, col: 0 })).toBe(true);
      expect(Position.isValid({ row: 7, col: 7 })).toBe(true);
      expect(Position.isValid({ row: 14, col: 14 })).toBe(true);
      expect(Position.isValid({ row: 0, col: 14 })).toBe(true);
      expect(Position.isValid({ row: 14, col: 0 })).toBe(true);
    });

    it("should return false for positions with negative coordinates", () => {
      expect(Position.isValid({ row: -1, col: 0 })).toBe(false);
      expect(Position.isValid({ row: 0, col: -1 })).toBe(false);
      expect(Position.isValid({ row: -1, col: -1 })).toBe(false);
    });

    it("should return false for positions outside board bounds", () => {
      expect(Position.isValid({ row: 15, col: 0 })).toBe(false);
      expect(Position.isValid({ row: 0, col: 15 })).toBe(false);
      expect(Position.isValid({ row: 15, col: 15 })).toBe(false);
      expect(Position.isValid({ row: 100, col: 100 })).toBe(false);
    });

    it("should return false for non-integer coordinates", () => {
      expect(Position.isValid({ row: 7.5, col: 8 })).toBe(false);
      expect(Position.isValid({ row: 7, col: 8.3 })).toBe(false);
      expect(Position.isValid({ row: 7.1, col: 8.9 })).toBe(false);
    });

    it("should return false for NaN coordinates", () => {
      expect(Position.isValid({ row: NaN, col: 8 })).toBe(false);
      expect(Position.isValid({ row: 7, col: NaN })).toBe(false);
      expect(Position.isValid({ row: NaN, col: NaN })).toBe(false);
    });

    it("should return false for Infinity coordinates", () => {
      expect(Position.isValid({ row: Infinity, col: 8 })).toBe(false);
      expect(Position.isValid({ row: 7, col: Infinity })).toBe(false);
      expect(Position.isValid({ row: -Infinity, col: -Infinity })).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true for positions with same coordinates", () => {
      const pos1: Position = { row: 5, col: 7 };
      const pos2: Position = { row: 5, col: 7 };
      
      expect(Position.equals(pos1, pos2)).toBe(true);
    });

    it("should return true for identical position objects", () => {
      const pos: Position = { row: 3, col: 9 };
      
      expect(Position.equals(pos, pos)).toBe(true);
    });

    it("should return false for positions with different row", () => {
      const pos1: Position = { row: 5, col: 7 };
      const pos2: Position = { row: 6, col: 7 };
      
      expect(Position.equals(pos1, pos2)).toBe(false);
    });

    it("should return false for positions with different col", () => {
      const pos1: Position = { row: 5, col: 7 };
      const pos2: Position = { row: 5, col: 8 };
      
      expect(Position.equals(pos1, pos2)).toBe(false);
    });

    it("should return false for positions with both different coordinates", () => {
      const pos1: Position = { row: 5, col: 7 };
      const pos2: Position = { row: 10, col: 12 };
      
      expect(Position.equals(pos1, pos2)).toBe(false);
    });

    it("should handle edge case positions correctly", () => {
      const topLeft: Position = { row: 0, col: 0 };
      const bottomRight: Position = { row: 14, col: 14 };
      const anotherTopLeft: Position = { row: 0, col: 0 };
      
      expect(Position.equals(topLeft, anotherTopLeft)).toBe(true);
      expect(Position.equals(topLeft, bottomRight)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return formatted string for valid positions", () => {
      expect(Position.toString({ row: 5, col: 7 })).toBe("(5, 7)");
      expect(Position.toString({ row: 0, col: 0 })).toBe("(0, 0)");
      expect(Position.toString({ row: 14, col: 14 })).toBe("(14, 14)");
    });

    it("should handle negative coordinates in string representation", () => {
      expect(Position.toString({ row: -1, col: 5 })).toBe("(-1, 5)");
      expect(Position.toString({ row: 3, col: -2 })).toBe("(3, -2)");
    });

    it("should handle large coordinates in string representation", () => {
      expect(Position.toString({ row: 100, col: 200 })).toBe("(100, 200)");
    });

    it("should handle decimal coordinates in string representation", () => {
      expect(Position.toString({ row: 5.5, col: 7.3 })).toBe("(5.5, 7.3)");
    });

    it("should handle special number values", () => {
      expect(Position.toString({ row: NaN, col: 5 })).toBe("(NaN, 5)");
      expect(Position.toString({ row: Infinity, col: 7 })).toBe("(Infinity, 7)");
    });
  });

  describe("create", () => {
    it("should create a position with given coordinates", () => {
      const position = Position.create(5, 7);
      
      expect(position.row).toBe(5);
      expect(position.col).toBe(7);
    });

    it("should create positions with edge coordinates", () => {
      const topLeft = Position.create(0, 0);
      const bottomRight = Position.create(14, 14);
      
      expect(topLeft.row).toBe(0);
      expect(topLeft.col).toBe(0);
      expect(bottomRight.row).toBe(14);
      expect(bottomRight.col).toBe(14);
    });

    it("should create positions with any number values", () => {
      const negativePos = Position.create(-1, -5);
      const largePos = Position.create(100, 200);
      
      expect(negativePos.row).toBe(-1);
      expect(negativePos.col).toBe(-5);
      expect(largePos.row).toBe(100);
      expect(largePos.col).toBe(200);
    });
  });
});