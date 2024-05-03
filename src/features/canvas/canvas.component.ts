import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, map, pairwise, startWith, switchMap, takeUntil } from 'rxjs';
import { CanvasControlService } from './canvas-control.service';
import { CursorMode, MousePositionData } from './canvas.models';
import { WINDOW } from '../../tokens/window.token';

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styleUrl: './canvas.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent {
  private readonly _canvasElRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private _canvas!: HTMLCanvasElement;

  constructor(
    private readonly _elRef: ElementRef,
    private readonly _canvasControl: CanvasControlService,
    @Inject(DOCUMENT) private readonly _document: Document,
    @Inject(WINDOW) private readonly _window: Window
  ) { }

  ngAfterViewInit() {
    this._canvas = this._canvasElRef().nativeElement;
    this._canvas.height = Math.floor(this._elRef.nativeElement.clientHeight);
    this._canvas.width = Math.floor(this._elRef.nativeElement.clientWidth);

    this.initialiseDrawEvents();
  }

  private initialiseDrawEvents(): void {
    const canvasContext = this._canvas.getContext('2d', { alpha: false, willReadFrequently: true })!;
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = this._canvasControl.strokeWidth();
    canvasContext.strokeStyle = this._canvasControl.colour();
    this.clearCanvas(canvasContext);

    const mouseDown$ = fromEvent<MouseEvent>(this._canvas, 'pointerdown');
    const mouseUp$ = fromEvent<MouseEvent>(this._document, 'pointerup');
    const mousePositionData$ = fromEvent<MouseEvent>(this._canvas, 'pointermove').pipe(
      map((event: MouseEvent) => ({
        x: Math.floor(event.clientX - this._canvas.getBoundingClientRect().left),
        y: Math.floor(event.clientY - this._canvas.getBoundingClientRect().top),
      })),
      pairwise(),
      map(([prev, curr]) => ({
        previous: prev,
        current: curr,
      })),
      startWith<MousePositionData>({
        previous: {
          x: 0,
          y: 0,
        },
        current: {
          x: 0,
          y: 0,
        },
      })
    );

    mouseDown$
      .pipe(
        takeUntilDestroyed(),
        switchMap(() => mousePositionData$.pipe(takeUntil(mouseUp$)))
      )
      .subscribe((mousePosData) => {
        canvasContext.lineWidth = this._canvasControl.strokeWidth();
        canvasContext.strokeStyle = this._canvasControl.cursorMode() === CursorMode.Brush
          ? this._canvasControl.colour()
          : this._canvasControl.rubberColour;

        this.drawBrushStroke(canvasContext, mousePosData);
      });

    fromEvent(this._window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        debounceTime(100)
      )
      .subscribe(() => {
        const imageData = canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);

        this._canvas.height = Math.floor((this._document.activeElement!.clientHeight - 128) * 0.98);
        this._canvas.width = Math.floor(this._document.activeElement!.clientWidth * 0.98);

        this.clearCanvas(canvasContext);
        canvasContext.lineCap = 'round';
        canvasContext.lineJoin = 'round';

        canvasContext.putImageData(imageData, 0, 0);
      });

    this._canvasControl.clearCanvas$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.clearCanvas(canvasContext));
  }

  private drawBrushStroke(
    canvasContext: CanvasRenderingContext2D,
    mousePosData: MousePositionData
  ): void {
    const { previous, current } = mousePosData;

    if (previous.x === current.x && previous.y === current.y) {
      return;
    }

    canvasContext.beginPath();
    canvasContext.moveTo(previous.x, previous.y);
    canvasContext.lineTo(current.x, current.y);
    canvasContext.stroke();
  }

  private clearCanvas(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }
}
