import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import OptionSelector from "./OptionSelector";

describe("OptionSelector", () => {
  const mockOptions = [
    { value: "option1", label: "選択肢1", description: "最初の選択肢" },
    { value: "option2", label: "選択肢2", description: "2番目の選択肢" },
    { value: "option3", label: "選択肢3", description: "3番目の選択肢" },
  ];

  const defaultProps = {
    title: "テスト選択",
    options: mockOptions,
    selectedValue: "option1",
    onValueChange: vi.fn(),
  };

  describe("基本的な表示", () => {
    it("タイトルが正しく表示される", () => {
      render(<OptionSelector {...defaultProps} />);
      expect(screen.getByText("テスト選択")).toBeInTheDocument();
    });

    it("すべての選択肢が表示される", () => {
      render(<OptionSelector {...defaultProps} />);
      
      expect(screen.getByText("選択肢1")).toBeInTheDocument();
      expect(screen.getByText("選択肢2")).toBeInTheDocument();
      expect(screen.getByText("選択肢3")).toBeInTheDocument();
    });

    it("すべての説明文が表示される", () => {
      render(<OptionSelector {...defaultProps} />);
      
      expect(screen.getByText("最初の選択肢")).toBeInTheDocument();
      expect(screen.getByText("2番目の選択肢")).toBeInTheDocument();
      expect(screen.getByText("3番目の選択肢")).toBeInTheDocument();
    });
  });

  describe("選択状態の表示", () => {
    it("選択された項目に選択済みスタイルが適用される", () => {
      const { container } = render(<OptionSelector {...defaultProps} selectedValue="option2" />);
      
      // 選択済みスタイルが適用された要素が存在することを確認
      const selectedElements = container.querySelectorAll('.border-blue-600');
      expect(selectedElements.length).toBeGreaterThan(0);
    });

    it("選択されていない項目に未選択スタイルが適用される", () => {
      const { container } = render(<OptionSelector {...defaultProps} selectedValue="option2" />);
      
      // 未選択スタイルが適用された要素が存在することを確認
      const unselectedElements = container.querySelectorAll('.border-gray-300');
      expect(unselectedElements.length).toBeGreaterThan(0);
    });

    it("選択済み項目のテキストカラーが青色になる", () => {
      render(<OptionSelector {...defaultProps} selectedValue="option1" />);
      
      const selectedLabel = screen.getByText("選択肢1");
      const selectedDescription = screen.getByText("最初の選択肢");
      
      expect(selectedLabel).toHaveClass("text-blue-700");
      expect(selectedDescription).toHaveClass("text-blue-600");
    });

    it("未選択項目のテキストカラーがグレー色になる", () => {
      render(<OptionSelector {...defaultProps} selectedValue="option1" />);
      
      const unselectedLabel = screen.getByText("選択肢2");
      const unselectedDescription = screen.getByText("2番目の選択肢");
      
      expect(unselectedLabel).toHaveClass("text-gray-800");
      expect(unselectedDescription).toHaveClass("text-gray-600");
    });
  });

  describe("クリックイベント", () => {
    it("選択肢をクリックするとonValueChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(<OptionSelector {...defaultProps} onValueChange={handleValueChange} />);
      
      const option2 = screen.getByText("選択肢2").closest("div");
      if (option2) {
        await user.click(option2);
      }
      
      expect(handleValueChange).toHaveBeenCalledWith("option2");
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    it("異なる選択肢をクリックすると正しい値でonValueChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(<OptionSelector {...defaultProps} onValueChange={handleValueChange} />);
      
      const option3 = screen.getByText("選択肢3").closest("div");
      if (option3) {
        await user.click(option3);
      }
      
      expect(handleValueChange).toHaveBeenCalledWith("option3");
    });
  });

  describe("アイコン付き選択肢", () => {
    const optionsWithIcons = [
      {
        value: "black",
        label: "黒石",
        description: "先手プレイヤー",
        icon: <div data-testid="black-icon">●</div>,
      },
      {
        value: "white",
        label: "白石",
        description: "後手プレイヤー",
        icon: <div data-testid="white-icon">○</div>,
      },
    ];

    it("アイコンが正しく表示される", () => {
      render(
        <OptionSelector
          title="色選択"
          options={optionsWithIcons}
          selectedValue="black"
          onValueChange={vi.fn()}
        />
      );
      
      expect(screen.getByTestId("black-icon")).toBeInTheDocument();
      expect(screen.getByTestId("white-icon")).toBeInTheDocument();
    });

    it("アイコン付きレイアウトが適用される", () => {
      render(
        <OptionSelector
          title="色選択"
          options={optionsWithIcons}
          selectedValue="black"
          onValueChange={vi.fn()}
        />
      );
      
      const optionContainer = screen.getByTestId("black-icon").parentElement;
      expect(optionContainer).toHaveClass("flex", "items-center", "space-x-3");
    });
  });

  describe("ジェネリック型対応", () => {
    it("数値型の値で動作する", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      const numberOptions = [
        { value: 1, label: "レベル1", description: "基本" },
        { value: 2, label: "レベル2", description: "標準" },
      ];

      render(
        <OptionSelector
          title="レベル選択"
          options={numberOptions}
          selectedValue={1}
          onValueChange={handleValueChange}
        />
      );
      
      const option2 = screen.getByText("レベル2").closest("div");
      if (option2) {
        await user.click(option2);
      }
      
      expect(handleValueChange).toHaveBeenCalledWith(2);
    });

    it("文字列以外の複雑な型でも動作する", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      
      // ユニークなオブジェクトを作成
      const value1 = { id: 1, name: "test1" };
      const value2 = { id: 2, name: "test2" };
      
      const complexOptions = [
        { value: value1, label: "オプション1", description: "説明1" },
        { value: value2, label: "オプション2", description: "説明2" },
      ];

      render(
        <OptionSelector
          title="複雑な選択"
          options={complexOptions}
          selectedValue={value1}
          onValueChange={handleValueChange}
        />
      );
      
      const option2 = screen.getByText("オプション2").closest("div");
      if (option2) {
        await user.click(option2);
      }
      
      expect(handleValueChange).toHaveBeenCalledWith(value2);
    });
  });

  describe("スタイリング", () => {
    it("基本的なCSSクラスが適用される", () => {
      render(<OptionSelector {...defaultProps} />);
      
      const option = screen.getByText("選択肢1").closest('[class*="cursor-pointer"]');
      expect(option).toHaveClass("cursor-pointer");
      expect(option).toHaveClass("p-4");
      expect(option).toHaveClass("rounded-lg");
      expect(option).toHaveClass("border-2");
    });

    it("タイトルに適切なスタイルが適用される", () => {
      render(<OptionSelector {...defaultProps} />);
      
      const title = screen.getByText("テスト選択");
      expect(title).toHaveClass("text-lg", "font-semibold", "mb-3", "text-gray-700");
    });
  });

  describe("境界値テスト", () => {
    it("選択肢が1つの場合も正常に動作する", () => {
      const singleOption = [{ value: "only", label: "唯一", description: "唯一の選択肢" }];
      
      render(
        <OptionSelector
          title="単一選択"
          options={singleOption}
          selectedValue="only"
          onValueChange={vi.fn()}
        />
      );
      
      expect(screen.getByText("唯一")).toBeInTheDocument();
      expect(screen.getByText("唯一の選択肢")).toBeInTheDocument();
    });

    it("空の選択肢配列でもエラーにならない", () => {
      render(
        <OptionSelector
          title="空の選択"
          options={[]}
          selectedValue=""
          onValueChange={vi.fn()}
        />
      );
      
      expect(screen.getByText("空の選択")).toBeInTheDocument();
    });
  });
});