import BaseEntity from "./core/BaseEntity";
import Racer from "./racer/Racer";
import Camera from "./core/Camera";

export default class RaceCameraController extends BaseEntity {
  racer: Racer;
  camera: Camera;

  constructor(racer: Racer, camera: Camera) {
    super();
    this.racer = racer;
    this.camera = camera;
  }

  afterPhysics() {
    if (this.racer.pod) {
      const vel = this.racer.getVelocity();
      const lookAhead = vel.clone();
      lookAhead.magnitude = Math.min(
        vel.magnitude * 0.3,
        Math.sqrt(vel.magnitude)
      );
      const center = this.racer.getWorldCenter().iadd(lookAhead);
      this.camera.smoothCenter(center, vel);
      this.camera.smoothZoom(
        20 / (1 + 0.19 * Math.log(vel.magnitude + 1)),
        0.92
      );
    }
  }
}
