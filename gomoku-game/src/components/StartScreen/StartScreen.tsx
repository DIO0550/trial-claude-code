"use client";

import { useState } from "react";
import CpuLevelSelector from "@/components/CpuLevelSelector/CpuLevelSelector";
import ColorSelector from "@/components/ColorSelector/ColorSelector";
import { StoneColor } from "@/features/board/utils/stone";
import { ColorSelection } from "@/types/colorSelection";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { JSX } from "react";

interface Props {
  onStartGame: (cpuLevel: CpuLevel, color: StoneColor) => void;
}

const StartScreen = ({ onStartGame }: Props): JSX.Element => {
  const [selectedCpuLevel, setSelectedCpuLevel] = useState<CpuLevel>("normal");
  const [selectedColor, setSelectedColor] = useState<ColorSelection>("black");

  const handleStartGame = () => {
    const finalColor = ColorSelection.resolveColor(selectedColor);
    onStartGame(selectedCpuLevel, finalColor);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          五目並べ
        </h1>
        
        <div className="space-y-6">
          <CpuLevelSelector
            selectedCpuLevel={selectedCpuLevel}
            onCpuLevelChange={setSelectedCpuLevel}
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