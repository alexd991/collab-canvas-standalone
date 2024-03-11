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

export type CursorModeUrl = "../../assets/paintbrush.svg" | "../../assets/paintcan.svg";
