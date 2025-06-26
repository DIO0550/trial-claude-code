# 五目並べ勝利判定ロジック実装計画

## 問題分析

現在のコードを確認した結果、以下の問題が判明しました：

1. **勝利判定ロジックが未実装**：`useGomokuGame`で石を置く処理（`makeMove`）はありますが、石を置いた後の勝利判定チェックが実装されていません
2. **勝利状態の管理は準備済み**：`GameStatus`型や`SET_WINNER`アクションは既に定義済みですが、実際に呼び出されていません

## 実装すべき機能

### 1. 勝利判定ユーティリティ関数
- **ファイル**: `src/features/board/utils/board.ts`に追加
- **関数**: `checkWinner(board: Board, lastMove: Position): StoneColor | null`
- **機能**: 最後に置かれた石の位置から4方向（縦・横・斜め）で5つ連続をチェック

### 2. 勝利判定ロジックの統合
- **ファイル**: `src/features/game/hooks/useGomokuGame.ts`を修正
- **機能**: `makeMove`内で石を置いた後に勝利判定をチェックし、勝者がいれば`SET_WINNER`アクションを発行

### 3. 引き分け判定
- **機能**: ボードが満杯で勝者がいない場合の引き分け判定

## 実装手順

### Step 1: 勝利判定ユーティリティの実装（TDD）
1. **テストケース作成**
   - `src/features/board/utils/board.test.ts`にテストを追加
   - 横、縦、斜め方向の勝利パターンをテスト
   - 勝利しない場合のテスト

2. **`Board.checkWinner`関数実装**
   - 4方向の連続チェックロジック
   - 最適化されたアルゴリズム

### Step 2: 勝利判定をゲームフックに統合
1. **`useGomokuGame`の修正**
   - `makeMove`関数に勝利判定を追加
   - 勝利時の`SET_WINNER`アクション発行

2. **テストの更新**
   - `useGomokuGame.test.ts`に勝利判定テストを追加

### Step 3: 引き分け判定の実装
1. **ボード満杯チェック**
   - `Board.isFull`関数の実装
   - 引き分け判定ロジック

2. **`SET_DRAW`アクションの統合**

## 技術的詳細

### 勝利判定アルゴリズム

```typescript
// 4方向の検索ベクトル
const directions = [
  [0, 1],   // 横（右方向）
  [1, 0],   // 縦（下方向）  
  [1, 1],   // 斜め（右下方向）
  [1, -1]   // 斜め（右上方向）
];

// 勝利条件
const WIN_LENGTH = 5;
```

### チェック方法
1. **最後に置かれた石の位置**から各方向に前後に検索
2. **同じ色の連続する石**をカウント
3. **5つ以上連続**していれば勝利
4. **効率化**: 最後に置かれた石の位置のみをチェックすることで計算量を削減

### パフォーマンス考慮
- 全ボードスキャンではなく、最後の手のみをチェック
- 4方向 × 2方向の最大8回の線形検索
- 時間計算量: O(1) （最大検索範囲が定数）

## 実装例

### Board.checkWinner関数の署名
```typescript
/**
 * 勝利判定を行う
 * @param board ゲームボード
 * @param lastMove 最後に置かれた石の位置
 * @returns 勝利した色、または勝利者がいない場合はnull
 */
checkWinner: (board: Board, lastMove: Position) => StoneColor | null
```

### useGomokuGameの修正箇所
```typescript
const makeMove = useCallback((row: number, col: number): void => {
  // 既存の石配置処理
  
  // 勝利判定の追加
  const winner = Board.checkWinner(board, { row, col });
  if (winner) {
    dispatch({ type: "SET_WINNER", winner });
    return;
  }
  
  // 引き分け判定の追加
  if (Board.isFull(board)) {
    dispatch({ type: "SET_DRAW" });
    return;
  }
  
  // プレイヤー交代
}, [...]);
```

## テスト戦略

### 勝利判定テストケース
1. **横方向の勝利**（5つ連続）
2. **縦方向の勝利**（5つ連続）
3. **斜め方向の勝利**（両方向）
4. **勝利しないケース**（4つ連続など）
5. **ボード端での勝利**
6. **複数方向での勝利可能性**

### 統合テストケース
1. **ゲームフロー全体**のテスト
2. **CPU対戦での勝利判定**
3. **引き分けシナリオ**

## 期待される結果

実装完了後、以下が実現されます：

1. **石を5つ並べた時点でゲーム終了**
2. **勝者の表示**
3. **引き分けの判定**
4. **ゲーム終了後の操作制限**
5. **リセット機能の正常動作**