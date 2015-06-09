p2 = require 'p2'
Entity = require 'core/Entity'

DEBUG_DRAW = false

DRAG = 0.7
LIFT = 0.7

MAGIC_NUMBER = 1 # For some reason this makes pods stop spinning


class Aerodynamics
  @applyAerodynamics: (body, dragAmount, liftAmount) =>
    for shape in body.shapes
      if shape.type == p2.Shape.RECTANGLE or shape.type == p2.Shape.CONVEX
        for i in [0...shape.vertices.length]
          v1 = shape.vertices[i]
          v2 = shape.vertices[(i + 1) % shape.vertices.length]
          @applyAerodynamicsToEdge(body, v1, v2, dragAmount, liftAmount)

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

    airVelocity = [body.velocity[0], body.velocity[1]] # opposite direction to actual air velocity
    offset = [midpoint[0] - body.position[0], midpoint[1] - body.position[1]]
    p2.vec2.rotate90cw(offset, offset)
    p2.vec2.scale(offset, offset, -1 * body.angularVelocity * MAGIC_NUMBER)
    # p2.vec2.add(airVelocity, airVelocity, offset)

    airSpeed = p2.vec2.length(airVelocity)
    p2.vec2.normalize(airVelocity, airVelocity)

    airDotEdgeNormal = p2.vec2.dot(airVelocity, edgeNormal)
    airDotEdge = p2.vec2.dot(airVelocity, edge)
    if airDotEdgeNormal < 0
      return

    dragMagnitude = airDotEdgeNormal * edgeLength * airSpeed * dragAmount * DRAG
    drag = []
    p2.vec2.scale(drag, airVelocity, -1 * dragMagnitude)
    body.applyForce(drag, midpoint)

    liftMagnitude = airDotEdge * airDotEdgeNormal * edgeLength * airSpeed * liftAmount * LIFT
    lift = []
    p2.vec2.rotate90cw(airVelocity, airVelocity)
    p2.vec2.scale(lift, airVelocity, -liftMagnitude)
    body.applyForce(lift, midpoint)


    if DEBUG_DRAW
      # game.draw.line(v1World, v2World, 0.1, 0xFF0000, dragMagnitude / edgeLength, 'world_overlay')
      vel = body.velocity
      start = [v1World[0] + vel[0] / 60, v1World[1] + vel[1] / 60]
      end = [v2World[0] + vel[0] / 60, v2World[1] + vel[1] / 60]
      game.draw.line(start, end, 0.2, 0xFF0000, dragMagnitude / (3 * edgeLength), 'world_overlay')
      
      start = [midpoint[0] + vel[0] / 60, midpoint[1] + vel[1] / 60]
      end = [start[0] + drag[0] * 0.2, start[1] + drag[1] * 0.2]
      game.draw.line(start, end, 0.1, 0xFF0000, dragMagnitude / edgeLength, 'world_overlay')
      
      end = [start[0] + lift[0] * 0.2, start[1] + lift[1] * 0.2]
      game.draw.line(start, end, 0.1, 0x0000FF, Math.abs(liftMagnitude) / edgeLength, 'world_overlay')



module.exports = Aerodynamics