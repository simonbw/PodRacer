import BaseEntity from "../core/entity/BaseEntity";
import TrackEditCameraController from "./TrackEditCameraController";
import PauseController from "../core/PauseController";

export class TrackEditMode extends BaseEntity {
  constructor() {
    super();
  }

  onAdd() {
    this.game.addEntity(new TrackEditCameraController());
    this.game.addEntity(new PauseController());
  }

  onDestroy() {}
}
