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
