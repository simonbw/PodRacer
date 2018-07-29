import * as Keys from "../core/constants/Keys";
import BaseEntity from "../core/BaseEntity";
import Ground from "../environment/Ground";
import MainMenu from "../menu/MainMenu";
import Racer from "./Racer";
import { clamp } from "../util/Util";
import { ControllerAxis, ControllerButton } from "../core/constants/Gamepad";

// TODO: Put these in a config file or something
// Keys
const K_LEFT_THROTTLE = Keys.X;
const K_RIGHT_THROTTLE = Keys.PERIOD;
const K_LEFT_FLAP = Keys.Z;
const K_RIGHT_FLAP = Keys.SLASH;
const K_LEFT_BOOST = Keys.C;
const K_RIGHT_BOOST = Keys.COMMA;
// Buttons
const B_LEFT_BOOST = ControllerButton.LB;
const B_RIGHT_BOOST = ControllerButton.RB;
const B_LEFT_FLAP = ControllerButton.LT;
const B_RIGHT_FLAP = ControllerButton.RT;

export default class PlayerRacerController extends BaseEntity {
  racer: Racer;

  constructor(racer: Racer) {
    super();
    this.racer = racer;
  }

  beforeTick() {
    const stickTransform = (value: number) => clamp(value) ** 1.2;
    const leftStick = stickTransform(
      -this.game.io.getAxis(ControllerAxis.LEFT_Y)
    );
    const rightStick = stickTransform(
      -this.game.io.getAxis(ControllerAxis.RIGHT_Y)
    );

    if (this.racer.leftEngine) {
      this.racer.leftEngine.setThrottle(
        clamp(leftStick + (this.game.io.keys[K_LEFT_THROTTLE] ? 1 : 0))
      );
    }
    if (this.racer.rightEngine) {
      this.racer.rightEngine.setThrottle(
        clamp(rightStick + (this.game.io.keys[K_RIGHT_THROTTLE] ? 1 : 0))
      );
    }

    const leftFlap = clamp(
      this.game.io.getButton(B_LEFT_FLAP) +
        (this.game.io.keys[K_LEFT_FLAP] ? 1 : 0)
    );
    const rightFlap = clamp(
      this.game.io.getButton(B_RIGHT_FLAP) +
        (this.game.io.keys[K_RIGHT_FLAP] ? 1 : 0)
    );
    this.racer.setFlaps(leftFlap, rightFlap);
  }

  onButtonDown(button: number) {
    switch (button) {
      case B_LEFT_BOOST:
        this.racer.leftEngine.boostOn();
        break;
      case B_RIGHT_BOOST:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onButtonUp(button: number) {
    switch (button) {
      case B_LEFT_BOOST:
        this.racer.leftEngine.boostOff();
        break;
      case B_RIGHT_BOOST:
        this.racer.rightEngine.boostOff();
        break;
    }
  }

  onKeyDown(key: number) {
    switch (key) {
      case K_LEFT_BOOST:
        this.racer.leftEngine.boostOn();
        break;
      case K_RIGHT_BOOST:
        this.racer.rightEngine.boostOn();
        break;
    }
  }

  onKeyUp(key: number) {
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
  afterPhysics() {
    if (!this.racer.pod) {
      this.game.removeAll(); // TODO: maybe we can do better?
      this.game.addEntity(new Ground());
      this.game.addEntity(new MainMenu());
    }
  }
}
