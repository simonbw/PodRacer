import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';

export default class FPSMeter extends Entity {
  constructor() {
    super();
    this.layer = 'hud';
    this.sprite = new Pixi.Text('Super Pod Racer', {
      fontFamily: 'Arial',
      fontSize: '12px',
      fill: 0x000000
    });
    this.sprite.x = 10;
    this.sprite.y = 10;
    this.lastUpdate = performance.now();
    this.averageDuration = 60;
  }
  
  onRender() {
    const now = performance.now();
    this.averageDuration = 0.9 * this.averageDuration + 0.1 * (now - this.lastUpdate);
    this.lastUpdate = now;
    this.sprite.text = Math.round(1000 / this.averageDuration);
  }
}