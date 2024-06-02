import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from 'utils/components';
import { CursorMode, CursorModeUrl, ISelectableToolbarComponent, SelectableToolbarItem  } from 'utils/models';

@Component({
  selector: 'app-flood-fill',
  template: `
    <app-icon-button
      [targetMode]="CursorMode.Fill"
      [iconUrl]="CursorModeUrl.Fill"
      (click)="onClick()">
    </app-icon-button>
  `,
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
})
export class FloodFillComponent implements ISelectableToolbarComponent {
  protected readonly CursorMode = CursorMode;
  protected readonly CursorModeUrl = CursorModeUrl;

  public readonly clickEmitter = output<SelectableToolbarItem>();

  public onClick(): void {
    this.clickEmitter.emit(SelectableToolbarItem.FloodFill);
  }
}
