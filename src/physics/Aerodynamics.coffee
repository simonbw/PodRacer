p2 = require 'p2'
Entity = require 'core/Entity'

DRAG = 0.1
LIFT = 0.1

class Aerodynamics
  @applyAerodynamics: (body, dragAmount, liftAmount) =>
    for shape in body.shapes
      if shape.type == p2.Shape.RECTANGLE or shape.type == p2.Shape.CONVEX
        for i in [0...shape.vertices.length]
          v1 = shape.vertices[i]
          v2 = shape.vertices[(i + 1) % shape.vertices.length]
          @applyAerodynamicsToEdge(body, v1, v2, dragAmount * DRAG, liftAmount * LIFT)

  @applyAerodynamicsToEdge: (body, v1, v2, dragAmount, liftAmount) =>
    # ????
    if not liftAmount?
      liftAmount = dragAmount

    # calculate some numbers relating to the edge 
    v1World = []
    body.toWorldFrame(v1World, v1)
    v2World = []
    body.toWorldFrame(v2World, v2)

    midpoint = [0.5 * (v1World[0] + v2World[0]), 0.5 * (v1World[1] + v2World[1])]

    edge = [v2World[0] - v1World[0], v2World[1] - v1World[1]]
    edgeLength = p2.vec2.length(edge)
    p2.vec2.normalize(edge, edge)   # edge is normalized
    edgeNormal = []
    p2.vec2.rotate90cw(edgeNormal, edge)  # vector pointing out of the rectangle

    # TODO write getLinearVelocityFromWorldPoin method?
    # TODO physicsUtil class?
    airVelocity = [body.velocity[0], body.velocity[1]] # opposite direction to actual air velocity

    airSpeed = p2.vec2.length(airVelocity)
    p2.vec2.normalize(airVelocity, airVelocity)

    airDotEdgeNormal = p2.vec2.dot(airVelocity, edgeNormal)
    airDotEdge = p2.vec2.dot(airVelocity, edge)
    if airDotEdgeNormal < 0
      return

    dragMagnitude = airDotEdgeNormal * edgeLength * airSpeed * dragAmount
    drag = []
    p2.vec2.scale(drag, airVelocity, -1 * dragMagnitude)
    body.applyForce(drag, midpoint)

    liftMagnitude = airDotEdge * airDotEdgeNormal * edgeLength * airSpeed * dragAmount
    lift = []
    p2.vec2.rotate90cw(airVelocity, airVelocity)
    p2.vec2.scale(lift, airVelocity, -1 * liftMagnitude)
    body.applyForce(lift, midpoint)



module.exports = Aerodynamics