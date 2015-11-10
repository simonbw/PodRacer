Entity = require 'core/Entity'
Engine = require 'racer/Engine'
Pod = require 'racer/Pod'
p2 = require 'p2'
Pixi = require 'pixi.js'
LinearSpring = p2.LinearSpring
RopeSpring = require 'physics/RopeSpring'
RacerDefs = require 'racer/RacerDefs'
Coupling = require 'racer/Coupling'

# 
class Racer extends Entity
  constructor: ([x, y], @racerDef=RacerDefs.default) ->
    podPosition = p2.vec2.add([0, 0], [x, y], @racerDef.podPosition)
    leftEnginePosition = p2.vec2.add([0, 0], [x, y], @racerDef.leftEnginePosition)
    rightEnginePosition = p2.vec2.add([0, 0], [x, y], @racerDef.rightEnginePosition)
    @pod = new Pod(podPosition, @racerDef.pod)
    @leftEngine = new Engine(leftEnginePosition, 'left', @racerDef.engine)
    @rightEngine = new Engine(rightEnginePosition, 'right', @racerDef.engine)
    @coupling = new Coupling(@leftEngine, @rightEngine, 0, 0, 0xFF22AA, 1)

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
    game.addEntity(@pod)
    game.addEntity(@leftEngine)
    game.addEntity(@rightEngine)

    game.addEntity(@coupling)

    for spring in @springs
      game.world.addSpring(spring)

  onRender: () =>
    if not @pod?
      return

    width = @racerDef.rope.size # width in meters of the rope
    color = @racerDef.rope.color

    if @leftEngine?
      podLeftPoint = @pod.localToWorld(@pod.leftRopePoint)
      leftEnginePoint = @leftEngine.localToWorld(@leftEngine.ropePoint)
      @game.draw.line(podLeftPoint, leftEnginePoint, width, color)

    if @rightEngine?
      podRightPoint = @pod.localToWorld(@pod.rightRopePoint)
      rightEnginePoint = @rightEngine.localToWorld(@rightEngine.ropePoint)
      @game.draw.line(podRightPoint, rightEnginePoint, width, color)
  
  # Set the control value on all the racer's flaps
  # @param left {number} - between 0 and 1
  # @param right {number} - between 0 and 1
  setFlaps: (left, right) =>
    if @pod? then @pod.setFlaps(left, right)
    if @leftEngine? then @leftEngine.setFlaps(left, right)
    if @rightEngine? then @rightEngine.setFlaps(left, right)

  # Get the velocity of the racer's pod
  getPodVelocity: () =>
    if @pod? then return Array.from(@pod.body.velocity) else return [0,0]

  getWorldCenter: () =>
    existingParts = [@leftEngine, @rightEngine, @pod].filter((x) -> x?)
    x = existingParts.reduce(((prev, curr) -> return prev + curr.body.position[0]), 0) / existingParts.length or 0
    y = existingParts.reduce(((prev, curr) -> return prev + curr.body.position[1]), 0) / existingParts.length or 0
    return [x, y]

  onDestroy: (game) =>
    for spring in @springs
      game.world.removeSpring(spring)

  afterTick: () =>
    for spring in @springs
      if not spring.bodyA.owner.game? or not spring.bodyB.owner.game?
        game.world.removeSpring(spring)
    if @leftEngine? and not @leftEngine.game?
      @leftEngine = null
    if @rightEngine? and not @rightEngine.game?
      @rightEngine = null
    if @pod? and not @pod.game?
      @pod = null


module.exports = Racer