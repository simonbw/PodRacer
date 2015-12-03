Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'
Materials = require 'physics/Materials'

class Wall extends Entity
  constructor: (x, y) ->

    @w = 10
    @h = 10

    graphicWidth = @w
    graphicHeight = @h


    @sprite = new Pixi.Graphics()

    for i in (-1..2)
      @sprite.beginFill(0x000000 + 100*i)
      @sprite.drawRect(-0.5 * @w, -0.5 * @h, @w + i, @h + i)
      @sprite.endFill()


    @body = new p2.Body {
      position: [x, y]
      mass: 0
      material: Materials.WALL
    }

    shape = new p2.Rectangle(@w, @h)
    @body.addShape(shape, [0, 0], 0)

    [@sprite.x, @sprite.y] = @body.position

module.exports = Wall