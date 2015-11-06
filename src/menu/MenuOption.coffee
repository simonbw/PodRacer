Entity = require 'core/Entity'
Pixi = require 'pixi.js'

class MenuOption extends Entity
  @WIDTH = WIDTH = 300
  @HEIGHT = HEIGHT = 80

  UNSELECTED_COLOR = 0x555566
  UNSELECTED_ALPHA = 0.5
  SELECTED_COLOR = 0x3333FF
  SELECTED_ALPHA = 0.9

  constructor: (@name, @x, @y, @callback) ->
    @text = new Pixi.Text(@name, {
      font: '24px Arial'
      fill: 0xFFFFFF
      lineHeight: HEIGHT
    });
    @layer = "menu"
    @sprite = new Pixi.Graphics()
    @sprite.x = @x
    @sprite.y = @y
    @text.x = 10
    @text.y = 10
    @sprite.addChild(@text)
    @redrawSprite(UNSELECTED_COLOR, UNSELECTED_ALPHA)

  select: () ->
    @redrawSprite(SELECTED_COLOR, SELECTED_ALPHA)

  unSelect: () ->
    @redrawSprite(UNSELECTED_COLOR, UNSELECTED_ALPHA)

  redrawSprite: (color, alpha) =>
    @sprite.clear()
    @sprite.beginFill(color, alpha)
    @sprite.drawRect(0, 0, WIDTH, HEIGHT)
    @sprite.endFill()

  activate: () =>
    if @callback?
      @callback()

module.exports = MenuOption