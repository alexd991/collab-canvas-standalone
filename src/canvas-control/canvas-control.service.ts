import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { CursorMode } from '../canvas/canvas.models';

@Injectable({ providedIn: 'root' })
export class CanvasControlService {
  private readonly _clearCanvasSubject = new Subject<void>();

  public readonly colour = signal('#000000');
  public readonly strokeWidth = signal(10);
  public readonly cursorMode = signal(CursorMode.Brush);
  public readonly clearCanvas$ = this._clearCanvasSubject.asObservable();

  public clearCanvas(): void {
    this._clearCanvasSubject.next();
  }
}
