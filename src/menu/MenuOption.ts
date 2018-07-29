import * as Pixi from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import { MAIN_FONT } from "../core/resources/fonts";

const WIDTH = 300;
const HEIGHT = 80;

const UNSELECTED_COLOR = 0x555566;
const UNSELECTED_ALPHA = 0.5;
const SELECTED_COLOR = 0x3333ff;
const SELECTED_ALPHA = 0.9;

export default class MenuOption extends BaseEntity {
  sprite = new Pixi.Graphics();
  name: string;
  x: number;
  y: number;
  callback: () => void;
  text: Pixi.Text;

  constructor(name: string, x: number, y: number, callback: () => void) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
    this.callback = callback;

    this.text = new Pixi.Text(this.name, {
      fill: 0xffffff,
      fontFamily: MAIN_FONT,
      fontSize: "24px",
      lineHeight: HEIGHT
    });

    this.layer = "menu";
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.text.x = 10;
    this.text.y = 10;
    this.sprite.addChild(this.text);

    this.redrawSprite(UNSELECTED_COLOR, UNSELECTED_ALPHA);
  }

  select() {
    this.redrawSprite(SELECTED_COLOR, SELECTED_ALPHA);
  }

  unSelect() {
    this.redrawSprite(UNSELECTED_COLOR, UNSELECTED_ALPHA);
  }

  activate() {
    if (this.callback) {
      this.callback();
    }
  }

  private redrawSprite(color: number, alpha: number) {
    this.sprite.clear();
    this.sprite.beginFill(color, alpha);
    this.sprite.drawRect(0, 0, WIDTH, HEIGHT);
    this.sprite.endFill();
  }
}
