import { StoneColor } from "@/types/stone";
import { DifficultyLevel } from "@/types/difficulty";
import { Board } from "@/utils/board";
import { Position } from "@/types/position";

export interface CpuPlayer {
  readonly difficulty: DifficultyLevel;
  readonly color: StoneColor;
  calculateNextMove(board: Board, moveHistory: Position[]): Position | null;
}

export interface CpuPlayerFactory {
  create(difficulty: DifficultyLevel, color: StoneColor): CpuPlayer;
}