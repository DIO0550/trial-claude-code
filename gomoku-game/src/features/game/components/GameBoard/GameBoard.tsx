"use client";

import Stone from "@/components/Stone/Stone";
import Button from "@/components/elements/Button/Button";
import TurnIndicator from "@/features/game/components/TurnIndicator/TurnIndicator";
import Board from "@/features/board/components/Board/Board";
import { GameResultModal } from "@/features/game/components/GameResultModal/GameResultModal";
import { useGomokuGame, GameSettings } from "@/features/game/hooks/useGomokuGame";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { JSX } from "react";

interface Props {
  cpuLevel: CpuLevel;
  playerColor: StoneColor;
  onBackToStart: () => void;
}

/**
 * 五目並べゲーム画面全体のコンポーネント
 * ヘッダー、ゲームボード、ターン表示、ゲーム結果モーダルを含む
 * @param cpuLevel - CPUの難易度レベル
 * @param playerColor - プレイヤーの石の色
 * @param onBackToStart - スタート画面に戻るコールバック関数
 * @returns ゲーム画面全体のレイアウト
 */
const GameBoard = ({ cpuLevel, playerColor, onBackToStart }: Props): JSX.Element => {
  const gameSettings: GameSettings = { playerColor, cpuLevel };
  const { board, gameStatus, winner, canMakeMove, makeMove, resetGame } = useGomokuGame(gameSettings);
  
  const cpuLevelLabels = {
    beginner: "入門",
    easy: "やさしい", 
    normal: "ふつう",
    hard: "むずかしい",
    expert: "エキスパート"
  };

  const isGameFinished = gameStatus === "won" || gameStatus === "draw";

  const handleRestart = () => {
    resetGame();
  };

  const handleBackToMenu = () => {
    onBackToStart();
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
          
          <Board board={board} canMakeMove={canMakeMove} onMakeMove={makeMove} />

          <TurnIndicator playerColor={playerColor} />
        </div>
      </div>

      <GameResultModal
        isOpen={isGameFinished}
        winner={winner}
        playerColor={playerColor}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
      />
    </div>
  );
};

export default GameBoard;