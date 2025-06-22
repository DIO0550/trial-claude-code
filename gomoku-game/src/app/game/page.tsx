"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GameBoard from "@/features/game/components/GameBoard/GameBoard";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { useBackToStart } from "@/hooks/useBackToStart";

function GamePageContent() {
  const searchParams = useSearchParams();
  const { backToStart } = useBackToStart();
  
  const cpuLevel = (searchParams.get("cpuLevel") as CpuLevel) || "normal";
  const playerColor = (searchParams.get("color") as StoneColor) || "black";

  return (
    <GameBoard
      cpuLevel={cpuLevel}
      playerColor={playerColor}
      onBackToStart={backToStart}
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