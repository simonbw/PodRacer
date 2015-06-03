p2 = require 'p2'
vec2 = p2.vec2

# Connects two bodies with a stretchy rope
class RopeSpring extends p2.Spring
  constructor: (bodyA, bodyB, options={}) ->
    super(bodyA, bodyB, options)

    @localAnchorA = options.localAnchorA
    @localAnchorA ?= [0, 0]
    @localAnchorB = options.localAnchorB
    @localAnchorB ?= [0, 0]

    @restLength = options.restLength
    @restLength ?= vec2.distance(@getWorldAnchorA(), @getWorldAnchorB())

  getWorldAnchorA: () =>
    out = [0, 0]
    @bodyA.toWorldFrame(out, @localAnchorA)
    return out

  getWorldAnchorB: () =>
    out = [0, 0]
    @bodyB.toWorldFrame(out, @localAnchorB)
    return out

  # Apply the rope forces to the body.
  applyForce: () =>
    worldAnchorA = @getWorldAnchorA()
    worldAnchorB = @getWorldAnchorB()

    # Get offset points
    offsetA = [0, 0]
    offsetB = [0, 0]
    vec2.sub(offsetA, worldAnchorA, @bodyA.position)
    vec2.sub(offsetB, worldAnchorB, @bodyB.position)
 
    # Compute distance vector between world anchor points
    displacement = [0, 0]
    vec2.sub(displacement, worldAnchorB, worldAnchorA)
    distance = vec2.len(displacement)
    displacementUnit = [0, 0]
    vec2.normalize(displacementUnit, displacement)
 
    # Compute relative velocity of the anchor points
    relativeVelocity = [0, 0]
    vec2.sub(relativeVelocity, @bodyB.velocity, @bodyA.velocity)
    tmp = [0, 0]
    vec2.crossZV(tmp, @bodyB.angularVelocity, offsetB)
    vec2.add(relativeVelocity, relativeVelocity, tmp)
    vec2.crossZV(tmp, @bodyA.angularVelocity, offsetA)
    vec2.sub(relativeVelocity, relativeVelocity, tmp)
 
    # F = - k * ( x - L ) - D * ( u )
    force = [0, 0]
    stretch = distance - @restLength # distance beyond rest length
    if stretch > 0
      magnitude = -@stiffness * stretch - @damping * vec2.dot(relativeVelocity, displacementUnit)
    else
      magnitude = 0
    vec2.scale(force, displacementUnit, magnitude)
 
    # Add forces to bodies
    vec2.sub(@bodyA.force, @bodyA.force, force)
    vec2.add(@bodyB.force, @bodyB.force, force)
 
    # Angular force
    ri_x_f = vec2.crossLength(offsetA, force)
    rj_x_f = vec2.crossLength(offsetB, force)
    @bodyA.angularForce -= ri_x_f
    @bodyB.angularForce += rj_x_f



module.exports = RopeSpring