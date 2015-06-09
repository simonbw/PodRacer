Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
p2 = require 'p2'

class Race extends Entity
  constructor: (@laps=3, onEnd=null) ->
    @waypoints = []
    @racers = []
    @racerWaypointIndexes = new Map() # stores the index of the waypoint a racer is currently on
    @racerLaps = new Map() # stores the index of the waypoint a racer is currently on

  onAdd: (game) =>
    for waypoint in @waypoints
      game.addEntity(waypoint)

  addWaypoint: (center, radius=20) =>
    @waypoints.push(new Waypoint(center, radius))

  addRacer: (racer) =>
    @racers.push(racer)
    @racerWaypointIndexes.set(racer, 0)
    @racerLaps.set(racer, 0)
  
  onTick: () =>
    for racer in @racers
      waypoint = @getRacerWaypoint(racer)
      distance = p2.vec2.distance(racer.getWorldCenter(), waypoint.center)
      if distance <= waypoint.radius + 1
        current = @racerWaypointIndexes.get(racer)
        @racerWaypointIndexes.set(racer, (current + 1) % @waypoints.length)
        console.log "waypoint reached", current
        if current == 0
          @racerLaps.set(racer, @racerLaps.get(racer) + 1)
          console.log "new lap"
          if @racerLaps.get(racer) > @laps
            console.log "RACE OVER"
            @destroy()
            break

  onRender: () =>
    for waypoint, i in @waypoints
      nextWaypoint = @waypoints[(i + 1) % @waypoints.length]
      @game.draw.line(waypoint.center, nextWaypoint.center, 0.1, 0x00FF00, 0.5)

  # Returns the current waypoint a racer is headed to 
  getRacerWaypoint: (racer) =>
    return @waypoints[@racerWaypointIndexes.get(racer)]

  # Return the current lap a racer is on
  getRacerLap: (racer) =>
    return Math.floor(@racerWaypointIndexes.get(racer) / @waypoints.length)

  onDestroy: (game) =>
    while @waypoints.length
      @waypoints.pop().destroy()


class Waypoint extends Entity
  constructor: (@center, @radius) ->
    @sprite = new Pixi.Graphics()
    @sprite.beginFill(0x00FF00, 0.3)
    @sprite.drawCircle(0, 0, @radius)
    @sprite.endFill()
    [@sprite.x, @sprite.y] = @center

module.exports = Race