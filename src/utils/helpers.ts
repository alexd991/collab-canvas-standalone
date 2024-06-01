import { CanvasPosition, LineData } from "../features/canvas";
import { RGBA } from "./common.models";


export function lineHasNoLength(lineData: LineData): boolean {
  const { start, end } = lineData;
  return start.x === end.x && start.y === end.y;
}

export function coloursMatch(a: RGBA | Uint8ClampedArray, b: RGBA | Uint8ClampedArray): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function isCanvasPosition(value: any): value is CanvasPosition {
  const keys = Object.keys(value);
  return keys.length === 2
    && keys.includes('x')
    && keys.includes('y')
    && typeof(value.x) === 'number'
    && typeof(value.y) === 'number';
}

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

  return [
    data[index],
    data[index + 1],
    data[index + 2],
    data[index + 3]
  ];
}

/**
 * Accepts a hex code (string), or an ImageData object and a CanvasPosition object.
 * @returns An RGBA tuple.
 */
export function toRGBA(hexCode: string): RGBA;
export function toRGBA(imageData: ImageData, position: CanvasPosition): RGBA;
export function toRGBA(arg1: ImageData | string, arg2?: CanvasPosition): RGBA {
  if(typeof arg1 === 'string' && !arg2) {
    return hexToRGBA(arg1);
  }

  if(arg1 instanceof ImageData && (arg2 && isCanvasPosition(arg2))) {
    return imageDataToRGBA(arg1, arg2);
  }

  return [-1, -1, -1, -1];
}
