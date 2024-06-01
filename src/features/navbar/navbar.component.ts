import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasControlService, CanvasHistoryService } from '../canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less',
  standalone: true,
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public constructor(
    private readonly _canvasControl: CanvasControlService,
    private readonly _canvasHistory: CanvasHistoryService,
  ) { }

  public readonly canUndo = this._canvasHistory.hasSnapshots;

  public clearCanvas(): void {
    this._canvasControl.clear();
  }

  public undo(): void {
    this._canvasControl.undo();
  }
}
