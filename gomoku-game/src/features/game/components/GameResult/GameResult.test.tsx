import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { GameResult } from "./GameResult";

describe("GameResult", () => {
  const defaultProps = {
    showResult: true,
    winner: "black" as const,
    playerColor: "black" as const,
    onRestart: vi.fn(),
    onBackToMenu: vi.fn(),
  };

  test("プレイヤー勝利時に適切なアイコンとメッセージを表示する", () => {
    render(<GameResult {...defaultProps} />);

    expect(screen.getByText("🎉")).toBeInTheDocument();
    expect(screen.getByText("おめでとうございます！")).toBeInTheDocument();
    expect(screen.getByText("あなたの勝利です")).toBeInTheDocument();
  });

  test("プレイヤー敗北時に適切なアイコンとメッセージを表示する", () => {
    const props = {
      ...defaultProps,
      winner: "white" as const,
      playerColor: "black" as const,
    };
    
    render(<GameResult {...props} />);

    expect(screen.getByText("😔")).toBeInTheDocument();
    expect(screen.getByText("残念！")).toBeInTheDocument();
    expect(screen.getByText("CPUの勝利です")).toBeInTheDocument();
  });

  test("引き分け時に適切なアイコンとメッセージを表示する", () => {
    const props = {
      ...defaultProps,
      winner: null,
    };
    
    render(<GameResult {...props} />);

    expect(screen.getByText("🤝")).toBeInTheDocument();
    expect(screen.getByText("引き分けです")).toBeInTheDocument();
  });

  test("再戦ボタンをクリックするとonRestartが呼ばれる", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const props = {
      ...defaultProps,
      onRestart,
    };
    
    render(<GameResult {...props} />);
    
    const restartButton = screen.getByText("再戦");
    await user.click(restartButton);
    
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  test("設定変更ボタンをクリックするとonBackToMenuが呼ばれる", async () => {
    const user = userEvent.setup();
    const onBackToMenu = vi.fn();
    const props = {
      ...defaultProps,
      onBackToMenu,
    };
    
    render(<GameResult {...props} />);
    
    const backToMenuButton = screen.getByText("設定変更");
    await user.click(backToMenuButton);
    
    expect(onBackToMenu).toHaveBeenCalledTimes(1);
  });

  test("showResult=falseの時にコンポーネントが非表示になる", () => {
    const props = {
      ...defaultProps,
      showResult: false,
    };
    
    render(<GameResult {...props} />);
    
    expect(screen.queryByText("🎉")).not.toBeInTheDocument();
    expect(screen.queryByText("再戦")).not.toBeInTheDocument();
  });
});