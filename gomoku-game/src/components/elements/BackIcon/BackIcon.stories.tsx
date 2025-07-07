import type { Meta, StoryObj } from "@storybook/nextjs";
import BackIcon from "./BackIcon";
import Button from "../Button/Button";

const meta = {
  component: BackIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BackIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "デフォルトの戻るアイコン。mediumサイズで表示されます。",
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
  parameters: {
    docs: {
      description: {
        story: "小さなサイズの戻るアイコン。コンパクトなUIに適しています。",
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
  parameters: {
    docs: {
      description: {
        story: "標準サイズの戻るアイコン。デフォルトサイズです。",
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
  parameters: {
    docs: {
      description: {
        story: "大きなサイズの戻るアイコン。重要な戻るボタンに使用します。",
      },
    },
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center">
        <BackIcon size="small" />
        <p className="mt-2 text-sm text-gray-600">Small</p>
      </div>
      <div className="text-center">
        <BackIcon size="medium" />
        <p className="mt-2 text-sm text-gray-600">Medium</p>
      </div>
      <div className="text-center">
        <BackIcon size="large" />
        <p className="mt-2 text-sm text-gray-600">Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "3つのサイズの比較表示。用途に応じて適切なサイズを選択できます。",
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    size: "medium",
    className: "text-blue-600 hover:text-blue-800 cursor-pointer transition-colors",
  },
  parameters: {
    docs: {
      description: {
        story: "カスタムスタイリングを適用した戻るアイコン。色やホバー効果をカスタマイズできます。",
      },
    },
  },
};

export const InButtonContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="mb-2 text-sm font-medium text-gray-700">アイコンのみボタン</h4>
        <Button
          variant="secondary"
          icon={<BackIcon />}
          iconOnly
          aria-label="戻る"
        >
          戻る
        </Button>
      </div>
      <div className="text-center">
        <h4 className="mb-2 text-sm font-medium text-gray-700">アイコン付きボタン</h4>
        <Button
          variant="secondary"
          icon={<BackIcon />}
        >
          戻る
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttonコンポーネントと組み合わせた使用例。アイコンのみとテキスト付きの両方のパターン。",
      },
    },
  },
};

export const GameUIExample: Story = {
  render: () => (
    <div className="w-96 p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="secondary"
          icon={<BackIcon />}
          iconOnly
          aria-label="スタート画面に戻る"
        >
          スタート画面に戻る
        </Button>
        <h1 className="text-xl font-bold text-gray-800">五目並べ</h1>
        <div className="w-10"></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-center text-gray-600">ゲーム画面</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "実際のゲームUIでの使用例。ゲーム画面のヘッダー部分で戻るボタンとして使用。",
      },
    },
  },
};

export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h4 className="font-medium text-gray-800">アクセシビリティ対応</h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          BackIconは適切なaria-labelを自動的に設定します：
        </p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          &lt;span aria-label="戻る"&gt;&amp;lt;&lt;/span&gt;
        </div>
        <p className="text-sm text-gray-600">
          スクリーンリーダーで「戻る」として読み上げられます。
        </p>
      </div>
      <BackIcon />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "アクセシビリティの対応例。スクリーンリーダーに対応した適切なaria-labelが設定されています。",
      },
    },
  },
};