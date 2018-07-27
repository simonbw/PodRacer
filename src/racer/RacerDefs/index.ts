import { Vector } from "../../core/Vector";
import { EngineDef } from "./EngineDef";
import { PodDef } from "./PodDef";

export { Anakin } from "./Anakin";

export interface RacerDef {
  engine: EngineDef;
  pod: PodDef;
  rope: RopeDef;
  coupling: CouplingDef;

  leftEnginePosition: Vector;
  rightEnginePosition: Vector;
  podPosition: Vector;
}

interface RopeDef {
  color: number;
  damping: number;
  size: number;
  stiffness: number;
}

interface CouplingDef {
  damping: number;
  stiffness: number;
}
