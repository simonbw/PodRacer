import p2 from 'p2';


// Connects two bodies with a stretchy rope
export default class RopeSpring extends p2.Spring {
  constructor(bodyA, bodyB, options = {}) {
    super(bodyA, bodyB, options);
    this.localAnchorA = options.localAnchorA || [0, 0];
    this.localAnchorB = options.localAnchorB || [0, 0];

    this.restLength = options.restLength || this.getWorldAnchorA().sub(this.getWorldAnchorB()).magnitude * 1.9;
  }

  getWorldAnchorA() {
    const out = [0, 0];
    this.bodyA.toWorldFrame(out, this.localAnchorA);
    return out;
  }

  getWorldAnchorB() {
    const out = [0, 0];
    this.bodyB.toWorldFrame(out, this.localAnchorB);
    return out;
  }

  // Apply the rope forces to the body.
  applyForce() {
    const worldAnchorA = this.getWorldAnchorA();
    const worldAnchorB = this.getWorldAnchorB();

    // Get offset points
    const offsetA = worldAnchorA.sub(this.bodyA.position);
    const offsetB = worldAnchorB.sub(this.bodyB.position);

    // Compute distance vector between world anchor points
    const displacement = worldAnchorB.sub(worldAnchorA);
    const distance = displacement.magnitude;
    const displacementUnit = displacement.normalize();

    // Compute relative velocity of the anchor points
    // TODO: Understand this and convert to use our vector stuff
    const aCrossOffset = [0, 0];
    const bCrossOffset = [0, 0];
    p2.vec2.crossZV(aCrossOffset, this.bodyA.angularVelocity, offsetA); // TODO: can we use our Vector?
    p2.vec2.crossZV(bCrossOffset, this.bodyB.angularVelocity, offsetB);
    const relativeVelocity = this.bodyB.velocity.sub(this.bodyA.velocity).iadd(bCrossOffset).isub(aCrossOffset);

    // F = - k * ( x - L ) - D * ( u )
    const stretch = distance - this.restLength; // distance beyond rest length
    let magnitude;
    if (stretch > 0) {
      magnitude = -this.stiffness * stretch - this.damping * relativeVelocity.dot(displacementUnit);
    } else {
      magnitude = 0;
    }
    const force = displacementUnit.mul(magnitude);

    // Add forces to bodies
    this.bodyA.force = this.bodyA.force.sub(force);
    this.bodyB.force = this.bodyB.force.add(force);

    // Angular force (I don't know how they got here)
    const ri_x_f = p2.vec2.crossLength(offsetA, force);
    const rj_x_f = p2.vec2.crossLength(offsetB, force);
    this.bodyA.angularForce -= ri_x_f;
    this.bodyB.angularForce += rj_x_f;
  }
}
