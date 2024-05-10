import { Injectable, computed, signal } from "@angular/core";
import { UNDO_BUFFER } from "../../../utils";

@Injectable({ providedIn: 'root' })
export class CanvasHistoryService {
  private readonly _canvasSnapshotHistory = signal<Array<ImageData>>([]);

  public readonly hasSnapshots = computed(() => this._canvasSnapshotHistory().length > 0);

  public addSnapshot(snapshot: ImageData): void {
    this._canvasSnapshotHistory.update(history => [...history, snapshot].slice(-UNDO_BUFFER));
  }

  public getLatestSnapshot(): ImageData | undefined {
    const latestSnapshot = this._canvasSnapshotHistory().slice(-1)[0];

    this._canvasSnapshotHistory.update(history => history.slice(0, -1));

    return latestSnapshot;
  }
}
