import { Vector } from "../../core/Vector";
import { FlapDef, WithSide } from "./FlapDef";

export interface EngineDef {
  boostMaxForce: number;
  color: number;
  drag: number;
  flaps: Array<FlapDef & WithSide>;
  fragility: number;
  health: number;
  healthMeterBackColor: number;
  healthMeterBackWidth: number;
  healthMeterColor: number;
  healthMeterWidth: number;
  mass: number;
  maxForce: number;
  size: Vector;
}
