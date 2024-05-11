import { OutputEmitterRef } from "@angular/core";

export enum SelectableToolbarItem {
  BrushControl = "BrushControl",
  FloodFill = "FloodFill",
}

export interface ISelectableToolbarItem {
  readonly clickEmitter: OutputEmitterRef<SelectableToolbarItem>;
  onClick(): void;
}
