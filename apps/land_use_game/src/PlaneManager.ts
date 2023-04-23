import { Entity, SampledPositionProperty, Viewer } from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class PlaneManager extends YpCodeBase {
  selectedLandUse: string | undefined;
  viewer: Viewer | undefined;
  plane: Entity | undefined;
  geoJson: any;

  constructor(viewer: Viewer, geoJson: any) {
    super();
    this.viewer = viewer;
    this.geoJson = geoJson;
  }

  computeBoundaryFlight(): SampledPositionProperty {
    const start = Cesium.JulianDate.fromDate(new Date());
    const property = new Cesium.SampledPositionProperty();

    let timeOffset = 0;
    for (const feature of this.geoJson.features) {
      const geometry = feature.geometry;
      if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          for (const coordinates of polygon) {
            for (let i = 0; i < coordinates.length - 1; i++) {
              const [lon, lat] = coordinates[i];
              const time = Cesium.JulianDate.addSeconds(
                start,
                timeOffset,
                new Cesium.JulianDate()
              );
              const position = Cesium.Cartesian3.fromDegrees(
                lon,
                lat,
                Cesium.Math.nextRandomNumber() * 500 + 1750
              );
              property.addSample(time, position);

              // Also create a point for each sample we generate.
              this.viewer!.entities.add({
                position: position,
                point: {
                  pixelSize: 8,
                  color: Cesium.Color.TRANSPARENT,
                  outlineColor: Cesium.Color.YELLOW,
                  outlineWidth: 3,
                },
              });

              timeOffset += 45;
            }
          }
        }
      }
    }

    return property;
  }

  setup() {
    const position = this.computeBoundaryFlight();
    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(
      start,
      360,
      new Cesium.JulianDate()
    );

    // Actually create the entity
    this.plane = this.viewer!.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: start,
          stop: stop,
        }),
      ]),

      position: position,

      orientation: new Cesium.VelocityOrientationProperty(position),

      model: {
        uri: "models/Cesium_Air.glb",
        scale: 100,
      },
    });

    //@ts-ignore
    this.plane!.position!.setInterpolationOptions({
      interpolationDegree: 5,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
    });
  }
}
