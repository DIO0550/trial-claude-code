import { JSX } from "react";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import OptionSelector from "@/components/elements/OptionSelector/OptionSelector";

interface Props {
  selectedCpuLevel: CpuLevel;
  onCpuLevelChange: (cpuLevel: CpuLevel) => void;
}

const CpuLevelSelector = ({ selectedCpuLevel, onCpuLevelChange }: Props): JSX.Element => {
  const cpuLevelOptions = [
    { value: "beginner" as CpuLevel, label: "入門", description: "ほぼランダム配置" },
    { value: "easy" as CpuLevel, label: "やさしい", description: "基本的な防御重視" },
    { value: "normal" as CpuLevel, label: "ふつう", description: "攻撃と防御のバランス" },
    { value: "hard" as CpuLevel, label: "むずかしい", description: "攻撃重視・3手先読み" },
    { value: "expert" as CpuLevel, label: "エキスパート", description: "最高レベル・5手先読み" }
  ];

  return (
    <OptionSelector
      title="CPU の強さを選択"
      options={cpuLevelOptions}
      selectedValue={selectedCpuLevel}
      onValueChange={onCpuLevelChange}
    />
  );
};

export default CpuLevelSelector;