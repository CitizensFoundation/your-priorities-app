import { ModelGraphics, Viewer } from "cesium";

export class ModelCache {
  private cache: Map<string, ModelGraphics>;

  constructor() {
    this.cache = new Map();
  }

  async loadModel(viewer: Viewer, url: string): Promise<ModelGraphics> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    } else {
      const modelEntity = new Cesium.Entity({
        model: {
          uri: url,
          show: false,
        },
      });
      viewer.entities.add(modelEntity);
      //await viewer.scene.clampToHeightMostDetailed([modelEntity]);
      const modelGraphics = modelEntity.model!;
      this.cache.set(url, modelGraphics);
      viewer.entities.remove(modelEntity);
      return modelGraphics;
    }
  }
}