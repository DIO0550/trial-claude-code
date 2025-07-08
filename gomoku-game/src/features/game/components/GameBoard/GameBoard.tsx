"use client";

import Button from "@/components/elements/Button/Button";
import BackIcon from "@/components/elements/BackIcon/BackIcon";
import Board from "@/features/board/components/Board/Board";
import { GameResult } from "@/features/game/components/GameResult/GameResult";
import { PlayerIndicator } from "@/features/game/components/PlayerIndicator/PlayerIndicator";
import { UndoButton } from "@/components/game/UndoButton";
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
  const { board, winner, canMakeMove, makeMove, resetGame, winningLine, showResultModal, currentPlayer, canUndo, undoMove } = useGomokuGame(gameSettings);
  
  const cpuLevelLabels = {
    beginner: "入門",
    easy: "やさしい", 
    normal: "ふつう",
    hard: "むずかしい",
    expert: "エキスパート"
  };

  // showResultModalフラグを使用してモーダル表示を制御

  const handleRestart = () => {
    resetGame();
  };

  const handleBackToMenu = () => {
    onBackToStart();
  };

  const cpuColor: StoneColor = playerColor === "black" ? "white" : "black";

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onBackToStart}
            variant="secondary"
            size="medium"
            icon={<BackIcon />}
            iconOnly
            aria-label="スタート画面に戻る"
          >
            スタート画面に戻る
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">五目並べ</h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>CPUレベル: {cpuLevelLabels[cpuLevel]}</span>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* ゲーム結果パネル */}
        {showResultModal && (
          <div className="mb-6">
            <GameResult
              showResult={showResultModal}
              winner={winner}
              playerColor={playerColor}
              onRestart={handleRestart}
              onBackToMenu={handleBackToMenu}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">ゲームボード（15×15）</p>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            {/* プレイヤー石表示（盤面左側） */}
            <div className="flex items-end h-96">
              <PlayerIndicator 
                color={playerColor} 
                label="あなた" 
                isCurrentTurn={currentPlayer === playerColor}
              />
            </div>

            {/* ゲームボード */}
            <div className="relative">
              <Board board={board} canMakeMove={canMakeMove} onMakeMove={makeMove} winningLine={winningLine} />
            </div>

            {/* CPU石表示（盤面右側） */}
            <div className="flex items-start h-96">
              <PlayerIndicator 
                color={cpuColor} 
                label="CPU" 
                isCurrentTurn={currentPlayer === cpuColor}
              />
            </div>
          </div>
          
          {/* ゲーム操作ボタン */}
          <div className="flex justify-center mt-4">
            <UndoButton 
              onUndo={undoMove}
              canUndo={canUndo}
              disabled={showResultModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;