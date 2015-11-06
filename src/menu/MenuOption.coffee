Entity = require 'core/Entity'
Pixi = require 'pixi.js'

class MenuOption extends Entity
  constructor: (@name) ->
    @sprite = new Pixi.Graphics()
    @sprite.beginFill(0x0000FF)
    @sprite.drawRect(0,0,100,50)
    @sprite.endFill()

  onRender: () ->
    console.log "onrender called for menu option"

module.exports = MenuOption