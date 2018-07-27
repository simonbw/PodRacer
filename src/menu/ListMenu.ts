import * as GamepadAxes from "../core/constants/GamepadAxes";
import * as GamepadButtons from "../core/constants/GamepadButtons";
import * as Keys from "../core/constants/Keys";
import * as Pixi from "pixi.js";
import BaseEntity from "../core/BaseEntity";
import MenuCameraController from "../MenuCameraController";
import * as Util from "../util/Util";
import MenuOption from "./MenuOption";
import { HEADING_FONT } from "../core/fonts";

const DOWN_THRESHOLD = 250;

export default abstract class ListMenu extends BaseEntity {
  pausable = false;
  layer = "menu";
  sprite = new Pixi.Graphics();

  text: Pixi.Text;
  options: MenuOption[];
  cameraController = new MenuCameraController();
  lastMoveTime: number;
  currentOption: number;
  frameAdded: number;

  onAdd() {
    this.text = new Pixi.Text("Pod Racer", {
      fontFamily: HEADING_FONT,
      fontSize: "50px",
      fontWeight: "bold",
      fill: 0xffffff
    });
    this.sprite.x = 20;
    this.sprite.y = 100;
    this.sprite.addChild(this.text);
    this.game.addEntity(this.cameraController);
    this.lastMoveTime = Date.now();
    this.options = this.makeOptions();
    this.options.forEach(option => this.game.addEntity(option));
    this.currentOption = 0;
    this.selectOption(0);
    this.frameAdded = this.game.framenumber;
  }

  abstract makeOptions(): MenuOption[];

  onTick() {
    const axis = this.game.io.getAxis(GamepadAxes.LEFT_Y);
    let currentTime;
    if (Math.abs(axis) > 0.3) {
      // TODO: why 0.3?
      currentTime = Date.now();
    }
    if (currentTime - this.lastMoveTime >= DOWN_THRESHOLD) {
      this.lastMoveTime = currentTime;
      this.selectOption(this.currentOption + Math.sign(axis));
    } else if (Math.abs(axis) < 0.2) {
      this.lastMoveTime = 0;
    }
  }

  selectOption(index: number) {
    index = Util.clamp(index, 0, this.options.length - 1);
    this.options[this.currentOption].unSelect();
    this.options[index].select();
    this.currentOption = index;
  }

  cancel() {
    // Override me
  }

  onButtonDown(button: number) {
    // Don't accept input on the very first frame
    if (this.game.framenumber === this.frameAdded) {
      return;
    }
    switch (button) {
      case GamepadButtons.A:
        this.activateOption();
        break;
      case GamepadButtons.D_UP:
        this.selectOption(this.currentOption - 1);
        break;
      case GamepadButtons.D_DOWN:
        this.selectOption(this.currentOption + 1);
        break;
      case GamepadButtons.B:
        this.cancel();
        break;
    }
  }

  onKeyDown(key: number) {
    // Don't accept input on the very first frame
    if (this.game.framenumber === this.frameAdded) {
      return;
    }
    switch (key) {
      case Keys.SPACE:
      case Keys.ENTER:
        this.activateOption();
        break;
      case Keys.UP:
        this.selectOption(this.currentOption - 1);
        break;
      case Keys.DOWN:
        this.selectOption(this.currentOption + 1);
        break;
      case Keys.ESCAPE:
        this.cancel();
        break;
    }
  }

  activateOption() {
    this.options[this.currentOption].activate();
  }

  onDestroy() {
    this.cameraController.destroy();
    this.options.forEach(option => option.destroy());
  }
}
