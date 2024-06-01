import { coloursMatch } from "../../../../utils/helpers";
import { RGBA, FillData } from "../../../../utils/models";

function replacePixel(data: Uint8ClampedArray, index: number, newColour: RGBA): void {
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
