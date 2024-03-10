import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { CursorMode } from '../canvas/canvas.models'

@Injectable({ providedIn: 'root' })
export class CanvasControlService {
  private readonly _colour: WritableSignal<string> = signal('#000000');
  private readonly _strokeWidth: WritableSignal<number> = signal(10);
  private readonly _cursorMode: WritableSignal<CursorMode> = signal(
    CursorMode.Brush
  );
  private readonly _clearCanvasSubject = new Subject<void>();

  public readonly colour = this._colour.asReadonly();
  public readonly strokeWidth = this._strokeWidth.asReadonly();
  public readonly cursorMode = this._cursorMode.asReadonly();
  public readonly clearCanvas$ = this._clearCanvasSubject.asObservable();

  public setColour(hex: string): void {
    this._colour.set(hex);
  }

  public setStrokeWidth(strokeRadius: number): void {
    this._strokeWidth.set(strokeRadius);
  }

  public setCursorMode(cursorMode: CursorMode): void {
    this._cursorMode.set(cursorMode);
  }

  public clearCanvas(): void {
    this._clearCanvasSubject.next();
  }
}
