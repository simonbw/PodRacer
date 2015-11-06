Entity = require 'core/Entity'
Pixi = require 'pixi.js'

class MenuOption extends Entity
  constructor: (@name, @x, @y, @callback) ->
    @text = new Pixi.Text(@name,{font : '24px Arial', fill : 0xFFFFFF, align : 'center'});
    @layer = "menu"
    @sprite = new Pixi.Graphics()
    @sprite.x = @x
    @sprite.y = @y
    @sprite.addChild(@text)
    @sprite.beginFill(0x0000AA)
    @sprite.drawRect(0, 0, 200, 30)
    @sprite.endFill()

  onRender: () ->
    #console.log "onrender called for menu option"

  onAdd: () ->
    #console.log "menu option added to game"

  select: () ->
    @redrawSprite(0xAA0000)

  unSelect: () ->
    @redrawSprite(0x0000AA)

  redrawSprite: (color) =>
    @sprite.clear()
    @sprite.beginFill(color)
    @sprite.drawRect(0, 0, 200, 30)
    @sprite.endFill()

  activate: () =>
    if @callback?
      @callback()

module.exports = MenuOption