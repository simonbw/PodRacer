import * as Pixi from "pixi.js";
import BaseEntity from "../core/BaseEntity";
import p2 from "p2";
import { Vector } from "../core/Vector";
import Engine from "./Engine";

export default class Coupling extends BaseEntity {
  sprite = new Pixi.Graphics();

  leftEngine: Engine;
  rightEngine: Engine;
  leftPosition: number;
  rightPosition: number;
  color: number;
  power: number;

  constructor(
    leftEngine: Engine,
    rightEngine: Engine,
    leftPosition: number,
    rightPosition: number,
    color: number,
    power: number
  ) {
    super();
    this.leftEngine = leftEngine;
    this.rightEngine = rightEngine;
    this.leftPosition = leftPosition;
    this.rightPosition = rightPosition;
    this.color = color;
    this.power = power;
  }

  onRender() {
    const leftBodyPosition = this.leftEngine.body.position as Vector;
    const rightBodyPosition = this.rightEngine.body.position as Vector;
    const length = leftBodyPosition.sub(rightBodyPosition).magnitude;

    const left = this.leftEngine.localToWorld([
      0.5 * this.leftEngine.size[0],
      this.leftPosition
    ] as Vector);

    const right = this.rightEngine.localToWorld([
      -0.5 * this.rightEngine.size[0],
      this.rightPosition
    ] as Vector);

    const width = (this.power / (length * length)) * (Math.random() + 0.5);
    const alpha = Math.random() + 0.4;

    this.game.draw.line(left, right, width, this.color, alpha);
  }

  afterTick() {
    if (this.leftEngine.game == null || this.rightEngine.game == null) {
      this.destroy();
    }
  }
}
