import {
  Cartesian3,
  Cartographic,
  Clock,
  Color,
  Entity,
  Model,
  PositionProperty,
  Property,
  Rectangle,
  SampledPositionProperty,
  VelocityVectorProperty,
  Viewer,
} from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";
import { LandUseEntity } from "./LandUseEntity";

const landUseModelPaths = {
  energy: "models/Power.glb",
  farming: "models/Farming.glb",
  tourism: "models/CesiumBalloon.glb",
  recreation: "models/CesiumBalloon.glb",
  restoration: "models/CesiumBalloon.glb",
  conservation: "models/CesiumBalloon.glb",
};

const landUseModelScales = {
  energy: 100,
  farming:  5,
  tourism:  100,
  recreation: 100,
  restoration:  100,
  conservation:  100,
};

export class TileManager extends YpCodeBase {
  selectedLandUse: string | undefined;
  viewer: Viewer | undefined;
  existingBoxes: Map<string, any> = new Map();
  geojsonData: any;
  allTiles: Rectangle[] = [];
  tileEntities: LandUseEntity[] = [];
  landUseCount: Map<string, number> = new Map();
  isCommenting = false;
  numberOfTilesWithComments = 0;
  numberOfTilesWithLandUse = 0;

  constructor(viewer: Viewer) {
    super();
    this.viewer = viewer;
  }

  countAssignedRectangles(landUse: string): number {
    return this.landUseCount.get(landUse) || 0;
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

  createWallFromGeoJSON(coordinates: any[], height: number, color: Color) {
    // Convert GeoJSON coordinates to positions with height
    const positions = coordinates.flatMap((coord) =>
      Cesium.Cartesian3.fromDegrees(coord[0], coord[1], height)
    );

    // Create a Cesium Wall entity
    this.viewer!.entities.add({
      wall: {
        positions: positions,
        material: color,
      },
    });
  }

  createTiles(
    rectangle: Rectangle,
    coordinates: any,
    width = 200000,
    height = 100000
  ): void {
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
          this.allTiles.push(rect);
        }
      }
    }
  }

  async readGeoData() {
    try {
      const response = await fetch("/testData/geodata.json");
      this.geojsonData = await response.json();

      this.geojsonData.features.forEach((feature: GeoJSONFeature) => {
        const coordinates = feature.geometry.coordinates;
        const color = Cesium.Color.BLUE.withAlpha(0.0);

        coordinates.forEach((polygon) => {
          const wallHeight = 1200; // Set the desired wawll height
          const wallColor = Cesium.Color.BLUE.withAlpha(0.2); // Set the desired wall color: ;
          this.createWallFromGeoJSON(polygon[0], wallHeight, wallColor);
          const rectangle = Cesium.Rectangle.fromCartographicArray(
            polygon[0].map((coord) =>
              Cesium.Cartographic.fromDegrees(coord[0], coord[1])
            )
          );
          const animationDuration = 40;

          this.createTiles(rectangle, coordinates);

          const sharedMaterial = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time, result) => {
              const elapsedSeconds = Cesium.JulianDate.secondsDifference(
                time,
                this.viewer!.clock.startTime
              );
              const alpha = Math.max(
                0.35 - elapsedSeconds / animationDuration,
                0
              );
              return Cesium.Color.fromAlpha(color, alpha, result);
            }, false)
          );

          // Add each tile as a rectangle entity to the EntityCollection
          this.allTiles.forEach((tile) => {
            const entity = new LandUseEntity({
              rectangle: {
                coordinates: tile,
                material: sharedMaterial,
              },
              landUseType: this.selectedLandUse,
            });

            this.viewer!.entities.add(entity);
            this.tileEntities.push(entity);
          });

          setTimeout(() => {
            sharedMaterial.color = new Cesium.ConstantProperty(color);
          }, animationDuration * 1000);
        });
      });
      this.calculateTileCounts();

    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  }

  createModel(url: string, position: PositionProperty, scale = 1.0) {
    const entity = this.viewer!.entities.add({
      name: url,
      position: position,
      model: {
        uri: url,
        scale: scale,
      },
    });
    return entity;
  }

  addCommentToRectangle(rectangleId: string, comment: string) {
    // Find the rectangle entity
    const rectangleEntity = this.viewer!.entities.getById(
      rectangleId
    ) as LandUseEntity;

    if (rectangleEntity) {
      // Add the comment to the rectangle entity
      rectangleEntity.comment = comment;

      // Add a 3D comment models from models/comment.glb
      const position = new Cesium.CallbackProperty((time, result) => {
        const center = Cesium.Rectangle.center(
          rectangleEntity.rectangle?.coordinates?.getValue(time)
        );
        return Cesium.Cartesian3.fromRadians(
          center.longitude,
          center.latitude,
          1200
        );
      }, false) as unknown as PositionProperty;

      rectangleEntity.commentEntity = this.createModel(
        "/models/chatBubble5.glb",
        position,
        275
      );

      this.calculateTileCounts();
    }
  }

  async processInputForRectangle(
    event: any,
    rectangleId: string,
    rectangleEntity: LandUseEntity,
    unsetIfSameLandUseType = true,
    landUseIconAnimation = true,
    boxAnimation = true
  ) {
    if (this.selectedLandUse && rectangleEntity.rectangle) {
      if (
        rectangleEntity.landUseType != undefined &&
        rectangleEntity.landUseType == this.selectedLandUse &&
        unsetIfSameLandUseType
      ) {
        const currentCount = this.landUseCount.get(this.selectedLandUse) || 0;
        this.landUseCount.set(this.selectedLandUse, currentCount - 1);
        rectangleEntity.landUseType = undefined;
        rectangleEntity.rectangle.material = new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.0)
        );
      } else {
        const newColor = this.getColorForLandUse(
          this.selectedLandUse
        ).withAlpha(0.32);

        rectangleEntity.landUseType = this.selectedLandUse;

        const currentCount = this.landUseCount.get(this.selectedLandUse) || 0;
        this.landUseCount.set(this.selectedLandUse, currentCount + 1);

        // Create a new material with the new color
        const newMaterial = new Cesium.ColorMaterialProperty(newColor);

        // Assign the new material to the picked rectangle
        rectangleEntity.rectangle.material = newMaterial;

        // Calculate the dimensions of the 3D box based on the rectangle
        const rectangle = rectangleEntity.rectangle.coordinates!.getValue(
          Cesium.JulianDate.now()
        );

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

        // Get the terrain height at the center position
        const terrainHeight = await this.getTerrainHeight(centerPosition);

        if (this.existingBoxes.has(rectangleId)) {
          // Remove the existing box entity
          const existingBoxEntity = this.existingBoxes.get(rectangleId);
          this.viewer!.entities.remove(existingBoxEntity);
          this.existingBoxes.delete(rectangleId);
        }

        if (boxAnimation) {
          // Calculate the distance from the camera to the center of the rectangle
          const cameraPosition = this.viewer!.camera.position;
          const boxCenterPosition =
            Cesium.Ellipsoid.WGS84.cartographicToCartesian(centerPosition);
          const distance = Cesium.Cartesian3.distance(
            cameraPosition,
            boxCenterPosition
          );

          // Map the distance to the height range (300-20000)
          const minDistance = 100;
          const maxDistance = 50000;
          const minHeight = 100;
          const maxHeight = 4500;
          const height =
            minHeight +
            ((distance - minDistance) / (maxDistance - minDistance)) *
              (maxHeight - minHeight);

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
        }

        if (landUseIconAnimation) {
          //@ts-ignore
          const url = landUseModelPaths[this.selectedLandUse];

          const startPosition = Cesium.Cartesian3.fromDegrees(
            (west + east) / 2,
            (south + north) / 2,
            500
          );
          const endPosition = Cesium.Cartesian3.fromDegrees(
            (west + east) / 2,
            (south + north) / 2,
            150000 // Adjust the value to control how far the model moves upward
          );

          const animationClock = new Cesium.Clock({
            startTime: Cesium.JulianDate.now(),
            currentTime: this.viewer!.clock.currentTime,
          });

          const currentTime = animationClock.currentTime;
          const durationInSeconds = 60;
          const endTime = new Cesium.JulianDate();
          Cesium.JulianDate.addSeconds(currentTime, durationInSeconds, endTime);

          const positionProperty = new Cesium.SampledPositionProperty();

          positionProperty.setInterpolationOptions({
            interpolationDegree: 1,
            interpolationAlgorithm: Cesium.LinearApproximation,
          });

          positionProperty.addSample(animationClock.currentTime, startPosition);
          positionProperty.addSample(endTime, endPosition);

          //@ts-ignore
          const modelInstance = this.createModel(url, positionProperty, landUseModelScales[this.selectedLandUse]);

          // Remove the model after the animation is completed
          setTimeout(() => {
            this.viewer!.entities.remove(modelInstance);
          }, durationInSeconds * 40000);
          setTimeout(() => {
            modelInstance.position = positionProperty;
          }, Cesium.JulianDate.secondsDifference(endTime, currentTime) * 1000);

          // Remove the model after 5 seconds
          setTimeout(() => {
            //this.viewer!.entities.remove(modelInstance);
          }, 50000);
        }
      }
    }
  }

  calculateTileCounts() {
    let numberOfTilesWithComments = 0;
    let numberOfTilesWithLandUse = 0;

    this.tileEntities.forEach((landUseEntity: LandUseEntity) => {
      if (landUseEntity.landUseType) {
        numberOfTilesWithLandUse += 1;
      }
      if (landUseEntity.comment) {
        numberOfTilesWithComments += 1;
      }
    });

    this.numberOfTilesWithComments = numberOfTilesWithComments;
    this.numberOfTilesWithLandUse = numberOfTilesWithLandUse;

    this.fire(
      "update-tile-count",
      {
        totalNumberOfTiles: this.tileEntities.length,
        numberOfTilesWithComments: this.numberOfTilesWithComments,
        numberOfTilesWithLandUse: this.numberOfTilesWithLandUse,
      },
      document
    );

    console.log(`numberOfTilesWithComments: ${numberOfTilesWithComments}`);
    console.log(`numberOfTilesWithLandUse: ${numberOfTilesWithLandUse}`);
    console.log(`totalNumberOfTiles: ${this.tileEntities.length}`)

  }

  async setInputAction(event: any) {
    const pickedFeatures = this.viewer!.scene.drillPick(event.position);

    // Filter the pickedFeatures to get the rectangle entity
    const rectangleEntity = pickedFeatures.find(
      (pickedFeature) => pickedFeature.id && pickedFeature.id.rectangle
    );

    console.log(`rectangleEntity: ${rectangleEntity}`);

    if (rectangleEntity) {
      const rectangleId = rectangleEntity.id.id;

      if (this.isCommenting) {
        this.fire("open-comment", { rectangleId }, document);
      } else if (this.selectedLandUse) {
        console.log(`selectedLandUse: ${this.selectedLandUse}`);
        this.processInputForRectangle(event, rectangleId, rectangleEntity.id);
        if (this.viewer!.camera!.positionCartographic!.height > 20000) {
          const pickedRectangle = rectangleEntity.id.rectangle;
          const adjacentTiles = this.allTiles.filter((tile) => {
            const centerX1 = (tile.west + tile.east) / 2;
            const centerY1 = (tile.north + tile.south) / 2;

            const centerX2 = (pickedRectangle.west + pickedRectangle.east) / 2;
            const centerY2 =
              (pickedRectangle.north + pickedRectangle.south) / 2;

            const pickedRectangleCoordinates =
              pickedRectangle.coordinates.getValue(Cesium.JulianDate.now());

            const deltaX = Math.abs(
              tile.west - pickedRectangleCoordinates.west
            );
            const deltaY = Math.abs(
              tile.north - pickedRectangleCoordinates.north
            );

            const tileSizeX =
              pickedRectangleCoordinates.east - pickedRectangleCoordinates.west;
            const tileSizeY =
              pickedRectangleCoordinates.north -
              pickedRectangleCoordinates.south;

            const isAdjacentHorizontally =
              deltaX === tileSizeX && deltaY <= tileSizeY * 1.1;
            const isAdjacentVertically =
              deltaX <= tileSizeX * 1.1 && deltaY === tileSizeY;
            return (
              (isAdjacentHorizontally || isAdjacentVertically) &&
              tile !== pickedRectangle
            );
          });

          for (const adjacentTile of adjacentTiles) {
            const adjacentEntity = this.tileEntities.find((entity) => {
              const entityCoordinates = entity.rectangle!.coordinates!.getValue(
                Cesium.JulianDate.now()
              );
              const adjacentTileCoordinates = adjacentTile;

              return (
                entityCoordinates.west === adjacentTileCoordinates.west &&
                entityCoordinates.south === adjacentTileCoordinates.south &&
                entityCoordinates.east === adjacentTileCoordinates.east &&
                entityCoordinates.north === adjacentTileCoordinates.north
              );
            });

            if (adjacentEntity) {
              this.processInputForRectangle(
                event,
                adjacentEntity.id,
                adjacentEntity,
                false,
                false
              );

              // Update the adjacentEntity with the desired changes
              // (e.g., landUseType, material, comment, etc.)
            }
          }
        }

        this.calculateTileCounts();
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

  getColorForLandUse(landUse: string) {
    // Return a Cesium.Color based on the selected land use
    switch (landUse) {
      case "energy":
        return Cesium.Color.RED.withAlpha(0.3);
      case "farming":
        return Cesium.Color.BLUE.withAlpha(0.3);
      case "tourism":
        return Cesium.Color.ORANGE.withAlpha(0.3);
      case "recreation":
        return Cesium.Color.YELLOW.withAlpha(0.3);
      case "restoration":
        return Cesium.Color.CYAN.withAlpha(0.3);
      case "conservation":
        return Cesium.Color.PURPLE.withAlpha(0.3);
      default:
        return Cesium.Color.TRANSPARENT;
    }
  }
}
