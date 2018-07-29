import Coupling from "./Coupling";
import Engine from "./Engine";
import BaseEntity from "../core/entity/BaseEntity";
import { LinearSpring } from "p2";
import Pod from "./Pod";
import RopeSpring from "../physics/RopeSpring";
import { Vector } from "../core/Vector";
import Game from "../core/Game";
import { RacerDef, Anakin } from "./RacerDefs/index";
import { RacerSoundController } from "../sound/RacerSoundController";

export default class Racer extends BaseEntity {
  layer: "world" = "world";

  racerDef: RacerDef;
  pod: Pod;
  leftEngine: Engine;
  rightEngine: Engine;
  coupling: Coupling;
  springs: Array<RopeSpring | LinearSpring> = [];
  soundController: RacerSoundController;

  constructor(position: Vector, racerDef = Anakin) {
    super();
    this.racerDef = racerDef;
    const podPosition = position.add(this.racerDef.podPosition);
    const leftEnginePosition = position.add(this.racerDef.leftEnginePosition);
    const rightEnginePosition = position.add(this.racerDef.rightEnginePosition);
    this.pod = new Pod(podPosition, this.racerDef.pod);
    this.leftEngine = new Engine(
      leftEnginePosition,
      "left",
      this.racerDef.engine
    );
    this.rightEngine = new Engine(
      rightEnginePosition,
      "right",
      this.racerDef.engine
    );

    // The visible coupling
    this.coupling = new Coupling(
      this.leftEngine,
      this.rightEngine,
      0,
      0,
      0xff22aa,
      1
    );

    this.addRopeSpring(this.leftEngine, this.pod.leftRopePoint as Vector);
    this.addRopeSpring(this.rightEngine, this.pod.rightRopePoint as Vector);

    this.addCouplingSpring(-1, -1);
    this.addCouplingSpring(-1, 1);
    this.addCouplingSpring(1, -1);
    this.addCouplingSpring(1, 1);

    this.soundController = new RacerSoundController(this);
  }

  private addRopeSpring(engine: Engine, podPoint: Vector): void {
    this.springs.push(
      new RopeSpring(this.pod.body, engine.body, {
        localAnchorA: podPoint,
        localAnchorB: engine.ropePoint as Vector,
        stiffness: this.racerDef.rope.stiffness,
        damping: this.racerDef.rope.damping
      })
    );
  }

  private addCouplingSpring(y1: number, y2: number): void {
    this.springs.push(
      new LinearSpring(this.leftEngine.body, this.rightEngine.body, {
        localAnchorA: [0, this.racerDef.engine.size[1] * y1],
        localAnchorB: [0, this.racerDef.engine.size[1] * y2],
        stiffness: this.racerDef.coupling.stiffness,
        damping: this.racerDef.coupling.damping
      })
    );
  }

  onAdd(game: Game) {
    game.addEntity(this.pod);
    game.addEntity(this.leftEngine);
    game.addEntity(this.rightEngine);
    game.addEntity(this.soundController);

    game.addEntity(this.coupling);

    for (const spring of this.springs) {
      game.world.addSpring(spring);
    }
  }

  onRender() {
    if (!this.pod) {
      return;
    }

    const width = this.racerDef.rope.size; // width in meters of the rope
    const color = this.racerDef.rope.color;

    if (this.leftEngine) {
      const podLeftPoint = this.pod.localToWorld(this.pod
        .leftRopePoint as Vector);
      const leftEnginePoint = this.leftEngine.localToWorld(this.leftEngine
        .ropePoint as Vector);
      this.game.draw.line(podLeftPoint, leftEnginePoint, width, color);
    }

    if (this.rightEngine) {
      const podRightPoint = this.pod.localToWorld(this.pod
        .rightRopePoint as Vector);
      const rightEnginePoint = this.rightEngine.localToWorld(this.rightEngine
        .ropePoint as Vector);
      this.game.draw.line(podRightPoint, rightEnginePoint, width, color);
    }
  }

  // Set the control value on all the racer's flaps
  // `left` and `right` should each be between 0 and 1
  setFlaps(left: number, right: number) {
    if (!isFinite(left) || !isFinite(right)) {
      throw new Error(`not finite: ${[left, right]}`);
    }
    if (this.pod) {
      this.pod.setFlaps(left, right);
    }
    if (this.leftEngine) {
      this.leftEngine.setFlaps(left, right);
    }
    if (this.rightEngine) {
      this.rightEngine.setFlaps(left, right);
    }
  }

  // Returns some average velocity of existing parts
  getVelocity(): Vector {
    let x = 0;
    let y = 0;
    const parts = [this.leftEngine, this.rightEngine, this.pod].filter(
      part => part
    );
    for (const part of parts) {
      if (part) {
        x += part.body.velocity[0] / parts.length;
        y += part.body.velocity[1] / parts.length;
      }
    }
    return [x, y] as Vector;
  }

  // Returns the average position of existing parts
  getWorldCenter(): Vector {
    let x = 0;
    let y = 0;
    const parts = [this.leftEngine, this.rightEngine, this.pod].filter(
      part => part
    );
    for (const part of parts) {
      if (part) {
        x += part.body.position[0] / parts.length;
        y += part.body.position[1] / parts.length;
      }
    }
    return [x, y] as Vector;
  }

  onDestroy() {
    this.soundController.destroy();
    this.pod.destroy();
    this.leftEngine.destroy();
    this.rightEngine.destroy();
    for (let spring of this.springs) {
      this.game.world.removeSpring(spring);
    }
  }

  afterPhysics() {
    for (const spring of this.springs) {
      if (!spring.bodyA.owner!.game || !spring.bodyB.owner!.game) {
        console.log("removing spring");
        this.game.world.removeSpring(spring);
      }
    }
  }
}
