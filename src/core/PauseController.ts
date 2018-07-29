import * as Keys from "./constants/Keys";
import BaseEntity from "./BaseEntity";
import PauseMenu from "../menu/PauseMenu";
import { ControllerButton } from "./constants/Gamepad";

export default class PauseController extends BaseEntity {
  pausable = false;

  onAdd() {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      this.pause();
    }
  };

  onDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onButtonDown(button: number) {
    if (button === ControllerButton.START) {
      this.pause();
    }
  }

  onKeyDown(key: number) {
    if (key === Keys.ESCAPE) {
      this.pause();
    }
  }

  pause() {
    if (!this.game.paused) {
      this.game.pause();
      this.game.addEntity(new PauseMenu());
    }
  }
}
