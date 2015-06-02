p2 = require 'p2'
Entity = require 'core/Entity'

class Aerodynamics
  @defaultLift = 0.0001
  @defaultDrag = 0.0001

  @applyAerodynamics: (body, dragAmount, liftAmount) =>
    for shape in body.shapes
      if shape.type == p2.Shape.RECTANGLE
        for i in [0...shape.vertices.length]
          v1 = shape.vertices[i]
          v2 = shape.vertices[(i + 1) % shape.vertices.length]
          @applyAerodynamicsToEdge(body, v1, v2, dragAmount, liftAmount)

  @applyAerodynamicsToEdge: (body, v1, v2, dragAmount, liftAmount) =>
    # ????
    if liftAmount < 0
      liftAmount = dragAmount

    # calculate some numbers relating to the edge 
    midpoint = [0.5 * (v1[0] + v2[0]), 0.5 * (v1[1] + v2[1])]
    midpointWorld = [0,0]
    body.toWorldFrame(midpointWorld, midpoint)

    edge = [v2[0] - v1[0], v2[1] - v1[1]]
    edgeLength = p2.vec2.length(edge)
    edgeNormal = [0,0]
    p2.vec2.scale(edgeNormal, edge, -1)
    airVelocity = body.velocity
    airSpeed = p2.vec2.length(airVelocity)

    airDotEdgeNormal = p2.vec2.dot(airVelocity, edgeNormal)
    airDotEdge = p2.vec2.dot(airVelocity, edge)
    if airDotEdgeNormal < 0
      return

    # drag
    dragMagnitude = airDotEdgeNormal * edgeLength * airSpeed * dragAmount
    drag = [0,0]
    p2.vec2.scale(drag, airVelocity, -1 * dragMagnitude)
    body.applyForce(drag, midpointWorld)

    # lift
    liftMagnitude = airDotEdge * airDotEdgeNormal * edgeLength * airSpeed * liftAmount
    lift = [0,0]
    p2.vec2.scale(lift, airVelocity, liftMagnitude)
    body.applyForce(lift, midpointWorld)



module.exports = Aerodynamics