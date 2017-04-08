import Entity from './core/Entity';

export default class MenuCameraController extends Entity {
  onAdd() {
    this.zoom = 0.1;
    this.camera = this.game.camera;
    this.position = [0, 0];
    this.camera.vx = 0;
    this.camera.vy = 0;
  }
  
  onRender() {
    this.camera.x += 0.05;
    this.camera.y += 0.05;
  }
}
