export type StoneColor = "black" | "white" | "none";

export const StoneColor = {
  isNone: (color: StoneColor): color is "none" => color === "none",
  isBlack: (color: StoneColor): color is "black" => color === "black",
  isWhite: (color: StoneColor): color is "white" => color === "white",
  isEmpty: (color: StoneColor): color is "none" => color === "none",
} as const;