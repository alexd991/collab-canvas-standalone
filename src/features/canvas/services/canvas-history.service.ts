import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CanvasHistoryService {
  private readonly _canvasSnapshotHistory: Array<ImageData> = [];

  public addSnapshot(snapshot: ImageData): void {
    this._canvasSnapshotHistory.push(snapshot);
    console.log(this._canvasSnapshotHistory);
  }

  public getLastSnapshot(): ImageData | undefined {
    return this._canvasSnapshotHistory.pop();
    console.log(this._canvasSnapshotHistory);
  }

}
