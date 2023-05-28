import { Entity } from "cesium";

export type LandUseEntityOptions = ConstructorParameters<typeof Entity>[0] & {
  landUseType?: string;
  rectangleIndex?: string;
  landUseVotes?: Map<string, number>;
};

export class LandUseEntity extends Cesium.Entity {
  landUseType?: "energy" | "gracing" | "tourism" | "recreation" | "restoration" | "conservation";
  comment?: string;
  commentEntity?: Entity;
  rectangleIndex?: string;
  landUseVotes?: Map<string, number>;

  constructor(options: LandUseEntityOptions) {
    super(options);
    this.landUseType = options.landUseType as any;
    if (this.rectangle) {
      const coordinates =
      this.rectangle.coordinates &&
      this.rectangle.coordinates.getValue(Cesium.JulianDate.now());
    this.rectangleIndex = `${Cesium.Math.toDegrees(
      coordinates.west
    )}|${Cesium.Math.toDegrees(coordinates.south)}|${Cesium.Math.toDegrees(
      coordinates.east
    )}|${Cesium.Math.toDegrees(coordinates.north)}`;
    }
  }

  toJSON(): any {
    return {
      name: this.name,
      rectangleIndex: this.rectangleIndex,
      landUseType: this.landUseType,
      comment: this.comment,
    };
  }
}
