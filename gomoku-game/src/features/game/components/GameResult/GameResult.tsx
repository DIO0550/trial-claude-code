import React from "react";
import Button from "@/components/elements/Button/Button";
import { StoneColor } from "@/features/board/utils/stone";

interface Props {
  showResult: boolean;
  winner: StoneColor | null;
  playerColor: StoneColor;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameResult = ({ showResult, winner, playerColor, onRestart, onBackToMenu }: Props): React.JSX.Element => {
  if (!showResult) return <></>;

  const isPlayerWin = winner === playerColor;
  const isDraw = winner === null;
  const isPlayerLose = !isDraw && !isPlayerWin;

  const getResultIcon = () => {
    if (isPlayerWin) return "🎉";
    if (isPlayerLose) return "😔";
    return "🤝";
  };

  const getResultTitle = () => {
    if (isPlayerWin) return "おめでとうございます！";
    if (isPlayerLose) return "残念！";
    return "";
  };

  const getResultMessage = () => {
    if (isPlayerWin) return "あなたの勝利です";
    if (isPlayerLose) return "CPUの勝利です";
    return "引き分けです";
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl p-6 text-center text-white animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-center gap-6">
        <div className="text-5xl">{getResultIcon()}</div>
        
        <div className="flex-1">
          {getResultTitle() && (
            <h2 className="text-2xl font-bold mb-1">
              {getResultTitle()}
            </h2>
          )}
          <p className="text-lg font-medium">{getResultMessage()}</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onRestart}
            variant="primary"
            className="!bg-white !text-purple-600 !hover:bg-gray-100 shadow-md border border-purple-600"
          >
            再戦
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 shadow-md border border-purple-600"
          >
            設定に戻る
          </Button>
        </div>
      </div>
    </div>
  );
};