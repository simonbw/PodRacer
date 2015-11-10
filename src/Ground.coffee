Entity = require 'core/Entity'
Pixi = require 'pixi.js'

class Ground extends Entity
  constructor: () ->
    @sprite = new Pixi.Graphics
    @layer = 'world_back'

    @sprite = Pixi.extras.TilingSprite.fromImage('images/ground.jpg', 1000000, 1000000)
    @sprite.anchor.x = 0.5
    @sprite.anchor.y = 0.5

    @sprite.scale.x = 0.04
    @sprite.scale.y = 0.04

    # @sprite = new Pixi.Graphics()
    # @sprite.beginFill(0xFFEEBB)
    # @sprite.drawRect(-100000, -100000, 200000, 200000)
    # @sprite.endFill()

module.exports = Ground