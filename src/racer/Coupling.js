import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';
import p2 from 'p2';


export default class Coupling extends Entity {
  constructor(leftEngine, rightEngine, leftPosition, rightPosition, color, power) {
    super();
    this.leftEngine = leftEngine;
    this.rightEngine = rightEngine;
    this.leftPosition = leftPosition;
    this.rightPosition = rightPosition;
    this.color = color;
    this.power = power;
    this.sprite = new Pixi.Graphics()
  }

  onRender() {
    const betweenVec = [this.leftEngine.body.position[0] - this.rightEngine.body.position[0], this.leftEngine.body.position[1] - this.rightEngine.body.position[1]];
    const length = p2.vec2.length(betweenVec);

    let left = [0.5 * this.leftEngine.size[0], this.leftPosition];
    left = this.leftEngine.localToWorld(left);

    let right = [-0.5 * this.rightEngine.size[0], this.rightPosition];
    right = this.rightEngine.localToWorld(right);

    const width = this.power / (length * length) * (Math.random() + 0.5);
    const alpha = Math.random() + 0.4;

    this.game.draw.line(left, right, width, this.color, alpha);
  }

  afterTick() {
    if (this.leftEngine.game == null || this.rightEngine.game == null) {
      this.destroy();
    }
  }
}
