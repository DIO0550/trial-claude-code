"use client";

import { useRouter } from "next/navigation";
import StartScreen from "../../components/StartScreen";
import { StoneColor } from "../../types/stone";

type DifficultyLevel = "beginner" | "easy" | "medium" | "hard" | "expert";

export default function StartPage() {
  const router = useRouter();

  const handleStartGame = (difficulty: DifficultyLevel, color: StoneColor) => {
    const params = new URLSearchParams({
      difficulty,
      color: color || "black"
    });
    router.push(`/game?${params.toString()}`);
  };

  return <StartScreen onStartGame={handleStartGame} />;
}