import { Component, ElementRef, HostListener, ViewEncapsulation, computed, inject, input, model, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { CursorMode, CursorModeUrl } from '../../canvas/canvas.models';

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
  public readonly CursorMode = CursorMode;

  public readonly colour = input.required<string>();
  public readonly strokeWidth = model.required<number>();
  public readonly cursorMode = model.required<CursorMode>();

  public readonly showModal = signal(false);
  public readonly halfStrokeRadius = computed(() => this.strokeWidth() / 4);
  public readonly brushMode = computed(() => this.cursorMode() === CursorMode.Brush);
  public readonly rubberMode = computed(() => this.cursorMode() === CursorMode.Rubber);
  public readonly iconUrl = computed<CursorModeUrl>(() => this.brushMode() ? CursorModeUrl.Brush : CursorModeUrl.Rubber);

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
