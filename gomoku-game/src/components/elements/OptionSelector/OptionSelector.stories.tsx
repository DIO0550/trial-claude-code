import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import OptionSelector from "./OptionSelector";
import Stone from "@/components/Stone/Stone";

const meta = {
  component: OptionSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OptionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSelection: Story = {
  args: {
    title: "基本的な選択",
    options: [
      { value: "option1", label: "選択肢1", description: "最初の選択肢" },
      { value: "option2", label: "選択肢2", description: "2番目の選択肢" },
      { value: "option3", label: "選択肢3", description: "3番目の選択肢" },
    ],
    selectedValue: "option1",
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "基本的な選択コンポーネント。アイコンなしのシンプルな表示。",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    title: "アイコン付き選択",
    options: [
      {
        value: "black",
        label: "黒石",
        description: "先手プレイヤー",
        icon: <Stone color="black" />,
      },
      {
        value: "white",
        label: "白石",
        description: "後手プレイヤー",
        icon: <Stone color="white" />,
      },
      {
        value: "random",
        label: "ランダム",
        description: "自動選択",
        icon: (
          <div className="w-6 h-6 border-2 border-gray-400 border-dashed rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        ),
      },
    ],
    selectedValue: "black",
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "アイコン付きの選択コンポーネント。Stone コンポーネントを使用した例。",
      },
    },
  },
};

export const CpuLevelExample: Story = {
  args: {
    title: "CPU の強さを選択",
    options: [
      { value: "beginner", label: "入門", description: "ほぼランダム配置" },
      { value: "easy", label: "やさしい", description: "基本的な防御重視" },
      { value: "normal", label: "ふつう", description: "攻撃と防御のバランス" },
      { value: "hard", label: "むずかしい", description: "攻撃重視・3手先読み" },
      { value: "expert", label: "エキスパート", description: "最高レベル・5手先読み" },
    ],
    selectedValue: "normal",
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "CPU レベル選択の例。実際の CpuLevelSelector で使用されるパターン。",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: "インタラクティブ例",
    options: [],
    selectedValue: "",
    onValueChange: () => {},
  },
  render: () => {
    const InteractiveExample = () => {
      const [selectedValue, setSelectedValue] = useState("medium");
      
      const options = [
        { value: "easy", label: "簡単", description: "初心者向け" },
        { value: "medium", label: "普通", description: "標準的な難易度" },
        { value: "hard", label: "難しい", description: "上級者向け" },
      ];

      return (
        <div className="w-80">
          <OptionSelector
            title="難易度を選択"
            options={options}
            selectedValue={selectedValue}
            onValueChange={setSelectedValue}
          />
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              選択された値: <strong>{selectedValue}</strong>
            </p>
          </div>
        </div>
      );
    };

    return <InteractiveExample />;
  },
  parameters: {
    docs: {
      description: {
        story: "インタラクティブな選択コンポーネント。実際にクリックして選択状態を変更できます。",
      },
    },
  },
};

export const NumberValues: Story = {
  render: () => {
    const NumberExample = () => {
      const [selectedValue, setSelectedValue] = useState(2);
      
      const options = [
        { value: 1, label: "レベル1", description: "基本設定" },
        { value: 2, label: "レベル2", description: "標準設定" },
        { value: 3, label: "レベル3", description: "高度設定" },
      ];

      return (
        <div className="w-80">
          <OptionSelector
            title="数値による選択"
            options={options}
            selectedValue={selectedValue}
            onValueChange={setSelectedValue}
          />
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              選択された数値: <strong>{selectedValue}</strong>
            </p>
          </div>
        </div>
      );
    };

    return <NumberExample />;
  },
  parameters: {
    docs: {
      description: {
        story: "数値を値として使用する例。ジェネリック型により任意の型に対応。",
      },
    },
  },
};