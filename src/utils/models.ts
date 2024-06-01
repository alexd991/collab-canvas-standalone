import { Signal } from "@angular/core";
import { Observable } from "rxjs";
import { OutputEmitterRef } from "@angular/core";

export type RGBA = readonly [number, number, number, number];

export enum CursorMode {
  Brush = 'Brush',
  Fill = 'Fill',
  Rubber = 'Rubber',
  Line = 'Line',
}

export enum CursorModeUrl {
  Brush = '../../assets/paintbrush.svg',
  Fill = '../../assets/paintcan.svg',
  Rubber = '../../assets/rubber.svg',
  Line = '../../assets/line.svg',
}

export type CanvasPosition = {
  x: number;
  y: number;
};

export type LineData = {
  start: CanvasPosition;
  end: CanvasPosition;
};

export type FillData = {
  startPosition: CanvasPosition;
  imageData: ImageData;
  oldColour: RGBA;
  newColour: RGBA;
};

export type CanvasEventStreams = {
  mouseDownFreeDraw$: Observable<MouseEvent>;
  mouseDownLine$: Observable<MouseEvent>;
  mouseDownFill$: Observable<MouseEvent>;
  canvasPosition$: Observable<CanvasPosition>;
  lineSegment$: Observable<LineData>;
  mouseUp$: Observable<MouseEvent>;
}

export type BrushControlButton = {
  cursorMode: CursorMode;
  cursorModeUrl: CursorModeUrl;
  class: string;
  selected: Signal<boolean>;
}

export enum SelectableToolbarItem {
  BrushControl = "BrushControl",
  FloodFill = "FloodFill",
}

export interface ISelectableToolbarItem {
  readonly clickEmitter: OutputEmitterRef<SelectableToolbarItem>;
  onClick(): void;
}
