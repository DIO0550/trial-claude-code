import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "プライマリボタン",
  },
  parameters: {
    docs: {
      description: {
        story: "メインアクション用の青いボタン。ゲーム開始など重要なアクションに使用。",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "セカンダリボタン",
  },
  parameters: {
    docs: {
      description: {
        story: "サブアクション用のグレーのボタン。戻るボタンなど補助的なアクションに使用。",
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: "small",
    variant: "primary",
    children: "小サイズ",
  },
  parameters: {
    docs: {
      description: {
        story: "小さなボタンサイズ。コンパクトなUIで使用。",
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    variant: "primary",
    children: "中サイズ",
  },
  parameters: {
    docs: {
      description: {
        story: "標準的なボタンサイズ。デフォルトサイズ。",
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: "large",
    variant: "primary",
    children: "大サイズ",
  },
  parameters: {
    docs: {
      description: {
        story: "大きなボタンサイズ。重要なアクションを強調したい場合に使用。",
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    children: "全幅ボタン",
  },
  parameters: {
    docs: {
      description: {
        story: "コンテナの幅いっぱいに広がるボタン。フォーム送信ボタンなどに使用。",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "無効ボタン",
  },
  parameters: {
    docs: {
      description: {
        story: "無効化されたボタン。クリックできず、視覚的にも無効であることが分かる。",
      },
    },
  },
};

export const VariantComparison: Story = {
  args: {
    children: "比較用ボタン",
  },
  render: () => (
    <div className="flex items-center space-x-4">
      <Button variant="primary">プライマリ</Button>
      <Button variant="secondary">セカンダリ</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "プライマリとセカンダリのバリアント比較。用途に応じて使い分け。",
      },
    },
  },
};

export const SizeComparison: Story = {
  args: {
    children: "比較用ボタン",
  },
  render: () => (
    <div className="flex items-center space-x-4">
      <Button size="small" variant="primary">小</Button>
      <Button size="medium" variant="primary">中</Button>
      <Button size="large" variant="primary">大</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "3つのサイズの比較表示。レイアウトに応じて適切なサイズを選択。",
      },
    },
  },
};

export const RealWorldExample: Story = {
  args: {
    children: "実例用ボタン",
  },
  render: () => (
    <div className="w-80 space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">ゲーム設定</h3>
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <p>CPU難易度: ふつう</p>
          <p>石の色: 黒</p>
        </div>
        <Button
          variant="primary"
          size="large"
          fullWidth
        >
          ゲーム開始
        </Button>
        <Button
          variant="secondary"
          size="medium"
          fullWidth
        >
          設定をリセット
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "実際のゲーム設定画面での使用例。主要アクションと補助アクションの使い分け。",
      },
    },
  },
};