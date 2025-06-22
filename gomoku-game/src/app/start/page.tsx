"use client";

import GameSetup from "@/features/game/components/GameSetup/GameSetup";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { useGameNavigation } from "@/hooks/useGameNavigation";

export default function StartPage() {
  const { navigateToGame } = useGameNavigation();

  const handleStartGame = (cpuLevel: CpuLevel, color: StoneColor) => {
    navigateToGame(cpuLevel, color);
  };

  return <GameSetup onStartGame={handleStartGame} />;
}