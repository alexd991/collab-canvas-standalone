import { LineData } from "utils/models";

export function lineHasNoLength(lineData: LineData): boolean {
  const { start, end } = lineData;
  return start.x === end.x && start.y === end.y;
}
