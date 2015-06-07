Entity = require 'core/Entity'
Engine = require 'racer/Engine'
Pod = require 'racer/Pod'
p2 = require 'p2'
Pixi = require 'pixi.js'
ControlFlap = require 'racer/ControlFlap'
LinearSpring = p2.LinearSpring
RopeSpring = require 'physics/RopeSpring'
RacerDefs = require 'racer/RacerDefs'

# 
class Racer extends Entity
  constructor: ([x, y], @racerDef=RacerDefs.default) ->
    console.log "new racer"

    @pod = new Pod([x, y], @racerDef.pod)
    @leftEngine = new Engine([x - 1, y - 8], @racerDef.engine)
    @rightEngine = new Engine([x + 1, y - 8], @racerDef.engine)

    @rightFlaps = [] # controlled by right trigger
    @leftFlaps = [] # controlled by left trigger

    # @rightFlaps.push(new ControlFlap(@pod.body, [0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 1))
    # @leftFlaps.push(new ControlFlap(@pod.body, [-0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 0))

    # Springs
    @springs = []
    # ropes
    for [engine, podPoint] in [[@leftEngine, @pod.leftRopePoint], [@rightEngine, @pod.rightRopePoint]]
      @springs.push(new RopeSpring(@pod.body, engine.body, {
          localAnchorA: podPoint,
          localAnchorB: engine.ropePoint,
          stiffness: @racerDef.rope.stiffness,
          damping: @racerDef.rope.damping
        }))

    # engine couplings
    for [y1, y2] in [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      @springs.push(new LinearSpring(@leftEngine.body, @rightEngine.body, {
          localAnchorA: [0, @racerDef.engine.size[1] * y1],
          localAnchorB: [0, @racerDef.engine.size[1] * y2],
          stiffness: @racerDef.coupling.stiffness,
          damping: @racerDef.coupling.damping
        }))

  onAdd: (game) =>
    console.log "racer added"
    game.addEntity(@pod)
    game.addEntity(@leftEngine)
    game.addEntity(@rightEngine)

    for flap in @rightFlaps
      game.addEntity(flap)
    for flap in @leftFlaps
      game.addEntity(flap)

    for spring in @springs
      game.world.addSpring(spring)

  onRender: () =>
    width = @racerDef.rope.size # width in meters of the rope
    color = @racerDef.rope.color
    podLeftPoint = @pod.localToWorld(@pod.leftRopePoint)
    podRightPoint = @pod.localToWorld(@pod.rightRopePoint)
    leftEnginePoint = @leftEngine.localToWorld(@leftEngine.ropePoint)
    rightEnginePoint = @rightEngine.localToWorld(@rightEngine.ropePoint)
    @game.draw.line(podLeftPoint, leftEnginePoint, width, color)
    @game.draw.line(podRightPoint, rightEnginePoint, width, color)

  getWorldCenter: () =>
    x = (@leftEngine.body.position[0] + @rightEngine.body.position[0] + @pod.body.position[0]) / 3.0
    y = (@leftEngine.body.position[1] + @rightEngine.body.position[1] + @pod.body.position[1]) / 3.0
    return [x, y]

  onDestroy: (game) =>
    for spring in @springs
      game.world.removeSpring(spring)

module.exports = Racer