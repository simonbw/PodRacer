class RacerDef {
  constructor() {
    this.engine = {
      'boostMaxForce': 120.0,
      'color': 0x0000FF,
      'drag': 1.0,
      'flaps': [{
        'color': 0xEEEE00,
        'drag': 0.5,
        'length': 0.8,
        'maxAngle': Math.PI / 6,
        'side': 'outside',
        'y': -1.0
      }, {
        'color': 0xEEEE00,
        'drag': 0.5,
        'length': 0.8,
        'maxAngle': Math.PI / 6,
        'side': 'inside',
        'y': -1.0
      }],
      'fragility': 2,
      'health': 100,
      'healthMeterBackColor': 0x003355,
      'healthMeterBackWidth': 0.07,
      'healthMeterColor': 0x00FFFF,
      'healthMeterWidth': 0.07,
      'mass': 1.0,
      'maxForce': 85.0,
      'size': [0.5, 2.0]
    };

    this.leftEnginePosition = [-1, 0];
    this.rightEnginePosition = [1, 0];
    this.podPosition = [0, 8];

    this.pod = {
      'color': 0x0000FF,
      'drag': 1.4,
      'flaps': [{
        'color': 0x000055,
        'drag': 0.8,
        'length': 0.5,
        'maxAngle': Math.PI / 3,
        'y': 0
      }],
      'fragility': 0,
      'health': 100,
      'mass': 1.0,
      'position': [0, 10],
      'size': [1, 1.5]
    };
    this.rope = {
      'color': 0x444444,
      'damping': 1.5,
      'size': 0.03,
      'stiffness': 20
    };
    this.coupling = {
      'damping': 0.5,
      'stiffness': 30
    }
  }
}


export const ANAKIN = new RacerDef();

export const TEST = new RacerDef();
TEST.pod.color = 0x2222BB;
TEST.rope.color = 0x444444;
TEST.engine.color = 0x2222BB;
TEST.pod.flaps[0].color = 0x1111AA;
