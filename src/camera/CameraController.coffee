Entity = require 'core/Entity'
Util = require 'util/Util.coffee'
p2 = require 'p2'


# Controls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  onRender: () ->
    if @racer.pod?
      vel = @racer.getPodVelocity()
      center = @racer.getWorldCenter().iadd(vel.imul(0.3))
      @camera.smoothCenter(center, vel)
      speed = p2.vec2.length(vel)
      @camera.smoothZoom(20 / (1 + 0.14 * Math.log(speed + 1)))

      @game.audio



module.exports = CameraController