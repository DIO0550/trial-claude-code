import { JSX } from "react";

interface OptionSelectorOption<T> {
  value: T;
  label: string;
  description: string;
  icon?: JSX.Element;
}

type Props<T> = {
  title: string;
  options: OptionSelectorOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  layout?: 'vertical' | 'grid';
  gridColumns?: number;
}

/**
 * 汎用的な選択肢コンポーネント
 * 
 * @param title - 選択肢グループのタイトル
 * @param options - 選択肢の配列（value, label, description, 任意のicon）
 * @param selectedValue - 現在選択されている値
 * @param onValueChange - 選択値変更時のコールバック関数
 * @param layout - 表示レイアウト（vertical: 縦並び、grid: グリッド表示）
 * @param gridColumns - グリッド表示時の列数（デフォルト: 2）
 * @returns 選択肢コンポーネント
 */
const OptionSelector = <T,>({
  title,
  options,
  selectedValue,
  onValueChange,
  layout = 'vertical',
  gridColumns = 2,
}: Props<T>): JSX.Element => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        {title}
      </h2>
      <div className={layout === 'grid' 
        ? `grid gap-3 ${
            gridColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            gridColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
            gridColumns === 4 ? 'grid-cols-2 md:grid-cols-4' :
            'grid-cols-2'
          }` 
        : 'space-y-3'
      }>
        {options.map((option, index) => (
          <div
            key={typeof option.value === 'object' ? `option-${index}` : String(option.value)}
            onClick={() => onValueChange(option.value)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 select-none ${
              selectedValue === option.value
                ? 'border-blue-600 bg-blue-100 shadow-lg ring-4 ring-blue-300'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
            }`}
          >
            <div className={
              layout === 'grid' && option.icon 
                ? "flex flex-col items-center space-y-2 text-center" 
                : option.icon 
                  ? "flex items-center space-x-3" 
                  : ""
            }>
              {option.icon}
              <div className={layout === 'grid' ? "text-center" : ""}>
                <div className={`font-semibold ${layout === 'grid' ? 'text-sm' : 'text-base'} ${selectedValue === option.value ? 'text-blue-700' : 'text-gray-800'}`}>
                  {option.label}
                </div>
                <div className={`${layout === 'grid' ? 'text-xs' : 'text-sm'} mt-1 ${selectedValue === option.value ? 'text-blue-600' : 'text-gray-600'}`}>
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;