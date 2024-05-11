import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasControlService } from '../canvas';
import { BrushControlComponent, ColourSelectorComponent, FloodFillComponent } from './tools';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColourSelectorComponent,
    BrushControlComponent,
    FloodFillComponent,
  ],
})
export class ToolbarComponent {
  private readonly _canvasControl = inject(CanvasControlService);

  protected readonly colour = this._canvasControl.colour;
  protected readonly strokeDiameter = this._canvasControl.strokeDiameter;
  protected readonly cursorMode = this._canvasControl.cursorMode;
}
