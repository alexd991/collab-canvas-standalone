import { ChangeDetectionStrategy, Component, Signal, ViewEncapsulation, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CanvasControlService } from '../canvas-control/canvas-control.service';
import { CursorMode } from '../canvas/canvas.models';
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
  protected cursorMode = this._canvasControl.cursorMode;
}
