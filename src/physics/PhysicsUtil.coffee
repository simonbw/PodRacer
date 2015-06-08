p2 = require 'p2'


PhysicsUtil = {
  velocityAtWorldPoint: (body, worldPoint) ->
    [vx, vy] = body.velocity

    

    return [x, y]
}

PhysicsUtil.vec2 = {
  add: (a, b) ->
    out = p2.vec2.create()
    return p2.vec2.add(out, a, b)

  sub: (a, b) ->
    out = p2.vec2.create()
    return p2.vec2.sub(out, a, b)

  mul: (a, b) ->
    out = p2.vec2.create()
    return p2.vec2.mul(out, a, b)

  distance: p2.vec2.distance

  dot: p2.vec2.dot
}

module.exports = PhysicsUtil