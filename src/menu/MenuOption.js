import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';

const WIDTH = 300;
const HEIGHT = 80;

const UNSELECTED_COLOR = 0x555566;
const UNSELECTED_ALPHA = 0.5;
const SELECTED_COLOR = 0x3333FF;
const SELECTED_ALPHA = 0.9;

export default class MenuOption extends Entity {
  constructor(name, x, y, callback) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
    this.callback = callback;
    
    this.text = new Pixi.Text(this.name, {
      fill: 0xFFFFFF,
      fontFamily: 'Arial',
      fontSize: '24px',
      lineHeight: HEIGHT
    });
    this.layer = 'menu';
    this.sprite = new Pixi.Graphics();
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
  
  redrawSprite(color, alpha) {
    this.sprite.clear();
    this.sprite.beginFill(color, alpha);
    this.sprite.drawRect(0, 0, WIDTH, HEIGHT);
    this.sprite.endFill();
  }
  
  activate() {
    if (this.callback) {
      this.callback();
    }
  }
}
