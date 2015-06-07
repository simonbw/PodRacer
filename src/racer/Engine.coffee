Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'
Aero = require 'physics/Aerodynamics'


class Engine extends Entity
  constructor: ([x, y], @engineDef) ->
    console.log "new engine at #{[x, y]}"
    
    [w, h] = @engineDef.size

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(@engineDef.color)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @body = new p2.Body {
      position: [x, y]
      mass: @engineDef.mass
      angularDamping: 0.01
      damping: 0.0
    }

    shape = new p2.Rectangle(w, h)
    @body.addShape(shape, [0, 0], 0)

    @throttle = 0.0
    @ropePoint = [0, 0.45 * h] # point the rope connects in local coordinates

  onAdd: () =>
    console.log "engine added"

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

  onTick: () =>
    Aero.applyAerodynamics(@body, @engineDef.drag, @engineDef.drag)
    @throttle = Util.clamp(@throttle, 0, 1)
    maxForce = @getMaxForce()
    fx = Math.cos(@body.angle - Math.PI / 2) * @throttle * maxForce
    fy = Math.sin(@body.angle - Math.PI / 2) * @throttle * maxForce
    @body.force[0] += fx
    @body.force[1] += fy

  getMaxForce: () =>
    return @engineDef.maxForce


module.exports = Engine