import BaseEntity from "../core/entity/BaseEntity";
import { Vector } from "../core/Vector";
import * as Pixi from "pixi.js";

export class WaypointMarker extends BaseEntity {
  center: Vector;
  radius: number;
  sprite = new Pixi.Graphics();

  constructor(center: Vector, radius: number) {
    super();
    this.center = center;
    this.radius = radius;

    this.sprite.beginFill(0x00ff00, 0.3);
    this.sprite.drawCircle(0, 0, this.radius);
    this.sprite.endFill();
    [this.sprite.x, this.sprite.y] = this.center;
  }
}
