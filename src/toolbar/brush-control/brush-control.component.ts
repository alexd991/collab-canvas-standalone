import { Component, ElementRef, HostListener, ViewEncapsulation, computed, inject, input, model, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { CursorMode } from '../../canvas/canvas.models';

@Component({
  selector: 'app-brush-control',
  templateUrl: './brush-control.component.html',
  styleUrl: './brush-control.component.less',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSliderModule,
  ],
})
export class BrushControlComponent {
  public CursorMode = CursorMode;

  public colour = input.required<string>();
  public strokeWidth = model.required<number>();
  public cursorMode = model.required<CursorMode>();

  public showModal = signal(false);
  public halfStrokeRadius = computed(() => this.strokeWidth() / 4);
  public brushMode = computed(() => this.cursorMode() === CursorMode.Brush);
  public rubberMode = computed(() => this.cursorMode() === CursorMode.Rubber);

  private readonly _elRef = inject(ElementRef);

  @HostListener('document:mousedown', ['$event'])
  public onClickOutsideModal(event: Event): void {
    if (this.showModal() && !this._elRef.nativeElement.contains(event.target)) {
      this.showModal.set(false);
    }
  }

  protected onClickOnIcon(): void {
    this.showModal.update((cond) => !cond);
  }

  protected setNewStrokeWidth(inputEvent: Event): void {
    this.strokeWidth.set(Number((inputEvent.target as HTMLInputElement).value));
  }

  protected setNewCursorMode(newMode: CursorMode): void {
    this.cursorMode.set(newMode);
  }
}
