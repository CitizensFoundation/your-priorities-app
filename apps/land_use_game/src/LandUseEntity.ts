import { Entity } from "cesium";

export type LandUseEntityOptions = ConstructorParameters<typeof Entity>[0] & { landUseType?: string };

export class LandUseEntity extends Cesium.Entity {
  landUseType?: string;
  comment?: string;
  commentEntity?: Entity;

  constructor(options: LandUseEntityOptions) {
    super(options);
    this.landUseType = options.landUseType;
  }
}
