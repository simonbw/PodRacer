import * as Pixi from "pixi.js";

import ground from "./assets/images/ground.jpg";

export const imageUrls = {
  ground
};

export function loadPixiAssets() {
  console.log("loading resources...");
  return new Promise(resolve => {
    const loader = Pixi.loader;
    for (const url of Object.values(imageUrls)) {
      loader.add(url);
    }
    loader.load((_: void, resources: any) => {
      console.log("resources loaded", resources);
      resolve(resources);
    });
  });
}
