import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UndoButton } from "./UndoButton";

describe("UndoButton", () => {
  test("待ったボタンが表示される", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={true} 
        disabled={false} 
      />
    );

    expect(screen.getByText("待った")).toBeInTheDocument();
    expect(screen.getByTestId("undo-button")).toBeInTheDocument();
  });

  test("canUndoがtrueの時にボタンが有効", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={true} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    expect(button).not.toBeDisabled();
  });

  test("canUndoがfalseの時にボタンが無効", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={false} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    expect(button).toBeDisabled();
  });

  test("disabledがtrueの時にボタンが無効", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={true} 
        disabled={true} 
      />
    );

    const button = screen.getByTestId("undo-button");
    expect(button).toBeDisabled();
  });

  test("ボタンクリック時にonUndoが呼ばれる", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={true} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    fireEvent.click(button);

    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });

  test("無効状態ではクリックしてもonUndoが呼ばれない", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={false} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    fireEvent.click(button);

    expect(mockOnUndo).not.toHaveBeenCalled();
  });

  test("適切なスタイルクラスが適用される", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={true} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    expect(button).toHaveClass("undo-button");
  });

  test("無効状態では無効スタイルが適用される", () => {
    const mockOnUndo = vi.fn();
    
    render(
      <UndoButton 
        onUndo={mockOnUndo} 
        canUndo={false} 
        disabled={false} 
      />
    );

    const button = screen.getByTestId("undo-button");
    expect(button).toHaveClass("undo-button--disabled");
  });
});