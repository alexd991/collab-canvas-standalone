import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasControlService } from '../canvas';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public constructor(
    private readonly _canvasControl: CanvasControlService,
  ) { }

  public clearCanvas(): void {
    this._canvasControl.clearCanvas();
  }

  public undo(): void {
    this._canvasControl.undo();
  }
}
