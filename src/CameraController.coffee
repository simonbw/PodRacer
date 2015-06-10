Entity = require 'core/Entity'
p2 = require 'p2'


# Controlls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  onRender: () ->
    @camera.center(@racer.getWorldCenter())
    speed = p2.vec2.length(@racer.pod.body.velocity)
    @camera.smoothZoom(20 / (1 + 0.1 * Math.log(speed + 1)))



module.exports = CameraController