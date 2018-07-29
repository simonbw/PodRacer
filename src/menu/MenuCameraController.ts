import BaseEntity from "../core/entity/BaseEntity";
import Camera from "../core/Camera";
import { Vector } from "../core/Vector";

export default class MenuCameraController extends BaseEntity {
  zoom = 0.1;
  position = [0, 0] as Vector;
  camera: Camera;

  onAdd() {
    this.camera = this.game.camera;
  }

  onRender() {
    this.camera.vx = 3 * Math.sin(-this.game.elapsedTime / 3);
    this.camera.vy = 3 * Math.cos(-this.game.elapsedTime / 3);
  }
}
