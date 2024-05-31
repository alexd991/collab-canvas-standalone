import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideAnimations } from '@angular/platform-browser/animations';

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
  ],
}
