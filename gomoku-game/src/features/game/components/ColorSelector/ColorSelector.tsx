"use client";

import Stone from "@/components/Stone/Stone";
import { ColorSelection } from "@/types/colorSelection";
import { JSX } from "react";
import OptionSelector from "@/components/elements/OptionSelector/OptionSelector";

interface Props {
  selectedColor: ColorSelection;
  onColorChange: (color: ColorSelection) => void;
}

const ColorSelector = ({
  selectedColor,
  onColorChange,
}: Props): JSX.Element => {
  const colorOptions = [
    {
      value: "black" as ColorSelection,
      label: ColorSelection.getLabel("black"),
      description: ColorSelection.getDescription("black"),
      icon: <Stone color="black" />
    },
    {
      value: "white" as ColorSelection,
      label: ColorSelection.getLabel("white"),
      description: ColorSelection.getDescription("white"),
      icon: <Stone color="white" />
    },
    {
      value: "random" as ColorSelection,
      label: ColorSelection.getLabel("random"),
      description: ColorSelection.getDescription("random"),
      icon: (
        <div className="w-6 h-6 border-2 border-gray-400 border-dashed rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-500">?</span>
        </div>
      )
    },
  ];

  return (
    <OptionSelector
      title="あなたの石の色を選択"
      options={colorOptions}
      selectedValue={selectedColor}
      onValueChange={onColorChange}
      layout="grid"
      gridColumns={3}
    />
  );
};

export default ColorSelector;
