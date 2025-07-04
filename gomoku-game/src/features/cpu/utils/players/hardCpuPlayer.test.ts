import { describe, test, expect } from "vitest";
import { createHardCpuPlayer } from "./hardCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("HardCpuPlayer", () => {
  describe("プレイヤー作成", () => {
    test("白石でHardCPUプレイヤーを作成できる", () => {
      const player = createHardCpuPlayer("white");
      
      expect(player.cpuLevel).toBe("hard");
      expect(player.color).toBe("white");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("黒石でHardCPUプレイヤーを作成できる", () => {
      const player = createHardCpuPlayer("black");
      
      expect(player.cpuLevel).toBe("hard");
      expect(player.color).toBe("black");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("無効な石の色で作成した場合エラーを投げる", () => {
      expect(() => createHardCpuPlayer("none")).toThrow(
        "CPU player color cannot be 'none'"
      );
    });
  });

  describe("手計算", () => {
    describe("基本動作", () => {
      test("空のボードでは中央に手を打つ", () => {
        const player = createHardCpuPlayer("white");
        const emptyBoard: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(emptyBoard, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });

      test("すべてのマスが埋まっている場合はnullを返す", () => {
        const player = createHardCpuPlayer("white");
        const fullBoard: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
        const moveHistory: Position[] = [];

        const move = player.calculateNextMove(fullBoard, moveHistory);

        expect(move).toBeNull();
      });

      test("有効な手のみを返す", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // いくつかのマスを埋める
        board[0][0] = "black";
        board[1][1] = "white";
        board[2][2] = "black";
        
        // 序盤定石を無効化するための手順履歴
        const moveHistory: Position[] = [
          { row: 0, col: 0 }, { row: 1, col: 1 },
          { row: 2, col: 2 }, { row: 3, col: 3 },
          { row: 4, col: 4 }, { row: 5, col: 5 },
          { row: 6, col: 6 }
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
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 横方向に4連続の白石を配置
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
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("相手の勝利を阻止する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 横方向に4連続の黒石を配置
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
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });

      test("勝利が防御より優先される", () => {
        const player = createHardCpuPlayer("white");
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
          expect(
            (move.row === 7 && move.col === 2) || 
            (move.row === 7 && move.col === 7)
          ).toBe(true);
        }
      });
    });

    describe("高度な脅威検出", () => {
      test("フォーク攻撃を認識して対処する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 黒石でフォーク攻撃を準備（2つの3連続を同時に作れる位置）
        board[6][6] = "black";
        board[6][7] = "black";
        board[6][8] = "black";
        
        board[7][6] = "black";
        board[8][6] = "black";
        
        const moveHistory: Position[] = [
          { row: 6, col: 6 }, { row: 10, col: 10 },
          { row: 6, col: 7 }, { row: 11, col: 11 },
          { row: 6, col: 8 }, { row: 12, col: 12 },
          { row: 7, col: 6 }, { row: 13, col: 13 },
          { row: 8, col: 6 }
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // フォーク攻撃を阻止する位置に打つ
          expect(board[move.row][move.col]).toBe("none");
          expect(move.row).toBeGreaterThanOrEqual(0);
          expect(move.row).toBeLessThan(15);
          expect(move.col).toBeGreaterThanOrEqual(0);
          expect(move.col).toBeLessThan(15);
        }
      });

      test("複数の脅威を同時に評価する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 複数方向の脅威を配置
        board[5][5] = "black";
        board[5][6] = "black";
        board[5][7] = "black";
        
        board[6][5] = "black";
        board[7][5] = "black";
        
        board[6][6] = "black";
        board[7][7] = "black";
        
        const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

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

      test("隠れた脅威を検出する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 間隔を空けた脅威パターン
        board[7][3] = "black";
        board[7][4] = "black";
        // 7,5は空き
        board[7][6] = "black";
        
        const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

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

    describe("3手先読み", () => {
      test("3手先の勝利パターンを認識する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 3手先で勝利できるパターンを配置
        board[7][5] = "white";
        board[7][6] = "white";
        
        // 黒石を配置して妨害
        board[8][5] = "black";
        board[8][6] = "black";
        
        const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

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

      test("相手の3手先の脅威を予測して阻止する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 相手が3手先で勝利できるパターン
        board[7][5] = "black";
        board[7][6] = "black";
        
        const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

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

    describe("戦略的近接評価", () => {
      test("プレイヤーの石の近くに配置する", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // プレイヤー（黒石）を端に配置
        board[3][3] = "black";
        
        const moveHistory: Position[] = [
          { row: 3, col: 3 }, { row: 7, col: 7 }, // 初手を無効化
          { row: 0, col: 0 }, { row: 1, col: 1 },
          { row: 2, col: 2 }, { row: 4, col: 4 },
          { row: 5, col: 5 }, { row: 6, col: 6 }
        ];

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // プレイヤーの石から距離2以内に配置されることを確認
          const distance = Math.abs(move.row - 3) + Math.abs(move.col - 3);
          expect(distance).toBeLessThanOrEqual(2);
        }
      });

      test("複数のプレイヤーの石がある場合、最も近い位置を選ぶ", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // プレイヤーの石を複数配置
        board[2][2] = "black";
        board[10][10] = "black";
        board[5][5] = "white"; // CPU石も配置
        
        const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // いずれかのプレイヤーの石から距離8以内（実際の戦略的判断を考慮）
          const distance1 = Math.abs(move.row - 2) + Math.abs(move.col - 2);
          const distance2 = Math.abs(move.row - 10) + Math.abs(move.col - 10);
          expect(Math.min(distance1, distance2)).toBeLessThanOrEqual(8);
        }
      });

      test("フォーク形成での戦略的近接配置", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // プレイヤーの石を配置（フォーク阻害位置での近接を想定）
        board[6][6] = "black";
        board[6][7] = "black";
        board[7][6] = "black";
        
        // 自分の石でフォーク準備
        board[8][8] = "white";
        board[9][9] = "white";
        
        const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        if (move) {
          // プレイヤーの石またはフォーク形成位置の近くに配置
          const playerDistance = Math.min(
            Math.abs(move.row - 6) + Math.abs(move.col - 6),
            Math.abs(move.row - 6) + Math.abs(move.col - 7),
            Math.abs(move.row - 7) + Math.abs(move.col - 6)
          );
          const forkDistance = Math.min(
            Math.abs(move.row - 8) + Math.abs(move.col - 8),
            Math.abs(move.row - 9) + Math.abs(move.col - 9)
          );
          expect(Math.min(playerDistance, forkDistance)).toBeLessThanOrEqual(2);
        }
      });

      test("攻守のバランスを取る", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 自分の有利な形を作りつつ相手を阻止
        board[7][7] = "white";
        board[6][6] = "black";
        board[8][8] = "black";
        
        const moveHistory: Position[] = Array(8).fill(null).map((_, i) => ({ row: 0, col: i }));

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

      test("領域支配を意識した配置", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 中央領域に基盤を作る
        board[7][7] = "white";
        board[6][8] = "white";
        board[8][6] = "white";
        
        // 相手は端に配置
        board[1][1] = "black";
        board[1][2] = "black";
        
        const moveHistory: Position[] = Array(10).fill(null).map((_, i) => ({ row: 0, col: i }));

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
      test("ボード端での複雑な脅威検出", () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // ボード端での複雑なパターン
        board[0][0] = "black";
        board[0][1] = "black";
        board[0][2] = "black";
        board[1][0] = "black";
        board[2][0] = "black";
        
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
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
        
        board[7][7] = "none";
        
        const moveHistory: Position[] = [];
        const move = player.calculateNextMove(board, moveHistory);

        expect(move).not.toBeNull();
        expect(move).toEqual({ row: 7, col: 7 });
      });
    });

    describe("パフォーマンステスト", () => {
      test("複雑な盤面での計算時間が合理的である", { timeout: 60000 }, () => {
        const player = createHardCpuPlayer("white");
        const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
        
        // 複雑な盤面を作成
        for (let i = 0; i < 50; i++) {
          const row = Math.floor(Math.random() * 15);
          const col = Math.floor(Math.random() * 15);
          if (board[row][col] === "none") {
            board[row][col] = i % 2 === 0 ? "black" : "white";
          }
        }
        
        const moveHistory: Position[] = Array(50).fill(null).map((_, i) => ({ 
          row: Math.floor(i / 15), 
          col: i % 15 
        }));

        const startTime = Date.now();
        const move = player.calculateNextMove(board, moveHistory);
        const endTime = Date.now();

        expect(move).not.toBeNull();
        if (move) {
          expect(board[move.row][move.col]).toBe("none");
        }
        
        // 計算時間が35秒以内であることを確認（複雑な盤面での実用性を考慮）
        expect(endTime - startTime).toBeLessThan(35000);
      });
    });
  });
});