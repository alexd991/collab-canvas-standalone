import { CanvasPosition } from "../../../canvas";
import { RGBA } from "./flood-fill.models";

export function hexToRGBA(hexCode: string): RGBA {
  const hex = hexCode.replace('#', '') + 'ff';
  return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
      parseInt(hex.substring(6, 8), 16),
  ];
}

export function getOldColour(imageData: ImageData, position: CanvasPosition): RGBA {
  const data = imageData.data;
  const xLength = imageData.width;
  const index = (position.y * xLength + position.x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

export function colourMatch(a: RGBA | Uint8ClampedArray, b: RGBA | Uint8ClampedArray): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function replacePixel(data: Uint8ClampedArray, index: number, newColour: RGBA): void {
  data[index] = newColour[0];
  data[index + 1] = newColour[1];
  data[index + 2] = newColour[2];
  data[index + 3] = newColour[3];
}
