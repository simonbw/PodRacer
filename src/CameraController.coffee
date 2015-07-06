Entity = require 'core/Entity'
p2 = require 'p2'

# Controls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  onRender: () ->
    # TODO: Change this when the default vector array type is changed
    vel = [@racer.pod.body.velocity[0], @racer.pod.body.velocity[1]]
    center = @racer.getWorldCenter().iadd(vel.imul(0.18))
    @camera.center(center)
    speed = p2.vec2.length(@racer.pod.body.velocity)
    @camera.smoothZoom(20 / (1 + 0.1 * Math.log(speed + 1)))



module.exports = CameraController