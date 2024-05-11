import { Component, ViewEncapsulation, computed, input, model } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../../canvas';
import { IconModalComponent } from '../../../../utils';

@Component({
  selector: 'app-brush-control',
  templateUrl: './brush-control.component.html',
  styleUrl: './brush-control.component.less',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSliderModule,
    IconModalComponent,
  ],
})
export class BrushControlComponent {
  public readonly CursorMode = CursorMode;
  public readonly CursorModeUrl = CursorModeUrl;

  public readonly colour = input.required<string>();
  public readonly strokeWidth = model.required<number>();
  public readonly cursorMode = model.required<CursorMode>();

  public readonly halfStrokeRadius = computed(() => this.strokeWidth() / 4);
  public readonly iconUrl = computed(() => {
    switch (this.cursorMode()) {
      case CursorMode.Brush:
        return CursorModeUrl.Brush;
      case CursorMode.Rubber:
        return CursorModeUrl.Rubber;
      case CursorMode.Line:
        return CursorModeUrl.Line;
      default:
        return '';
    }
  });

  public readonly brushMode = computed(() => this.cursorMode() === CursorMode.Brush);
  public readonly rubberMode = computed(() => this.cursorMode() === CursorMode.Rubber);
  public readonly lineMode = computed(() => this.cursorMode() === CursorMode.Line);

  protected setNewStrokeWidth(inputEvent: Event): void {
    this.strokeWidth.set(Number((inputEvent.target as HTMLInputElement).value));
  }

  protected setNewCursorMode(newMode: CursorMode): void {
    this.cursorMode.set(newMode);
  }
}
