import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../../canvas';
import { IconButtonComponent } from '../../../../utils/icon-button/icon-button.component';

@Component({
  selector: 'app-flood-fill',
  template: `
    <app-icon-button
      [targetMode]="CursorMode.Fill"
      [iconUrl]="CursorModeUrl.Fill">
    </app-icon-button>
  `,
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
})
export class FloodFillComponent {
  protected readonly CursorMode = CursorMode;
  protected readonly CursorModeUrl = CursorModeUrl;
}
