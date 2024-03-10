import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasControlService } from '../canvas-control/canvas-control.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less',
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  constructor(
    private readonly _canvasControl: CanvasControlService,
  ) { }

  clearCanvas(): void {
    this._canvasControl.clearCanvas();
  }
}
