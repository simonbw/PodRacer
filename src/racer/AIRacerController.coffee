Entity = require 'core/Entity'
p2 = require 'p2'
Util = require 'util/Util.coffee'

# Affects how far ahead the AI will look
PREDICTION_DISTANCE_SPEED_MULTIPLIER = 0.1
PREDICTION_EXPONENT = 1.2
MAX_THROTTLE = 1.0
TURN_FACTOR_LINEAR = 1.9
TURN_FACTOR_CUBIC = 1.3
TURN_FACTOR_NEAR = 0.005

class PlayerRacerController extends Entity
  constructor: (@racer, @race) ->

  beforeTick: () =>
    if @race? and not @race.game
      @race = null

    if @race?
      waypoint = @race.getRacerWaypoint(@racer)
      nextWaypoint = @race.getRacerWaypoint(@racer, 1)
      racerPos = @racer.getWorldCenter()

      speed = p2.vec2.length(@racer.pod.body.velocity)
      waypointDistance = p2.vec2.length([waypoint.center[0] - racerPos[0], waypoint.center[1] - racerPos[1]])
      predictionDistance =  speed * Math.sqrt(waypoint.radius) * PREDICTION_DISTANCE_SPEED_MULTIPLIER + waypoint.radius

      if predictionDistance > waypointDistance
        weight = (waypointDistance / predictionDistance) ** PREDICTION_EXPONENT
        invWeight = 1 - weight
        c1 = waypoint.center
        c2 = nextWaypoint.center
        target = [c1[0] * weight + c2[0] * invWeight, c1[1] * weight + c2[1] * invWeight]
      else
        target = waypoint.center

      currentAngle = (@racer.leftEngine.getDirection() + @racer.rightEngine.getDirection()) / 2
      targetAngle = Math.atan2(target[1] - racerPos[1], target[0] - racerPos[0])

      turnAmount = Util.angleDelta(currentAngle, targetAngle) / Math.PI # How much turn needed from -1 to 1
      turnAmount = (turnAmount ** 3) * TURN_FACTOR_LINEAR + turnAmount * TURN_FACTOR_CUBIC # TODO: Tune this
      turnAmount /= 1 + TURN_FACTOR_NEAR * Math.sqrt(waypointDistance / (speed + 1))
      turnAmount = Util.clamp(turnAmount)


      maxThrottle = MAX_THROTTLE
      @racer.leftEngine.setThrottle((1.0 + turnAmount) * maxThrottle) 
      @racer.rightEngine.setThrottle((1.0 - turnAmount) * maxThrottle)

 module.exports = PlayerRacerController