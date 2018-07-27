import { Vector } from "../../core/Vector";

export interface FlapDef {
  color: number;
  drag: number;
  length: number;
  maxAngle: number;
  y: number;
  side?: "outside" | "inside";
}

export interface WithSide {
  side: "outside" | "inside";
}

export interface WithPosition {
  position: Vector;
  direction: ControlFlapDirection;
}

export enum ControlFlapDirection {
  Left,
  Right
}
