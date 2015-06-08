Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'
Aero = require 'physics/Aerodynamics'
ControlFlap = require 'racer/ControlFlap'


class Engine extends Entity
  constructor: ([x, y], @side, @engineDef) ->
    console.log "new engine at #{[x, y]}"
    
    [w, h] = @engineDef.size
    @size = @engineDef.size

    @sprite = new Pixi.Graphics()
    @sprite.lineStyle(0.01, 0xFFFFFF)
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
    @ropePoint = [0, 0.45 * h] # point the rope connects in local coordinates

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

  onAdd: (game) =>
    console.log "engine added"
    for flap in @flaps
      game.addEntity(flap)

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

  onTick: () =>
    Aero.applyAerodynamics(@body, @engineDef.drag, @engineDef.drag)
    
    @throttle = Util.clamp(@throttle, 0, 1)
    maxForce = @getMaxForce()
    fx = Math.cos(@body.angle - Math.PI / 2) * @throttle * maxForce
    fy = Math.sin(@body.angle - Math.PI / 2) * @throttle * maxForce
    @body.force[0] += fx
    @body.force[1] += fy

  getMaxForce: () =>
    return @engineDef.maxForce

  onDestroy: (game) =>
    for flap in @flaps
      flap.destoy()

module.exports = Engine