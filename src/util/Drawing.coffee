Entity = require 'core/Entity'
Pixi = require 'pixi.js'


# Class used to make drawing primitives easy
class Drawing extends Entity
  constructor: () ->
    @sprites = {}

  line: ([x1, y1], [x2, y2], width=0.01, color=0xFFFFFF, alpha=1.0, layer='world') =>
    @guaranteeSprite(layer)
    sprite = @sprites[layer]
    sprite.lineStyle(width, color, alpha)
    sprite.moveTo(x1 - 0.5, y1 - 0.5) # the -0.5 is because pixi sucks
    sprite.lineTo(x2 - 0.5, y2 - 0.5) # the -0.5 is because pixi sucks

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


module.exports = Drawing