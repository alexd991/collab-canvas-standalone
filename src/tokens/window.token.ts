import { InjectionToken } from "@angular/core";

export const WINDOW: InjectionToken<Window> = new InjectionToken<Window>('Window', {
  providedIn: "root",
  factory: () => window
});
