Entity = require 'core/Entity'

# Controlls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  render: () ->
    @camera.center(@racer.getWorldCenter())



module.exports = CameraController