import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-colour-selector',
  template: `
    <ngx-colors
      ngx-colors-trigger
      colorsAnimation="popup"
      [ngModel]="colour()"
      (change)="setNewColour($event)"
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

  ngAfterViewInit(): void {
    this.colour.set('#000000');
  }

  protected setNewColour(hexCode: string): void {
    this.colour.set(hexCode);
  }
}
