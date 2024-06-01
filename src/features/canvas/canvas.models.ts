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


