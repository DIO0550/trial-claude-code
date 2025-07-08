interface UndoButtonProps {
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

/**
 * 待ったボタンコンポーネント
 * ゲーム中に手番を1つ前に戻すためのボタン
 */
export const UndoButton = ({ onUndo, canUndo, disabled = false }: UndoButtonProps): JSX.Element => {
  const isDisabled = !canUndo || disabled;

  const handleClick = () => {
    if (isDisabled) return;
    onUndo();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      data-testid="undo-button"
      className={`
        undo-button
        px-4 py-2 
        bg-blue-500 hover:bg-blue-600 
        text-white font-medium rounded-md
        transition-colors duration-200
        ${isDisabled 
          ? 'undo-button--disabled bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' 
          : 'cursor-pointer'
        }
      `}
    >
      待った
    </button>
  );
};