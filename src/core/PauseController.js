import * as GamepadButtons from './constants/GamepadButtons';
import * as Keys from './constants/Keys';
import Entity from './Entity';
import PauseMenu from '../menu/PauseMenu';

export default class PauseController extends Entity {
  constructor() {
    super();
    this.pausable = false;
  }
  
  onButtonDown(button) {
    if (button === GamepadButtons.START) {
      this.togglePause();
    }
  }
  
  onKeyDown(key) {
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
