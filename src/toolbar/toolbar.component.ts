import { Component, Signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CanvasControlService } from '../canvas-control/canvas-control.service';
import { CursorMode } from '../canvas/canvas.models';
import { BrushControlComponent } from './brush-control/brush-control.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
  standalone: true,
  // encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    NgxColorsModule,
    BrushControlComponent
  ],
})
export class ToolbarComponent {
  protected colour: string;
  protected colourSignal: Signal<string>;
  protected cursorMode: Signal<CursorMode>;
  protected strokeWidth: Signal<number>;
  private _flip: boolean = true;
  private _router = inject(Router);

  constructor(private readonly _canvasControl: CanvasControlService) {
    this.colour = this._canvasControl.colour();
    this.colourSignal = this._canvasControl.colour;
    this.strokeWidth = this._canvasControl.strokeWidth;
    this.cursorMode = this._canvasControl.cursorMode;
  }

  protected setNewColour(hexCode: string): void {
    this._canvasControl.setColour(hexCode);
  }

  protected setCursorMode(): void {
    this._router.navigateByUrl(this._flip ? 'canvas-test' : 'canvas');
    this._flip = !this._flip;

    const cursorMode = this._flip ? CursorMode.Brush : CursorMode.Fill;

    this._canvasControl.setCursorMode(cursorMode);
  }
}
