import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BackIcon from "./BackIcon";

describe("BackIcon", () => {
  describe("基本的な表示", () => {
    it("戻るアイコンが表示される", () => {
      render(<BackIcon />);
      expect(screen.getByText("<")).toBeInTheDocument();
    });

    it("適切なaria-labelが設定される", () => {
      render(<BackIcon />);
      const icon = screen.getByText("<");
      expect(icon).toHaveAttribute("aria-label", "戻る");
    });

    it("デフォルトでmediumサイズが適用される", () => {
      render(<BackIcon />);
      const icon = screen.getByText("<");
      expect(icon).toHaveClass("text-lg");
    });
  });

  describe("サイズバリエーション", () => {
    it("smallサイズが正しく適用される", () => {
      render(<BackIcon size="small" />);
      const icon = screen.getByText("<");
      expect(icon).toHaveClass("text-sm");
    });

    it("mediumサイズが正しく適用される", () => {
      render(<BackIcon size="medium" />);
      const icon = screen.getByText("<");
      expect(icon).toHaveClass("text-lg");
    });

    it("largeサイズが正しく適用される", () => {
      render(<BackIcon size="large" />);
      const icon = screen.getByText("<");
      expect(icon).toHaveClass("text-xl");
    });
  });

  describe("アクセシビリティ", () => {
    it("セマンティックロール要素として認識される", () => {
      render(<BackIcon />);
      const icon = screen.getByText("<");
      expect(icon).toBeInTheDocument();
    });
  });
});