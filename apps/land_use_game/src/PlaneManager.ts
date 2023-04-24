import { Cartesian3, Entity, SampledPositionProperty, Viewer } from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class PlaneManager extends YpCodeBase {
  selectedLandUse: string | undefined;
  viewer: Viewer | undefined;
  plane: Entity | undefined;
  geoJson: any;
  MINIMUM_FLIGHT_HEIGHT = 1700;
  MINIMUM_DISTANCE = 20; // km
  ANIMATION_TIME_OFFSET = 35;

  constructor(viewer: Viewer, geoJson: any) {
    super();
    this.viewer = viewer;
    this.geoJson = geoJson;
  }

   calculateDistanceInKm(position1: Cartesian3, position2: Cartesian3) {
    const point1Cartographic = Cesium.Cartographic.fromCartesian(position1);
    const point2Cartographic = Cesium.Cartographic.fromCartesian(position2);
    const distance = Cesium.Cartesian3.distance(position1, position2);
    const distanceInKm = distance / 1000.0;
    return distanceInKm;
  }

  async computeBoundaryFlight(): Promise<[SampledPositionProperty, number]> {
    const start = Cesium.JulianDate.fromDate(new Date());
    const property = new Cesium.SampledPositionProperty();
    const terrainProvider = this.viewer!.terrainProvider;

    let timeOffset = 0;
    let firstPosition = null;
    let prevPosition = null;
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

              const cartographicPosition = Cesium.Cartographic.fromDegrees(lon, lat);
              await Cesium.sampleTerrainMostDetailed(terrainProvider, [cartographicPosition]);
              const terrainHeight = cartographicPosition.height;

              const height = Math.max(
                Cesium.Math.nextRandomNumber() * 4000 + 1500,
                terrainHeight + this.MINIMUM_FLIGHT_HEIGHT
              );

              const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);

              if (prevPosition !== null) {
                const distanceInKm = this.calculateDistanceInKm(prevPosition, position);

                if (distanceInKm < this.MINIMUM_DISTANCE) {
                  continue;
                }
              }

              if (firstPosition === null) {
                firstPosition = position;
              }

              property.addSample(time, position);

              // Also create a point for each sample we generate.
              if (false) {
                this.viewer!.entities.add({
                  position: position,
                  point: {
                    pixelSize: 8,
                    color: Cesium.Color.TRANSPARENT,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                  },
                });
              }

              timeOffset += this.ANIMATION_TIME_OFFSET;
              prevPosition = position;
            }
          }
        }
      }
    }

    return [property, timeOffset];
  }


  async setup() {
    const [position, timeOffset] = await this.computeBoundaryFlight();
    const start = this.viewer!.clock.currentTime;
    const stop = Cesium.JulianDate.addSeconds(
      start,
      60 * 60,
      new Cesium.JulianDate()
    );

    position.setInterpolationOptions({
      interpolationDegree: 5,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
    });

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


  }
}
