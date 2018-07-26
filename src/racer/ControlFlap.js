import Entity from "../core/Entity";
import * as Util from "../util/Util";
import { applyAerodynamicsToEdge } from "../physics/Aerodynamics";

export const LEFT = false;
export const RIGHT = true;

export default class ControlFlap extends Entity {
  constructor(attachedBody, flapDef) {
    super();
    this.attachedBody = attachedBody;
    this.flapDef = flapDef;
    this.direction = this.flapDef.direction;
    this.position = this.flapDef.position;
    this.control = 0;
  }

  setControl(value) {
    this.control = Util.clamp(value, 0, 1);
  }

  getAngle() {
    let angle = this.flapDef.maxAngle * this.control;
    if (this.direction === LEFT) {
      angle *= -1;
    }
    return angle - Math.PI / 2;
  }

  onTick() {
    const start = this.position;
    let end;
    if (this.direction === LEFT) {
      end = [start[0] - this.control, start[1]];
      applyAerodynamicsToEdge(
        this.attachedBody,
        end,
        start,
        this.flapDef.drag,
        0
      );
    } else if (this.direction === RIGHT) {
      end = [start[0] + this.control, start[1]];
      applyAerodynamicsToEdge(
        this.attachedBody,
        start,
        end,
        this.flapDef.drag,
        0
      );
    } else {
      throw new Error(`Unknown direction: ${this.direction}`);
    }
  }

  onRender() {
    const startPoint = [0, 0];
    this.attachedBody.toWorldFrame(startPoint, this.position);

    const angle = this.getAngle();
    // TODO: Shorten line?
    const end = [
      this.position[0] + this.flapDef.length * Math.cos(angle),
      this.position[1] + this.flapDef.length * Math.sin(angle)
    ];
    this.attachedBody.toWorldFrame(end, end);

    const width = 0.1;
    this.game.draw.line(startPoint, end, width, this.flapDef.color);
  }
}

// TODO: Not this
ControlFlap.LEFT = LEFT;
ControlFlap.RIGHT = RIGHT;
