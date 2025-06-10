"use client";

import { useState } from "react";
import Stone from "./Stone";
import { StoneColor } from "../types/stone";

type DifficultyLevel = "beginner" | "easy" | "medium" | "hard" | "expert";

interface StartScreenProps {
  onStartGame: (difficulty: DifficultyLevel, color: StoneColor) => void;
}

const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("medium");
  const [selectedColor, setSelectedColor] = useState<StoneColor>("black");

  const handleStartGame = () => {
    onStartGame(selectedDifficulty, selectedColor);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          五目並べ
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              CPU の強さを選択
            </h2>
            <div className="space-y-2">
              {[
                { value: "beginner", label: "入門", description: "ほぼランダム配置" },
                { value: "easy", label: "やさしい", description: "基本的な防御重視" },
                { value: "medium", label: "ふつう", description: "攻撃と防御のバランス" },
                { value: "hard", label: "むずかしい", description: "攻撃重視・3手先読み" },
                { value: "expert", label: "エキスパート", description: "最高レベル・5手先読み" }
              ].map((option) => (
                <label key={option.value} className="flex items-start cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="difficulty"
                    value={option.value}
                    checked={selectedDifficulty === option.value}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                    className="mr-3 mt-1 text-blue-600"
                  />
                  <div>
                    <div className="text-gray-700 font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              あなたの石の色を選択
            </h2>
            <div className="flex space-x-4">
              {[
                { value: "black", label: "黒（先手）" },
                { value: "white", label: "白（後手）" }
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={option.value}
                    checked={selectedColor === option.value}
                    onChange={(e) => setSelectedColor(e.target.value as StoneColor)}
                    className="mr-2 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Stone color={option.value as StoneColor} />
                    <span className="text-gray-700">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            ゲーム開始
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;