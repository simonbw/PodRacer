import * as Pixi from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import * as Materials from "../physics/Materials";
import p2 from "p2";
import { Vector } from "../core/Vector";

export default class Wall extends BaseEntity {
  sprite = new Pixi.Graphics();

  x: number;
  y: number;
  w: number;
  h: number;
  path: any[];
  corners: Pixi.Point[];
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.w = 400;
    this.h = 1;
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
    const bodyProps = {
      mass: 0,
      material: Materials.WALL,
      position: [x, y] as Vector
    };
    this.body = new p2.Body(bodyProps);
    const shape = new p2.Box({ width: this.w, height: this.h });
    this.body.addShape(shape, [0, 0], 0);
  }
}
