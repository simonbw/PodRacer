import * as GamepadButtons from "./constants/GamepadButtons";
import * as Keys from "./constants/Keys";
import BaseEntity from "./BaseEntity";
import PauseMenu from "../menu/PauseMenu";

export default class PauseController extends BaseEntity {
  pausable = false;

  onButtonDown(button: number) {
    if (button === GamepadButtons.START) {
      this.togglePause();
    }
  }

  onKeyDown(key: number) {
    if (key === Keys.ESCAPE) {
      this.togglePause();
    }
  }

  togglePause() {
    if (!this.game.paused) {
      this.game.togglePause();
      this.game.addEntity(new PauseMenu());
    }
  }
}
