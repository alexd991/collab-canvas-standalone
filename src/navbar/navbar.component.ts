import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasControlService } from '../canvas-control/canvas-control.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  constructor(
    private readonly _canvasControl: CanvasControlService,
  ) { }

  clearCanvas(): void {
    this._canvasControl.clearCanvas();
  }
}
