"use client";

import { useRouter } from "next/navigation";
import StartScreen from "@/components/StartScreen/StartScreen";
import { StoneColor } from "@/types/stone";
import { DifficultyLevel } from "@/types/difficulty";

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