import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    layout: "centered",
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h2 className="text-xl font-bold mb-4">サンプルモーダル</h2>
        <p className="mb-4">これはモーダルダイアログのサンプルです。</p>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            キャンセル
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            確認
          </button>
        </div>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    children: <div>このコンテンツは表示されません</div>,
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h2 className="text-xl font-bold mb-4">長いコンテンツのモーダル</h2>
        <div className="space-y-4">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-gray-700">
              これは長いコンテンツのサンプルです。段落 {i + 1} です。
              モーダルの最大高さを超える場合はスクロール可能になります。
            </p>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            OK
          </button>
        </div>
      </div>
    ),
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h2 className="text-xl font-bold mb-4">フォーム入力モーダル</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名前</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="名前を入力"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">メール</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="メールアドレスを入力"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    ),
  },
};

export const GameVictoryWithBackground: Story = {
  args: {
    isOpen: true,
    children: (
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          おめでとうございます！
        </h2>
        <p className="text-lg mb-6 text-gray-600">あなたの勝利です</p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            再戦
          </button>
          <button className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">
            設定変更
          </button>
        </div>
      </div>
    ),
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
        {/* ゲーム盤面のような背景コンテンツ */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            五目並べゲーム
          </h1>
          
          {/* 模擬ゲーム盤面 */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-lg mb-6">
            <div 
              className="bg-yellow-200 p-2 rounded gap-0"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(15, 1fr)' 
              }}
            >
              {Array.from({ length: 225 }, (_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs"
                >
                  {/* ランダムに石を配置 */}
                  {Math.random() < 0.1 ? (
                    <div className={`w-4 h-4 rounded-full ${Math.random() < 0.5 ? 'bg-black' : 'bg-white border border-black'}`} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          
          {/* ゲーム情報 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">プレイヤー情報</h3>
              <p>あなた: 黒石</p>
              <p>CPU: 白石</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">ゲーム状況</h3>
              <p>手数: 23手</p>
              <p>経過時間: 5分32秒</p>
            </div>
          </div>
          
          {/* 操作ボタン */}
          <div className="flex justify-center gap-4 mt-6">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              やり直し
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              ゲーム終了
            </button>
          </div>
        </div>
        
        <Story />
      </div>
    ),
  ],
};
