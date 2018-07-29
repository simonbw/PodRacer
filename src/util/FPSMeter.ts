import * as Pixi from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import { HEADING_FONT } from "../core/resources/fonts";

export default class FPSMeter extends BaseEntity {
  layer: "hud" = "hud";

  lastUpdate: number;
  averageDuration: number;
  sprite: Pixi.Text;
  slowFrameCount: number = 0;

  constructor() {
    super();
    this.sprite = new Pixi.Text("Super Pod Racer", {
      fontFamily: HEADING_FONT,
      fontSize: "12px",
      fill: 0x000000
    });
    this.sprite.x = 10;
    this.sprite.y = 10;
    this.lastUpdate = performance.now();
  }

  onAdd() {
    this.averageDuration = this.game.renderTimestep;
  }

  onRender() {
    const now = performance.now();
    const duration = now - this.lastUpdate;
    this.averageDuration = 0.9 * this.averageDuration + 0.1 * duration;
    this.lastUpdate = now;
    this.sprite.text = String(Math.round(1000 / this.averageDuration));
  }
}
