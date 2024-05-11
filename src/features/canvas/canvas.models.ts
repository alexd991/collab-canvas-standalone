import { Observable } from "rxjs";

export type CanvasPosition = {
  x: number;
  y: number;
};

export type LineData = {
  start: CanvasPosition;
  end: CanvasPosition;
};

export type CanvasEventData = {
  mouseDownFreeDraw$: Observable<MouseEvent>;
  mouseDownLine$: Observable<MouseEvent>;
  canvasPosition$: Observable<CanvasPosition>;
  lineData$: Observable<LineData>;
  mouseUp$: Observable<MouseEvent>;
  canvasContext: CanvasRenderingContext2D;
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
