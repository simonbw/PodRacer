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
    # @sprite.beginFill(0xFFFFBB)
    # @sprite.drawRect(-1000, -1000, 2000, 2000)
    # @sprite.endFill()

module.exports = Ground