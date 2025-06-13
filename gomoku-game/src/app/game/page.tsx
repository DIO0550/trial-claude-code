"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GameScreen from "@/components/GameScreen/GameScreen";
import { StoneColor } from "@/types/stone";
import { DifficultyLevel } from "@/types/difficulty";

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const difficulty = (searchParams.get("difficulty") as DifficultyLevel) || "medium";
  const playerColor = (searchParams.get("color") as StoneColor) || "black";

  const handleBackToStart = () => {
    router.push("/start");
  };

  return (
    <GameScreen
      difficulty={difficulty}
      playerColor={playerColor}
      onBackToStart={handleBackToStart}
    />
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GamePageContent />
    </Suspense>
  );
}