export type CpuLevel = "beginner" | "easy" | "medium" | "hard" | "expert";

export const CpuLevel = {
  isBeginner: (level: CpuLevel): level is "beginner" => level === "beginner",
  isEasy: (level: CpuLevel): level is "easy" => level === "easy",
  isMedium: (level: CpuLevel): level is "medium" => level === "medium",
  isHard: (level: CpuLevel): level is "hard" => level === "hard",
  isExpert: (level: CpuLevel): level is "expert" => level === "expert",
} as const;