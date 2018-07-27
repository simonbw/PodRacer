import { RacerDef } from "./index";
import { Vector } from "../../core/Vector";

export const Anakin: RacerDef = {
  engine: {
    boostMaxForce: 120.0,
    color: 0x0000ff,
    drag: 1.0,
    flaps: [
      {
        color: 0xeeee00,
        drag: 0.5,
        length: 0.8,
        maxAngle: Math.PI / 6,
        side: "outside",
        y: -1.0
      },
      {
        color: 0xeeee00,
        drag: 0.5,
        length: 0.8,
        maxAngle: Math.PI / 6,
        side: "inside",
        y: -1.0
      }
    ],
    fragility: 2,
    maxHealth: 100,
    healthMeterBackColor: 0x003355,
    healthMeterBackWidth: 0.07,
    healthMeterColor: 0x00ffff,
    healthMeterWidth: 0.07,
    mass: 1.0,
    maxForce: 85.0,
    size: [0.5, 2.0] as Vector
  },

  leftEnginePosition: [-1, 0] as Vector,
  rightEnginePosition: [1, 0] as Vector,
  podPosition: [0, 8] as Vector,

  pod: {
    color: 0x0000ff,
    drag: 1.4,
    flaps: [
      {
        color: 0x000055,
        drag: 0.8,
        length: 0.5,
        maxAngle: Math.PI / 3,
        y: 0
      }
    ],
    fragility: 0,
    health: 100,
    mass: 1.0,
    position: [0, 10] as Vector,
    size: [1, 1.5] as Vector
  },
  rope: {
    color: 0x444444,
    damping: 1.5,
    size: 0.03,
    stiffness: 20
  },
  coupling: {
    damping: 0.5,
    stiffness: 30
  }
};
