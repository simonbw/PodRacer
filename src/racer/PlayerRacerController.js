import Entity from '../core/Entity'
import * as Util from '../util/Util'
import Ground from '../environment/Ground'
import MainMenu from '../menu/MainMenu';

import * as GamepadButtons from '../core/constants/GamepadButtons'
import * as GamepadAxes from '../core/constants/GamepadAxes'


const LEFT_THROTTLE = 88; // X
const LEFT_FLAP = 90; // Z
const RIGHT_THROTTLE = 190; // .
const RIGHT_FLAP = 191; // /
const LEFT_BOOST = 67; // C
const RIGHT_BOOST = 188; // ,


export default class PlayerRacerController extends Entity {
  constructor(racer) {
    super();
    this.racer = racer;
  }

  beforeTick() {
    const stickTransform = (value) => Util.clamp(value, 0, 1) ** 1.2;
    const leftStick = stickTransform(-this.game.io.getAxis(GamepadAxes.LEFT_Y));
    const rightStick = stickTransform(-this.game.io.getAxis(GamepadAxes.RIGHT_Y));

    if (this.racer.leftEngine) {
      this.racer.leftEngine.setThrottle(leftStick + this.game.io.keys[LEFT_THROTTLE]);
    }
    if (this.racer.rightEngine) {
      this.racer.rightEngine.setThrottle(rightStick + this.game.io.keys[RIGHT_THROTTLE]);
    }

    const leftFlap = Util.clamp(this.game.io.getButton(GamepadButtons.LT) + this.game.io.keys[LEFT_FLAP], 0, 1);
    const rightFlap = Util.clamp(this.game.io.getButton(GamepadButtons.RT) + this.game.io.keys[RIGHT_FLAP], 0, 1);
    this.racer.setFlaps(leftFlap, rightFlap)
  }

  onButtonDown(button) {
    switch (button) {
      case GamepadButtons.L3:
        this.racer.leftEngine.boostOn();
        break;
      case GamepadButtons.R3:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onButtonUp(button) {
    switch (button) {
      case GamepadButtons.L3:
        this.racer.leftEngine.boostOff();
        break;
      case GamepadButtons.R3:
        this.racer.rightEngine.boostOff();
        break;
    }
  }

  onKeyDown(key) {
    switch (key) {
      case LEFT_BOOST:
        this.racer.leftEngine.boostOn();
        break;
      case RIGHT_BOOST:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onKeyUp(key) {
    switch (key) {
      case LEFT_BOOST:
        this.racer.leftEngine.boostOff();
        break;
      case RIGHT_BOOST:
        this.racer.rightEngine.boostOff();
        break;
    }
  }

  // this might cause bugs
  // TODO: remove, restructure
  afterTick() {
    if (!this.racer.pod) {
      this.game.clearAll(); // TODO: maybe we can do better?
      this.game.addEntity(new Ground());
      this.game.addEntity(new MainMenu());
    }
  }
}



