import { Signal } from "@angular/core";
import { CursorMode, CursorModeUrl } from "../../../canvas";

export type BrushControlButton = {
  cursorMode: CursorMode;
  cursorModeUrl: CursorModeUrl;
  class: string;
  selected: Signal<boolean>;
}
