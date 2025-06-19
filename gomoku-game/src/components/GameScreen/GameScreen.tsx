"use client";

import Stone from "@/components/Stone/Stone";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/types/cpuLevel";
import { JSX } from "react";

interface Props {
  cpuLevel: CpuLevel;
  playerColor: StoneColor;
  onBackToStart: () => void;
}

const GameScreen = ({ cpuLevel, playerColor, onBackToStart }: Props): JSX.Element => {
  const cpuLevelLabels = {
    beginner: "入門",
    easy: "やさしい", 
    normal: "ふつう",
    hard: "むずかしい",
    expert: "エキスパート"
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToStart}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            スタート画面に戻る
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">五目並べ</h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>CPUレベル: {cpuLevelLabels[cpuLevel]}</span>
              <span>|</span>
              <div className="flex items-center space-x-1">
                <span>あなた:</span>
                <Stone color={playerColor} />
              </div>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">ゲームボード（15×15）</p>
            <p className="text-sm text-gray-500 mt-2">
              ここにゲームボードが表示されます
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-96 h-96 bg-amber-100 border-2 border-amber-800 rounded flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-6xl mb-4">🎯</div>
                <p>ゲームボード実装予定</p>
                <p className="text-sm mt-2">15×15のグリッド</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700">
                <span className="font-semibold">現在のターン:</span> 
                {playerColor === "black" ? " あなた（先手）" : " CPU（先手）"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;