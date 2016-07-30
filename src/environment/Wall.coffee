Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'
Materials = require 'physics/Materials'

class Wall extends Entity
  constructor: (x, y) ->

<<<<<<< HEAD
    @w = 15
    @h = 15


    @sprite = new Pixi.Graphics()
    corners = [new Pixi.Point(0.5*@w, 0.5*@h), 
    new Pixi.Point(0.5*@w, -0.5*@h), 
    new Pixi.Point(-0.5*@w, -0.5*@h), 
    new Pixi.Point(-0.5*@w, 0.5*@h)]
    @sprite.beginFill(0xbda27e)
    @sprite.drawPolygon(corners)
    @sprite.endFill()

    innerW = 12
    innerH = 12
    corners = [new Pixi.Point(0.5*innerW, 0.5*innerH), 
    new Pixi.Point(0.5*innerW, -0.5*innerH), 
    new Pixi.Point(-0.5*innerW, -0.5*innerH), 
    new Pixi.Point(-0.5*innerW, 0.5*innerH)]
    @sprite.beginFill(0xa89070)
    @sprite.drawPolygon(corners)
    @sprite.endFill()

    innerW = 5
    innerH = 5
    corners = [new Pixi.Point(0.5*innerW, 0.5*innerH), 
    new Pixi.Point(0.5*innerW, -0.5*innerH), 
    new Pixi.Point(-0.5*innerW, -0.5*innerH), 
    new Pixi.Point(-0.5*innerW, 0.5*innerH)]
    @sprite.beginFill(0x937d62)
    @sprite.drawPolygon(corners)
    @sprite.endFill()
=======
    @w = 10
    @h = 1000

    graphicWidth = @w
    graphicHeight = @h


    @sprite = new Pixi.Graphics()
    @sprite.lineStyle(0.07, 0x000000, 1)

    startColor = 0xe8d9c5
    endColor = 0xD2B48C

    num_layers = 7

    colorRange = Util.colorRange(startColor, endColor, num_layers - 1)

    for i in [Math.trunc(-1*num_layers/2)..Math.ceil(num_layers/2-1)]
      @sprite.beginFill(colorRange[i + Math.trunc(num_layers/2)])
      @sprite.drawRect(-0.5 * (@w - i), -0.5 * (@h - i), @w - i, @h - i)
      @sprite.endFill()
>>>>>>> origin/obstacles


    @body = new p2.Body {
      position: [x, y]
      mass: 0
      material: Materials.WALL
    }

    shape = new p2.Rectangle(@w, @h)
    @body.addShape(shape, [0, 0], 0)

    [@sprite.x, @sprite.y] = @body.position

module.exports = Wall