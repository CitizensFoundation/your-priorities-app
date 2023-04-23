import { Cartographic, Model, Rectangle, Viewer } from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class TileManager extends YpCodeBase {
  selectedLandUse: string | undefined;
  viewer: Viewer | undefined;
  existingBoxes: Map<string, any> = new Map();

  constructor(viewer: Viewer) {
    super();
    this.viewer = viewer;
  }

  getColor(landuse: string) {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return new Cesium.Color(red / 255, green / 255, blue / 255, 0.2);
  }

  isPointInsidePolygon(point: any, polygon: any[]): boolean {
    let intersections = 0;
    const len = polygon.length;

    for (let i = 0, j = len - 1; i < len; j = i++) {
      const vertex1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        polygon[i]
      );
      const vertex2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        polygon[j]
      );

      if (
        vertex1.latitude > point.latitude !==
          vertex2.latitude > point.latitude &&
        point.longitude <
          ((vertex2.longitude - vertex1.longitude) *
            (point.latitude - vertex1.latitude)) /
            (vertex2.latitude - vertex1.latitude) +
            vertex1.longitude
      ) {
        intersections++;
      }
    }

    return intersections % 2 !== 0;
  }

  createTiles(
    rectangle: Rectangle,
    coordinates: any,
    width = 200000,
    height = 100000
  ): Rectangle[] {
    const tiles: Rectangle[] = [];

    const west = rectangle.west;
    const south = rectangle.south;
    const east = rectangle.east;
    const north = rectangle.north;

    const widthInRadians = Cesium.Math.toRadians(
      width / Cesium.Ellipsoid.WGS84.maximumRadius
    );
    const heightInRadians = Cesium.Math.toRadians(
      height / Cesium.Ellipsoid.WGS84.maximumRadius
    );

    for (let lon = west; lon < east; lon += widthInRadians) {
      for (let lat = south; lat < north; lat += heightInRadians) {
        const rect = new Cesium.Rectangle(
          lon,
          lat,
          Math.min(lon + widthInRadians, east),
          Math.min(lat + heightInRadians, north)
        );

        // Calculate the center of the rectangle
        const rectCenter = Cesium.Rectangle.center(rect);

        // Check if the center of the rectangle is inside any of the polygons
        let inside = false;
        for (const polygon of coordinates) {
          const cartesianCoords = polygon[0].map((coord: [number, number]) =>
            Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
          );
          if (this.isPointInsidePolygon(rectCenter, cartesianCoords)) {
            inside = true;
            break;
          }
        }

        if (inside) {
          tiles.push(rect);
        }
      }
    }

    return tiles;
  }

  async readGeoData() {
    try {
      const response = await fetch("/testData/geodata.json");
      const geojsonData = await response.json();

      geojsonData.features.forEach((feature: GeoJSONFeature) => {
        const landuse = feature.properties.LandUse;
        const coordinates = feature.geometry.coordinates;
        const color = Cesium.Color.BLUE.withAlpha(0.0);

        coordinates.forEach((polygon) => {
          const rectangle = Cesium.Rectangle.fromCartographicArray(
            polygon[0].map((coord) =>
              Cesium.Cartographic.fromDegrees(coord[0], coord[1])
            )
          );
          const animationDuration = 40;

          const tiles = this.createTiles(rectangle, coordinates);

          const sharedMaterial = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time, result) => {
              const elapsedSeconds = Cesium.JulianDate.secondsDifference(
                time,
                this.viewer!.clock.startTime
              );
              const alpha = Math.max(0.7 - elapsedSeconds / animationDuration, 0);
              return Cesium.Color.fromAlpha(color, alpha, result);
            }, false)
          );

          // Add each tile as a rectangle entity to the EntityCollection
          tiles.forEach((tile) => {
            const entity = this.viewer!.entities.add({
              rectangle: {
                coordinates: tile,
                material: sharedMaterial,
              },
            });
          });

          setTimeout(() => {
            sharedMaterial.color = new Cesium.ConstantProperty(color);
          }, animationDuration * 1000);
        });
      });
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  }

  hexToCesiumColor(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return new Cesium.Color(r, g, b, 1.0);
  }

  createModel(url: string, x: number, y: number, height: number) {
    const position = Cesium.Cartesian3.fromDegrees(x, y, height);
    this.viewer!.entities.add({
      name: url,
      position: position,
      model: {
        uri: url,
      },
    });
  }

  getGlowingMaterial(color: any) {
    const glowingMaterial = new Cesium.Material({
      fabric: {
        type: "Glowing",
        uniforms: {
          glowColor: color,
          glowIntensity: 0.5,
        },
        source: `
          uniform vec3 glowColor;
          uniform float glowIntensity;

          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec3 normal = normalize(materialInput.normalEC);
            vec3 lightDirection = normalize(czm_sunDirectionEC);
            float intensity = max(dot(normal, lightDirection), 0.0);
            vec3 glow = glowColor * pow(intensity, glowIntensity) * glowIntensity;
            material.diffuse = glow;
            material.alpha = 1.0;
            return material;
          }
        `,
      },
      translucent: false,
    });

    return glowingMaterial;
  }

  async setInputAction(event: any) {
    const pickedFeatures = this.viewer!.scene.drillPick(event.position);

    // Filter the pickedFeatures to get the rectangle entity
    const rectangleEntity = pickedFeatures.find(
      (pickedFeature) => pickedFeature.id && pickedFeature.id.rectangle
    );

    if (rectangleEntity) {
      const rectangleId = rectangleEntity.id.id;

      // Check if there is an existing box entity for the rectangle
      if (this.selectedLandUse) {
        const newColor = this.getColorForLandUse(
          this.selectedLandUse
        ).withAlpha(0.4);

        // Create a new material with the new color
        const newMaterial = new Cesium.ColorMaterialProperty(newColor);

        // Assign the new material to the picked rectangle
        rectangleEntity.id.rectangle.material = newMaterial;

        // Calculate the dimensions of the 3D box based on the rectangle
        const rectangle = rectangleEntity.id.rectangle.coordinates.getValue();

        const west = Cesium.Math.toDegrees(rectangle.west);
        const south = Cesium.Math.toDegrees(rectangle.south);
        const east = Cesium.Math.toDegrees(rectangle.east);
        const north = Cesium.Math.toDegrees(rectangle.north);

        const centerPosition = Cesium.Rectangle.center(rectangle);
        const centerLatitude = Cesium.Math.toDegrees(centerPosition.latitude);

        const widthInRadians = rectangle.width;
        const heightInRadians = rectangle.height;

        const width = Math.abs(
          widthInRadians *
            Math.cos(centerPosition.latitude) *
            Cesium.Ellipsoid.WGS84.maximumRadius
        );
        const depth = Math.abs(
          heightInRadians * Cesium.Ellipsoid.WGS84.maximumRadius
        );
        const height = 300; // Set the height of the box

        // Get the terrain height at the center position
        const terrainHeight = await this.getTerrainHeight(centerPosition);

        if (this.existingBoxes.has(rectangleId)) {
          // Remove the existing box entity
          const existingBoxEntity = this.existingBoxes.get(rectangleId);
          this.viewer!.entities.remove(existingBoxEntity);
          this.existingBoxes.delete(rectangleId);
        }

        // Create a 3D box entity
        const boxEntity = this.viewer!.entities.add({
          position: Cesium.Ellipsoid.WGS84.cartographicToCartesian(
            new Cesium.Cartographic(
              centerPosition.longitude,
              centerPosition.latitude,
              terrainHeight + height / 2
            )
          ),
          box: {
            dimensions: new Cesium.Cartesian3(width, depth, height),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            material: this.getColorForLandUse(this.selectedLandUse) as any,
          },
        });

        this.existingBoxes.set(rectangleId, boxEntity);

        // Remove the box after 3 seconds
        setTimeout(() => {
          this.viewer!.entities.remove(boxEntity);
        }, 2000);

        const url = "models/CesiumBalloon.glb";

        const startPosition = Cesium.Cartesian3.fromDegrees(
          (west + east) / 2,
          (south + north) / 2,
          height / 2
        );
        const endPosition = Cesium.Cartesian3.fromDegrees(
          (west + east) / 2,
          (south + north) / 2,
          height / 2 + 20000 // Adjust the value to control how far the model moves upward
        );
        const startColor = this.getColorForLandUse(
          this.selectedLandUse
        ).withAlpha(1);
        const endColor = this.getColorForLandUse(
          this.selectedLandUse
        ).withAlpha(0);

        const currentTime = Cesium.JulianDate.now();
        const endTime = new Cesium.JulianDate();
        Cesium.JulianDate.addSeconds(currentTime, 30, endTime);

        const positionProperty = new Cesium.SampledPositionProperty();
        positionProperty.addSample(currentTime, startPosition);
        positionProperty.addSample(endTime, endPosition);

        const colorProperty = new Cesium.SampledProperty(Cesium.Color);
        colorProperty.addSample(currentTime, startColor);
        colorProperty.addSample(endTime, endColor);

        const startOrientation = Cesium.Transforms.headingPitchRollQuaternion(
          startPosition,
          new Cesium.HeadingPitchRoll(0, 0, 0)
        );

        const endOrientation = Cesium.Transforms.headingPitchRollQuaternion(
          endPosition,
          new Cesium.HeadingPitchRoll(0, 0, 0)
        );

        const orientationProperty = new Cesium.SampledProperty(
          Cesium.Quaternion
        );
        orientationProperty.addSample(currentTime, startOrientation);
        orientationProperty.addSample(endTime, endOrientation);
        const lon = Cesium.Math.toDegrees(centerPosition.longitude);
        const lat = Cesium.Math.toDegrees(centerPosition.latitude);
        const terrainHeightFinal = terrainHeight + height / 2;

        this.createModel(url, lon, lat, terrainHeightFinal);

        // Remove the model after 5 seconds
        setTimeout(() => {
          //this.viewer!.entities.remove(modelInstance);
        }, 50000);
      }
    }
  }

  async getTerrainHeight(position: Cartographic): Promise<number> {
    const terrainProvider = this.viewer!.terrainProvider;
    const positions = [position];

    const sampledPositions = await Cesium.sampleTerrainMostDetailed(
      terrainProvider,
      positions
    );

    return sampledPositions[0].height;
  }

  getMaterialForLandUse(landUse: string) {
    switch (landUse) {
      case "energy":
        return this.getGlowingMaterial(Cesium.Color.RED.withAlpha(0.3));
      case "farming":
        return this.getGlowingMaterial(Cesium.Color.BLUE.withAlpha(0.3));
      case "tourism":
        return this.getGlowingMaterial(Cesium.Color.GREEN.withAlpha(0.3));
      case "recreation":
        return this.getGlowingMaterial(Cesium.Color.YELLOW.withAlpha(0.3));
      case "restoration":
        return this.getGlowingMaterial(Cesium.Color.PINK.withAlpha(0.3));
      case "conservation":
        return this.getGlowingMaterial(Cesium.Color.PURPLE.withAlpha(0.3));
      default:
        return Cesium.Color.TRANSPARENT;
    }
  }

  getColorForLandUse(landUse: string) {
    // Return a Cesium.Color based on the selected land use
    switch (landUse) {
      case "energy":
        return Cesium.Color.RED.withAlpha(0.3);
      case "farming":
        return Cesium.Color.BLUE.withAlpha(0.3);
      case "tourism":
        return Cesium.Color.GREEN.withAlpha(0.3);
      case "recreation":
        return Cesium.Color.YELLOW.withAlpha(0.3);
      case "restoration":
        return Cesium.Color.PINK.withAlpha(0.3);
      case "conservation":
        return Cesium.Color.PURPLE.withAlpha(0.3);
      default:
        return Cesium.Color.TRANSPARENT;
    }
  }
}
