import * as Pixi from "pixi.js";
import Camera from "./Camera";
import LayerInfo from "./LayerInfo";

// The thing that renders stuff to the screen. Mostly for handling layers.
export default class GameRenderer {
  private layerInfos: LayerInfo[] = [];
  private layerInfosByName: { [name: string]: LayerInfo } = {};

  pixiRenderer: Pixi.WebGLRenderer | Pixi.CanvasRenderer;
  stage: Pixi.Container;
  camera: Camera;

  constructor() {
    Pixi.settings.RESOLUTION = window.devicePixelRatio || 1;
    this.pixiRenderer = Pixi.autoDetectRenderer(
      window.innerWidth,
      window.innerHeight,
      {
        antialias: false,
        resolution: Pixi.settings.RESOLUTION
      }
    );
    document.body.appendChild(this.pixiRenderer.view);
    this.stage = new Pixi.Container();
    this.camera = new Camera(this);

    window.addEventListener("resize", () => this.handleResize());

    this.addLayer(new LayerInfo("world_back", 1));
    this.addLayer(new LayerInfo("world", 1));
    this.addLayer(new LayerInfo("world_front", 1));
    this.addLayer(new LayerInfo("world_overlay", 1));
    this.addLayer(new LayerInfo("hud", 0));
    this.addLayer(new LayerInfo("menu", 0));
  }

  private addLayer(layerInfo: LayerInfo) {
    this.stage.addChildAt(layerInfo.layer, this.layerInfos.length);
    this.layerInfosByName[layerInfo.name] = layerInfo;
    this.layerInfos.push(layerInfo);
  }

  private getLayerInfo(layerName: string) {
    const layerInfo = this.layerInfosByName[layerName];
    if (!layerInfo) {
      throw new Error(`Cannot find layer: ${layerInfo}`);
    }
    return layerInfo;
  }

  handleResize() {
    this.pixiRenderer.resize(window.innerWidth, window.innerHeight);
  }

  // Render the current frame.
  render() {
    for (const layerInfo of this.layerInfos) {
      this.camera.updateLayer(layerInfo);
    }
    this.pixiRenderer.render(this.stage);
  }

  add(
    sprite: Pixi.DisplayObject,
    layerName: string = "world"
  ): Pixi.DisplayObject {
    this.getLayerInfo(layerName).layer.addChild(sprite);
    return sprite;
  }

  // Remove a child from a specific layer.
  remove(sprite: Pixi.DisplayObject, layerName: string = "world"): void {
    this.getLayerInfo(layerName).layer.removeChild(sprite);
  }
}
