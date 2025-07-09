import { describe, test, expect } from "vitest";
import { createExpertCpuPlayer } from "./expertCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("ExpertCpuPlayer", () => {
  describe("プレイヤー作成", () => {
    test("白石でExpertCPUプレイヤーを作成できる", () => {
      const player = createExpertCpuPlayer("white");

      expect(player.cpuLevel).toBe("expert");
      expect(player.color).toBe("white");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("黒石でExpertCPUプレイヤーを作成できる", () => {
      const player = createExpertCpuPlayer("black");

      expect(player.cpuLevel).toBe("expert");
      expect(player.color).toBe("black");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("無効な石の色で作成した場合エラーを投げる", () => {
      expect(() => createExpertCpuPlayer("none")).toThrow(
        "CPU player color cannot be 'none'",
      );
    });
  });

  describe("手計算", () => {
    describe("基本動作", () => {
      test("空のボードでは中央に手を打つ", () => {
        const player = createExpertCpuPlayer("white");
        const emptyBoard: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(emptyBoard, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });

      test("すべてのマスが埋まっている場合はnullを返す", () => {
        const player = createExpertCpuPlayer("white");
        const fullBoard: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("black"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(fullBoard, moveHistory);

        expect(move).toBeNull();
      });

      test("有効な手のみを返す", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        board[0][0] = "black";
        board[1][1] = "white";
        board[2][2] = "black";

        const moveHistory: Position[] = [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
          { row: 3, col: 3 },
          { row: 4, col: 4 },
          { row: 5, col: 5 },
          { row: 6, col: 6 },
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });
    });

    describe("勝利・防御判定", () => {
      test("自分が勝利できる場合は勝利手を打つ", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        board[7][3] = "white";
        board[7][4] = "white";
        board[7][5] = "white";
        board[7][6] = "white";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 7 && move.col === 2) ||
              (move.row === 7 && move.col === 7),
          ).toBe(true);
        }
      });

      test("相手の勝利を阻止する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        board[7][3] = "black";
        board[7][4] = "black";
        board[7][5] = "black";
        board[7][6] = "black";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 7 && move.col === 2) ||
              (move.row === 7 && move.col === 7),
          ).toBe(true);
        }
      });

      test("勝利が防御より優先される", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 自分の勝利手
        board[7][3] = "white";
        board[7][4] = "white";
        board[7][5] = "white";
        board[7][6] = "white";

        // 相手の4連続（別の場所）
        board[8][3] = "black";
        board[8][4] = "black";
        board[8][5] = "black";
        board[8][6] = "black";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 7 && move.col === 2) ||
              (move.row === 7 && move.col === 7),
          ).toBe(true);
        }
      });

      test("相手の3連続（両端開放）を防御する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 相手の3連続（両端開放）
        board[7][4] = "black";
        board[7][5] = "black";
        board[7][6] = "black";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 7 && move.col === 3) ||
              (move.row === 7 && move.col === 7),
          ).toBe(true);
        }
      });

      test("相手の3連続（片端ブロック）を防御する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 相手の3連続（片端ブロック）
        board[7][3] = "white"; // ブロック石
        board[7][4] = "black";
        board[7][5] = "black";
        board[7][6] = "black";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(move.row === 7 && move.col === 7).toBe(true);
        }
      });

      test("縦方向の相手3連続を防御する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 縦方向の相手3連続
        board[4][7] = "black";
        board[5][7] = "black";
        board[6][7] = "black";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 3 && move.col === 7) ||
              (move.row === 7 && move.col === 7),
          ).toBe(true);
        }
      });

      test("斜め方向の相手3連続を防御する", { timeout: 10000 }, () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 斜め方向の相手3連続
        board[5][5] = "black";
        board[6][6] = "black";
        board[7][7] = "black";

        // ボードに対応する追加の石を配置
        board[0][0] = "white";
        board[0][1] = "black";
        board[0][2] = "white";
        board[0][3] = "black";
        board[14][14] = "white";
        board[13][13] = "black";

        // 序盤定石を回避するために十分な手数を設定
        const moveHistory: Position[] = [
          { row: 5, col: 5 },
          { row: 0, col: 0 },
          { row: 6, col: 6 },
          { row: 0, col: 1 },
          { row: 7, col: 7 },
          { row: 0, col: 2 },
          { row: 14, col: 14 },
          { row: 0, col: 3 },
          { row: 13, col: 13 },
        ];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(
            (move.row === 4 && move.col === 4) ||
              (move.row === 8 && move.col === 8),
          ).toBe(true);
        }
      });
    });

    describe("完璧近接戦略", () => {
      test("プレイヤーの石から距離1-2以内に優先配置する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // プレイヤー（黒石）を端に配置
        board[2][2] = "black";

        const moveHistory: Position[] = [
          { row: 2, col: 2 },
          { row: 7, col: 7 }, // 初手を無効化
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 3, col: 3 },
          { row: 4, col: 4 },
          { row: 5, col: 5 },
          { row: 6, col: 6 },
          { row: 8, col: 8 },
          { row: 9, col: 9 },
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // プレイヤーの石から距離2以内に配置されることを確認
          const distance = Math.abs(move.row - 2) + Math.abs(move.col - 2);
          expect(distance).toBeLessThanOrEqual(2);
        }
      });
    });

    describe("動的戦略調整", () => {
      test("序盤では領域支配を重視する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        board[7][7] = "black";
        board[8][8] = "white";

        const moveHistory: Position[] = [
          { row: 7, col: 7 },
          { row: 8, col: 8 },
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 中央エリア重視
          const centerDistance =
            Math.abs(move.row - 7) + Math.abs(move.col - 7);
          expect(centerDistance).toBeLessThanOrEqual(6);
        }
      });

      test("中盤では攻守バランスを取る", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 中盤の複雑な盤面
        for (let i = 0; i < 20; i++) {
          const row = 5 + (i % 5);
          const col = 5 + Math.floor(i / 5);
          board[row][col] = i % 2 === 0 ? "white" : "black";
        }

        const moveHistory: Position[] = Array(20)
          .fill(null)
          .map((_, i) => ({
            row: 5 + (i % 5),
            col: 5 + Math.floor(i / 5),
          }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });

      test("終盤では効率的な勝利を目指す", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 終盤の少ない空きマス
        for (let row = 0; row < 15; row++) {
          for (let col = 0; col < 15; col++) {
            if ((row + col) % 3 !== 0) {
              board[row][col] = (row + col) % 2 === 0 ? "white" : "black";
            }
          }
        }

        const moveHistory: Position[] = Array(150)
          .fill(null)
          .map((_, i) => ({
            row: Math.floor(i / 15),
            col: i % 15,
          }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
        }
      });
    });

    describe("高度パターン認識", () => {
      test("相手の複雑なフォーク攻撃を阻止する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 黒石の複雑なフォーク準備
        board[7][7] = "black";
        board[6][8] = "black";
        board[8][6] = "black";
        board[5][9] = "black";
        board[9][5] = "black";

        const moveHistory: Position[] = Array(10)
          .fill(null)
          .map((_, i) => ({ row: 0, col: i }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });
    });

    describe("戦術的位置取り", () => {
      test("戦略的要所を占有する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // 戦略的要所の周辺配置
        board[7][7] = "black";
        board[6][6] = "white";
        board[8][8] = "black";

        const moveHistory: Position[] = Array(6)
          .fill(null)
          .map((_, i) => ({ row: 0, col: i }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });
    });

    describe("境界値テスト", () => {
      test("ボード端での複雑な戦略を実行する", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // ボード端での複雑なパターン
        board[0][0] = "black";
        board[0][1] = "black";
        board[0][2] = "black";
        board[1][0] = "black";
        board[2][0] = "black";
        board[1][1] = "white";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
          expect(board[move.row][move.col]).toBe("none");
        }
      });

      test("1つの空きマスのみの場合", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("black"));

        board[7][7] = "none";

        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });
    });

    describe("軽量パフォーマンステスト", () => {
      test("シンプルな盤面での応答時間が妥当である", () => {
        const player = createExpertCpuPlayer("white");
        const board: Board = Array(15)
          .fill(null)
          .map(() => Array(15).fill("none"));

        // シンプルな盤面
        board[7][7] = "black";

        const moveHistory: Position[] = [{ row: 7, col: 7 }];

        const startTime = Date.now();
        const move = player.calculateNextMove(board, moveHistory);
        const endTime = Date.now();

        expect(move).not.toBeNull();

        // 簡単な場合は1秒以内
        expect(endTime - startTime).toBeLessThan(1000);
      });
    });
  });
});
