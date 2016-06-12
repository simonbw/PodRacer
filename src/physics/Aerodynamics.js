import p2 from 'p2';
import Entity from '../core/Entity';

const DEBUG_DRAW = false;

const DRAG = 0.7;
const LIFT = 0.7;
const MAGIC_NUMBER = 1; // For some reason this makes pods stop spinning


export function applyAerodynamics(body, dragAmount, liftAmount) {
  body.shapes.forEach((shape) => {
    if (shape.aerodynamics && (shape.type == p2.Shape.BOX || shape.type == p2.Shape.CONVEX)) {
      for (let i = 0; i < shape.vertices.length; i++) {
        const v1 = shape.vertices[i];
        const v2 = shape.vertices[(i + 1) % shape.vertices.length];
        applyAerodynamicsToEdge(body, v1, v2, dragAmount, liftAmount);
      }
    }
  });
}

export function applyAerodynamicsToEdge(body, v1, v2, dragAmount, liftAmount) {
  if (liftAmount == null) {
    liftAmount = dragAmount;
  }

  // calculate some numbers relating to the edge
  const v1World = [0, 0];
  const v2World = [0, 0];
  body.toWorldFrame(v1World, v1);
  body.toWorldFrame(v2World, v2);
  const midpoint = v1World.add(v2World).imul(0.5);

  const edge = v2World.sub(v1World);
  const edgeLength = edge.magnitude;
  edge.inormalize(); // edge is normalized
  const edgeNormal = edge.rotate90cw(); // vector pointing out of the rectangle

  const airVelocity = body.velocity.clone(); // opposite direction to actual air velocity for some reason?
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

  const dragMagnitude = airDotEdgeNormal * edgeLength * airSpeed * dragAmount * DRAG;
  const drag = airVelocity.mul(-dragMagnitude);

  if (!drag.every(isFinite)) {
    console.log(v1, v2);
  } else {
    body.applyForce(drag, midpoint.sub(body.position));
  }

  const liftMagnitude = airDotEdge * airDotEdgeNormal * edgeLength * airSpeed * liftAmount * LIFT;
  const lift = airVelocity.rotate90cw().imul(-liftMagnitude);
  if (!lift.every(isFinite)) {
    console.log('lift:', lift);
  } else {
    body.applyForce(lift, midpoint.sub(body.position));
  }


  if (DEBUG_DRAW) {
    // game.draw.line(v1World, v2World, 0.1, 0xFF0000, dragMagnitude / edgeLength, 'world_overlay')
    const vel = body.velocity;
    let start, end;
    start = [v1World[0] + vel[0] / 60, v1World[1] + vel[1] / 60];
    end = [v2World[0] + vel[0] / 60, v2World[1] + vel[1] / 60];
    game.draw.line(start, end, 0.2, 0xFF0000, dragMagnitude / (3 * edgeLength), 'world_overlay');

    start = [midpoint[0] + vel[0] / 60, midpoint[1] + vel[1] / 60];
    end = [start[0] + drag[0] * 0.2, start[1] + drag[1] * 0.2];
    game.draw.line(start, end, 0.1, 0xFF0000, dragMagnitude / edgeLength, 'world_overlay');

    end = [start[0] + lift[0] * 0.2, start[1] + lift[1] * 0.2];
    game.draw.line(start, end, 0.1, 0x0000FF, Math.abs(liftMagnitude) / edgeLength, 'world_overlay')
  }
}
