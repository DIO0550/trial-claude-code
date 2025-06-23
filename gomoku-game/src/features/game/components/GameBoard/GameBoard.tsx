"use client";

import Stone from "@/components/Stone/Stone";
import Button from "@/components/elements/Button/Button";
import TurnIndicator from "@/features/game/components/TurnIndicator/TurnIndicator";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { useGameBoard } from "@/features/board/hooks/useGameBoard";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";
import { JSX } from "react";

interface Props {
  cpuLevel: CpuLevel;
  playerColor: StoneColor;
  onBackToStart: () => void;
}

const GameBoard = ({ cpuLevel, playerColor, onBackToStart }: Props): JSX.Element => {
  const { canPlaceStone, placeStone, getStone } = useGameBoard();
  
  const cpuLevelLabels = {
    beginner: "入門",
    easy: "やさしい", 
    normal: "ふつう",
    hard: "むずかしい",
    expert: "エキスパート"
  };

  const handleCellClick = (row: number, col: number) => {
    if (canPlaceStone(row, col)) {
      placeStone(row, col, playerColor);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onBackToStart}
            variant="secondary"
            size="medium"
          >
            スタート画面に戻る
          </Button>
          
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
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-amber-100 p-4 rounded-lg border-2 border-amber-800">
              <div 
                className="grid gap-0 bg-amber-800" 
                style={{ 
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
                }}
              >
                {Array.from({ length: BOARD_SIZE }).map((_, row) =>
                  Array.from({ length: BOARD_SIZE }).map((_, col) => {
                    const stone = getStone(row, col);
                    const isClickable = canPlaceStone(row, col);
                    
                    return (
                      <button
                        key={`${row}-${col}`}
                        className={`
                          w-8 h-8 border border-amber-700 bg-amber-100 flex items-center justify-center
                          relative
                          ${isClickable ? 'hover:bg-amber-200 cursor-pointer' : 'cursor-default'}
                          ${row === 0 ? 'border-t-2 border-t-amber-800' : ''}
                          ${row === BOARD_SIZE - 1 ? 'border-b-2 border-b-amber-800' : ''}
                          ${col === 0 ? 'border-l-2 border-l-amber-800' : ''}
                          ${col === BOARD_SIZE - 1 ? 'border-r-2 border-r-amber-800' : ''}
                        `}
                        onClick={() => handleCellClick(row, col)}
                        disabled={!isClickable}
                      >
                        {stone !== "none" && (
                          <div className="w-6 h-6">
                            <Stone color={stone} />
                          </div>
                        )}
                        {/* 座標ポイント表示（星の位置） */}
                        {((row === 3 || row === 7 || row === 11) && 
                          (col === 3 || col === 7 || col === 11)) && stone === "none" && (
                          <div className="absolute w-2 h-2 bg-amber-800 rounded-full" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <TurnIndicator playerColor={playerColor} />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;