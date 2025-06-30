import React from "react";
import { Modal } from "@/components/Modal/Modal";
import { StoneColor } from "@/features/board/utils/stone";

type Props = {
  isOpen: boolean;
  winner: StoneColor | null;
  playerColor: StoneColor;
  onRestart: () => void;
  onBackToMenu: () => void;
};

/**
 * ゲーム結果を表示するモーダルダイアログ
 * 勝利・敗北・引き分けの結果に応じて適切なメッセージとアクションボタンを表示する
 */
export const GameResultModal = ({
  isOpen,
  winner,
  playerColor,
  onRestart,
  onBackToMenu,
}: Props): React.JSX.Element => {
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
    <Modal isOpen={isOpen} onClose={onRestart}>
      <div className="text-center">
        <div className="text-6xl mb-4">{getResultIcon()}</div>
        
        {getResultTitle() && (
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {getResultTitle()}
          </h2>
        )}
        
        <p className="text-lg mb-6 text-gray-600">{getResultMessage()}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            再戦
          </button>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            設定変更
          </button>
        </div>
      </div>
    </Modal>
  );
};