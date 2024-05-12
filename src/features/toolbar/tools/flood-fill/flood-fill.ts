import { CanvasPosition } from "../../../canvas";
import { FillData, RGBA } from "./flood-fill.models";

function hexToRGBA(hexCode: string): RGBA {
  const hex = hexCode.replace('#', '') + 'ff';
  return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
      parseInt(hex.substring(6, 8), 16),
  ];
}

function imageDataToRGBA(imageData: ImageData, position: CanvasPosition): RGBA {
  const data = imageData.data;
  const xLength = imageData.width;
  const index = (position.y * xLength + position.x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

export function toRGBA(imageData: ImageData, position: CanvasPosition): RGBA;
export function toRGBA(hexCode: string): RGBA;
export function toRGBA(arg1: ImageData | string, arg2?: CanvasPosition): RGBA {
  if(typeof arg1 === 'string' && !arg2) {
    return hexToRGBA(arg1);
  }

  if(arg1 instanceof ImageData && arg2) {
    return imageDataToRGBA(arg1, arg2);
  }

  return [-1, -1, -1, -1];
}

export function coloursMatch(a: RGBA | Uint8ClampedArray, b: RGBA | Uint8ClampedArray): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function replacePixel(data: Uint8ClampedArray, index: number, newColour: RGBA): void {
  data[index] = newColour[0];
  data[index + 1] = newColour[1];
  data[index + 2] = newColour[2];
  data[index + 3] = newColour[3];
}

export function floodFillImageData(
  fillData: FillData
): ImageData {
  const { startPosition, imageData, oldColour, newColour } = fillData;

  const data = imageData.data;
  const xLength = imageData.width;
  const yLength = imageData.height;

  const queue = [[startPosition.x, startPosition.y] as const];

  while(queue.length) {
    const [x, y] = queue.pop()!;

    if (x < 0 || x >= xLength || y < 0 || y >= yLength) {
      continue;
    }

    const index = (y * xLength + x) * 4;
    const currentPixel = data.slice(index, index + 4);

    if (coloursMatch(currentPixel, oldColour)) {
      replacePixel(data, index, newColour);
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  return imageData;
}
