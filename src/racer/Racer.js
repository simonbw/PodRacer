import Coupling from "./Coupling";
import Engine from "./Engine";
import Entity from "../core/Entity";
import p2 from "p2";
import Pod from "./Pod";
import * as RacerDefs from "./RacerDefs";
import RopeSpring from "../physics/RopeSpring";

const LinearSpring = p2.LinearSpring;

export default class Racer extends Entity {
  constructor([x, y], racerDef = RacerDefs.ANAKIN) {
    super();
    this.layer = "world";
    this.racerDef = racerDef;
    const podPosition = [x, y].add(this.racerDef.podPosition);
    const leftEnginePosition = [x, y].add(this.racerDef.leftEnginePosition);
    const rightEnginePosition = [x, y].add(this.racerDef.rightEnginePosition);
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
    this.coupling = new Coupling(
      this.leftEngine,
      this.rightEngine,
      0,
      0,
      0xff22aa,
      1
    );

    // Springs
    this.springs = [];
    // ropes
    [
      [this.leftEngine, this.pod.leftRopePoint],
      [this.rightEngine, this.pod.rightRopePoint]
    ].forEach(([engine, podPoint]) => {
      this.springs.push(
        new RopeSpring(this.pod.body, engine.body, {
          localAnchorA: podPoint,
          localAnchorB: engine.ropePoint,
          stiffness: this.racerDef.rope.stiffness,
          damping: this.racerDef.rope.damping
        })
      );
    });

    // engine couplings
    // TODO: Make these better
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([y1, y2]) => {
      this.springs.push(
        new LinearSpring(this.leftEngine.body, this.rightEngine.body, {
          localAnchorA: [0, this.racerDef.engine.size[1] * y1],
          localAnchorB: [0, this.racerDef.engine.size[1] * y2],
          stiffness: this.racerDef.coupling.stiffness,
          damping: this.racerDef.coupling.damping
        })
      );
    });
  }

  onAdd(game) {
    game.addEntity(this.pod);
    game.addEntity(this.leftEngine);
    game.addEntity(this.rightEngine);

    game.addEntity(this.coupling);

    this.springs.forEach(spring => {
      game.world.addSpring(spring);
    });
  }

  onRender() {
    if (!this.pod) {
      return;
    }

    const width = this.racerDef.rope.size; // width in meters of the rope
    const color = this.racerDef.rope.color;

    if (this.leftEngine) {
      const podLeftPoint = this.pod.localToWorld(this.pod.leftRopePoint);
      const leftEnginePoint = this.leftEngine.localToWorld(
        this.leftEngine.ropePoint
      );
      this.game.draw.line(podLeftPoint, leftEnginePoint, width, color);
    }

    if (this.rightEngine) {
      const podRightPoint = this.pod.localToWorld(this.pod.rightRopePoint);
      const rightEnginePoint = this.rightEngine.localToWorld(
        this.rightEngine.ropePoint
      );
      this.game.draw.line(podRightPoint, rightEnginePoint, width, color);
    }
  }

  // Set the control value on all the racer's flaps
  // this.param left {number} - between 0 and 1
  // this.param right {number} - between 0 and 1
  setFlaps(left, right) {
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

  getVelocity() {
    const existingParts = [this.leftEngine, this.rightEngine, this.pod].filter(
      x => x
    );
    const x =
      existingParts.reduce((prev, curr) => prev + curr.body.velocity[0], 0) /
        existingParts.length || 0;
    const y =
      existingParts.reduce((prev, curr) => prev + curr.body.velocity[1], 0) /
        existingParts.length || 0;
    return [x, y];
  }

  getWorldCenter() {
    const existingParts = [this.leftEngine, this.rightEngine, this.pod].filter(
      x => x
    );
    const x =
      existingParts.reduce((prev, curr) => prev + curr.body.position[0], 0) /
        existingParts.length || 0;
    const y =
      existingParts.reduce((prev, curr) => prev + curr.body.position[1], 0) /
        existingParts.length || 0;
    return [x, y];
  }

  onDestroy() {
    for (let spring of this.springs) {
      this.game.world.removeSpring(spring);
    }
  }

  afterTick() {
    this.springs.forEach(spring => {
      if (!spring.bodyA.owner.game || !spring.bodyB.owner.game) {
        console.log("removing spring");
        this.game.world.removeSpring(spring);
      }
    });
    if (this.leftEngine && !this.leftEngine.game) {
      console.log("left engine destroyed");
      this.leftEngine = null;
    }
    if (this.rightEngine && !this.rightEngine.game) {
      console.log("right engine destroyed");
      this.rightEngine = null;
    }
    if (this.pod && !this.pod.game) {
      console.log("pod destroyed");
      this.pod = null;
    }
  }
}
