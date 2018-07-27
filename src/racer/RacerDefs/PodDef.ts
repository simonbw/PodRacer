import { Vector } from "../../core/Vector";
import { FlapDef } from "./FlapDef";

export interface PodDef {
  color: number;
  drag: number;
  flaps: Array<FlapDef>;
  fragility: 0;
  health: 100;
  mass: 1.0;
  position: Vector;
  size: Vector;
}
