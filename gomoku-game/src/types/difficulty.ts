export type DifficultyLevel = "beginner" | "easy" | "medium" | "hard" | "expert";

export const DifficultyLevel = {
  isBeginner: (level: DifficultyLevel): level is "beginner" => level === "beginner",
  isEasy: (level: DifficultyLevel): level is "easy" => level === "easy",
  isMedium: (level: DifficultyLevel): level is "medium" => level === "medium",
  isHard: (level: DifficultyLevel): level is "hard" => level === "hard",
  isExpert: (level: DifficultyLevel): level is "expert" => level === "expert",
} as const;