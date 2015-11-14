

class RacerDef
  constructor: () ->
    @engine =
      'color': 0x0000FF
      'drag': 1.0
      'mass': 1.0
      'maxForce': 80.0
      'size': [0.5, 2.0]
      'flaps': [{
        'color': 0xEEEE00
        'drag': 0.5
        'length': 0.8
        'maxAngle': Math.PI / 6
        'side': 'outside'
        'y': -1.0
      }, {
        'color': 0xEEEE00
        'drag': 0.5
        'length': 0.8
        'maxAngle': Math.PI / 6
        'side': 'inside'
        'y': -1.0
      }]
      'health': 100
      'fragility': 2
      'healthMeterColor': 0x00FFFF
      'healthMeterBackColor': 0x003355
      'healthMeterWidth': 0.07
      'healthMeterBackWidth': 0.07
    @leftEnginePosition = [-1, 0]
    @rightEnginePosition = [1, 0]
    @podPosition = [0, 8]
    @pod =
      'color': 0x0000FF
      'drag': 1.4
      'mass': 1.0
      'size': [1, 1.5]
      'position': [0, 10]
      'flaps': [{
        'color': 0x000055
        'drag': 0.8
        'length': 0.5
        'maxAngle': Math.PI / 3
        'y': 0
      }]
      'health': 100
      'fragility': 0.5
    @rope =
      'size': 0.03
      'color': 0x444444
      'stiffness': 20
      'damping': 1.5
    @coupling =
      'stiffness': 30
      'damping': 0.5

RacerDefs = {}

RacerDefs.default = new RacerDef()

RacerDefs.test = new RacerDef()
RacerDefs.test.pod.color = 0x2222BB
RacerDefs.test.rope.color = 0x444444
RacerDefs.test.engine.color = 0x2222BB
RacerDefs.test.pod.flaps[0].color = 0x1111AA

module.exports = RacerDefs