"use client";

import Stone from "@/components/Stone/Stone";
import { StoneColor } from "@/types/stone";
import { ColorSelection } from "@/types/colorSelection";
import { JSX } from "react";

interface Props {
  selectedColor: ColorSelection;
  onColorChange: (color: ColorSelection) => void;
}

const ColorSelector = ({
  selectedColor,
  onColorChange,
}: Props): JSX.Element => {
  const colorOptions: Array<{
    value: ColorSelection;
    label: string;
    description: string;
    hasStone: boolean;
  }> = [
    {
      value: "black",
      label: ColorSelection.getLabel("black"),
      description: ColorSelection.getDescription("black"),
      hasStone: true,
    },
    {
      value: "white",
      label: ColorSelection.getLabel("white"),
      description: ColorSelection.getDescription("white"),
      hasStone: true,
    },
    {
      value: "random",
      label: ColorSelection.getLabel("random"),
      description: ColorSelection.getDescription("random"),
      hasStone: false,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        あなたの石の色を選択
      </h2>
      <div className="space-y-3">
        {colorOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onColorChange(option.value)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 select-none ${
              selectedColor === option.value
                ? "border-blue-600 bg-blue-100 shadow-lg ring-4 ring-blue-300"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3">
              {option.hasStone && <Stone color={option.value as StoneColor} />}
              {!option.hasStone && (
                <div className="w-6 h-6 border-2 border-gray-400 border-dashed rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">?</span>
                </div>
              )}
              <div>
                <div
                  className={`font-semibold text-base ${
                    selectedColor === option.value
                      ? "text-blue-700"
                      : "text-gray-800"
                  }`}
                >
                  {option.label}
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedColor === option.value
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
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

export default ColorSelector;
