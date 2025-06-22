"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";

type UseGameNavigationReturn = {
  navigateToGame: (cpuLevel: CpuLevel, color: StoneColor) => void;
};

/**
 * ゲーム画面への遷移を管理するフック
 */
export function useGameNavigation(): UseGameNavigationReturn {
  const router = useRouter();

  /**
   * ゲーム画面への遷移
   * @param cpuLevel CPU難易度
   * @param color プレイヤーの石の色
   */
  const navigateToGame = useCallback((cpuLevel: CpuLevel, color: StoneColor) => {
    const params = new URLSearchParams({
      cpuLevel,
      color: color || "black"
    });
    router.push(`/game?${params.toString()}`);
  }, [router]);

  return {
    navigateToGame
  };
}