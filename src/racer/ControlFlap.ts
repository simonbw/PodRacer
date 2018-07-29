import BaseEntity from "../core/BaseEntity";
import * as Util from "../util/Util";
import { applyAerodynamicsToEdge } from "../physics/Aerodynamics";
import {
  FlapDef,
  WithPosition,
  ControlFlapDirection
} from "./RacerDefs/FlapDef";
import p2 from "p2";
import { Vector } from "../core/Vector";

export default class ControlFlap extends BaseEntity {
  attachedBody: p2.Body;
  direction: any;
  flapDef: FlapDef & WithPosition;
  position: Vector;
  control: number;

  constructor(attachedBody: p2.Body, flapDef: FlapDef & WithPosition) {
    super();
    this.attachedBody = attachedBody;
    this.flapDef = flapDef;
    this.direction = flapDef.direction;
    this.position = flapDef.position;
    this.control = 0;
  }

  setControl(value: number) {
    this.control = Util.clamp(value);
  }

  getAngle() {
    let angle = this.flapDef.maxAngle * this.control;
    if (this.direction === ControlFlapDirection.Left) {
      angle *= -1;
    }
    return angle - Math.PI / 2;
  }

  onTick() {
    const start = this.position;
    switch (this.direction) {
      case ControlFlapDirection.Left: {
        const end = [start[0] - this.control, start[1]] as Vector;
        applyAerodynamicsToEdge(
          this.attachedBody,
          end,
          start,
          this.flapDef.drag,
          0
        );
        break;
      }
      case ControlFlapDirection.Right: {
        const end = [start[0] + this.control, start[1]] as Vector;
        applyAerodynamicsToEdge(
          this.attachedBody,
          start,
          end,
          this.flapDef.drag,
          0
        );
        break;
      }
      default:
        console.log("x");
    }
  }

  onRender() {
    const startPoint = [0, 0] as Vector;
    this.attachedBody.toWorldFrame(startPoint, this.position);

    const angle = this.getAngle();
    // TODO: Shorten line?
    const direction = [Math.cos(angle), Math.sin(angle)] as Vector;
    const end = this.position.add(direction.imul(this.flapDef.length));
    this.attachedBody.toWorldFrame(end, end);

    const width = 0.1;
    this.game.draw.line(startPoint, end, width, this.flapDef.color);
  }
}
