Entity = require 'core/Entity'

WEIGHT = 0.95

# Provides performance information
class Profiler extends Entity
  constructor: () ->
    @phases = {}

  addPhase: (name, parent=null) =>
    @phases[name] = new Phase(name, @phases[parent])
    if parent?
      @phases[parent].children.push(@phases[name])

  start: (phase) =>
    @phases[phase].start()

  end: (phase) =>
    @phases[phase].end()

  report: () =>
    s = ''
    for name, phase of @phases
      if not phase.parent?
        s += phase.report()
    console.log(s)

class Phase
  constructor: (@name, @parent)->
    @calls = 0
    @totalTime = 0
    @children = []
    @recentTime = 0

  start: () =>
    @calls += 1
    @startTime = Date.now()
    
  end: () =>
    if @startTime?
      duration = Date.now() - @startTime
      @totalTime += duration
      @recentTime = WEIGHT * @recentTime + (1 - WEIGHT) * duration

  report: (indent=0) =>
    percent = if @parent? then 100 * @recentTime / @parent.recentTime else 100
    spaces = Array(indent + 1).join('  ')
    s = spaces + "#{@name}: #{@recentTime.toFixed(2)} (#{percent.toFixed(0)}%) \n"
    for phase in @children
      s += phase.report(indent + 1)
    return s

module.exports = Profiler