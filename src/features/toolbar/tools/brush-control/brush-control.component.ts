import { Component, ViewEncapsulation, computed, input, model, output, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../../canvas';
import { IconModalComponent } from '../../../../utils';
import { BrushControlButton } from './brush-control.models';
import { ISelectableToolbarItem, SelectableToolbarItem } from '../../toolbar.models';

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
export class BrushControlComponent implements ISelectableToolbarItem {
  public readonly CursorMode = CursorMode;
  public readonly CursorModeUrl = CursorModeUrl;

  public readonly colour = input.required<string>();
  public readonly strokeDiameter = model.required<number>();
  public readonly cursorMode = model.required<CursorMode>();
  public readonly storedCursorMode = signal<CursorMode>(CursorMode.Brush);

  public readonly halfStrokeRadius = computed(() => this.strokeDiameter() / 4);
  public readonly iconUrl = computed(() => {
    switch (this.storedCursorMode()) {
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
      selected: computed(() => this.storedCursorMode() === CursorMode.Brush),
    },
    {
      cursorMode: CursorMode.Rubber,
      cursorModeUrl: CursorModeUrl.Rubber,
      class: "rubber",
      selected: computed(() => this.storedCursorMode() === CursorMode.Rubber),
    },
    {
      cursorMode: CursorMode.Line,
      cursorModeUrl: CursorModeUrl.Line,
      class: "line",
      selected: computed(() => this.storedCursorMode() === CursorMode.Line),
    },
  ];

  public readonly shouldToggleModal = () => {
    if(this.cursorMode() === CursorMode.Fill) {
      this.setNewCursorMode(this.storedCursorMode());
      return false;
    }

    return true;
  };

  public readonly clickEmitter = output<SelectableToolbarItem>();

  public onClick(): void {
    this.clickEmitter.emit(SelectableToolbarItem.BrushControl);
  }

  protected setNewStrokeDiameter(inputEvent: Event): void {
    this.strokeDiameter.set(Number((inputEvent.target as HTMLInputElement).value));
  }

  protected setNewCursorMode(newMode: CursorMode): void {
    this.cursorMode.set(newMode);

    if(this.storedCursorMode() !== newMode) {
      this.storedCursorMode.set(newMode);
    }
  }
}
