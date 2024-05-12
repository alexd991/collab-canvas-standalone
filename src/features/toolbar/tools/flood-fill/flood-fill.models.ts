import { CanvasPosition } from "../../../canvas";

export type RGBA = readonly [number, number, number, number];

export type FillData = {
  startPosition: CanvasPosition;
  imageData: ImageData;
  oldColour: RGBA;
  newColour: RGBA;
};
