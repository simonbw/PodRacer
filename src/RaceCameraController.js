import Entity from './core/Entity';
import p2 from 'p2';

export default class CameraController extends Entity {
  constructor(racer, camera) {
    super();
    this.racer = racer;
    this.camera = camera;
  }

  afterTick() {
    if (this.racer.pod) {
      const vel = this.racer.getVelocity();
      const lookAhead = vel.clone();
      lookAhead.magnitude = Math.min(vel.magnitude * 0.3, Math.sqrt(vel.magnitude));
      const center = this.racer.getWorldCenter().iadd(lookAhead);
      this.camera.smoothCenter(center, vel);
      this.camera.smoothZoom(20 / (1 + 0.19 * Math.log(vel.magnitude + 1)), 0.92);
    }
  }
}
