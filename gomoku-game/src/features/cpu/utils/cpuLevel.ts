export type CpuLevel = "beginner" | "easy" | "normal" | "hard" | "expert";

export const CpuLevel = {
  isBeginner: (level: CpuLevel): level is "beginner" => level === "beginner",
  isEasy: (level: CpuLevel): level is "easy" => level === "easy",
  isNormal: (level: CpuLevel): level is "normal" => level === "normal",
  isHard: (level: CpuLevel): level is "hard" => level === "hard",
  isExpert: (level: CpuLevel): level is "expert" => level === "expert",
} as const;