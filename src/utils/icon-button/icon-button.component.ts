import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasControlService, CursorMode, CursorModeUrl } from '../../features/canvas';

@Component({
  selector: 'app-icon-button',
  template: `
    <a class="icon" (click)="onClick()">
      <img [src]="iconUrl()" alt="icon" [title]="targetMode()"/>
    </a>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class IconButtonComponent {
  private readonly _canvasControl = inject(CanvasControlService);

  public readonly iconUrl = input.required<CursorModeUrl>();
  public readonly targetMode = input.required<CursorMode>();

  public onClick(): void {
    if(this._canvasControl.cursorMode() !== this.targetMode()) {
      this._canvasControl.cursorMode.set(this.targetMode());
    }
  }
}
