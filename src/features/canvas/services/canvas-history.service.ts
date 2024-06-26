import { Injectable, computed, signal } from "@angular/core";
import { UNDO_BUFFER } from "utils/constants";

@Injectable({ providedIn: 'root' })
export class CanvasHistoryService {
  private readonly _canvasSnapshotHistory = signal<Array<ImageData>>([]);

  public readonly hasSnapshots = computed(() => this._canvasSnapshotHistory().length > 0);

  public addSnapshot(snapshot: ImageData): void {
    this._canvasSnapshotHistory.update(history => [...history, snapshot].slice(-UNDO_BUFFER));
  }

  public latestSnapshot(): ImageData | undefined {
    const latestSnapshot = this._canvasSnapshotHistory().slice(-1)[0];

    this._canvasSnapshotHistory.update(history => history.slice(0, -1));

    return latestSnapshot;
  }

  public latestSnapshotCopy(): ImageData | undefined {
    return this._canvasSnapshotHistory().slice(-1)[0];
  }
}
