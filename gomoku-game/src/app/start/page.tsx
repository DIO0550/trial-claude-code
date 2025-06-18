"use client";

import { useRouter } from "next/navigation";
import StartScreen from "@/components/StartScreen/StartScreen";
import { StoneColor } from "@/types/stone";
import { CpuLevel } from "@/types/cpuLevel";

export default function StartPage() {
  const router = useRouter();

  const handleStartGame = (cpuLevel: CpuLevel, color: StoneColor) => {
    const params = new URLSearchParams({
      cpuLevel,
      color: color || "black"
    });
    router.push(`/game?${params.toString()}`);
  };

  return <StartScreen onStartGame={handleStartGame} />;
}