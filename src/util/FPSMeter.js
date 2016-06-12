import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';


const getTime = Performance.now || Date.now;

export default class FPSMeter extends Entity {
  constructor() {
    super();
    this.layer = 'hud';
    this.sprite = new Pixi.Text('Super Pod Racer', {
      font: '12px Arial',
      fill: 0x000000
    });
    this.sprite.x = 10;
    this.sprite.y = 10;
    this.lastUpdate = getTime();
    this.averageDuration = 60;
  }

  onRender() {
    const now = getTime();
    this.averageDuration = 0.9 * this.averageDuration + 0.1 * (now - this.lastUpdate);
    this.lastUpdate = now;
    this.sprite.text = Math.round(1000 / this.averageDuration);
  }
}