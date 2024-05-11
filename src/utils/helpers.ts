import { LineData } from "../features/canvas";

export function lineHasNoLength(lineData: LineData): boolean {
  const { start, end } = lineData;
  return start.x === end.x && start.y === end.y;
}
