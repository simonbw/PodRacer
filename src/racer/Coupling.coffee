Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'
Random = require 'util/Random'

class Coupling extends Entity
  constructor: (@leftEngine, @rightEngine, @leftPosition, @rightPosition, @color, @power) ->
    @sprite = new Pixi.Graphics()

  onAdd: (game) =>
    @light = game.lights.newLineLight()
    @light.radius = 0.9
    @light.color = @color
    @light.intensity = 0.8

  onRender: () =>
    betweenVec = [@leftEngine.body.position[0] - @rightEngine.body.position[0], @leftEngine.body.position[1] - @rightEngine.body.position[1]]
    length = p2.vec2.length(betweenVec)

    left = [0.5*@leftEngine.size[0], @leftPosition]
    left = @leftEngine.localToWorld(left)

    right = [-0.5*@rightEngine.size[0], @rightPosition]
    right = @rightEngine.localToWorld(right)

    width = @power / (length * length) * (Math.random() + 0.5)
    alpha = Math.random() + 0.4

#    @game.draw.line(left, right, width, @color, alpha)

    @light.startPoint = left
    @light.endPoint = right
    @light.intensity = Random.normal(0.7, 0.5)

module.exports = Coupling