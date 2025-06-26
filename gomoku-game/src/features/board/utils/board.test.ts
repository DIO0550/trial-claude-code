import { describe, it, expect } from "vitest";
import { Board } from "./board";

describe("Board", () => {
  describe("createEmpty", () => {
    it("15x15の空のボードを作成する", () => {
      const board = Board.createEmpty();
      
      expect(board).toHaveLength(15);
      expect(board[0]).toHaveLength(15);
      
      // 全てのセルが"none"で初期化されていることを確認
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          expect(board[row][col]).toBe("none");
        }
      }
    });

    it("新しい配列インスタンスを返す", () => {
      const board1 = Board.createEmpty();
      const board2 = Board.createEmpty();
      
      expect(board1).not.toBe(board2);
      expect(board1[0]).not.toBe(board2[0]);
    });
  });

  describe("isValidPosition", () => {
    describe("正常系", () => {
      it("有効な座標でtrueを返す", () => {
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(7, 7)).toBe(true);
        expect(Board.isValidPosition(14, 14)).toBe(true);
      });

      it("境界値の座標でtrueを返す", () => {
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(0, 14)).toBe(true);
        expect(Board.isValidPosition(14, 0)).toBe(true);
        expect(Board.isValidPosition(14, 14)).toBe(true);
      });
    });

    describe("異常系", () => {
      it("負の座標でfalseを返す", () => {
        expect(Board.isValidPosition(-1, 0)).toBe(false);
        expect(Board.isValidPosition(0, -1)).toBe(false);
        expect(Board.isValidPosition(-1, -1)).toBe(false);
      });

      it("範囲外の座標でfalseを返す", () => {
        expect(Board.isValidPosition(15, 0)).toBe(false);
        expect(Board.isValidPosition(0, 15)).toBe(false);
        expect(Board.isValidPosition(15, 15)).toBe(false);
      });

      it("大きく範囲外の座標でfalseを返す", () => {
        expect(Board.isValidPosition(100, 50)).toBe(false);
        expect(Board.isValidPosition(-10, -5)).toBe(false);
      });
    });

    describe("境界値テスト", () => {
      it("境界値直前はtrue、境界値はfalse", () => {
        // 上限境界
        expect(Board.isValidPosition(14, 14)).toBe(true);
        expect(Board.isValidPosition(15, 14)).toBe(false);
        expect(Board.isValidPosition(14, 15)).toBe(false);
        
        // 下限境界
        expect(Board.isValidPosition(0, 0)).toBe(true);
        expect(Board.isValidPosition(-1, 0)).toBe(false);
        expect(Board.isValidPosition(0, -1)).toBe(false);
      });
    });

    describe("引数の型テスト", () => {
      it("小数点を含む数値でfalseを返す", () => {
        expect(Board.isValidPosition(7.5, 7)).toBe(false);
        expect(Board.isValidPosition(7, 7.5)).toBe(false);
      });

      it("非常に大きな数値でfalseを返す", () => {
        expect(Board.isValidPosition(Number.MAX_SAFE_INTEGER, 7)).toBe(false);
        expect(Board.isValidPosition(7, Number.MAX_SAFE_INTEGER)).toBe(false);
      });
    });
  });

  describe("isEmpty", () => {
    it("空のボードに対してtrueを返す", () => {
      const board = Board.createEmpty();
      
      expect(Board.isEmpty(board)).toBe(true);
    });

    it("石が1つでも置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      
      expect(Board.isEmpty(board)).toBe(false);
    });

    it("複数の石が置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      board[7][8] = "white";
      board[8][7] = "black";
      
      expect(Board.isEmpty(board)).toBe(false);
    });

    it("全ての位置に石が置かれたボードに対してfalseを返す", () => {
      const board = Board.createEmpty();
      
      // 全ての位置に石を配置
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          board[row][col] = (row + col) % 2 === 0 ? "black" : "white";
        }
      }
      
      expect(Board.isEmpty(board)).toBe(false);
    });
  });

  describe("getStonePositions", () => {
    it("指定された色の石の位置を全て取得する", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      board[8][8] = "black";
      board[9][9] = "white";
      
      const blackPositions = Board.getStonePositions(board, "black");
      const whitePositions = Board.getStonePositions(board, "white");
      
      expect(blackPositions).toHaveLength(2);
      expect(blackPositions).toContainEqual({ row: 7, col: 7 });
      expect(blackPositions).toContainEqual({ row: 8, col: 8 });
      
      expect(whitePositions).toHaveLength(1);
      expect(whitePositions).toContainEqual({ row: 9, col: 9 });
    });

    it("該当する色の石がない場合は空配列を返す", () => {
      const board = Board.createEmpty();
      board[7][7] = "black";
      
      const whitePositions = Board.getStonePositions(board, "white");
      const nonePositions = Board.getStonePositions(board, "none");
      
      expect(whitePositions).toHaveLength(0);
      expect(nonePositions.length).toBeGreaterThan(0); // 空きマスは多数ある
    });

    it("空のボードで'none'を指定すると全位置を返す", () => {
      const board = Board.createEmpty();
      
      const nonePositions = Board.getStonePositions(board, "none");
      
      expect(nonePositions).toHaveLength(15 * 15);
    });
  });

  describe("getNearbyPositions", () => {
    it("指定位置から半径1の近接位置を取得する", () => {
      const centerPosition = { row: 7, col: 7 };
      const nearbyPositions = Board.getNearbyPositions(centerPosition, 1);
      
      // 3x3 = 9個の位置が返される
      expect(nearbyPositions).toHaveLength(9);
      
      // 中央が最初に来る（距離0）
      expect(nearbyPositions[0]).toEqual({ row: 7, col: 7 });
      
      // 距離1の位置が含まれる
      expect(nearbyPositions).toContainEqual({ row: 6, col: 7 });
      expect(nearbyPositions).toContainEqual({ row: 8, col: 7 });
      expect(nearbyPositions).toContainEqual({ row: 7, col: 6 });
      expect(nearbyPositions).toContainEqual({ row: 7, col: 8 });
    });

    it("指定位置から半径2の近接位置を取得する", () => {
      const centerPosition = { row: 7, col: 7 };
      const nearbyPositions = Board.getNearbyPositions(centerPosition, 2);
      
      // 5x5 = 25個の位置が返される
      expect(nearbyPositions).toHaveLength(25);
      
      // 中央が最初に来る
      expect(nearbyPositions[0]).toEqual({ row: 7, col: 7 });
      
      // 半径2の範囲が含まれる
      expect(nearbyPositions).toContainEqual({ row: 5, col: 7 });
      expect(nearbyPositions).toContainEqual({ row: 9, col: 7 });
      expect(nearbyPositions).toContainEqual({ row: 7, col: 5 });
      expect(nearbyPositions).toContainEqual({ row: 7, col: 9 });
    });

    it("ボード端での近接位置を取得する（範囲外は除外される）", () => {
      const cornerPosition = { row: 0, col: 0 };
      const nearbyPositions = Board.getNearbyPositions(cornerPosition, 1);
      
      // 角なので4個のみ（3x3のうち4個が有効）
      expect(nearbyPositions).toHaveLength(4);
      
      // 有効な位置のみ含まれる
      expect(nearbyPositions).toContainEqual({ row: 0, col: 0 });
      expect(nearbyPositions).toContainEqual({ row: 0, col: 1 });
      expect(nearbyPositions).toContainEqual({ row: 1, col: 0 });
      expect(nearbyPositions).toContainEqual({ row: 1, col: 1 });
    });

    it("距離順にソートされる", () => {
      const centerPosition = { row: 7, col: 7 };
      const nearbyPositions = Board.getNearbyPositions(centerPosition, 2);
      
      // 距離を計算して順序を確認
      for (let i = 1; i < nearbyPositions.length; i++) {
        const prevDistance = Math.abs(nearbyPositions[i-1].row - 7) + Math.abs(nearbyPositions[i-1].col - 7);
        const currentDistance = Math.abs(nearbyPositions[i].row - 7) + Math.abs(nearbyPositions[i].col - 7);
        expect(currentDistance).toBeGreaterThanOrEqual(prevDistance);
      }
    });

    it("半径0では中央のみを返す", () => {
      const centerPosition = { row: 5, col: 5 };
      const nearbyPositions = Board.getNearbyPositions(centerPosition, 0);
      
      expect(nearbyPositions).toHaveLength(1);
      expect(nearbyPositions[0]).toEqual({ row: 5, col: 5 });
    });
  });

  describe("getCenterPosition", () => {
    it("ボードの中央位置を返す", () => {
      const center = Board.getCenterPosition();
      
      expect(center).toEqual({ row: 7, col: 7 });
    });

    it("常に同じ位置を返す", () => {
      const center1 = Board.getCenterPosition();
      const center2 = Board.getCenterPosition();
      
      expect(center1).toEqual(center2);
    });
  });

  describe("countConsecutiveStones", () => {
    describe("横方向の連続カウント", () => {
      it("5つ連続で横に並んだ場合に5を返す", () => {
        const board = Board.createEmpty();
        
        // 横に5つ黒石を配置 (7,3) から (7,7)
        for (let col = 3; col <= 7; col++) {
          board[7][col] = "black";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(5);
      });

      it("4つ連続で横に並んだ場合に4を返す", () => {
        const board = Board.createEmpty();
        
        // 横に4つ黒石を配置
        for (let col = 3; col <= 6; col++) {
          board[7][col] = "black";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 6 });
        expect(result).toBe(4);
      });

      it("2つ連続で横に並んだ場合に2を返す", () => {
        const board = Board.createEmpty();
        
        // 横に2つ黒石を配置
        board[7][6] = "black";
        board[7][7] = "black";
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(2);
      });
    });

    describe("縦方向の連続カウント", () => {
      it("5つ連続で縦に並んだ場合に5を返す", () => {
        const board = Board.createEmpty();
        
        // 縦に5つ白石を配置 (3,7) から (7,7)
        for (let row = 3; row <= 7; row++) {
          board[row][7] = "white";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(5);
      });

      it("3つ連続で縦に並んだ場合に3を返す", () => {
        const board = Board.createEmpty();
        
        // 縦に3つ白石を配置
        for (let row = 5; row <= 7; row++) {
          board[row][7] = "white";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(3);
      });
    });

    describe("斜め方向の連続カウント", () => {
      it("右下方向に5つ連続で並んだ場合に5を返す", () => {
        const board = Board.createEmpty();
        
        // 右下斜めに5つ黒石を配置 (3,3) から (7,7)
        for (let i = 0; i < 5; i++) {
          board[3 + i][3 + i] = "black";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(5);
      });

      it("右上方向に3つ連続で並んだ場合に3を返す", () => {
        const board = Board.createEmpty();
        
        // 右上斜めに3つ白石を配置
        for (let i = 0; i < 3; i++) {
          board[7 - i][5 + i] = "white";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 5, col: 7 });
        expect(result).toBe(3);
      });
    });

    describe("連続しないケース", () => {
      it("3つ連続の場合は3を返す", () => {
        const board = Board.createEmpty();
        
        // 3つだけ配置
        board[7][5] = "black";
        board[7][6] = "black";
        board[7][7] = "black";
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(3);
      });

      it("間に異なる色が挟まっている場合は連続が途切れる", () => {
        const board = Board.createEmpty();
        
        // 黒-黒-白-黒-黒の配置
        board[7][3] = "black";
        board[7][4] = "black";
        board[7][5] = "white";
        board[7][6] = "black";
        board[7][7] = "black";
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(2); // 右2つの黒石のみ
      });

      it("空のマスでは0を返す", () => {
        const board = Board.createEmpty();
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(0);
      });

      it("単独の石では1を返す", () => {
        const board = Board.createEmpty();
        board[7][7] = "black";
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 7 });
        expect(result).toBe(1);
      });
    });

    describe("ボード端での連続カウント", () => {
      it("ボードの端で5つ連続した場合も5を返す", () => {
        const board = Board.createEmpty();
        
        // ボード右端で縦に5つ配置
        for (let row = 0; row < 5; row++) {
          board[row][14] = "black";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 4, col: 14 });
        expect(result).toBe(5);
      });

      it("ボードの左端で3つ連続した場合に3を返す", () => {
        const board = Board.createEmpty();
        
        // ボード左端で横に3つ配置
        for (let col = 0; col < 3; col++) {
          board[7][col] = "white";
        }
        
        const result = Board.countConsecutiveStones(board, { row: 7, col: 2 });
        expect(result).toBe(3);
      });
    });
  });
});