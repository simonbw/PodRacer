Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'
Materials = require 'physics/Materials'

class Wall extends Entity
  constructor: (x, y) ->

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


    @body = new p2.Body {
      position: [x, y]
      mass: 0
      material: Materials.WALL
    }

    shape = new p2.Rectangle(@w, @h)
    @body.addShape(shape, [0, 0], 0)

    [@sprite.x, @sprite.y] = @body.position

module.exports = Wall