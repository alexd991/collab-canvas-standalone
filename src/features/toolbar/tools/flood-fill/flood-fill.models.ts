import { CanvasPosition } from "../../../canvas";

export type RGBA = [number, number, number, number];

export type FillData = {
  startPosition: CanvasPosition;
  imageData: ImageData;
  oldColour: RGBA;
  newColour: RGBA;
};
