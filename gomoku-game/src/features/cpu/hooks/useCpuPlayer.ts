import { useCallback, useMemo } from "react";
import { Board } from "@/features/board/utils/board";
import { StoneColor } from "@/features/board/utils/stone";
import { Position } from "@/features/board/utils/position";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { CpuPlayer } from "@/features/cpu/utils/players/cpuPlayer";
import { createBeginnerCpuPlayer } from "@/features/cpu/utils/players/beginnerCpuPlayer";
import { createEasyCpuPlayer } from "@/features/cpu/utils/players/easyCpuPlayer";
import { createNormalCpuPlayer } from "@/features/cpu/utils/players/normalCpuPlayer";
import { createHardCpuPlayer } from "@/features/cpu/utils/players/hardCpuPlayer";
import { createExpertCpuPlayer } from "@/features/cpu/utils/players/expertCpuPlayer";

export interface UseCpuPlayerReturn {
  getNextMove: (board: Board, moveHistory?: Position[]) => Position | null;
}

/**
 * CPUプレイヤーのロジックを管理するカスタムフック
 * 既存のCPUプレイヤーファクトリを利用して次の手を決定する
 * @param cpuColor - CPUプレイヤーの石の色
 * @param cpuLevel - CPUの難易度レベル
 * @returns CPUプレイヤーの操作メソッド
 */
export const useCpuPlayer = (
  cpuColor: StoneColor,
  cpuLevel: CpuLevel = "easy",
): UseCpuPlayerReturn => {
  const cpuPlayer = useMemo<CpuPlayer>(() => {
    switch (cpuLevel) {
      case "beginner":
        return createBeginnerCpuPlayer(cpuColor);
      case "easy":
        return createEasyCpuPlayer(cpuColor);
      case "normal":
        return createNormalCpuPlayer(cpuColor);
      case "hard":
        return createHardCpuPlayer(cpuColor);
      case "expert":
        return createExpertCpuPlayer(cpuColor);
      default:
        return createEasyCpuPlayer(cpuColor);
    }
  }, [cpuColor, cpuLevel]);

  const getNextMove = useCallback(
    (board: Board, moveHistory: Position[] = []): Position | null => {
      return cpuPlayer.calculateNextMove(board, moveHistory);
    },
    [cpuPlayer],
  );

  return {
    getNextMove,
  };
};
