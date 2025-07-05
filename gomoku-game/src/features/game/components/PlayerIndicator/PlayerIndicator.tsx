import { JSX } from "react";
import { StoneColor } from "@/features/board/utils/stone";
import Stone from "@/components/Stone/Stone";

interface PlayerIndicatorProps {
  color: StoneColor;
  label: string;
  isCurrentTurn?: boolean;
}

export const PlayerIndicator = ({ color, label, isCurrentTurn = false }: PlayerIndicatorProps): JSX.Element => {
  const borderClass = isCurrentTurn 
    ? "border-2 border-blue-500 bg-blue-50" 
    : "border-2 border-gray-300 bg-white";
  
  const shadowClass = isCurrentTurn 
    ? "shadow-lg shadow-blue-200" 
    : "shadow-md";

  return (
    <div className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg w-24 h-28 ${borderClass} ${shadowClass}`}>
      <div data-testid="player-stone" className="transform scale-150">
        <Stone color={color} />
      </div>
      <span className="text-base font-semibold text-gray-800 text-center">{label}</span>
    </div>
  );
};