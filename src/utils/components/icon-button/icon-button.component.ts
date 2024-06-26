import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasControlService } from 'features/canvas';
import { CursorModeUrl, CursorMode } from 'utils/models';

@Component({
  selector: 'app-icon-button',
  template: `
    <a class="icon" (click)="onClick()">
      <img [src]="iconUrl()" alt="icon" [title]="targetMode()"/>
    </a>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
