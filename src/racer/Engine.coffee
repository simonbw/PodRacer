Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util.coffee'
Aero = require 'physics/Aerodynamics'
ControlFlap = require 'racer/ControlFlap'
RacerSoundController = require 'sound/RacerSoundController'

class Engine extends Entity
  constructor: ([x, y], @side, @engineDef) ->
    [w, h] = @engineDef.size
    @size = @engineDef.size

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(@engineDef.color)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @soundController = new RacerSoundController(this)

    @health = @engineDef.health
    @fragility = @engineDef.fragility

    @body = new p2.Body {
      position: [x, y]
      mass: @engineDef.mass
      angularDamping: 0.3
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

  onAdd: () =>
    @game.addEntity(@soundController)
    for flap in @flaps
      @game.addEntity(flap)

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

    left = [-0.5 * @size[0], 0.5 * @size[1]]
    right = [0.5 * @size[0], 0.5 * @size[1]]
    leftWorld = @localToWorld(left)
    rightWorld = @localToWorld(right)

    rand = Math.random()

    endPoint = @localToWorld([(left[0] + right[0]) / 2, (2.5 + rand) * @throttle + 0.5 * @size[1]])
    @game.draw.triangle(leftWorld, endPoint, rightWorld, 0x0000FF, 0.2)

    endPoint = @localToWorld([(left[0] + right[0]) / 2, (1.6 + rand) * @throttle + 0.5 * @size[1]])
    @game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00AAFF, 0.4)

    endPoint = @localToWorld([(left[0] + right[0]) / 2, (0.5 + rand) * @throttle + 0.5 * @size[1]])
    @game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00FFFF, 0.6)

    endPoint = @localToWorld([(left[0] + right[0]) / 2, (0.15 + rand) * @throttle + 0.5 * @size[1]])
    @game.draw.triangle(leftWorld, endPoint, rightWorld, 0xFFFFFF, 0.8)

  onTick: () =>
    Aero.applyAerodynamics(@body, @engineDef.drag, @engineDef.drag)

    @throttle = Util.clamp(@throttle, 0, 1)
    maxForce = @getMaxForce()
    fx = Math.cos(@getDirection()) * @throttle * maxForce
    fy = Math.sin(@getDirection()) * @throttle * maxForce
    @body.applyForce([fx,fy], @localToWorld([0, 0.5 * @size[1]]))

  # Return the angle the engine is pointing in
  getDirection: () =>
    return @body.angle - Math.PI / 2

  getMaxForce: () =>
    return @engineDef.maxForce + p2.vec2.length(@body.velocity) * 0.004 * @engineDef.maxForce

  onDestroy: (game) =>
    for flap in @flaps
      flap.destroy()
    @soundController.destroy()

  impact: (other) =>
    if @health > 0
      @health -= @fragility
    else
      @destroy()

module.exports = Engine