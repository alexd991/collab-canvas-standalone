import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasControlService } from '../canvas';
import { BrushControlComponent, ColourSelectorComponent } from './tools';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColourSelectorComponent,
    BrushControlComponent,
  ],
})
export class ToolbarComponent {
  private readonly _canvasControl = inject(CanvasControlService);

  protected colour = this._canvasControl.colour;
  protected strokeWidth = this._canvasControl.strokeWidth;
  protected cursorMode = this._canvasControl.cursorMode;
}
