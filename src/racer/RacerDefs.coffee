

class RacerDef
  constructor: () ->
    @engine =
      'color': 0x0000FF
      'drag': 1.0
      'mass': 1.0
      'maxForce': 30.0
      'size': [0.5, 2.0]
    @pod =
      'color': 0x0000FF
      'drag': 3.0
      'mass': 1.0
      'size': [1, 1.5]
    @rope =
      'size': 0.03
      'color': 0x444444
      'stiffness': 10
      'damping': 1
    @coupling = 
      'stiffness': 20
      'damping': 0.5


RacerDefs = {}

RacerDefs.default = new RacerDef()

RacerDefs.test = new RacerDef()
RacerDefs.test.pod.color = 0x000000
RacerDefs.test.rope.color = 0x000000
RacerDefs.test.engine.color = 0x000000

module.exports = RacerDefs