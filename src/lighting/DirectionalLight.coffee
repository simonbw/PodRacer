Pixi = require 'pixi.js'
fs = require 'fs'
Util = require 'util/Util'
AbstractLightFilter = require 'lighting/AbstractLightFilter'


FRAGMENT_SHADER = fs.readFileSync(__dirname + '/directional_light.frag', 'utf8')


# A simple point light
# TODO: This shouldn't have to extend Pixi.Graphics if I could figure out the filterArea thing
class DirectionalLight extends Pixi.Graphics
  constructor: (@lights, [x, y] = [0, 0], radius = 10, angle = 0, spread = 0.5, spreadFuzz = 0.2, @color = 0xFFFFFF, @intensity = 1) ->
    super()
    @blendMode = Pixi.BLEND_MODES.NORMAL
    [@x, @y] = [x, y];
    @_radius = radius
    @_angle = angle
    @_spread = spread
    @_spreadFuzz = spreadFuzz

    @lightFilter = new DirectionalLightFilter()
    @filters = [@lightFilter]

    @redraw()

  redraw: () =>
    @clear()
    @beginFill(0xFFFFFF)
    @moveTo(0, 0)
    totalSpread = @spread + @spreadFuzz
    @arc(0, 0, @radius, @angle - totalSpread, @angle + totalSpread)
    @lineTo(0, 0)
    @endFill()

  @property 'radius',
    set: (value) ->
      @_radius = value
      @redraw()
    get: () ->
      return @_radius

  @property 'spread',
    set: (value) ->
      @_spread = value
      @redraw()
    get: () ->
      return @_spread

  @property 'spreadFuzz',
    set: (value) ->
      @_spreadFuzz = value
      @redraw()
    get: () ->
      return @_spreadFuzz

  @property 'angle',
    set: (value) ->
      @_angle = value
      @redraw()
    get: () ->
      return @_angle

  onRender: (camera) =>
    @angle = Util.mod(@angle + Math.PI, Math.PI * 2) - Math.PI
    @lightFilter.uniforms.center.value = camera.toScreen([@x, @y])
    @lightFilter.uniforms.color.value = Util.Color.intToRgb(@color)
    @lightFilter.uniforms.intensity.value = @intensity
    @lightFilter.uniforms.lightAngle.value = @angle
    @lightFilter.uniforms.radius.value = @radius
    @lightFilter.uniforms.scale.value = camera.z
    @lightFilter.uniforms.spread.value = @spread
    @lightFilter.uniforms.spreadFuzz.value = @spreadFuzz

  destroy: () =>
    @lights.removeLight(this);


#
class DirectionalLightFilter extends AbstractLightFilter

  constructor: (radius) ->
    super FRAGMENT_SHADER, {
      center: {type: '2f', value: [0, 0]}
      color: {type: '3f', value: 1.0}
      intensity: {type: '1f', value: 1.0}
      lightAngle: {type: '1f', value: 0.0}
      radius: {type: '1f', value: radius}
      scale: {type: '1f', value: 1.0}
      spread: {type: '1f', value: 1.0}
      spreadFuzz: {type: '1f', value: 1.0}
    }


module.exports = DirectionalLight