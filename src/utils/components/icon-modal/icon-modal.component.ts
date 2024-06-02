import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewEncapsulation, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { hostAttribute } from 'utils/host-attribute';
import { CursorMode } from 'utils/models';

@Component({
  selector: 'app-icon-modal',
  standalone: true,
  templateUrl: './icon-modal.component.html',
  styleUrl: './icon-modal.component.less',
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconModalComponent {
  private readonly _elRef = inject(ElementRef);
  protected readonly showModal = signal<boolean>(false);

  public readonly shouldToggleFn = input<() => boolean>();
  public readonly iconUrl = input.required<string>();
  public readonly iconAlt = input.required<CursorMode>();
  public readonly iconTitle = hostAttribute.required<string>('iconTitle');

  public onIconClick(): void {
    const shouldToggleFn = this.shouldToggleFn();

    if(!shouldToggleFn || shouldToggleFn()) {
      this.toggleModal();
    }
  }

  private toggleModal(): void {
    this.showModal.update((value) => !value);
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOutsideModal(event: Event): void {
    if (this.showModal() && !this._elRef.nativeElement.contains(event.target)) {
      this.showModal.set(false);
    }
  }
}
