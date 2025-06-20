import { JSX } from "react";
import { StoneColor } from "@/features/board/utils/stone";

interface Props {
  playerColor: StoneColor;
}

const TurnIndicator = ({ playerColor }: Props): JSX.Element => {
  const isPlayerTurn = playerColor === "black";
  const currentPlayerLabel = isPlayerTurn ? "あなた（先手）" : "CPU（先手）";

  return (
    <div className="mt-6 text-center">
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-gray-700">
          <span className="font-semibold">現在のターン:</span> 
          {` ${currentPlayerLabel}`}
        </p>
      </div>
    </div>
  );
};

export default TurnIndicator;