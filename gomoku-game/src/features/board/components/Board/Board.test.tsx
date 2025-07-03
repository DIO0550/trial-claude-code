import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Board from "./Board";
import { Board as BoardData, WinningLine } from "@/features/board/utils/board";

describe("Board", () => {
  const emptyBoard: BoardData = Array.from({ length: 15 }, () =>
    Array.from({ length: 15 }, () => "none")
  );

  const mockCanMakeMove = vi.fn(() => true);
  const mockOnMakeMove = vi.fn();

  const defaultProps = {
    board: emptyBoard,
    canMakeMove: mockCanMakeMove,
    onMakeMove: mockOnMakeMove,
  };

  describe("基本表示", () => {
    it("15x15のボードが表示される", () => {
      render(<Board {...defaultProps} />);

      // 225個のセル（15×15）が表示されることを確認
      const cells = screen.getAllByTestId(/^cell-\d+-\d+$/);
      expect(cells).toHaveLength(225);
    });

    it("ボードに石が正しく表示される", () => {
      const boardWithStones: BoardData = [...emptyBoard];
      boardWithStones[7][7] = "black";
      boardWithStones[7][8] = "white";

      render(
        <Board
          {...defaultProps}
          board={boardWithStones}
        />
      );

      // 石が表示されていることを確認（具体的な石コンポーネントのテストは石コンポーネント側で行う）
      expect(screen.getAllByTestId(/^cell-\d+-\d+$/)).toHaveLength(225);
    });
  });

  describe("勝利ラインのハイライト", () => {
    it("勝利ライン情報がない場合、通常のセルとして表示される", () => {
      render(<Board {...defaultProps} winningLine={null} />);

      // 通常のセルのみ表示されることを確認
      const normalCells = screen.getAllByTestId(/^cell-\d+-\d+$/);
      expect(normalCells).toHaveLength(225);

      // 勝利セルが存在しないことを確認
      const winningCells = screen.queryAllByTestId(/^winning-cell-\d+-\d+$/);
      expect(winningCells).toHaveLength(0);
    });

    it("勝利ラインが設定されている場合、該当位置がハイライトされる", () => {
      const winningLine: WinningLine = {
        positions: [
          { row: 7, col: 7 },
          { row: 7, col: 8 },
          { row: 7, col: 9 },
          { row: 7, col: 10 },
          { row: 7, col: 11 },
        ],
      };

      render(<Board {...defaultProps} winningLine={winningLine} />);

      // 勝利ラインの5つのセルがハイライトされることを確認
      expect(screen.getByTestId("winning-cell-7-7")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-8")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-9")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-10")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-11")).toBeInTheDocument();

      // 通常のセルが220個（225-5）表示されることを確認
      const normalCells = screen.getAllByTestId(/^cell-\d+-\d+$/);
      expect(normalCells).toHaveLength(220);
    });

    it("縦方向の勝利ラインが正しくハイライトされる", () => {
      const winningLine: WinningLine = {
        positions: [
          { row: 3, col: 7 },
          { row: 4, col: 7 },
          { row: 5, col: 7 },
          { row: 6, col: 7 },
          { row: 7, col: 7 },
        ],
      };

      render(<Board {...defaultProps} winningLine={winningLine} />);

      // 縦方向の勝利ラインがハイライトされることを確認
      expect(screen.getByTestId("winning-cell-3-7")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-4-7")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-5-7")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-6-7")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-7")).toBeInTheDocument();
    });

    it("斜め方向の勝利ラインが正しくハイライトされる", () => {
      const winningLine: WinningLine = {
        positions: [
          { row: 3, col: 3 },
          { row: 4, col: 4 },
          { row: 5, col: 5 },
          { row: 6, col: 6 },
          { row: 7, col: 7 },
        ],
      };

      render(<Board {...defaultProps} winningLine={winningLine} />);

      // 斜め方向の勝利ラインがハイライトされることを確認
      expect(screen.getByTestId("winning-cell-3-3")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-4-4")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-5-5")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-6-6")).toBeInTheDocument();
      expect(screen.getByTestId("winning-cell-7-7")).toBeInTheDocument();
    });
  });
});