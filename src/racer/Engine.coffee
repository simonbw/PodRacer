Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'


class Engine extends Entity
  constructor: ([x, y], [w, h]) ->
    console.log "new engine at #{[x, y]}"
    
    @sprite = new Pixi.Graphics()
    @sprite.beginFill(0x0000FF)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @body = new p2.Body {
      position: [x, y]
      mass: 1
      angularDamping: 0.01
      damping: 0.0
    }

    shape = new p2.Rectangle(w, h)
    @body.addShape(shape, [0, 0], 0)

    @throttle = 0.0
    @maxForce = 10.0

  getMaxForce: () =>
    return 15.0

  added: () =>
    console.log "engine added"

  render: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

  tick: () =>
    @throttle = Util.clamp(@throttle, 0, 1)
    maxForce = @getMaxForce()
    fx = Math.cos(@body.angle - Math.PI / 2) * @throttle * maxForce
    fy = Math.sin(@body.angle - Math.PI / 2) * @throttle * maxForce
    @body.force[0] += fx
    @body.force[1] += fy


module.exports = Engine