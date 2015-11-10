Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'

class Coupling extends Entity
  constructor: (@leftEngine, @rightEngine, @leftPosition, @rightPosition, @color, @power) ->
    @sprite = new Pixi.Graphics()
    
  onRender: () =>
    betweenVec = [@leftEngine.body.position[0] - @rightEngine.body.position[0], @leftEngine.body.position[1] - @rightEngine.body.position[1]]
    length = p2.vec2.length(betweenVec)

    left = [0.5*@leftEngine.size[0], @leftPosition]
    left = @leftEngine.localToWorld(left)

    right = [-0.5*@rightEngine.size[0], @rightPosition]
    right = @rightEngine.localToWorld(right)

    width = @power / (length*length) * (Math.random() + 0.5)
    alpha = Math.random() + 0.4

    @game.draw.line(left, right, width, @color, alpha)

  afterTick: () =>
    if not @leftEngine.game? or not @rightEngine.game?
      @destroy()

module.exports = Coupling