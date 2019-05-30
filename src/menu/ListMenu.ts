import * as Keys from "../core/constants/Keys";
import * as Pixi from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import MenuCameraController from "./MenuCameraController";
import * as Util from "../util/Util";
import MenuOption from "./MenuOption";
import { HEADING_FONT } from "../core/resources/fonts";
import { ControllerAxis, ControllerButton } from "../core/constants/Gamepad";
import Entity from "../core/entity/Entity";

const DOWN_THRESHOLD = 250;

export default abstract class ListMenu extends BaseEntity {
  pausable = false;
  layer: "menu" = "menu";
  sprite = new Pixi.Graphics();

  text: Pixi.Text;
  options: MenuOption[];
  cameraController? = new MenuCameraController();
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

    this.lastMoveTime = Date.now();

    this.options = this.makeOptions();
    for (const option of this.options) {
      this.game.addEntity(option);
    }
    this.currentOption = 0;
    this.selectOption(0);
    this.frameAdded = this.game.framenumber;

    if (this.cameraController) {
      this.game.addEntity(this.cameraController);
    }

    this.game.renderer.hideCursor();
  }

  abstract makeOptions(): MenuOption[];

  onTick() {
    const axis = this.game.io.getAxis(ControllerAxis.LEFT_Y);
    const currentTime = Date.now();
    if (Math.abs(axis) < 0.2) {
      this.lastMoveTime = 0;
    } else if (
      Math.abs(axis) > 0.3 &&
      currentTime - this.lastMoveTime >= DOWN_THRESHOLD
    ) {
      this.lastMoveTime = currentTime;
      this.selectOption(this.currentOption + Math.sign(axis));
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

  onButtonDown(button: ControllerButton) {
    // Don't accept input on the very first frame
    if (this.game.framenumber === this.frameAdded) {
      return;
    }
    switch (button) {
      case ControllerButton.A:
        this.activateOption();
        break;
      case ControllerButton.D_UP:
        this.selectOption(this.currentOption - 1);
        break;
      case ControllerButton.D_DOWN:
        this.selectOption(this.currentOption + 1);
        break;
      case ControllerButton.B:
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
      case Keys.W:
        this.selectOption(this.currentOption - 1);
        break;
      case Keys.DOWN:
      case Keys.S:
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
    if (this.cameraController) {
      this.cameraController.destroy();
    }
    for (const option of this.options) {
      option.destroy();
    }
  }
}
