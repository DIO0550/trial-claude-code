import { JSX } from "react";
import { CpuLevel } from "@/types/cpuLevel";

interface Props {
  selectedCpuLevel: CpuLevel;
  onCpuLevelChange: (cpuLevel: CpuLevel) => void;
}

const CpuLevelSelector = ({ selectedCpuLevel, onCpuLevelChange }: Props): JSX.Element => {
  const cpuLevelOptions = [
    { value: "beginner", label: "入門", description: "ほぼランダム配置" },
    { value: "easy", label: "やさしい", description: "基本的な防御重視" },
    { value: "normal", label: "ふつう", description: "攻撃と防御のバランス" },
    { value: "hard", label: "むずかしい", description: "攻撃重視・3手先読み" },
    { value: "expert", label: "エキスパート", description: "最高レベル・5手先読み" }
  ] as const;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        CPU の強さを選択
      </h2>
      <div className="space-y-3">
        {cpuLevelOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onCpuLevelChange(option.value as CpuLevel)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 select-none ${
              selectedCpuLevel === option.value
                ? 'border-blue-600 bg-blue-100 shadow-lg ring-4 ring-blue-300'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
            }`}
          >
            <div>
              <div className={`font-semibold text-base ${selectedCpuLevel === option.value ? 'text-blue-700' : 'text-gray-800'}`}>
                {option.label}
              </div>
              <div className={`text-sm mt-1 ${selectedCpuLevel === option.value ? 'text-blue-600' : 'text-gray-600'}`}>
                {option.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CpuLevelSelector;