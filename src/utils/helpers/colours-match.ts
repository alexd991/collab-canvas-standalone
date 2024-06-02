import { RGBA } from "utils/models";

export function coloursMatch(a: RGBA | Uint8ClampedArray, b: RGBA | Uint8ClampedArray): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
