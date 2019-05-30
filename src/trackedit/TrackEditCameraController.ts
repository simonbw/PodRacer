import Camera from "../core/Camera";
import BaseEntity from "../core/entity/BaseEntity";
import { Vector } from "../core/Vector";
import * as Key from "../core/constants/Keys";

export default class TrackEditCameraController extends BaseEntity {
  camera: Camera;

  onAdd() {
    this.camera = this.game.camera;
  }

  afterPhysics() {
    const shiftDown = this.game.io.keys[Key.SHIFT];

    const zoomSpeed = shiftDown ? 0.02 : 0.05;
    const zoom = this.camera.z * (1.0 + zoomSpeed * this.getZoomAmount());
    this.camera.smoothZoom(zoom, 0.5);

    const moveSpeed = (shiftDown ? 50 : 250) / this.camera.z ** 0.7;
    const velocity = this.getMoveVector().imul(moveSpeed);
    this.camera.smoothSetVelocity(velocity, 0.5);
  }

  private getMoveVector(): Vector {
    const keys = this.game.io.keys;

    const up = keys[Key.UP] || keys[Key.W];
    const down = keys[Key.DOWN] || keys[Key.S];
    const left = keys[Key.LEFT] || keys[Key.A];
    const right = keys[Key.RIGHT] || keys[Key.D];

    return [
      (left ? -1 : 0) + (right ? 1 : 0),
      (up ? -1 : 0) + (down ? 1 : 0)
    ] as Vector;
  }

  private getZoomAmount(): number {
    const keys = this.game.io.keys;
    return (keys[Key.PLUS] ? 1 : 0) + (keys[Key.MINUS] ? -1 : 0);
  }
}
