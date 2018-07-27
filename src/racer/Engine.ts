import * as Materials from "../physics/Materials";
import * as Pixi from "pixi.js";
import * as Random from "../util/Random";
import * as Util from "../util/Util";
import ControlFlap from "./ControlFlap";
import BaseEntity from "../core/BaseEntity";
import p2 from "p2";
import RacerSoundController from "../sound/RacerSoundController";
import { applyAerodynamics } from "../physics/Aerodynamics";
import { Vector } from "../core/Vector";
import { EngineDef } from "./RacerDefs/EngineDef";
import {
  ControlFlapDirection,
  FlapDef,
  WithPosition
} from "./RacerDefs/FlapDef";
import Entity from "../core/Entity/index";
import { ConditionList, Condition } from "./Conditions";

type Momentum = [number, number, number];

export default class Engine extends BaseEntity {
  side: "left" | "right";
  engineDef: EngineDef;
  sprite = new Pixi.Graphics();
  healthMeter: Pixi.Graphics;
  soundController: RacerSoundController;
  health: number;
  conditions = new ConditionList();
  boosting: boolean = false;
  throttle: number = 0.0;
  flaps: ControlFlap[] = [];
  colliding: boolean;
  lastMomentum: Momentum;
  collisionLength: number;

  constructor(position: Vector, side: "left" | "right", engineDef: EngineDef) {
    super();
    this.side = side;
    this.engineDef = engineDef;
    this.health = this.engineDef.maxHealth;
    this.soundController = new RacerSoundController(this);

    this.makeBody(position);
    this.makeSprite();
    this.makeFlaps();
  }

  makeSprite() {
    const [w, h] = this.engineDef.size;
    this.sprite.beginFill(this.engineDef.color);
    this.sprite.drawRect(-0.5 * w, -0.5 * h, w, h);
    this.sprite.endFill();
    this.sprite.lineStyle(
      this.engineDef.healthMeterBackWidth,
      this.engineDef.healthMeterBackColor
    );
    this.sprite.moveTo(0, 0.4 * this.engineDef.size[1]);
    this.sprite.lineTo(0, -0.4 * this.engineDef.size[1]);

    this.healthMeter = new Pixi.Graphics();
    this.sprite.addChild(this.healthMeter);
  }

  makeBody(position: Vector) {
    const [w, h] = this.engineDef.size;
    const bodyProps = {
      angularDamping: 0.3,
      damping: 0.0,
      mass: this.engineDef.mass,
      material: Materials.RACER,
      position
    };
    this.body = new p2.Body(bodyProps);

    const shape1 = new p2.Box({ width: w, height: h });
    (shape1 as any).aerodynamicsEnabled = true;
    this.body.addShape(shape1, [0, 0], 0);

    // invisible triangle thing in front to help with collisions
    const shape2Vertices = [
      [0.5 * w, -0.5 * h],
      [-0.5 * w, -0.5 * h],
      [0, -0.7 * h]
    ];
    const shape2 = new p2.Convex({ vertices: shape2Vertices });
    (shape2 as any).aerodynamicsEnabled = false;
    this.body.addShape(shape2, [0, 0], 0);
  }

  makeFlaps() {
    for (const engineFlapDef of this.engineDef.flaps) {
      const isLeftFlap =
        (this.side === "left" && engineFlapDef.side === "outside") ||
        (this.side === "right" && engineFlapDef.side === "inside");

      const position = [
        ((isLeftFlap ? -1 : 1) * this.engineDef.size[0]) / 2,
        engineFlapDef.y
      ] as Vector;

      const direction = isLeftFlap
        ? ControlFlapDirection.Left
        : ControlFlapDirection.Right;

      const flapDef: FlapDef & WithPosition = {
        ...engineFlapDef,
        position,
        direction
      };
      this.flaps.push(new ControlFlap(this.body, flapDef));
    }
  }

  get size(): Vector {
    return this.engineDef.size;
  }

  get velocity(): Vector {
    return this.body.velocity as Vector;
  }

  // point the rope connects in local coordinates
  get ropePoint(): Vector {
    const [w, h] = this.engineDef.size;
    return this.side === "right"
      ? ([-0.4 * w, 0.45 * h] as Vector)
      : ([0.4 * w, 0.45 * h] as Vector);
  }

  get position(): Vector {
    return this.body.position as Vector;
  }

  setThrottle(value: number) {
    // TODO: These conditions better
    value = Util.clamp(value, 0, 1);
    if (this.conditions.has(Condition.Stutter)) {
      value *= Math.random();
    }
    if (
      !this.conditions.has(Condition.ThrottleStuck) &&
      !this.conditions.has(Condition.NoThrust)
    ) {
      this.throttle = Util.clamp(value, 0, 1);
    }
  }

  // Set the control value on all the engine's flaps
  setFlaps(left: number, right: number): void {
    this.flaps.forEach(flap => {
      switch (flap.direction) {
        case ControlFlapDirection.Left:
          if (!this.conditions.has(Condition.LeftFlapStuck)) {
            flap.setControl(left);
          }
          break;
        case ControlFlapDirection.Right:
          if (!this.conditions.has(Condition.RightFlapStuck)) {
            flap.setControl(right);
          }
          break;
      }
    });
  }

  onAdd(): void {
    this.game.addEntity(this.soundController);
    this.flaps.forEach(flap => {
      this.game.addEntity(flap);
    });
  }

  onRender(): void {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.rotation = this.body.angle;

    this.healthMeter.clear();
    this.healthMeter.lineStyle(
      this.engineDef.healthMeterWidth,
      this.engineDef.healthMeterColor
    );
    this.healthMeter.moveTo(0, 0.4 * this.engineDef.size[1]);
    this.healthMeter.lineTo(
      0,
      (-0.4 * this.engineDef.size[1] * this.health) / this.engineDef.maxHealth
    );

    const left = [
      -0.5 * this.engineDef.size[0],
      0.5 * this.engineDef.size[1]
    ] as Vector;
    const right = [
      0.5 * this.engineDef.size[0],
      0.5 * this.engineDef.size[1]
    ] as Vector;
    const leftWorld = this.localToWorld(left);
    const rightWorld = this.localToWorld(right);

    //The Flame
    const rand = Math.random();
    let endPoint;
    endPoint = this.localToWorld([
      (left[0] + right[0]) / 2,
      (2.5 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
    ] as Vector);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x0000ff, 0.2);

    endPoint = this.localToWorld([
      (left[0] + right[0]) / 2,
      (1.6 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
    ] as Vector);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00aaff, 0.4);

    endPoint = this.localToWorld([
      (left[0] + right[0]) / 2,
      (0.5 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
    ] as Vector);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00ffff, 0.6);

    endPoint = this.localToWorld([
      (left[0] + right[0]) / 2,
      (0.15 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
    ] as Vector);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0xffffff, 0.8);
  }

  onTick() {
    applyAerodynamics(this.body, this.engineDef.drag, this.engineDef.drag);
    const force = this.getCurrentForce();
    const forcePoint = [0, 0.5 * this.engineDef.size[1]];
    this.body.applyForceLocal([0, -force], forcePoint);

    this.conditions.cooldown(this.game.tickTimestep);

    // Grinding
    if (this.colliding) {
      this.doCollisionDamage();
    }

    // Conditions
    if (this.conditions.has(Condition.NoThrust)) {
      this.throttle = 0;
    }
    if (this.conditions.has(Condition.BoostFailure)) {
      this.boosting = false;
    }
  }

  getDirection() {
    return this.body.angle - Math.PI / 2;
  }

  getMaxForce() {
    const force = this.boosting
      ? this.engineDef.boostMaxForce
      : this.engineDef.maxForce;
    // TODO: Is this good? Should it be wind based?
    return force + (this.body.velocity as Vector).magnitude * 0.004 * force;
  }

  getCurrentForce() {
    return this.getMaxForce() * this.throttle;
  }

  onDestroy() {
    this.soundController.destroy();
    this.flaps.forEach(flap => {
      flap.destroy();
    });
  }

  onBeginContact(other: Entity) {
    this.collisionLength = 0;
    this.lastMomentum = this.getMomentum();
    this.colliding = true;
  }

  onEndContact(other: Entity) {
    this.doCollisionDamage();
    this.colliding = false;
  }

  doCollisionDamage() {
    this.collisionLength += 1;
    const momentum = this.getMomentum();
    const xDifference = Math.abs(momentum[0] - this.lastMomentum[0]);
    const yDifference = Math.abs(momentum[1] - this.lastMomentum[1]);
    const angularDifference = Math.abs(momentum[2] - this.lastMomentum[2]);
    const damage =
      Math.random() * (xDifference + yDifference + angularDifference) ** 1.4;
    this.lastMomentum = momentum;

    if (damage > 50) {
      const condition = Random.choose(...Object.values(Condition)); // TODO: Choose conditions based on damage
      const time = 5; // TODO: Random condition durations
      this.conditions.add(condition, time);
      console.log(
        `${damage} damage: ${condition} for ${time.toFixed(1)} seconds`
      );
    }
  }

  getMomentum(): Momentum {
    const [xMomentum, yMomentum] = this.velocity.mul(this.body.mass);
    const angularMomentum = this.body.angularVelocity * this.body.inertia;
    return [xMomentum, yMomentum, angularMomentum];
  }

  boostOn() {
    if (
      !this.conditions.has(Condition.BoostStuck) &&
      !this.conditions.has(Condition.BoostFailure)
    ) {
      this.boosting = true;
    }
  }

  boostOff() {
    if (!this.conditions.has(Condition.BoostStuck)) {
      this.boosting = false;
    }
  }
}
