Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util.coffee'
Aero = require 'physics/Aerodynamics'
ControlFlap = require 'racer/ControlFlap'
RacerSoundController = require 'sound/RacerSoundController'
Materials = require 'physics/Materials'
Random = require 'util/Random'


CONDITIONS = [
  'throttle_stuck',
  'no_thrust',
  'left_flap_stuck',
  'right_flap_stuck',
  'stutter',
  'boost_stuck',
  'boost_failure',
]

class Engine extends Entity
  constructor: ([x, y], @side, @engineDef) ->
    [w, h] = @engineDef.size
    @size = @engineDef.size

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(@engineDef.color)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()
    @sprite.lineStyle(@engineDef.healthMeterBackWidth, @engineDef.healthMeterBackColor)
    @sprite.moveTo(0, 0.4 * @size[1])
    @sprite.lineTo(0, -0.4 * @size[1])

    @sprite.healthMeter = new Pixi.Graphics()
    @sprite.addChild(@sprite.healthMeter)

    @soundController = new RacerSoundController(this)

    @health = @engineDef.health
    @fragility = @engineDef.fragility

    @conditions = new Set()
    @conditionTimes = {}

    @body = new p2.Body {
      position: [x, y]
      mass: @engineDef.mass
      angularDamping: 0.3
      damping: 0.0
      material: Materials.RACER
    }

    shape1 = new p2.Rectangle(w, h)
    shape1.aerodynamics = true
    @body.addShape(shape1, [0, 0], 0)

    shape2Vertices = [[0.5*w, -0.5*h],[-0.5*w, -0.5*h],[0, -0.7*h]]
    shape2 = new p2.Convex(shape2Vertices)
    shape2.aerodynamics = false
    @body.addShape(shape2, [0, 0], 0)

    @boosting = false
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
    if @conditions.has('stutter')
      value *= Math.random()
    if not @conditions.has('throttle_stuck') and not @conditions.has('no_thrust')
      @throttle = Util.clamp(value, 0, 1)

  # Set the control value on all the engine's flaps
  # @param left {number} - between 0 and 1
  # @param right {number} - between 0 and 1
  setFlaps: (left, right) =>
    for flap in @flaps
      if flap.direction == ControlFlap.LEFT and not @conditions.has('left_flap_stuck')
        flap.setControl(left)
      if flap.direction == ControlFlap.RIGHT and not @conditions.has('right_flap_stuck')
        flap.setControl(right)

  onAdd: () =>
    @game.addEntity(@soundController)
    for flap in @flaps
      @game.addEntity(flap)

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

    @sprite.healthMeter.clear()
    @sprite.healthMeter.lineStyle(@engineDef.healthMeterWidth, @engineDef.healthMeterColor)
    @sprite.healthMeter.moveTo(0, 0.4 * @size[1])
    @sprite.healthMeter.lineTo(0, -0.4 * @size[1] * @health / @engineDef.health)

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

    # change engine color WIP
#    @sprite = new Pixi.Graphics()
#    @sprite.beginFill(@engineDef.color)
#    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
#    @sprite.endFill()

  onTick: () =>
    Aero.applyAerodynamics(@body, @engineDef.drag, @engineDef.drag)

    @throttle = Util.clamp(@throttle, 0, 1)
    force = @getCurrentForce()
    fx = Math.cos(@getDirection()) * force
    fy = Math.sin(@getDirection()) * force
    @body.applyForce([fx,fy], @localToWorld([0, 0.5 * @size[1]]))

    @conditions.forEach (condition) =>
      @conditionTimes[condition] -= @game.timestep
      if @conditionTimes[condition] <= 0
        @conditions.delete(condition)
        console.log "ending: #{condition}"

    # Grinding
    if @colliding
      @doCollisionDamage()

    # Conditions
    if @conditions.has('no_thrust')
      @throttle = 0

    if @conditions.has('boost_failure')
      @boosting = false

# Return the angle the engine is pointing in
  getDirection: () =>
    return @body.angle - Math.PI / 2

  getMaxForce: () =>
    force = if @boosting then @engineDef.boostMaxForce else @engineDef.maxForce
    return force + p2.vec2.length(@body.velocity) * 0.004 * force

  getCurrentForce: () =>
    return @getMaxForce() * @throttle

  onDestroy: (game) =>
    for flap in @flaps
      flap.destroy()
    @soundController.destroy()

  beginContact: (other, contactEquations) =>
    @collisionLength = 0
    @lastMomentum = @getMomentum()
    @colliding = true

  endContact: (other) =>
    @doCollisionDamage()
    @colliding = false

  doCollisionDamage: () =>
    @collisionLength += 1
    momentum = @getMomentum()
    xDifference = Math.abs(momentum[0] - @lastMomentum[0])
    yDifference = Math.abs(momentum[1] - @lastMomentum[1])
    angularDifference = Math.abs(momentum[2] - @lastMomentum[2])
    damage = Math.random() * (xDifference + yDifference + angularDifference) ** 1.4
    @lastMomentum = momentum

    if damage > 50
      condition = Random.choose(CONDITIONS)
      @conditions.add(condition)
      time = 5
      @conditionTimes[condition] = @conditionTimes[condition] + time || time
      console.log "#{damage} damage: #{condition} for #{time.toFixed(1)} seconds"

  repair: () =>
    @conditions.clear()

  getMomentum: () =>
    xMomentum = @body.velocity[0] * @body.mass
    yMomentum = @body.velocity[1] * @body.mass
    angularMomentum = @body.angularVelocity * @body.inertia
    return [xMomentum, yMomentum, angularMomentum]

  boostOn: () =>
    if not @conditions.has('boost_stuck') and not @conditions.has('boost_failure')
      @boosting = true

  boostOff: () =>
    if not @conditions.has('boost_stuck')
      @boosting = false

module.exports = Engine