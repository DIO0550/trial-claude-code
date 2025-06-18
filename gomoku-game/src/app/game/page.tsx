"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GameScreen from "@/components/GameScreen/GameScreen";
import { StoneColor } from "@/types/stone";
import { CpuLevel } from "@/types/cpuLevel";

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const cpuLevel = (searchParams.get("cpuLevel") as CpuLevel) || "normal";
  const playerColor = (searchParams.get("color") as StoneColor) || "black";

  const handleBackToStart = () => {
    router.push("/start");
  };

  return (
    <GameScreen
      cpuLevel={cpuLevel}
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