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
  Rubber = 'Rubber',
}
export enum CursorModeUrl {
  Brush = '../../assets/paintbrush.svg',
  Fill = '../../assets/paintcan.svg',
  Rubber = '../../assets/rubber.svg',
}
