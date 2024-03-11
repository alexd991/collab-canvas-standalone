import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasComponent, ToolbarComponent, NavbarComponent } from '../features'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ToolbarComponent,
    CanvasComponent,
    NavbarComponent,
  ],
})
export class AppComponent { }
