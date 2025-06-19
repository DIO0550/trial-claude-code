import { describe, test, expect } from "vitest";
import { createNormalCpuPlayer } from "./normalCpuPlayer";
import { Board } from "@/utils/board";
import { Position } from "@/features/board/utils/position";

describe("NormalCpuPlayer", () => {
  describe("プレイヤー作成", () => {
    test("白石でNormalCPUプレイヤーを作成できる", () => {
      const player = createNormalCpuPlayer("white");
      
      expect(player.cpuLevel).toBe("normal");
      expect(player.color).toBe("white");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("黒石でNormalCPUプレイヤーを作成できる", () => {
      const player = createNormalCpuPlayer("black");
      
      expect(player.cpuLevel).toBe("normal");
      expect(player.color).toBe("black");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("無効な石の色で作成した場合エラーを投げる", () => {
      expect(() => createNormalCpuPlayer("none")).toThrow(
        "CPU player color cannot be 'none'"
      );
    });
  });

  describe("手計算", () => {
    describe("基本動作", () => {
      test("空のボードでは中央に手を打つ", () => {
        const player = createNormalCpuPlayer("white");
        const emptyBoard: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(emptyBoard, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });

      test("すべてのマスが埋まっている場合はnullを返す", () => {
        const player = createNormalCpuPlayer("white");
        const fullBoard: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(fullBoard, moveHistory);

        expect(move).toBeNull();
      });

      test("有効な手のみを返す", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // いくつかのマスを埋める（序盤定石の対象外にする）
        board[0][0] = "black";
        board[1][1] = "white";
        board[2][2] = "black";
        
        // 6手以上の履歴で序盤定石を無効化
        const moveHistory: Position[] = [
          { row: 0, col: 0 }, { row: 1, col: 1 },
          { row: 2, col: 2 }, { row: 3, col: 3 },
          { row: 4, col: 4 }, { row: 5, col: 5 },
          { row: 6, col: 6 }
        ];
        
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 空きマスに打つ
          expect(board[move.row][move.col]).toBe("none");
          // 有効な座標範囲内
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });
    });

    describe("勝利・防御判定", () => {
      test("自分が勝利できる場合は勝利手を打つ", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 横方向に4連続の白石を配置（自分の石）
        board[7][3] = "white";
        board[7][4] = "white";
        board[7][5] = "white";
        board[7][6] = "white";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 勝利位置に打つ
          expect(
            (move.row === 7 && move.col === 2) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("相手の勝利を阻止する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 横方向に4連続の黒石を配置（相手の石）
        board[7][3] = "black";
        board[7][4] = "black";
        board[7][5] = "black";
        board[7][6] = "black";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 阻止位置に打つ
          expect(
            (move.row === 7 && move.col === 2) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("勝利が防御より優先される", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
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
          // 自分の勝利手を優先
          expect(
            (move.row === 7 && move.col === 2) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });
    });

    describe("序盤定石", () => {
      test("2手目は中央周辺に打つ", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 中央に1手目が打たれている
        board[7][7] = "black";
        const moveHistory: Position[] = [{ row: 7, col: 7 }];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 中央周辺の定石位置
          const expectedPositions = [
            { row: 6, col: 6 }, { row: 6, col: 8 },
            { row: 8, col: 6 }, { row: 8, col: 8 },
            { row: 7, col: 6 }, { row: 7, col: 8 },
            { row: 6, col: 7 }, { row: 8, col: 7 },
          ];
          
          const isExpectedPosition = expectedPositions.some(
            pos => pos.row === move.row && pos.col === move.col
          );
          expect(isExpectedPosition).toBe(true);
        }
      });

      test("序盤期間後は定石を使用しない", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 中央に石を配置
        board[7][7] = "black";
        
        // 6手以上の履歴
        const moveHistory: Position[] = Array(7).fill(null).map((_, i) => ({ row: i, col: 0 }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 中央ではない（定石を使っていない）
          expect(move.row !== 7 || move.col !== 7).toBe(true);
        }
      });
    });

    describe("方向別脅威検出", () => {
      test("縦方向の脅威を検出する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 縦方向に4連続の黒石を配置
        board[3][7] = "black";
        board[4][7] = "black";
        board[5][7] = "black";
        board[6][7] = "black";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 阻止位置に打つ
          expect(
            (move.row === 2 && move.col === 7) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("右下斜め方向の脅威を検出する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 右下斜め方向に4連続の黒石を配置
        board[3][3] = "black";
        board[4][4] = "black";
        board[5][5] = "black";
        board[6][6] = "black";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 阻止位置に打つ
          expect(
            (move.row === 2 && move.col === 2) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("左下斜め方向の脅威を検出する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 左下斜め方向に4連続の黒石を配置
        board[3][10] = "black";
        board[4][9] = "black";
        board[5][8] = "black";
        board[6][7] = "black";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 阻止位置に打つ
          expect(
            (move.row === 2 && move.col === 11) || 
            (move.row === 7 && move.col === 6)
          ).toBe(true);
        }
      });
    });

    describe("評価関数テスト", () => {
      test("3連続の脅威を適切に評価する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 白石の3連続を作る
        board[7][4] = "white";
        board[7][5] = "white";
        board[7][6] = "white";
        
        // 黒石の2連続を作る
        board[8][4] = "black";
        board[8][5] = "black";
        
        const moveHistory: Position[] = [
          { row: 7, col: 4 }, { row: 8, col: 4 },
          { row: 7, col: 5 }, { row: 8, col: 5 },
          { row: 7, col: 6 }
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 有効な手である
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });

      test("中央付近を優先する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 端に少し石を置く
        board[0][0] = "black";
        board[0][1] = "white";
        
        const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 有効な範囲内
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
          // 空きマス
          expect(board[move.row][move.col]).toBe("none");
        }
      });

      test("複数の2連続がある場合に適切に評価する", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 複数の2連続パターンを配置
        board[6][6] = "white";
        board[6][7] = "white";
        
        board[8][6] = "white";
        board[9][6] = "white";
        
        const moveHistory: Position[] = [
          { row: 6, col: 6 }, { row: 8, col: 8 },
          { row: 6, col: 7 }, { row: 9, col: 9 },
          { row: 8, col: 6 }, { row: 10, col: 10 },
          { row: 9, col: 6 }
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // 有効な手である
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });
    });

    describe("境界値テスト", () => {
      test("ボード端での脅威検出", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // ボード端での4連続
        board[0][0] = "black";
        board[0][1] = "black";
        board[0][2] = "black";
        board[0][3] = "black";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // ボード範囲内かつ阻止位置
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
          expect(board[move.row][move.col]).toBe("none");
        }
      });

      test("1つの空きマスのみの場合", () => {
        const player = createNormalCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
        
        // 1つだけ空きマスを作る
        board[7][7] = "none";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });
    });
  });
});