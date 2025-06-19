import { StoneColor } from "@/features/board/utils/stone";

export type ColorSelection = StoneColor | "random";

export const ColorSelection = {
  isRandom: (selection: ColorSelection): selection is "random" => selection === "random",
  isStoneColor: (selection: ColorSelection): selection is StoneColor => 
    selection === "black" || selection === "white" || selection === "none",
  
  resolveColor: (selection: ColorSelection): StoneColor => {
    if (ColorSelection.isRandom(selection)) {
      return Math.random() < 0.5 ? "black" : "white";
    }
    return selection;
  },
  
  getLabel: (selection: ColorSelection): string => {
    switch (selection) {
      case "black":
        return "黒（先手）";
      case "white":
        return "白（後手）";
      case "random":
        return "ランダム";
      case "none":
        return "なし";
      default:
        return "";
    }
  },
  
  getDescription: (selection: ColorSelection): string => {
    switch (selection) {
      case "black":
        return "最初に石を置きます";
      case "white":
        return "相手の後に石を置きます";
      case "random":
        return "ゲーム開始時に色が決まります";
      case "none":
        return "石がありません";
      default:
        return "";
    }
  },
} as const;