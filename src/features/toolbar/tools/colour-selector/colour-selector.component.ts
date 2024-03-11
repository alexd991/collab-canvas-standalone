import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-colour-selector',
  template: `
    <ngx-colors
      ngx-colors-trigger
      colorsAnimation="popup"
      colorPickerControls="no-alpha"
      acceptLabel="Accept"
      cancelLabel="Cancel"
      [ngModel]="colour()"
      (change)="setNewColour($event)"
      title="Colour Selector"
    />
  `,
  styleUrl: './colour-selector.component.less',
  standalone: true,
  imports: [
    FormsModule,
    NgxColorsModule,
  ],
})
export class ColourSelectorComponent {
  public colour = model.required<string>();

  protected setNewColour(hexCode: string): void {
    if(!hexCode)
      return;

    this.colour.set(hexCode);
  }
}
