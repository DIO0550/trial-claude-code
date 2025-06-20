import { StoneColor } from "@/features/board/utils/stone";
import { CpuLevel } from "@/features/cpu/utils/cpuLevel";
import { Board } from "@/features/board/utils/board";
import { Position } from "@/features/board/utils/position";

export interface CpuPlayer {
  readonly cpuLevel: CpuLevel;
  readonly color: StoneColor;
  calculateNextMove(board: Board, moveHistory: Position[]): Position | null;
}

export interface CpuPlayerFactory {
  create(cpuLevel: CpuLevel, color: StoneColor): CpuPlayer;
}