import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  describe("基本的な表示", () => {
    it("子要素のテキストが正しく表示される", () => {
      render(<Button>テストボタン</Button>);
      expect(screen.getByRole("button", { name: "テストボタン" })).toBeInTheDocument();
    });

    it("デフォルトでprimaryバリアントが適用される", () => {
      render(<Button>テストボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-600");
    });

    it("デフォルトでmediumサイズが適用される", () => {
      render(<Button>テストボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4", "py-2");
    });
  });

  describe("バリアント", () => {
    it("primaryバリアントが正しく適用される", () => {
      render(<Button variant="primary">プライマリ</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-600", "text-white");
    });

    it("secondaryバリアントが正しく適用される", () => {
      render(<Button variant="secondary">セカンダリ</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-200", "text-gray-800");
    });
  });

  describe("サイズ", () => {
    it("smallサイズが正しく適用される", () => {
      render(<Button size="small">小サイズ</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
    });

    it("mediumサイズが正しく適用される", () => {
      render(<Button size="medium">中サイズ</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4", "py-2", "text-base");
    });

    it("largeサイズが正しく適用される", () => {
      render(<Button size="large">大サイズ</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-6", "py-3", "text-lg");
    });
  });

  describe("全幅オプション", () => {
    it("fullWidthがtrueの場合w-fullクラスが適用される", () => {
      render(<Button fullWidth>全幅ボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });

    it("fullWidthがfalseの場合w-fullクラスが適用されない", () => {
      render(<Button fullWidth={false}>通常幅ボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });
  });

  describe("無効化状態", () => {
    it("disabledがtrueの場合ボタンが無効になる", () => {
      render(<Button disabled>無効ボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("無効化状態で適切なスタイルが適用される", () => {
      render(<Button disabled>無効ボタン</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50", "disabled:cursor-not-allowed");
    });
  });

  describe("クリックイベント", () => {
    it("クリック時にonClickが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>クリック可能</Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("無効化されている場合はonClickが呼ばれない", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} disabled>無効ボタン</Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("カスタムクラス", () => {
    it("追加のクラス名が適用される", () => {
      render(<Button className="custom-class">カスタム</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("基本クラスとカスタムクラスが共存する", () => {
      render(<Button className="custom-class">カスタム</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class", "bg-blue-600", "font-semibold");
    });
  });

  describe("アクセシビリティ", () => {
    it("フォーカスリングクラスが適用される", () => {
      render(<Button>フォーカス</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:outline-none", "focus:ring-2", "focus:ring-offset-2");
    });

    it("キーボードでアクセス可能", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>キーボード</Button>);
      const button = screen.getByRole("button");

      button.focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("HTMLボタン属性", () => {
    it("type属性が正しく適用される", () => {
      render(<Button type="submit">送信</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("aria-label属性が正しく適用される", () => {
      render(<Button aria-label="閉じる">×</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "閉じる");
    });
  });

  describe("アイコンサポート", () => {
    it("アイコンが表示される", () => {
      const icon = <span data-testid="test-icon">←</span>;
      render(<Button icon={icon}>戻る</Button>);
      
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByText("戻る")).toBeInTheDocument();
    });

    it("アイコンのみモードでテキストが表示されない", () => {
      const icon = <span data-testid="test-icon">←</span>;
      render(<Button icon={icon} iconOnly aria-label="戻る">戻る</Button>);
      
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.queryByText("戻る")).not.toBeInTheDocument();
    });

    it("iconOnlyモードでaria-labelが必須", () => {
      const icon = <span data-testid="test-icon">←</span>;
      render(<Button icon={icon} iconOnly aria-label="戻る">戻る</Button>);
      
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "戻る");
    });
  });
});