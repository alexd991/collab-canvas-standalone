import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasControlService } from '../canvas-control/canvas-control.service';
import { BrushControlComponent } from './brush-control/brush-control.component';
import { ColourSelectorComponent } from './colour-selector/colour-selector.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColourSelectorComponent,
    BrushControlComponent
  ],
})
export class ToolbarComponent {
  private readonly _canvasControl = inject(CanvasControlService);

  protected colour = this._canvasControl.colour;
  protected strokeWidth = this._canvasControl.strokeWidth;
}
