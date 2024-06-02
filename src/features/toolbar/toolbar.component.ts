import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasControlService } from 'features/canvas';
import { SelectableToolbarItem } from 'utils/models';
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
    CommonModule,
  ],
})
export class ToolbarComponent {
  public readonly SelectableToolbarItem = SelectableToolbarItem;

  private readonly _canvasControl = inject(CanvasControlService);

  protected readonly colour = this._canvasControl.colour;
  protected readonly strokeDiameter = this._canvasControl.strokeDiameter;
  protected readonly cursorMode = this._canvasControl.cursorMode;

  protected readonly selectedToolbarItem = signal<SelectableToolbarItem>(SelectableToolbarItem.BrushControl);

  public setToolbarItem(itemType: SelectableToolbarItem): void {
    this.selectedToolbarItem.set(itemType);
  }
}
