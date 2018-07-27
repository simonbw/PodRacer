import BaseEntity from "./core/BaseEntity";
import Camera from "./core/Camera";
import { Vector } from "./core/Vector";

export default class MenuCameraController extends BaseEntity {
  zoom = 0.1;
  position = [0, 0] as Vector;
  camera: Camera;

  onAdd() {
    this.camera = this.game.camera;
    this.camera.vx = 0;
    this.camera.vy = 0;
  }

  onRender() {
    this.camera.x += 0.05 * Math.sin(-this.game.elapsedTime / 2); // TODO: make non-framerate dependent
    this.camera.y += 0.05 * Math.cos(-this.game.elapsedTime / 2);
  }
}
