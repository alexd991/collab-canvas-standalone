import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Renderer2, ViewEncapsulation, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { hostAttribute } from '../host-attribute';

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
  private readonly _renderer = inject(Renderer2);

  protected readonly iconAlt = hostAttribute.required('iconAlt');
  protected readonly iconTitle = hostAttribute.required('iconTitle');
  protected readonly iconClass = hostAttribute.required('iconClass');
  protected readonly showModal = signal<boolean>(false);

  public readonly iconUrl = input.required<string>();

  public ngAfterViewInit(): void {
    this._renderer.addClass(this._elRef.nativeElement, this.iconClass);
  }

  public toggleModal(): void {
    this.showModal.update((value) => !value);
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOutsideModal(event: Event): void {
    if (this.showModal() && !this._elRef.nativeElement.contains(event.target)) {
      this.showModal.set(false);
    }
  }
}
