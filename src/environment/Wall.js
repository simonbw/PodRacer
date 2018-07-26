import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';
import * as Materials from '../physics/Materials';
import p2 from 'p2';

export default class Wall extends Entity {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.w = 400;
    this.h = 1;
    this.sprite = new Pixi.Graphics();
    this.path = [];
    this.corners = [
      new Pixi.Point(0.5 * this.w, 0.5 * this.h),
      new Pixi.Point(0.5 * this.w, -0.5 * this.h),
      new Pixi.Point(-0.5 * this.w, -0.5 * this.h),
      new Pixi.Point(-0.5 * this.w, 0.5 * this.h)
    ];
    this.sprite.beginFill(0x000000);
    this.sprite.drawPolygon(this.corners);
    this.sprite.endFill();
    this.body = new p2.Body({
      mass: 0,
      material: Materials.WALL,
      position: [x, y]
    });
    const shape = new p2.Box({ width: this.w, height: this.h });
    this.body.addShape(shape, [0, 0], 0);
    this.shape.x = this.body.position.x;
    this.shape.y = this.body.position.y;
  }
}