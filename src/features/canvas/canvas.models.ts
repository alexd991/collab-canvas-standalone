import { Observable } from "rxjs";

export type CanvasPosition = {
  x: number;
  y: number;
};

export type LineData = {
  start: CanvasPosition;
  end: CanvasPosition;
};

export type CanvasEventStreams = {
  mouseDownFreeDraw$: Observable<MouseEvent>;
  mouseDownLine$: Observable<MouseEvent>;
  mouseDownFill$: Observable<MouseEvent>;
  canvasPosition$: Observable<CanvasPosition>;
  lineSegment$: Observable<LineData>;
  mouseUp$: Observable<MouseEvent>;
}

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
