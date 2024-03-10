import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, signal, viewChild } from '@angular/core';
import { Subscription, debounceTime, filter, fromEvent, map, pairwise, startWith, switchMap, takeUntil } from 'rxjs';
import { CanvasControlService } from '../canvas-control/canvas-control.service';
import { CursorMode, MousePositionData } from './canvas.models';

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styleUrl: './canvas.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent {
  private _canvasElRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private _canvas!: HTMLCanvasElement;
  private readonly _subscriptions: Subscription = new Subscription();

  constructor(
    private readonly _elRef: ElementRef,
    private readonly _canvasControl: CanvasControlService,
    @Inject(DOCUMENT) private readonly _document: Document
  ) { }

  ngAfterViewInit() {
    this._canvas = this._canvasElRef().nativeElement;
    this._canvas.height = Math.floor(this._elRef.nativeElement.clientHeight);
    this._canvas.width = Math.floor(this._elRef.nativeElement.clientWidth);

    this.initialiseDrawEvents();
  }

  private initialiseDrawEvents(): void {
    const canvasContext = this._canvas.getContext('2d')!;
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = this._canvasControl.strokeWidth();
    canvasContext.strokeStyle = this._canvasControl.colour();

    // set the canvas as white - helps the fill tool function properly
    canvasContext.fillStyle = '#ffffff';
    canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);

    const mouseDown$ = fromEvent<MouseEvent>(this._canvas, 'mousedown');
    const mouseUp$ = fromEvent<MouseEvent>(this._document, 'mouseup');
    const mousePositionData$ = fromEvent<MouseEvent>(this._canvas, 'mousemove').pipe(
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

    this._subscriptions.add(
      mouseDown$
        .pipe(
          filter(() => this._canvasControl.cursorMode() === CursorMode.Brush),
          switchMap(() => mousePositionData$.pipe(takeUntil(mouseUp$)))
        )
        .subscribe((mousePosData) => {
          canvasContext.lineWidth = this._canvasControl.strokeWidth();;
          canvasContext.strokeStyle = this._canvasControl.colour();

          this.drawBrushStroke(canvasContext, mousePosData);
        })
    );



    this._subscriptions.add(
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(100)
        )
        .subscribe(() => {
          const imageData = canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);

          this._canvas.height = Math.floor(this._elRef.nativeElement.clientHeight);
          this._canvas.width = Math.floor(this._elRef.nativeElement.clientWidth);

          canvasContext.fillStyle = '#ffffff';
          canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);

          if (imageData) {
            canvasContext.putImageData(imageData, 0, 0);
          }
        })
    );

    this._subscriptions.add(
      this._canvasControl.clearCanvas$.subscribe(() => this.clearCanvas(canvasContext))
    );
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
    canvasContext.fillStyle = '#ffffff';
    canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }
}