import { ChangeDetectionStrategy, Component, ElementRef, Inject, effect, viewChild } from '@angular/core';
import { Observable, Subscription, debounceTime, fromEvent, map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { CanvasControlService, CanvasHistoryService } from './services';
import { CursorMode, MousePositionData } from './canvas.models';
import { DOCUMENT, WINDOW } from '../../tokens';
import { FOOTER_HEIGHT, IDEAL_CANVAS_DIMENSION_PCT, NAVBAR_HEIGHT, RUBBER_COLOUR } from '../../utils';

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
  private readonly _subscriptions = new Subscription();

  public constructor(
    private readonly _canvasControl: CanvasControlService,
    private readonly _canvasHistory: CanvasHistoryService,
    @Inject(DOCUMENT) private readonly _document: Document,
    @Inject(WINDOW) private readonly _window: Window
  ) { }

  public ngAfterViewInit() {
    this._canvas = this._canvasElRef().nativeElement;
    this.initialiseCanvas();
  }

  public ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  private initialiseCanvas(): void {
    const canvasContext = this._canvas.getContext('2d', { alpha: false, willReadFrequently: true })!;

    this.setCanvasDimensions();
    this.initialiseCanvasContext(canvasContext);
    this.fillCanvasWhite(canvasContext);

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

    this.createSubscriptions(mouseDown$, mousePositionData$, mouseUp$, canvasContext);
  }

  private createSubscriptions(
    mouseDown$: Observable<MouseEvent>,
    mousePositionData$: Observable<MousePositionData>,
    mouseUp$: Observable<MouseEvent>,
    canvasContext: CanvasRenderingContext2D
  ): void {
    this._subscriptions.add(
      mouseDown$
        .pipe(
          tap(() => this.storeCanvasSnapshot(canvasContext)),
          switchMap(() => mousePositionData$.pipe(takeUntil(mouseUp$)))
        )
        .subscribe((mousePosData) => {
          canvasContext.lineWidth = this._canvasControl.strokeWidth();
          canvasContext.strokeStyle = this._canvasControl.cursorMode() === CursorMode.Brush
            ? this._canvasControl.colour()
            : RUBBER_COLOUR;

          this.drawBrushStroke(canvasContext, mousePosData);
        })
    );

    this._subscriptions.add(
      fromEvent(this._window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          const imageData = canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);

          this.setCanvasDimensions();
          this.initialiseCanvasContext(canvasContext);
          this.fillCanvasWhite(canvasContext);

          canvasContext.putImageData(imageData, 0, 0);
        })
    );

    this._subscriptions.add(
      this._canvasControl.canvasUndo$.subscribe(() => {
        const latestSnapshot = this._canvasHistory.getLatestSnapshot();
        if (latestSnapshot) {
          canvasContext.putImageData(latestSnapshot, 0, 0);
        }
      })
    );

    this._subscriptions.add(
      this._canvasControl.clearCanvas$.subscribe(() => {
        this.storeCanvasSnapshot(canvasContext);
        this.fillCanvasWhite(canvasContext);
      })
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
    canvasContext.closePath();
    canvasContext.stroke();
  }

  private setCanvasDimensions(): void {
    this._canvas.height = (this._document.body.clientHeight - (NAVBAR_HEIGHT + FOOTER_HEIGHT)) * IDEAL_CANVAS_DIMENSION_PCT;
    this._canvas.width = this._document.body.clientWidth * IDEAL_CANVAS_DIMENSION_PCT;
  }

  private initialiseCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = this._canvasControl.strokeWidth();
    canvasContext.strokeStyle = this._canvasControl.colour();
  }

  private fillCanvasWhite(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private storeCanvasSnapshot(canvasContext: CanvasRenderingContext2D): void {
    this._canvasHistory.addSnapshot(canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height));
  }
}
