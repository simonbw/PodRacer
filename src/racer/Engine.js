import * as Materials from '../physics/Materials';
import * as Pixi from 'pixi.js';
import * as Random from '../util/Random';
import * as Util from '../util/Util';
import ControlFlap from './ControlFlap';
import Entity from '../core/Entity';
import p2 from 'p2';
import RacerSoundController from '../sound/RacerSoundController';
import { applyAerodynamics } from '../physics/Aerodynamics';


const CONDITIONS = [
  'throttle_stuck',
  'no_thrust',
  'left_flap_stuck',
  'right_flap_stuck',
  'stutter',
  'boost_stuck',
  'boost_failure'
];

export default class Engine extends Entity {
  constructor([x, y], side, engineDef) {
    super();
    this.side = side;
    this.engineDef = engineDef;
    this.size = engineDef.size;
    const [w, h] = engineDef.size;

    this.sprite = new Pixi.Graphics();
    this.sprite.beginFill(this.engineDef.color);
    this.sprite.drawRect(-0.5 * w, -0.5 * h, w, h);
    this.sprite.endFill();
    this.sprite.lineStyle(this.engineDef.healthMeterBackWidth, this.engineDef.healthMeterBackColor);
    this.sprite.moveTo(0, 0.4 * this.size[1]);
    this.sprite.lineTo(0, -0.4 * this.size[1]);

    this.sprite.healthMeter = new Pixi.Graphics();
    this.sprite.addChild(this.sprite.healthMeter);

    this.soundController = new RacerSoundController(this);

    this.health = this.engineDef.health;
    this.fragility = this.engineDef.fragility;

    this.conditions = new Set();
    this.conditionTimes = {};

    this.body = new p2.Body({
      angularDamping: 0.3,
      damping: 0.0,
      mass: this.engineDef.mass,
      material: Materials.RACER,
      position: [x, y]
    });

    const shape1 = new p2.Box({width: w, height: h});
    shape1.aerodynamics = true;
    this.body.addShape(shape1, [0, 0], 0);

    // invisible triangle thing in front
    const shape2Vertices = [[0.5 * w, -0.5 * h], [-0.5 * w, -0.5 * h], [0, -0.7 * h]];
    const shape2 = new p2.Convex({vertices: shape2Vertices});
    shape2.aerodynamics = false;
    this.body.addShape(shape2, [0, 0], 0);

    this.boosting = false;
    this.throttle = 0.0;
    if (this.side == 'right') {
      this.ropePoint = [-0.4 * w, 0.45 * h]; // point the rope connects in local coordinates
    } else {
      this.ropePoint = [0.4 * w, 0.45 * h];
    }

    this.flaps = [];
    this.engineDef.flaps.forEach((flapDef) => {
      const def = {
        color: flapDef.color,
        drag: flapDef.drag,
        length: flapDef.length,
        maxAngle: flapDef.maxAngle
      };
      if ((this.side == 'left' && flapDef.side == 'outside') || (this.side == 'right' && flapDef.side == 'inside')) {
        console.log('left flap');
        def['direction'] = ControlFlap.LEFT;
        def['position'] = [-this.engineDef.size[0] / 2, flapDef.y];
      } else {
        console.log('right flap');
        def['direction'] = ControlFlap.RIGHT;
        def['position'] = [this.engineDef.size[0] / 2, flapDef.y];
      }
      this.flaps.push(new ControlFlap(this.body, def));
    });
  }

  setThrottle(value) {
    if (this.conditions.has('stutter')) {
      value *= Math.random();
    }
    if (!this.conditions.has('throttle_stuck') && !this.conditions.has('no_thrust')) {
      this.throttle = Util.clamp(value, 0, 1);
    }
  }

  // Set the control value on all the engine's flaps
  setFlaps(left, right) {
    this.flaps.forEach((flap) => {
      if (flap.direction == ControlFlap.LEFT && !this.conditions.has('left_flap_stuck')) {
        flap.setControl(left)
      }
      if (flap.direction == ControlFlap.RIGHT && !this.conditions.has('right_flap_stuck')) {
        flap.setControl(right)
      }
    });
  }

  onAdd() {
    this.game.addEntity(this.soundController);
    this.flaps.forEach((flap) => {
      this.game.addEntity(flap);
    });
  }

  onRender() {
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
    this.sprite.rotation = this.body.angle;

    this.sprite.healthMeter.clear();
    this.sprite.healthMeter.lineStyle(this.engineDef.healthMeterWidth, this.engineDef.healthMeterColor);
    this.sprite.healthMeter.moveTo(0, 0.4 * this.size[1]);
    this.sprite.healthMeter.lineTo(0, -0.4 * this.size[1] * this.health / this.engineDef.health);

    const left = [-0.5 * this.size[0], 0.5 * this.size[1]];
    const right = [0.5 * this.size[0], 0.5 * this.size[1]];
    const leftWorld = this.localToWorld(left);
    const rightWorld = this.localToWorld(right);

    //The Flame
    const rand = Math.random();
    let endPoint;
    endPoint = this.localToWorld([(left[0] + right[0]) / 2, (2.5 + rand) * this.throttle + 0.5 * this.size[1]]);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x0000FF, 0.2);

    endPoint = this.localToWorld([(left[0] + right[0]) / 2, (1.6 + rand) * this.throttle + 0.5 * this.size[1]]);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00AAFF, 0.4);

    endPoint = this.localToWorld([(left[0] + right[0]) / 2, (0.5 + rand) * this.throttle + 0.5 * this.size[1]]);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00FFFF, 0.6);

    endPoint = this.localToWorld([(left[0] + right[0]) / 2, (0.15 + rand) * this.throttle + 0.5 * this.size[1]]);
    this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0xFFFFFF, 0.8);
  }

  onTick() {
    applyAerodynamics(this.body, this.engineDef.drag, this.engineDef.drag);
    const force = this.getCurrentForce();
    const forcePoint = [0, 0.5 * this.size[1]];
    this.body.applyForceLocal([0, -force], forcePoint);

    this.conditions.forEach((condition) => {
      this.conditionTimes[condition] -= this.game.timestep;
      if (this.conditionTimes[condition] <= 0) {
        this.conditions.delete(condition);
        console.log(`ending: ${condition}`);
      }
    });

    // Grinding
    if (this.colliding) {
      this.doCollisionDamage()
    }

    // Conditions
    if (this.conditions.has('no_thrust')) {
      this.throttle = 0;
    }
    if (this.conditions.has('boost_failure')) {
      this.boosting = false;
    }
  }

  getDirection() {
    return this.body.angle - Math.PI / 2;
  }

  getMaxForce() {
    const force = this.boosting ? this.engineDef.boostMaxForce : this.engineDef.maxForce;
    return force + this.body.velocity.magnitude * 0.004 * force; // TODO: Is this good? Should it be wind based?
  }

  getCurrentForce() {
    return this.getMaxForce() * this.throttle;
  }

  onDestroy() {
    this.flaps.forEach((flap) => {
      flap.destroy()
    });
    this.soundController.destroy();
  }

  onBeginContact(other, contactEquations) {
    this.collisionLength = 0;
    this.lastMomentum = this.getMomentum();
    this.colliding = true
  }

  onEndContact(other) {
    this.doCollisionDamage();
    this.colliding = false
  }

  doCollisionDamage() {
    this.collisionLength += 1;
    const momentum = this.getMomentum();
    const xDifference = Math.abs(momentum[0] - this.lastMomentum[0]);
    const yDifference = Math.abs(momentum[1] - this.lastMomentum[1]);
    const angularDifference = Math.abs(momentum[2] - this.lastMomentum[2]);
    const damage = Math.random() * (xDifference + yDifference + angularDifference)**1.4;
    this.lastMomentum = momentum;

    if (damage > 50) {
      const condition = Random.choose(CONDITIONS); // TODO: Choose conditions based on damage
      this.conditions.add(condition);
      const time = 5; // TODO: Random condition durations
      this.conditionTimes[condition] = this.conditionTimes[condition] + time || time;
      console.log(`${damage} damage: ${condition} for ${time.toFixed(1)} seconds`);
    }
  }

  repair() {
    this.conditions.clear();
  }

  getMomentum() {
    const xMomentum = this.body.velocity[0] * this.body.mass;
    const yMomentum = this.body.velocity[1] * this.body.mass;
    const angularMomentum = this.body.angularVelocity * this.body.inertia;
    return [xMomentum, yMomentum, angularMomentum]
  }

  boostOn() {
    if (!this.conditions.has('boost_stuck') && !this.conditions.has('boost_failure')) {
      this.boosting = true;
    }
  }

  boostOff() {
    if (!this.conditions.has('boost_stuck')) {
      this.boosting = false;
    }
  }
}
