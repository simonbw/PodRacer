Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'
Aero = require 'physics/Aerodynamics'
ControlFlap = require 'racer/ControlFlap'


class Engine extends Entity
  constructor: ([x, y], @side, @engineDef) ->
    [w, h] = @engineDef.size
    @size = @engineDef.size

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(@engineDef.color)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @body = new p2.Body {
      position: [x, y]
      mass: @engineDef.mass
      angularDamping: 0.01
      damping: 0.0
    }

    shape = new p2.Rectangle(w, h)
    @body.addShape(shape, [0, 0], 0)

    @throttle = 0.0
    if @side == 'right'
      @ropePoint = [-0.4 * w, 0.45 * h] # point the rope connects in local coordinates
    else
      @ropePoint = [0.4 * w, 0.45 * h]

    @flaps = []
    for flapDef in @engineDef.flaps
      def = {}
      for prop in ['color', 'drag', 'length', 'maxAngle']
        def[prop] = flapDef[prop]
      if (@side == 'left' and flapDef.side == 'outside') or (@side == 'right' and flapDef.side == 'inside')
        def['direction'] = ControlFlap.LEFT
        def['position'] = [-@engineDef.size[0] / 2, flapDef.y]
      else
        def['direction'] = ControlFlap.RIGHT
        def['position'] = [@engineDef.size[0] / 2, flapDef.y]
      @flaps.push(new ControlFlap(@body, def))

  onAdd: (game) =>
#    @engineLight = game.lights.newPointLight()
    @engineLight = game.lights.newDirectionalLight()
    @engineLight.spread = 0
    @engineLight.spreadFuzz = Math.PI
    @engineLight.color = 0xAAFFFF

    @headLight = game.lights.newDirectionalLight()
    @headLight.spread = 0.3
    @headLight.spreadFuzz = Math.PI / 8
    @headLight.color = 0xFFFFAA
    @headLight.intensity = 0.35
    @headLight.radius = 100.0

    for flap in @flaps
      game.addEntity(flap)

  setThrottle: (value) =>
    @throttle = Util.clamp(value, 0, 1)

  # Set the control value on all the engine's flaps
  # @param left {number} - between 0 and 1
  # @param right {number} - between 0 and 1
  setFlaps: (left, right) =>
    for flap in @flaps
      if flap.direction == ControlFlap.LEFT
        flap.setControl(left)
      if flap.direction == ControlFlap.RIGHT
        flap.setControl(right)

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

    left = [-0.5 * @size[0], 0.5 * @size[1]]
    right = [0.5 * @size[0], 0.5 * @size[1]]
    leftWorld = @localToWorld(left)
    rightWorld = @localToWorld(right)

    rand = Math.random()

    @headLight.position.set(@localToWorld([0, -0.4 * @size[1]])...)
    @headLight.angle = @body.angle - Math.PI / 2

    throttleWithIdle = 0.2 + 0.8 * @throttle
    @engineLight.position.set(@localToWorld([0, 0.5 * @size[1]])...)
    @engineLight.angle = @body.angle + Math.PI / 2
    @engineLight.radius = (12.0 + 2.0 * rand)
    @engineLight.intensity = (0.6 + 0.2 * rand) * (0.2 + 0.8 * throttleWithIdle)


    # Engine effect, bottom to top
    triangleData = [[2.5, 0x0000FF, 0.2], [1.6, 0x00AAFF, 0.4], [0.5, 0x00FFFF, 0.6], [0.15, 0xFFFFFF, 0.8]]
    for [length, color, alpha] in triangleData
      endPoint = @localToWorld([(left[0] + right[0]) / 2, (length + rand) * throttleWithIdle + 0.5 * @size[1]])
      @game.draw.triangle(leftWorld, endPoint, rightWorld, color, alpha)

  onTick: () =>
    Aero.applyAerodynamics(@body, @engineDef.drag, @engineDef.drag)
    
    @throttle = Util.clamp(@throttle, 0, 1)
    maxForce = @getMaxForce()
    fx = Math.cos(@body.angle - Math.PI / 2) * @throttle * maxForce
    fy = Math.sin(@body.angle - Math.PI / 2) * @throttle * maxForce
    @body.applyForce([fx,fy], @localToWorld([0, 0.5 * @size[1]]))

  getMaxForce: () =>
    return @engineDef.maxForce + p2.vec2.length(@body.velocity) * 0.004 * @engineDef.maxForce

  onDestroy: (game) =>
    for flap in @flaps
      flap.destoy()

module.exports = Engine