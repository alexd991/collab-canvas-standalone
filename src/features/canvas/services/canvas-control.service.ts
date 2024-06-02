import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { CursorMode } from 'utils/models';

@Injectable({ providedIn: 'root' })
export class CanvasControlService {
  private readonly _clearCanvasSubject = new Subject<void>();
  public readonly clearCanvas$ = this._clearCanvasSubject.asObservable();

  private readonly _canvasUndoSubject = new Subject<void>();
  public readonly canvasUndo$ = this._canvasUndoSubject.asObservable();

  public readonly colour = signal('#000000');
  public readonly strokeDiameter = signal(15);
  public readonly cursorMode = signal(CursorMode.Brush);

  public clear(): void {
    this._clearCanvasSubject.next();
  }

  public undo(): void {
    this._canvasUndoSubject.next();
  }
}
