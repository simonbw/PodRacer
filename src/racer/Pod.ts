import * as Materials from "../physics/Materials";
import * as Pixi from "pixi.js";
import { applyAerodynamics } from "../physics/Aerodynamics";
import ControlFlap from "./ControlFlap";
import BaseEntity from "../core/entity/BaseEntity";
import p2 from "p2";
import {
  FlapDef,
  WithPosition,
  ControlFlapDirection
} from "./RacerDefs/FlapDef";
import { Vector } from "../core/Vector";
import { PodDef } from "./RacerDefs/PodDef";
import Game from "../core/Game";
import Entity from "../core/entity/Entity";

export default class Pod extends BaseEntity {
  sprite = new Pixi.Graphics();

  podDef: PodDef;
  health: number;
  leftRopePoint: Vector;
  rightRopePoint: Vector;
  flaps: ControlFlap[];

  constructor([x, y]: Vector, podDef: PodDef) {
    super();
    this.podDef = podDef;
    const [w, h] = this.size;

    this.sprite.beginFill(this.podDef.color);
    this.sprite.drawRect(-0.5 * w, -0.5 * h, w, h);
    this.sprite.endFill();

    this.health = this.podDef.health;

    this.body = new p2.Body({
      angularDamping: 0.15,
      damping: 0.001,
      mass: 1, //this.podDef.mass,
      material: Materials.RACER,
      position: [x, y]
    } as any);

    const shape = new p2.Box({ width: w, height: h });
    (shape as any).aerodynamicsEnabled = true;
    this.body.addShape(shape, [0, 0], 0);

    this.leftRopePoint = [-0.4 * w, -0.45 * h] as Vector; // point the left rope connects in local coordinates
    this.rightRopePoint = [0.4 * w, -0.45 * h] as Vector; // point the right rope connects in local coordinates

    this.flaps = [];
    for (const flapDef of this.podDef.flaps) {
      const leftDef: FlapDef & WithPosition = {
        ...flapDef,
        direction: ControlFlapDirection.Left,
        position: [-this.size[0] / 2, flapDef.y] as Vector
      };
      const rightDef: FlapDef & WithPosition = {
        ...flapDef,
        direction: ControlFlapDirection.Right,
        position: [this.size[0] / 2, flapDef.y] as Vector
      };
      this.flaps.push(new ControlFlap(this.body, leftDef));
      this.flaps.push(new ControlFlap(this.body, rightDef));
    }
  }

  get size(): Vector {
    return this.podDef.size;
  }

  get velocity(): Vector {
    return this.body.velocity as Vector;
  }

  // Set the control value on all the racer's flaps
  setFlaps(left: number, right: number) {
    for (const flap of this.flaps) {
      switch (flap.direction) {
        case ControlFlapDirection.Left:
          flap.setControl(left);
          break;
        case ControlFlapDirection.Right:
          flap.setControl(right);
          break;
      }
    }
  }

  onAdd(game: Game) {
    for (const flap of this.flaps) {
      game.addEntity(flap);
    }
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
    this.sprite.rotation = this.body.angle;
  }

  onTick() {
    applyAerodynamics(this.body, this.podDef.drag, this.podDef.drag);
  }

  onDestroy() {
    for (const flap of this.flaps) {
      flap.destroy();
    }
  }

  onImpact() {
    // TODO: Do we really want this? I don't think so
    this.health -= this.podDef.fragility;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
