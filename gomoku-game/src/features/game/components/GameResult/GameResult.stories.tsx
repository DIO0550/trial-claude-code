import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { GameResult } from "./GameResult";

const meta: Meta<typeof GameResult> = {
  component: GameResult,
  parameters: {
    layout: "centered",
  },
  args: {
    onRestart: fn(),
    onBackToMenu: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GameResult>;

export const PlayerWin: Story = {
  args: {
    showResult: true,
    winner: "black",
    playerColor: "black",
  },
};

export const PlayerLose: Story = {
  args: {
    showResult: true,
    winner: "white", 
    playerColor: "black",
  },
};

export const Draw: Story = {
  args: {
    showResult: true,
    winner: null,
    playerColor: "black",
  },
};

export const Hidden: Story = {
  args: {
    showResult: false,
    winner: "black",
    playerColor: "black",
  },
};

export const PlayerWinWithGameBoard: Story = {
  args: {
    showResult: true,
    winner: "black",
    playerColor: "black",
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
        <div className="w-full max-w-4xl">
          {/* ゲーム盤面のヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              スタート画面に戻る
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">五目並べ</h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span>CPUレベル: ふつう</span>
                <span>|</span>
                <div className="flex items-center space-x-1">
                  <span>あなた:</span>
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="w-32"></div>
          </div>

          {/* ゲーム結果パネル */}
          <div className="mb-6">
            <Story />
          </div>

          {/* ゲーム盤面 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <p className="text-lg text-gray-700">ゲームボード（15×15）</p>
            </div>
            
            {/* 模擬ゲーム盤面 */}
            <div className="bg-yellow-100 p-4 rounded-lg shadow-lg mb-6">
              <div 
                className="bg-yellow-200 p-2 rounded gap-0 mx-auto"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(15, 1fr)',
                  width: '600px',
                  height: '600px'
                }}
              >
                {Array.from({ length: 225 }, (_, i) => {
                  // 勝利パターンを表示
                  const row = Math.floor(i / 15);
                  const col = i % 15;
                  let stone = null;
                  
                  // 黒石の勝利ライン (対角線)
                  if (row === col && row >= 5 && row <= 9) {
                    stone = <div className="w-6 h-6 bg-black rounded-full shadow-lg border-2 border-yellow-400" />;
                  }
                  // その他の石をランダム配置
                  else if (Math.random() < 0.1) {
                    stone = <div className={`w-6 h-6 rounded-full shadow ${Math.random() < 0.5 ? 'bg-black' : 'bg-white border border-black'}`} />;
                  }
                  
                  return (
                    <div 
                      key={i}
                      className="w-10 h-10 border border-gray-400 flex items-center justify-center"
                    >
                      {stone}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ターン表示エリア */}
            <div className="text-center text-gray-600">
              <p>ゲーム終了</p>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};