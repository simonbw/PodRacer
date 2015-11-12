Entity = require 'core/Entity'
Pixi = require 'pixi.js'


# Class used to make drawing primitives easy
class Drawing extends Entity

  pausable: false

  constructor: () ->
    @sprites = {}

  line: ([x1, y1], [x2, y2], width=0.01, color=0xFFFFFF, alpha=1.0, layer='world') =>
    @guaranteeSprite(layer)
    sprite = @sprites[layer]
    sprite.lineStyle(width, color, alpha)
    sprite.moveTo(x1, y1) # the -0.5 is because pixi sucks
    sprite.lineTo(x2, y2) # the -0.5 is because pixi sucks

  # Guarantee that a layer exists
  guaranteeSprite: (layerName) =>
    if not @sprites[layerName]?
      @sprites[layerName] = new Pixi.Graphics()
      @game.renderer.add(@sprites[layerName], layerName)

  beforeTick: () =>
    for layerName, sprite of @sprites
      sprite.clear()

  onDestroy: (game) =>
    for layerName, sprite of @sprites
      game.renderer.remove(sprite, layerName)

  triangle: (one, two, three, color=0xFF0000, alpha=1.0, layer='world') =>
    @guaranteeSprite(layer)
    sprite = @sprites[layer]
    sprite.lineStyle()
    sprite.beginFill(color, alpha)
    sprite.drawPolygon([one[0], one[1], two[0], two[1], three[0], three[1]])
    sprite.endFill()


module.exports = Drawing