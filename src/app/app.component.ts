import { ChangeDetectionStrategy, Component } from '@angular/core';
import {  } from'@angular/animations';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CanvasComponent } from '../canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ToolbarComponent,
    CanvasComponent,
  ],
})
export class AppComponent {
}
