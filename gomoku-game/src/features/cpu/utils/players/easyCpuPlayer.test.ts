import { describe, test, expect } from "vitest";
import { createEasyCpuPlayer } from "./easyCpuPlayer";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

describe("EasyCpuPlayer", () => {
  describe("作成", () => {
    test("白石でEasyCPUプレイヤーを作成できる", () => {
      const player = createEasyCpuPlayer("white");
      
      expect(player.cpuLevel).toBe("easy");
      expect(player.color).toBe("white");
      expect(typeof player.calculateNextMove).toBe("function");
    });

    test("黒石でEasyCPUプレイヤーを作成できる", () => {
      const player = createEasyCpuPlayer("black");
      
      expect(player.cpuLevel).toBe("easy");
      expect(player.color).toBe("black");
      expect(typeof player.calculateNextMove).toBe("function");
    });
  });

  describe("calculateNextMove", () => {
    test("空のボードでは中央付近に手を打つ", () => {
      const player = createEasyCpuPlayer("white");
      const emptyBoard: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      const moveHistory: Position[] = [];

      const move = player.calculateNextMove(emptyBoard, moveHistory);

      expect(move).not.toBeNull();
      if (move) {
        // 中央（7,7）から半径3以内に打つ
        const centerDistance = Math.abs(move.row - 7) + Math.abs(move.col - 7);
        expect(centerDistance).toBeLessThanOrEqual(3);
      }
    });

    test("すべてのマスが埋まっている場合はnullを返す", () => {
      const player = createEasyCpuPlayer("white");
      const fullBoard: Board = Array(15).fill(null).map(() => Array(15).fill("black"));
      const moveHistory: Position[] = [];

      const move = player.calculateNextMove(fullBoard, moveHistory);

      expect(move).toBeNull();
    });

    test("相手が4連続で並んでいる場合は阻止する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 横方向に4連続の黒石を配置（相手の石）
      board[7][3] = "black";
      board[7][4] = "black";
      board[7][5] = "black";
      board[7][6] = "black";
      // 阻止ポイント: (7, 2) または (7, 7)
      
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

    test("自分が4連続で並んでいる場合は勝利する", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // 横方向に4連続の白石を配置（自分の石）
      board[7][3] = "white";
      board[7][4] = "white";
      board[7][5] = "white";
      board[7][6] = "white";
      // 勝利ポイント: (7, 2) または (7, 7)
      
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

    test("縦方向の4連続も検出する", () => {
      const player = createEasyCpuPlayer("white");
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

    test("斜め方向の4連続も検出する", () => {
      const player = createEasyCpuPlayer("white");
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

    test("有効な空きマスのみに手を打つ", () => {
      const player = createEasyCpuPlayer("white");
      const board: Board = Array(15).fill(null).map(() => Array(15).fill("none"));
      
      // いくつかのマスを埋める
      board[0][0] = "black";
      board[1][1] = "white";
      board[7][7] = "black";
      
      const moveHistory: Position[] = [];
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

  describe("対戦感向上のテスト", () => {
    test("初手（空盤面）では中央付近（7±2範囲）に配置する", () => {
      const player = createEasyCpuPlayer("black");
      const board = Board.createEmpty();
      const moveHistory: Position[] = [];

      // Board.isEmptyがtrueであることを確認
      expect(Board.isEmpty(board)).toBe(true);

      // 複数回テストして、すべて中央付近（7±2の範囲）に配置されることを確認
      for (let i = 0; i < 10; i++) {
        const move = player.calculateNextMove(board, moveHistory);
        
        expect(move).not.toBeNull();
        expect(move!.row).toBeGreaterThanOrEqual(5); // 7-2
        expect(move!.row).toBeLessThanOrEqual(9);    // 7+2
        expect(move!.col).toBeGreaterThanOrEqual(5); // 7-2
        expect(move!.col).toBeLessThanOrEqual(9);    // 7+2
      }
    });

    test("勝利・防御手がない場合、プレイヤーの石の近く（2-3マス以内）に配置する", () => {
      const player = createEasyCpuPlayer("black");
      
      // 複数回テストして、プレイヤーの石から2-3マス以内に配置されることを確認
      let proximityCount = 0;
      const testRuns = 20;

      for (let i = 0; i < testRuns; i++) {
        const testBoard = Board.createEmpty();
        // プレイヤー（白）の石を配置（勝利・防御に関係ない位置）
        testBoard[5][5] = "white";
        testBoard[9][9] = "white";
        const moveHistory: Position[] = [
          { row: 5, col: 5 },
          { row: 9, col: 9 }
        ];
        
        const move = player.calculateNextMove(testBoard, moveHistory);
        
        expect(move).not.toBeNull();
        
        // どちらかの白石から3マス以内かチェック
        const row1Distance = Math.abs(move!.row - 5);
        const col1Distance = Math.abs(move!.col - 5);
        const row2Distance = Math.abs(move!.row - 9);
        const col2Distance = Math.abs(move!.col - 9);
        
        const isNearFirst = row1Distance <= 3 && col1Distance <= 3;
        const isNearSecond = row2Distance <= 3 && col2Distance <= 3;
        
        if (isNearFirst || isNearSecond) {
          proximityCount++;
        }
      }

      // 70%以上は近接位置に配置されるべき（EasyはBeginnerより少し低め）
      expect(proximityCount / testRuns).toBeGreaterThan(0.7);
    });

    test("勝利手が優先される（近接配置より優先度が高い）", () => {
      const player = createEasyCpuPlayer("white");
      const board = Board.createEmpty();
      
      // 自分（白）の勝利手を作成
      board[7][3] = "white";
      board[7][4] = "white";
      board[7][5] = "white";
      board[7][6] = "white";
      // 勝利位置: (7,2) または (7,7)
      
      // プレイヤー（黒）の石を離れた場所に配置
      board[1][1] = "black";
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      // 勝利手を優先（近接配置よりも優先度が高い）
      expect(
        (move!.row === 7 && move!.col === 2) || 
        (move!.row === 7 && move!.col === 7)
      ).toBe(true);
    });

    test("防御手が優先される（近接配置より優先度が高い）", () => {
      const player = createEasyCpuPlayer("white");
      const board = Board.createEmpty();
      
      // 相手（黒）の脅威を作成
      board[7][3] = "black";
      board[7][4] = "black";
      board[7][5] = "black";
      board[7][6] = "black";
      // 阻止位置: (7,2) または (7,7)
      
      // 自分（白）の石を離れた場所に配置
      board[1][1] = "white";
      
      const moveHistory: Position[] = [];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      // 防御手を優先（近接配置よりも優先度が高い）
      expect(
        (move!.row === 7 && move!.col === 2) || 
        (move!.row === 7 && move!.col === 7)
      ).toBe(true);
    });

    test("近接位置がない場合はフォールバックでランダム配置する", () => {
      const player = createEasyCpuPlayer("black");
      const board = Board.createEmpty();
      
      // プレイヤーの石を角に配置し、周囲を埋める（近接位置を作らない）
      board[0][0] = "white";
      // 周囲3マス以内をすべて埋める
      for (let row = 0; row <= 3; row++) {
        for (let col = 0; col <= 3; col++) {
          if (!(row === 0 && col === 0)) {
            board[row][col] = "black";
          }
        }
      }
      
      const moveHistory: Position[] = [{ row: 0, col: 0 }];
      const move = player.calculateNextMove(board, moveHistory);

      expect(move).not.toBeNull();
      expect(Position.isValid(move!)).toBe(true);
      expect(board[move!.row][move!.col]).toBe("none");
      
      // 近接範囲外に配置されることを確認
      const rowDistance = Math.abs(move!.row - 0);
      const colDistance = Math.abs(move!.col - 0);
      expect(rowDistance > 3 || colDistance > 3).toBe(true);
    });
  });
});