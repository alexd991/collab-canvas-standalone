import { ChangeDetectionStrategy, Component, ElementRef, Inject, viewChild } from '@angular/core';
import { Subscription, debounceTime, filter, fromEvent, map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { CanvasControlService, CanvasHistoryService } from './services';
import { CanvasEventData, CursorMode, CanvasPosition, LineData } from './canvas.models';
import { DOCUMENT, WINDOW } from '../../tokens';
import { FOOTER_HEIGHT, IDEAL_CANVAS_DIMENSION_PCT, LINE_STYLE, NAVBAR_HEIGHT, RUBBER_COLOUR } from '../../utils';
import { FillData, colourMatch, hexToRGBA, getOldColour, replacePixel } from '../toolbar/tools/flood-fill';

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

    this.createSubscriptions(this.createCanvasEventData(canvasContext));
  }

  private createCanvasEventData(canvasContext: CanvasRenderingContext2D): CanvasEventData {
    const mouseDownFreeDraw$ = fromEvent<MouseEvent>(this._canvas, 'pointerdown')
      .pipe(
        filter(
          () => this._canvasControl.cursorMode() === CursorMode.Brush || this._canvasControl.cursorMode() === CursorMode.Rubber
        ),
        tap(() => this.storeCanvasSnapshot(canvasContext)),
      );

    const mouseDownLine$ = fromEvent<MouseEvent>(this._canvas, 'pointerdown')
      .pipe(
        filter(() => this._canvasControl.cursorMode() === CursorMode.Line),
        tap(() => this.storeCanvasSnapshot(canvasContext)),
      );

    const mouseDownFill$ = fromEvent<MouseEvent>(this._canvas, 'pointerdown')
      .pipe(
        filter(() => this._canvasControl.cursorMode() === CursorMode.Fill),
        tap(() => this.storeCanvasSnapshot(canvasContext)),
      );

    const mouseUp$ = fromEvent<MouseEvent>(this._document, 'pointerup');

    const canvasPosition$ = fromEvent<MouseEvent>(this._canvas, 'pointermove')
      .pipe(
        map((event: MouseEvent) => this.toCanvasPosition(event)),
      );

    const lineData$ = canvasPosition$
      .pipe(
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
      lineData$,
      mouseUp$,
      canvasContext,
    }
  }

  private createSubscriptions(canvasEventData: CanvasEventData): void {
    const {
      mouseDownFreeDraw$,
      mouseDownLine$,
      mouseDownFill$,
      canvasPosition$,
      lineData$,
      mouseUp$,
      canvasContext,
    } = canvasEventData;

    this._subscriptions.add(
      mouseDownFreeDraw$
        .pipe(
          switchMap(() => lineData$.pipe(takeUntil(mouseUp$)))
        )
        .subscribe((lineData) => this.drawBrushStroke(canvasContext, lineData))
    );

    this._subscriptions.add(
      mouseDownLine$
        .pipe(
          map((event: MouseEvent) => [ this.toCanvasPosition(event), this._canvasHistory.latestSnapshotCopy() ] as const),
          switchMap(([start, snapshot]) => canvasPosition$
            .pipe(
              map((end) => ([ { start, end } as LineData, snapshot ] as const)),
              takeUntil(mouseUp$)
            ),
          ),
        ).subscribe(([lineData, snapshot]) => {
          // remove temporary line by restoring the previous snapshot
          if(snapshot){
            canvasContext.putImageData(snapshot, 0, 0);
          }

          this.drawBrushStroke(canvasContext, lineData);
        })
    );

    this._subscriptions.add(
      mouseDownFill$
      .pipe(
        map((event: MouseEvent): FillData => {
          const startPosition = this.toCanvasPosition(event);
          const imageData = canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height);
          const oldColour = getOldColour(imageData, startPosition);
          const newColour = hexToRGBA(this._canvasControl.colour());

          return { startPosition, imageData, oldColour, newColour };
        })
      ).subscribe((fillData) =>  this.floodFill(canvasContext, fillData))
    );

    this._subscriptions.add(
      fromEvent(this._window, 'resize')
        .pipe(debounceTime(10))
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
        const latestSnapshot = this._canvasHistory.latestSnapshot();
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
    lineData: LineData
  ): void {
    const { start, end } = lineData;

    if (start.x === end.x && start.y === end.y) {
      return;
    }

    canvasContext.lineWidth = this._canvasControl.strokeDiameter();
    canvasContext.strokeStyle = this._canvasControl.cursorMode() === CursorMode.Rubber
      ? RUBBER_COLOUR
      : this._canvasControl.colour();

    canvasContext.beginPath();
    canvasContext.moveTo(start.x, start.y);
    canvasContext.lineTo(end.x, end.y);
    canvasContext.closePath();
    canvasContext.stroke();
  }

  private floodFill(
    canvasContext: CanvasRenderingContext2D,
    fillData: FillData
  ): void {
    const { startPosition, imageData, oldColour, newColour } = fillData;

    const data = imageData.data;
    const xLength = imageData.width;
    const yLength = imageData.height;
    const startIdx = [startPosition.x, startPosition.y] as const;

    const queue = [startIdx];

    while(queue.length) {
      const [x, y] = queue.pop()!;

      if (x < 0 || x >= xLength || y < 0 || y >= yLength) {
        continue;
      }

      const index = (y * xLength + x) * 4;

      if (colourMatch(data.slice(index, index + 4), oldColour)) {
        replacePixel(data, index, newColour);
        queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    canvasContext.putImageData(imageData, 0, 0);
  }

  private setCanvasDimensions(): void {
    this._canvas.height = (this._document.body.clientHeight - (NAVBAR_HEIGHT + FOOTER_HEIGHT)) * IDEAL_CANVAS_DIMENSION_PCT;
    this._canvas.width = this._document.body.clientWidth * IDEAL_CANVAS_DIMENSION_PCT;
  }

  private initialiseCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.lineCap = LINE_STYLE;
    canvasContext.lineJoin = LINE_STYLE;
    canvasContext.lineWidth = this._canvasControl.strokeDiameter();
    canvasContext.strokeStyle = this._canvasControl.colour();
  }

  private fillCanvasWhite(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private storeCanvasSnapshot(canvasContext: CanvasRenderingContext2D): void {
    this._canvasHistory.addSnapshot(canvasContext.getImageData(0, 0, this._canvas.width, this._canvas.height));
  }

  private toCanvasPosition(event: MouseEvent): CanvasPosition {
    return {
      x: Math.floor(event.clientX - this._canvas.getBoundingClientRect().left),
      y: Math.floor(event.clientY - this._canvas.getBoundingClientRect().top),
    };
  }
}
