import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';

// Class used to make drawing primitives easy
export default class Drawing extends Entity {
  constructor() {
    super();
    this.pausable = false;
    this.sprites = {};
  }
  
  line([x1, y1], [x2, y2], width = 0.01, color = 0xFFFFFF, alpha = 1.0, layer = 'world') {
    this.guaranteeLayerSprite(layer);
    const sprite = this.sprites[layer];
    sprite.lineStyle(width, color, alpha);
    sprite.moveTo(x1, y1);
    sprite.lineTo(x2, y2)
  }
  
  triangle(one, two, three, color = 0xFF0000, alpha = 1.0, layer = 'world') {
    this.guaranteeLayerSprite(layer);
    const sprite = this.sprites[layer];
    sprite.lineStyle();
    sprite.beginFill(color, alpha);
    sprite.drawPolygon([one[0], one[1], two[0], two[1], three[0], three[1]]);
    sprite.endFill()
  }
  
  guaranteeLayerSprite(layerName) {
    if (this.sprites[layerName] == null) {
      this.sprites[layerName] = new Pixi.Graphics();
      this.game.renderer.add(this.sprites[layerName], layerName);
    }
  }
  
  beforeTick() {
    Object.entries(this.sprites).forEach(([layerName, sprite]) => sprite.clear());
  }
  
  onDestroy() {
    Object.entries(this.sprites).forEach(([layerName, sprite]) => {
      this.game.renderer.remove(sprite, layerName);
    });
  }
}
