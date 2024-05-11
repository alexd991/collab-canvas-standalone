import { Component, ViewEncapsulation, computed, input, model } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../../canvas';
import { IconModalComponent } from '../../../../utils';
import { BrushControlButton } from './brush-control.models';

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
  public readonly strokeDiameter = model.required<number>();
  public readonly cursorMode = model.required<CursorMode>();

  public readonly halfStrokeRadius = computed(() => this.strokeDiameter() / 4);
  public readonly iconUrl = computed(() => {
    const cursorMode = this.cursorMode();
    switch (cursorMode) {
      case CursorMode.Brush:
        return CursorModeUrl.Brush;
      case CursorMode.Rubber:
        return CursorModeUrl.Rubber;
      case CursorMode.Line:
        return CursorModeUrl.Line;
      default:
        return ""
    }
  });

  public readonly brushControlButtons: BrushControlButton[] = [
    {
      cursorMode: CursorMode.Brush,
      cursorModeUrl: CursorModeUrl.Brush,
      class: "brush",
      selected: computed(() => this.cursorMode() === CursorMode.Brush),
    },
    {
      cursorMode: CursorMode.Rubber,
      cursorModeUrl: CursorModeUrl.Rubber,
      class: "rubber",
      selected: computed(() => this.cursorMode() === CursorMode.Rubber),
    },
    {
      cursorMode: CursorMode.Line,
      cursorModeUrl: CursorModeUrl.Line,
      class: "line",
      selected: computed(() => this.cursorMode() === CursorMode.Line),
    },
  ];

  protected setNewStrokeDiameter(inputEvent: Event): void {
    this.strokeDiameter.set(Number((inputEvent.target as HTMLInputElement).value));
  }

  protected setNewCursorMode(newMode: CursorMode): void {
    this.cursorMode.set(newMode);
  }
}
