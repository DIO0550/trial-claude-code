"use client";

import { useState } from "react";
import DifficultySelector from "../DifficultySelector/DifficultySelector";
import ColorSelector from "../ColorSelector/ColorSelector";
import { StoneColor } from "../../types/stone";
import { DifficultyLevel } from "../../types/difficulty";

interface Props {
  onStartGame: (difficulty: DifficultyLevel, color: StoneColor) => void;
}

const StartScreen = ({ onStartGame }: Props) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("medium");
  const [selectedColor, setSelectedColor] = useState<StoneColor | "random">("black");

  const handleStartGame = () => {
    const finalColor = selectedColor === "random" 
      ? Math.random() < 0.5 ? "black" : "white"
      : selectedColor;
    onStartGame(selectedDifficulty, finalColor);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          五目並べ
        </h1>
        
        <div className="space-y-6">
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
          />

          <ColorSelector
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

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