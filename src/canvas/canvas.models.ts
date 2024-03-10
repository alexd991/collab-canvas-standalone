export type MousePosition = {
  x: number;
  y: number;
};

export type MousePositionData = {
  previous: MousePosition;
  current: MousePosition;
};

export enum CursorMode {
  Brush = 'Brush',
  Fill = 'Fill',
}
