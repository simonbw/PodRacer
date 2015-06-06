Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'

class Race extends Entity
  constructor: () ->
    @waypoints = []
    @racers = []
    @racerWaypointIndexes = new Map() # stores the index of the waypoint a racer is currently on

  onAdd: (game) =>
    for waypoint in @waypoints
      game.addEntity(waypoint)

  addWaypoint: (center, radius=10) =>
    @waypoints.push(new Waypoint(center, radius))

  addRacer: (racer) =>
    @racers.push(racer)
    @racerWaypointIndexes.set(racer, 0)
  
  onTick: () =>
    for racer in @racers
      waypoint = @getRacerWaypoint(racer)
      distance = p2.vec2.distance(racer.getWorldCenter(), waypoint.center)
      if distance <= waypoint.radius + 1
        @racerWaypointIndexes.set(racer, @racerWaypointIndexes.get(racer) + 1)
        console.log "waypoint completed", @getRacerWaypointIndex(racer)

  # Returns the current waypoint a racer is headed to 
  getRacerWaypoint: (racer) =>
    return @waypoints[@getRacerWaypointIndex(racer)]

  getRacerWaypointIndex: (racer) =>
    return @racerWaypointIndexes.get(racer) % @waypoints.length

  # Return the current lap a racer is on
  getRacerLap: (racer) =>
    return Math.floor(@racerWaypointIndexes.get(racer) / @waypoints.length)

  destroy: (game) =>
    super(game)
    for waypoint in @waypoints
      waypoint.destroy()


class Waypoint extends Entity
  constructor: (@center, @radius) ->
    @sprite = new Pixi.Graphics()
    @sprite.beginFill(0x00FF00, 0.3)
    @sprite.drawCircle(0, 0, @radius)
    @sprite.endFill()
    [@sprite.x, @sprite.y] = @center

module.exports = Race