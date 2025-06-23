import Stone from "@/components/Stone/Stone";
import { useGameBoard } from "@/features/board/hooks/useGameBoard";
import { BOARD_SIZE } from "@/features/board/constants/dimensions";
import { StoneColor } from "@/features/board/utils/stone";
import { JSX } from "react";

interface Props {
  playerColor: StoneColor;
}

/**
 * 15×15の五目並べゲームボードコンポーネント
 * プレイヤーが石を配置できるインタラクティブなボード
 * @param playerColor - プレイヤーの石の色
 * @returns 五目並べのゲームボード
 */
const Board = ({ playerColor }: Props): JSX.Element => {
  const { canPlaceStone, placeStone, getStone } = useGameBoard();

  /**
   * セルクリック時の処理
   * 石が配置可能な場合のみプレイヤーの石を配置する
   */
  const handleCellClick = (row: number, col: number) => {
    if (canPlaceStone(row, col)) {
      placeStone(row, col, playerColor);
    }
  };

  return (
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
  );
};

export default Board;