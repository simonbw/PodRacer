import p2 from "p2";
import { Vector } from "../core/Vector";

// Connects two bodies with a stretchy rope
export default class RopeSpring extends p2.Spring {
  localAnchorA: Vector;
  localAnchorB: Vector;
  restLength: number;

  constructor(
    bodyA: p2.Body,
    bodyB: p2.Body,
    options: {
      localAnchorA?: Vector;
      localAnchorB?: Vector;
      restLength?: number;
      stiffness?: number;
      damping?: number;
    } = {}
  ) {
    super(bodyA, bodyB, options);
    this.localAnchorA = options.localAnchorA || ([0, 0] as Vector);
    this.localAnchorB = options.localAnchorB || ([0, 0] as Vector);

    this.restLength =
      options.restLength ||
      this.getWorldAnchorA().sub(this.getWorldAnchorB()).magnitude * 1.9;
  }

  getWorldAnchorA() {
    const out = [0, 0] as Vector;
    this.bodyA.toWorldFrame(out, this.localAnchorA);
    return out;
  }

  getWorldAnchorB() {
    const out = [0, 0] as Vector;
    this.bodyB.toWorldFrame(out, this.localAnchorB);
    return out;
  }

  // Apply the rope forces to the body.
  applyForce() {
    const worldAnchorA = this.getWorldAnchorA();
    const worldAnchorB = this.getWorldAnchorB();

    // Get offset points
    const offsetA = worldAnchorA.sub(this.bodyA.position as Vector);
    const offsetB = worldAnchorB.sub(this.bodyB.position as Vector);

    // Compute distance vector between world anchor points
    const displacement = worldAnchorB.sub(worldAnchorA);
    const distance = displacement.magnitude;
    const displacementUnit = displacement.normalize();

    // Compute relative velocity of the anchor points
    const aCrossOffset = [0, 0] as Vector;
    const bCrossOffset = [0, 0] as Vector;
    // TODO: Add cross product to Vector and use it?
    p2.vec2.crossZV(aCrossOffset, this.bodyA.angularVelocity, offsetA);
    p2.vec2.crossZV(bCrossOffset, this.bodyB.angularVelocity, offsetB);
    const relativeVelocity = (this.bodyB.velocity as Vector)
      .sub(this.bodyA.velocity as Vector)
      .iadd(bCrossOffset)
      .isub(aCrossOffset);

    // F = - k * ( x - L ) - D * ( u )
    const stretch = distance - this.restLength; // distance beyond rest length
    let magnitude;
    if (stretch > 0) {
      magnitude =
        -this.stiffness * stretch -
        this.damping * relativeVelocity.dot(displacementUnit);
    } else {
      magnitude = 0;
    }
    const force = displacementUnit.mul(magnitude);

    // Add forces to bodies
    this.bodyA.force = (this.bodyA.force as Vector).sub(force);
    this.bodyB.force = (this.bodyB.force as Vector).add(force);

    // Angular force (I don't know how they got here)
    const ri_x_f = p2.vec2.crossLength(offsetA, force);
    const rj_x_f = p2.vec2.crossLength(offsetB, force);
    this.bodyA.angularForce -= ri_x_f;
    this.bodyB.angularForce += rj_x_f;
  }
}
