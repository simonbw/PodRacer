Pixi = require 'pixi.js'
fs = require 'fs'
Util = require 'util/Util'
AbstractLightFilter = require 'lighting/AbstractLightFilter'


# The shader used to render the light
FRAGMENT_SHADER = fs.readFileSync(__dirname + '/point_light.frag', 'utf8')


# A simple point light
# TODO: This shouldn't have to extend Pixi.Graphics if I could figure out the filterArea thing
class PointLight extends Pixi.Graphics
  constructor: (@lights, [x, y] = [0, 0], radius = 10, @color = 0xFFFFFF, @intensity = 1) ->
    super()
    @blendMode = Pixi.BLEND_MODES.ADD
    [@x, @y] = [x, y]
    @radius = radius
    @lightFilter = new PointLightFilter()
    @filters = [@lightFilter]

  @property 'radius',
    set: (value) ->
      @_radius = value
      @clear()
      @beginFill(0xFFFFFF)
      @drawCircle(0, 0, value)
      @endFill()
    get: () ->
      return @_radius

  onRender: (camera) =>
    @lightFilter.uniforms.center.value = camera.toScreen([@x, @y])
    @lightFilter.uniforms.color.value = Util.Color.intToRgb(@color)
    @lightFilter.uniforms.intensity.value = @intensity
    @lightFilter.uniforms.radius.value = @radius
    @lightFilter.uniforms.scale.value = camera.z

  destroy: () =>
    @lights.removeLight(this)


#
class PointLightFilter extends AbstractLightFilter
  constructor: (radius) ->
    super FRAGMENT_SHADER, {
      center: {type: '2f', value: [0, 0]}
      color: {type: '3f', value: 1.0}
      intensity: {type: '1f', value: 1.0}
      radius: {type: '1f', value: radius}
      scale: {type: '1f', value: 1.0}
    }


module.exports = PointLight