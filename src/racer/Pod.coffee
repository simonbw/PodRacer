Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'


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

  added: () =>
    console.log "pod added"

  render: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle


module.exports = Pod