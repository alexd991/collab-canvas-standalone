import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../../canvas';
import { IconButtonComponent } from '../../../../utils/icon-button/icon-button.component';
import { ISelectableToolbarItem, SelectableToolbarItem } from '../../toolbar.models';

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
export class FloodFillComponent implements ISelectableToolbarItem {
  protected readonly CursorMode = CursorMode;
  protected readonly CursorModeUrl = CursorModeUrl;

  public readonly clickEmitter = output<SelectableToolbarItem>();

  public onClick(): void {
    this.clickEmitter.emit(SelectableToolbarItem.FloodFill);
  }
}
