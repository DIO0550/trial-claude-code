# 五目並べ（Gomoku）ゲーム仕様書

## ゲーム概要
Next.jsで実装する五目並べ（Gomoku）ゲーム。プレイヤーがCPUと対戦する形式。

## 基本ルール
- **ボードサイズ**: 15×15のグリッド
- **プレイヤー**: プレイヤー vs CPU
- **石の色選択**: プレイヤーが黒石または白石を選択可能
- **先手**: 黒石から開始（プレイヤーが黒を選択した場合はプレイヤー先手）
- **勝利条件**: 縦・横・斜めのいずれかで5個連続して石を並べる

## ゲームフロー
1. スタート画面でCPU難易度と石の色を選択
2. 選択に応じて先手・後手が決定
3. 先手から交互に石を配置
4. 5個連続で並んだ側の勝利
5. ボードが埋まって勝者が決まらない場合は引き分け

## CPU AI仕様

### 難易度レベル詳細

#### 1. 入門（Beginner）
- **戦略**: ほぼランダム配置
- **特徴**:
  - 70%ランダム配置、30%基本的な判断
  - 即勝利手があれば打つ
  - 相手の4連を阻止
  - 中央付近を若干優先

#### 2. やさしい（Easy）
- **戦略**: 基本的な防御重視
- **特徴**:
  - 50%基本戦略、50%ランダム
  - 自分の勝利手と相手の阻止を優先
  - 3連の延長を狙う
  - 2連の防御も考慮

#### 3. ふつう（Medium）
- **戦略**: バランス型
- **特徴**:
  - 80%戦略的思考、20%ランダム
  - 攻撃と防御のバランス
  - 複数の脅威を同時作成
  - フォーク（2つ以上の勝利手）を狙う
  - 相手のフォークを阻止

#### 4. むずかしい（Hard）
- **戦略**: 攻撃重視の高レベル
- **特徴**:
  - 90%戦略的思考
  - 3手先まで読む
  - 積極的なフォーク作成
  - 相手の全ての脅威を評価
  - 中央制圧戦略

#### 5. エキスパート（Expert）
- **戦略**: 最高レベルAI
- **特徴**:
  - 95%戦略的思考
  - 5手先まで読む
  - 複雑なコンビネーション攻撃
  - 序盤・中盤・終盤の戦略切り替え
  - プレイヤーのパターンを学習

### AI思考アルゴリズム
1. **即勝利チェック**: 1手で勝利可能かチェック
2. **即敗北阻止**: 相手の勝利を阻止
3. **脅威評価**: 自分と相手の脅威度を計算
4. **位置評価**: 各位置の戦略的価値を評価
5. **ランダム要素**: 難易度に応じてランダム性を追加

## 実装機能

### 必須機能
- **ゲームボード表示**: 15×15のクリッカブルなグリッド
- **石の配置**: プレイヤーのクリックで石を配置
- **CPU自動配置**: CPUターンで自動的に石を配置
- **ターン表示**: 現在のプレイヤー（プレイヤー/CPU）を表示
- **勝利判定**: リアルタイムで勝敗をチェック
- **ゲーム状態表示**: 進行中/勝利/引き分け
- **ゲームリセット**: 新しいゲームを開始

### オプション機能
- **ゲーム履歴**: 手順の記録・表示
- **思考時間表示**: CPUの思考中インジケーター
- **勝利ライン表示**: 勝利時に5個並んだラインをハイライト
- **統計情報**: 勝敗記録

## UI/UX要件
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **視覚的フィードバック**: ホバー効果、石の配置アニメーション
- **ゲーム状態表示**: 現在のターン、勝者、引き分け
- **操作制限**: 既に石がある場所や、ゲーム終了後の配置を防ぐ
- **アクセシビリティ**: キーボード操作対応

## 技術要件
- **フレームワーク**: Next.js (App Router)
- **スタイリング**: Tailwind CSS
- **テスト**: Vitest + React Testing Library
- **ストーリーブック**: コンポーネント開発・ドキュメント
- **TypeScript**: 型安全性の確保

## ディレクトリ構成案
```
src/
  components/
    GameBoard/
    GameStatus/
    GameControls/
  hooks/
    useGameLogic.ts
    useGomokuAI.ts
  types/
    game.ts
  utils/
    gameLogic.ts
    aiAlgorithm.ts
```

## 開発フェーズ
1. **Phase 1**: 基本ゲームロジックとUI
2. **Phase 2**: CPU AI実装
3. **Phase 3**: UI/UX改善とアニメーション
4. **Phase 4**: テスト・最適化