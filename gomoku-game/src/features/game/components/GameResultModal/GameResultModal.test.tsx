import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, beforeEach, expect, vi } from "vitest";
import { GameResultModal } from "./GameResultModal";

describe("GameResultModal", () => {
  const mockOnRestart = vi.fn();
  const mockOnBackToMenu = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("プレイヤー勝利時に適切なメッセージが表示される", () => {
    render(
      <GameResultModal
        isOpen={true}
        winner="black"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.getByText("おめでとうございます！")).toBeInTheDocument();
    expect(screen.getByText("あなたの勝利です")).toBeInTheDocument();
  });

  test("CPU勝利時に適切なメッセージが表示される", () => {
    render(
      <GameResultModal
        isOpen={true}
        winner="white"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.getByText("残念！")).toBeInTheDocument();
    expect(screen.getByText("CPUの勝利です")).toBeInTheDocument();
  });

  test("引き分け時に適切なメッセージが表示される", () => {
    render(
      <GameResultModal
        isOpen={true}
        winner={null}
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.getByText("引き分けです")).toBeInTheDocument();
  });

  test("再戦ボタンをクリックするとonRestartが呼ばれる", () => {
    render(
      <GameResultModal
        isOpen={true}
        winner="black"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    const restartButton = screen.getByText("再戦");
    fireEvent.click(restartButton);

    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  test("設定変更ボタンをクリックするとonBackToMenuが呼ばれる", () => {
    render(
      <GameResultModal
        isOpen={true}
        winner="black"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    const backToMenuButton = screen.getByText("設定変更");
    fireEvent.click(backToMenuButton);

    expect(mockOnBackToMenu).toHaveBeenCalledTimes(1);
  });

  test("isOpenがfalseの時にモーダルが表示されない", () => {
    render(
      <GameResultModal
        isOpen={false}
        winner="black"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.queryByText("おめでとうございます！")).not.toBeInTheDocument();
    expect(screen.queryByText("再戦")).not.toBeInTheDocument();
  });

  test("勝利メッセージに応じた適切なアイコンが表示される", () => {
    const { rerender } = render(
      <GameResultModal
        isOpen={true}
        winner="black"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    // 勝利時のアイコン
    expect(screen.getByText("🎉")).toBeInTheDocument();

    // 敗北時のアイコン
    rerender(
      <GameResultModal
        isOpen={true}
        winner="white"
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.getByText("😔")).toBeInTheDocument();

    // 引き分け時のアイコン
    rerender(
      <GameResultModal
        isOpen={true}
        winner={null}
        playerColor="black"
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />
    );

    expect(screen.getByText("🤝")).toBeInTheDocument();
  });
});