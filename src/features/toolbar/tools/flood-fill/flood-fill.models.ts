import { RGBA } from "../../../../utils";
import { CanvasPosition } from "../../../canvas";

export type FillData = {
  startPosition: CanvasPosition;
  imageData: ImageData;
  oldColour: RGBA;
  newColour: RGBA;
};
