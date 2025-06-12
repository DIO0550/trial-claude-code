import { describe, it, expect } from "vitest";
import { StoneColor } from "./stone";

describe("StoneColor", () => {
  describe("isNone", () => {
    it("\"none\"の場合trueを返す", () => {
      expect(StoneColor.isNone("none")).toBe(true);
    });

    it("\"black\"の場合falseを返す", () => {
      expect(StoneColor.isNone("black")).toBe(false);
    });

    it("\"white\"の場合falseを返す", () => {
      expect(StoneColor.isNone("white")).toBe(false);
    });
  });

  describe("isBlack", () => {
    it("\"black\"の場合trueを返す", () => {
      expect(StoneColor.isBlack("black")).toBe(true);
    });

    it("\"white\"の場合falseを返す", () => {
      expect(StoneColor.isBlack("white")).toBe(false);
    });

    it("\"none\"の場合falseを返す", () => {
      expect(StoneColor.isBlack("none")).toBe(false);
    });
  });

  describe("isWhite", () => {
    it("\"white\"の場合trueを返す", () => {
      expect(StoneColor.isWhite("white")).toBe(true);
    });

    it("\"black\"の場合falseを返す", () => {
      expect(StoneColor.isWhite("black")).toBe(false);
    });

    it("\"none\"の場合falseを返す", () => {
      expect(StoneColor.isWhite("none")).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("\"none\"の場合trueを返す", () => {
      expect(StoneColor.isEmpty("none")).toBe(true);
    });

    it("\"black\"の場合falseを返す", () => {
      expect(StoneColor.isEmpty("black")).toBe(false);
    });

    it("\"white\"の場合falseを返す", () => {
      expect(StoneColor.isEmpty("white")).toBe(false);
    });
  });

  describe("型ガード機能", () => {
    it("isNoneは型ガードとして機能する", () => {
      const color: StoneColor = "none";
      if (StoneColor.isNone(color)) {
        // この時点でcolorは"none"型として扱われる
        expect(color).toBe("none");
      }
    });

    it("isBlackは型ガードとして機能する", () => {
      const color: StoneColor = "black";
      if (StoneColor.isBlack(color)) {
        // この時点でcolorは"black"型として扱われる
        expect(color).toBe("black");
      }
    });

    it("isWhiteは型ガードとして機能する", () => {
      const color: StoneColor = "white";
      if (StoneColor.isWhite(color)) {
        // この時点でcolorは"white"型として扱われる
        expect(color).toBe("white");
      }
    });
  });
});