import { Component, ElementRef, HostListener, Signal, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasControlService } from '../../canvas-control/canvas-control.service';

@Component({
  selector: 'app-brush-control',
  templateUrl: './brush-control.component.html',
  styleUrl: './brush-control.component.less',
  standalone: true,
  imports: [CommonModule],
})
export class BrushControlComponent {
  public showModal = signal(false);
  public strokeWidth = input.required<number>();
  public colour = input.required<string>();
  protected halfStrokeRadius: Signal<number>;

  constructor(
    private readonly _elRef: ElementRef,
    private readonly _canvasControl: CanvasControlService
  ) {
    this.halfStrokeRadius = computed(() => this.strokeWidth() / 4);
  }

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
    const sliderValue = Number((inputEvent.target as HTMLInputElement).value);
    this._canvasControl.setStrokeWidth(sliderValue);
  }
}
