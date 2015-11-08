

class RacerDef
  constructor: () ->
    @engine =
      'color': 0x0000FF
      'drag': 0.8
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
    @leftEnginePosition = [-1, 0]
    @rightEnginePosition = [1, 0]
    @podPosition = [0, 8]
    @pod =
      'color': 0x0000FF
      'drag': 1.2
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
    @rope =
      'size': 0.03
      'color': 0x444444
      'stiffness': 20
      'damping': 1
    @coupling = 
      'stiffness': 30
      'damping': 0.5

RacerDefs = {}

RacerDefs.default = new RacerDef()

RacerDefs.test = new RacerDef()
#RacerDefs.test.pod.color = 0x000000
#RacerDefs.test.rope.color = 0x000000
#RacerDefs.test.engine.color = 0x000000

module.exports = RacerDefs