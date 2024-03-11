import { Component, ElementRef, HostListener, ViewEncapsulation, computed, inject, input, model, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';

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
  public colour = input.required<string>();
  public strokeWidth = model.required<number>();
  public halfStrokeRadius = computed(() => this.strokeWidth() / 4);
  public showModal = signal(false);

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
}
