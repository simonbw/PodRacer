Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'
Materials = require 'physics/Materials'

class Wall extends Entity
  constructor: (x, y) ->

    @w = 400
    @h = 1


    @sprite = new Pixi.Graphics()
    @path = []
    @corners = [new Pixi.Point(0.5*@w, 0.5*@h),
    new Pixi.Point(0.5*@w, -0.5*@h),
    new Pixi.Point(-0.5*@w, -0.5*@h),
    new Pixi.Point(-0.5*@w, 0.5*@h)]
    @sprite.beginFill(0x000000)
    @sprite.drawPolygon(@corners)
    @sprite.endFill()
    # @sprite.beginFill(0x000000)
    # @sprite.drawRect(-0.5 * @w, -0.5 * @h, @w, @h)
    # @sprite.endFill()

    @body = new p2.Body {
      position: [x, y]
      mass: 0
      material: Materials.WALL
    }

    shape = new p2.Rectangle(@w, @h)
    @body.addShape(shape, [0, 0], 0)

    [@sprite.x, @sprite.y] = @body.position

module.exports = Wall