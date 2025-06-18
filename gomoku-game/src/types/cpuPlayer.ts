import { StoneColor } from "@/types/stone";
import { CpuLevel } from "@/types/cpuLevel";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";

export interface CpuPlayer {
  readonly cpuLevel: CpuLevel;
  readonly color: StoneColor;
  calculateNextMove(board: Board, moveHistory: Position[]): Position | null;
}

export interface CpuPlayerFactory {
  create(cpuLevel: CpuLevel, color: StoneColor): CpuPlayer;
}