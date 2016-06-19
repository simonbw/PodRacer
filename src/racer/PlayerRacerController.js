import * as GamepadAxes from '../core/constants/GamepadAxes';
import * as GamepadButtons from '../core/constants/GamepadButtons';
import * as Keys from '../core/constants/Keys';
import * as Util from '../util/Util';
import Entity from '../core/Entity';
import Ground from '../environment/Ground'
import MainMenu from '../menu/MainMenu';


// TODO: Put these in a config file or something
// Keys
const K_LEFT_THROTTLE = Keys.X;
const K_RIGHT_THROTTLE = Keys.PERIOD;
const K_LEFT_FLAP = Keys.Z;
const K_RIGHT_FLAP = Keys.SLASH;
const K_LEFT_BOOST = Keys.C;
const K_RIGHT_BOOST = Keys.COMMA;
// Buttons
const B_LEFT_BOOST = GamepadButtons.LB;
const B_RIGHT_BOOST = GamepadButtons.RB;
const B_LEFT_FLAP = GamepadButtons.LT;
const B_RIGHT_FLAP = GamepadButtons.RT;


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
      this.racer.leftEngine.setThrottle(leftStick + this.game.io.keys[K_LEFT_THROTTLE]);
    }
    if (this.racer.rightEngine) {
      this.racer.rightEngine.setThrottle(rightStick + this.game.io.keys[K_RIGHT_THROTTLE]);
    }

    const leftFlap = Util.clamp(this.game.io.getButton(B_LEFT_FLAP) + this.game.io.keys[K_LEFT_FLAP], 0, 1);
    const rightFlap = Util.clamp(this.game.io.getButton(B_RIGHT_FLAP) + this.game.io.keys[K_RIGHT_FLAP], 0, 1);
    this.racer.setFlaps(leftFlap, rightFlap);
  }

  onButtonDown(button) {
    switch (button) {
      case B_LEFT_BOOST:
        this.racer.leftEngine.boostOn();
        break;
      case B_RIGHT_BOOST:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onButtonUp(button) {
    switch (button) {
      case B_LEFT_BOOST:
        this.racer.leftEngine.boostOff();
        break;
      case B_RIGHT_BOOST:
        this.racer.rightEngine.boostOff();
        break;
    }
  }

  onKeyDown(key) {
    switch (key) {
      case K_LEFT_BOOST:
        this.racer.leftEngine.boostOn();
        break;
      case K_RIGHT_BOOST:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onKeyUp(key) {
    switch (key) {
      case K_LEFT_BOOST:
        this.racer.leftEngine.boostOff();
        break;
      case K_RIGHT_BOOST:
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



