Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Aero = require 'physics/Aerodynamics'


class Pod extends Entity
  constructor: ([x, y], [w, h]) ->
    console.log "new pod at #{[x, y]}"

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(0x0000FF)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @size = [w, h]

    @body = new p2.Body {
      position: [x, y]
      mass: 1
      angularDamping: 0.01
      damping: 0.0
    }
    
    shape = new p2.Rectangle(w, h)
    @body.addShape(shape, [0, 0], 0)

    @leftRopePoint = [-0.4 * w, -0.45 * h] # point the left rope connects in local coordinates
    @rightRopePoint = [0.4 * w, -0.45 * h] # point the right rope connects in local coordinates

  onAdd: () =>
    console.log "pod added"

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

  onTick: () =>
    Aero.applyAerodynamics(@body, 2, 2)


module.exports = Pod