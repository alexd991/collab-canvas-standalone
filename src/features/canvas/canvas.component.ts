import { ChangeDetectionStrategy, Component, ElementRef, Inject, viewChild } from '@angular/core';
import { Observable, Subscription, debounceTime, filter, fromEvent, map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { CanvasControlService, CanvasHistoryService } from './services';
import { CanvasEventStreams, CursorMode, CanvasPosition, LineData } from './canvas.models';
import { DOCUMENT, WINDOW } from '../../tokens';
import { FOOTER_HEIGHT, IDEAL_CANVAS_DIMENSION_PCT, LINE_STYLE, NAVBAR_HEIGHT, WHITE, lineHasNoLength } from '../../utils';
import { FillData, coloursMatch, floodFillImageData, toRGBA } from '../toolbar/tools/flood-fill';

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
  private _canvasContext!: CanvasRenderingContext2D;
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
    this._canvasContext = this._canvas.getContext('2d', { alpha: false, willReadFrequently: true })!;

    this.setCanvasDimensions();
    this.initialiseCanvasContext();
    this.fillCanvasWhite();

    this.createSubscriptions(this.createCanvasEventStreams());
  }

  private createCanvasEventStreams(): CanvasEventStreams {
    const mouseDownFreeDraw$ = this.createPointerDownEvent(
      () => this._canvasControl.cursorMode() === CursorMode.Brush || this._canvasControl.cursorMode() === CursorMode.Rubber
    );

    const mouseDownLine$ = this.createPointerDownEvent(
      () => this._canvasControl.cursorMode() === CursorMode.Line
    );

    const mouseDownFill$ = this.createPointerDownEvent(
      () => this._canvasControl.cursorMode() === CursorMode.Fill
    );

    const mouseUp$ = fromEvent<MouseEvent>(this._document, 'pointerup');

    const canvasPosition$ = fromEvent<MouseEvent>(this._canvas, 'pointermove').pipe(
      map((event: MouseEvent) => this.toCanvasPosition(event)),
    );

    const lineSegment$ = canvasPosition$.pipe(
      pairwise(),
      map(([start, end]): LineData => ({ start, end })),
      startWith<LineData>({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      }),
    );

    return {
      mouseDownFreeDraw$,
      mouseDownLine$,
      mouseDownFill$,
      canvasPosition$,
      lineSegment$,
      mouseUp$,
    }
  }

  private createSubscriptions(canvasEventStreams: CanvasEventStreams): void {
    const {
      mouseDownFreeDraw$,
      mouseDownLine$,
      mouseDownFill$,
      canvasPosition$,
      lineSegment$,
      mouseUp$,
    } = canvasEventStreams;

    [
      this.freeDrawSubscription(mouseDownFreeDraw$, lineSegment$, mouseUp$),
      this.straightLineSubscription(mouseDownLine$, canvasPosition$, mouseUp$),
      this.fillSubscription(mouseDownFill$),
      this.resizeCanvasSubscription(),
      this.undoSubscription(),
      this.clearCanvasSubscription(),
    ].forEach((subscription) => this._subscriptions.add(subscription));
  }

  private drawBrushStroke(lineData: LineData): void {
    if(lineHasNoLength(lineData)) {
      return;
    }

    const { start, end } = lineData;

    this._canvasContext.lineWidth = this._canvasControl.strokeDiameter();
    this._canvasContext.strokeStyle = this._canvasControl.cursorMode() === CursorMode.Rubber
      ? WHITE
      : this._canvasControl.colour();

    this._canvasContext.beginPath();
    this._canvasContext.moveTo(start.x, start.y);
    this._canvasContext.lineTo(end.x, end.y);
    this._canvasContext.closePath();
    this._canvasContext.stroke();
  }

  private floodFill(fillData: FillData): void {
    const imageData = floodFillImageData(fillData);
    this._canvasContext.putImageData(imageData, 0, 0);
  }

  private setCanvasDimensions(): void {
    this._canvas.height = (this._document.body.clientHeight - (NAVBAR_HEIGHT + FOOTER_HEIGHT)) * IDEAL_CANVAS_DIMENSION_PCT;
    this._canvas.width = this._document.body.clientWidth * IDEAL_CANVAS_DIMENSION_PCT;
  }

  private initialiseCanvasContext(): void {
    this._canvasContext.lineCap = LINE_STYLE;
    this._canvasContext.lineJoin = LINE_STYLE;
    this._canvasContext.lineWidth = this._canvasControl.strokeDiameter();
    this._canvasContext.strokeStyle = this._canvasControl.colour();
  }

  private fillCanvasWhite(): void {
    this._canvasContext.fillStyle = WHITE;
    this._canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private storeCanvasSnapshot(): void {
    const snapshot = this._canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);
    this._canvasHistory.addSnapshot(snapshot);
  }

  private toCanvasPosition(event: MouseEvent): CanvasPosition {
    return {
      x: Math.floor(event.clientX - this._canvas.getBoundingClientRect().left),
      y: Math.floor(event.clientY - this._canvas.getBoundingClientRect().top),
    };
  }

  private createPointerDownEvent(conditionFn: () => boolean): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(this._canvas, 'pointerdown').pipe(
      filter(conditionFn),
      tap(() => this.storeCanvasSnapshot()),
    );
  }

  private straightLineSubscription(
    mouseDownLine$: Observable<MouseEvent>,
    canvasPosition$: Observable<CanvasPosition>,
    mouseUp$: Observable<MouseEvent>
  ): Subscription {
    return mouseDownLine$.pipe(
      map((mouseEvent) => [this.toCanvasPosition(mouseEvent), this._canvasHistory.latestSnapshotCopy()] as const),
      switchMap(([start, snapshot]) => canvasPosition$.pipe(
          map((end) => [start, end, snapshot] as const),
          takeUntil(mouseUp$),
        )
      ),
    )
    .subscribe(([start, end, snapshot]) => {
      // remove temporary line by restoring the previous snapshot
      if(snapshot){
        this._canvasContext.putImageData(snapshot, 0, 0);
      }

      this.drawBrushStroke({ start, end });
    });
  }

  private fillSubscription(mouseDownFill$: Observable<MouseEvent>): Subscription {
    return mouseDownFill$.pipe(
      map((mouseEvent): FillData => {
        const startPosition = this.toCanvasPosition(mouseEvent);
        const imageData = this._canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);
        const oldColour = toRGBA(imageData, startPosition);
        const newColour = toRGBA(this._canvasControl.colour());

        return { startPosition, imageData, oldColour, newColour };
      }),
      filter(({ oldColour, newColour }) => !coloursMatch(oldColour, newColour)),
    )
    .subscribe((fillData) =>  this.floodFill(fillData));
  }

  private freeDrawSubscription(
    mouseDownFreeDraw$: Observable<MouseEvent>,
    lineData$: Observable<LineData>,
    mouseUp$: Observable<MouseEvent>
  ): Subscription {
    return mouseDownFreeDraw$.pipe(
      switchMap(() => lineData$.pipe(takeUntil(mouseUp$)))
    )
    .subscribe((lineData) => this.drawBrushStroke(lineData))
  }

  private resizeCanvasSubscription(): Subscription {
    return fromEvent(this._window, 'resize')
      .pipe(debounceTime(10))
      .subscribe(() => {
        const imageData = this._canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);

        this.setCanvasDimensions();
        this.initialiseCanvasContext();
        this.fillCanvasWhite();

        this._canvasContext.putImageData(imageData, 0, 0);
      });
  }

  private undoSubscription(): Subscription {
    return this._canvasControl.canvasUndo$.subscribe(() => {
      const latestSnapshot = this._canvasHistory.latestSnapshot();

      if (latestSnapshot) {
        this._canvasContext.putImageData(latestSnapshot, 0, 0);
      }
    });
  }

  private clearCanvasSubscription(): Subscription {
    return this._canvasControl.clearCanvas$.subscribe(() => {
      this.storeCanvasSnapshot();
      this.fillCanvasWhite();
    });
  }
}
