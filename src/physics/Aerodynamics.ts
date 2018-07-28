import p2 from "p2";
import { Vector } from "../core/Vector";

const DEBUG_DRAW = false;

const DRAG = 0.7;
const LIFT = 0.7;
const MAGIC_NUMBER = 1; // For some reason this makes pods stop spinning

function isAerodynamicShape(
  shape: p2.Shape
): shape is p2.Shape & { vertices: Vector[] } {
  return (
    (shape as any).aerodynamicsEnabled &&
    (shape.type === p2.Shape.BOX || shape.type === p2.Shape.CONVEX)
  );
}

export function applyAerodynamics(
  body: p2.Body,
  dragAmount: number,
  liftAmount: number
) {
  for (const shape of body.shapes) {
    if (isAerodynamicShape(shape)) {
      for (let i = 0; i < shape.vertices.length; i++) {
        const v1 = shape.vertices[i];
        const v2 = shape.vertices[(i + 1) % shape.vertices.length];
        applyAerodynamicsToEdge(body, v1, v2, dragAmount, liftAmount);
      }
    }
  }
}

export function applyAerodynamicsToEdge(
  body: p2.Body,
  v1: Vector,
  v2: Vector,
  dragAmount: number,
  liftAmount: number
) {
  if (liftAmount == null) {
    liftAmount = dragAmount;
  }

  // calculate some numbers relating to the edge
  const v1World = [0, 0] as Vector;
  const v2World = [0, 0] as Vector;
  body.toWorldFrame(v1World, v1);
  body.toWorldFrame(v2World, v2);
  const midpoint = v1World.add(v2World).imul(0.5);

  const edge = v2World.sub(v1World);
  const edgeLength = edge.magnitude;
  edge.inormalize(); // edge is normalized
  const edgeNormal = edge.rotate90cw(); // vector pointing out of the rectangle

  const airVelocity = (body.velocity as Vector).clone(); // opposite direction to actual air velocity for some reason?
  const airSpeed = airVelocity.magnitude;
  airVelocity.inormalize();

  // TODO: What was/is this here for?
  //const offset = midpoint.sub(body.position).irotate90cw().imul(-1 * body.angularVelocity * MAGIC_NUMBER);
  //p2.vec2.add(airVelocity, airVelocity, offset);

  const airDotEdgeNormal = p2.vec2.dot(airVelocity, edgeNormal);
  const airDotEdge = p2.vec2.dot(airVelocity, edge);
  if (airDotEdgeNormal < 0) {
    return;
  }

  const dragMagnitude =
    airDotEdgeNormal * edgeLength * airSpeed * dragAmount * DRAG;
  const drag = airVelocity.mul(-dragMagnitude);
  body.applyForce(drag, midpoint.sub(body.position as Vector));

  const liftMagnitude =
    airDotEdge * airDotEdgeNormal * edgeLength * airSpeed * liftAmount * LIFT;
  const lift = airVelocity.rotate90cw().imul(-liftMagnitude);
  body.applyForce(lift, midpoint.sub(body.position as Vector));

  if (window.DEBUG.aeroDebugDrawings) {
    // game.draw.line(v1World, v2World, 0.1, 0xFF0000, dragMagnitude / edgeLength, 'world_overlay')
    const vel = body.velocity;
    let start = [v1World[0] + vel[0] / 60, v1World[1] + vel[1] / 60] as Vector;
    let end = [v2World[0] + vel[0] / 60, v2World[1] + vel[1] / 60] as Vector;

    const game = window.DEBUG.game;
    game.draw.line(
      start,
      end,
      0.2,
      0xff0000,
      dragMagnitude / (3 * edgeLength),
      "world_overlay"
    );

    start = [midpoint[0] + vel[0] / 60, midpoint[1] + vel[1] / 60] as Vector;
    end = [start[0] + drag[0] * 0.2, start[1] + drag[1] * 0.2] as Vector;
    game.draw.line(
      start,
      end,
      0.1,
      0xff0000,
      dragMagnitude / edgeLength,
      "world_overlay"
    );

    end = [start[0] + lift[0] * 0.2, start[1] + lift[1] * 0.2] as Vector;
    game.draw.line(
      start,
      end,
      0.1,
      0x0000ff,
      Math.abs(liftMagnitude) / edgeLength,
      "world_overlay"
    );
  }
}
