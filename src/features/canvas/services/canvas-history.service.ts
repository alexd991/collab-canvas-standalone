import { Injectable } from "@angular/core";
import { CanvasUndoBuffer } from "../../../utils";

@Injectable({ providedIn: 'root' })
export class CanvasHistoryService {
  private _canvasSnapshotHistory: Array<ImageData> = [];

  public addSnapshot(snapshot: ImageData): void {
    this._canvasSnapshotHistory = [...this._canvasSnapshotHistory, snapshot].slice(-CanvasUndoBuffer);
  }

  public getLatestSnapshot(): ImageData | undefined {
    return this._canvasSnapshotHistory.pop();
  }
}
