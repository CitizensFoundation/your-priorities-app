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
import { LandUseEntity, LandUseEntityOptions } from "./LandUseEntity";

const landUseModelPaths = {
  energy:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/power2.glb",
  gracing:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/sheep3.glb",
  tourism:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/turism55.glb",
  recreation:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/iconSnowmobile2.glb",
  restoration:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/Restoration.glb",
  conservation:
    "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/protection2.glb",
};

const landUseModelScales = {
  energy: 220000,
  gracing: 190,
  tourism: 220000,
  recreation: 220000,
  restoration: 250,
  conservation: 220000,
};

export class TileManager extends YpCodeBase {
  selectedLandUse:
    | "energy"
    | "gracing"
    | "tourism"
    | "recreation"
    | "restoration"
    | "conservation"
    | undefined;
  viewer: Viewer | undefined;
  existingBoxes: Map<string, any> = new Map();
  resultsModels: Entity[] = [];
  landAnimatedModels: Entity[] = [];
  geojsonData: any;
  allTiles: Rectangle[] = [];
  tileEntities: LandUseEntity[] = [];
  tileRectangleIndex: Map<string, LandUseEntity> = new Map();

  landUseCount: Map<string, number> = new Map();
  isCommenting = false;
  numberOfTilesWithComments = 0;
  numberOfTilesWithLandUse = 0;
  rectangleLandUseCounts = new Map<string, Map<string, number>>();
  rectangleCommentsUseCounts = new Map<string, number>();
  rectangleMaxHeights = new Map<string, number>();
  resultsModelsUsed = new Map<string, boolean>();
  showAllTileResults!: boolean;

  showAllView: undefined | object;

  constructor(viewer: Viewer) {
    super();
    this.viewer = viewer;
  }

  async setShowAllTileResults(showAllTileResults: boolean) {
    this.showAllTileResults = showAllTileResults;
    await this.updateTileResults();
  }

  computeCenterOfArea() {
    let lonTotal = 0;
    let latTotal = 0;
    let count = 0;

    for (const feature of this.geojsonData.features) {
      const geometry = feature.geometry;
      if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          for (const coordinates of polygon) {
            for (let i = 0; i < coordinates.length - 1; i++) {
              const [lon, lat] = coordinates[i];
              lonTotal += lon;
              latTotal += lat;
              count++;
            }
          }
        }
      }
    }

    const lonAvg = lonTotal / count;
    const latAvg = latTotal / count;

    return { lon: lonAvg, lat: latAvg };
  }

  async setupTileResults(posts: YpPostData[], skipComments = false) {
    const landUseCount: Map<string, number> = new Map();

    if (posts) {
      posts.forEach((post) => {
        // Iterate over each item in the privateData array
        post.publicPrivateData.forEach(
          (item: {
            landUseType: any;
            rectangleIndex: any;
            pointId: number;
          }) => {
            // Get the landUseType and rectangleIndex from the item
            const { landUseType, rectangleIndex, pointId } = item;

            // If the rectangleIndex doesn't exist in the map yet, add it with a new Map for its landUseCounts
            if (!this.rectangleLandUseCounts.has(rectangleIndex)) {
              this.rectangleLandUseCounts.set(rectangleIndex, new Map());
            }

            // Get the landUseCounts for this rectangleIndex
            const landUseCounts =
              this.rectangleLandUseCounts.get(rectangleIndex)!;

            // If the landUseType doesn't exist in the landUseCounts yet, add it with a count of 0
            if (!landUseCounts.has(landUseType)) {
              landUseCounts.set(landUseType, 0);
            }

            // Increment the count for this landUseType
            landUseCounts.set(landUseType, landUseCounts.get(landUseType)! + 1);

            // Count total landuse types
            if (!landUseCount.has(landUseType)) {
              landUseCount.set(landUseType, 0);
            }
            landUseCount.set(landUseType, landUseCount.get(landUseType)! + 1);

            if (pointId) {
              const rectangleEntity =
                this.tileRectangleIndex.get(rectangleIndex);
              if (rectangleEntity) {
                if (!rectangleEntity.pointIds) rectangleEntity.pointIds = [];
                rectangleEntity.pointIds.push(pointId);
              } else {
                console.error(
                  "rectangleEntity not found for rectangleIndex",
                  rectangleIndex
                );
              }

              if (!this.rectangleCommentsUseCounts.has(rectangleIndex)) {
                this.rectangleCommentsUseCounts.set(rectangleIndex, 0);
              }
              this.rectangleCommentsUseCounts.set(
                rectangleIndex,
                this.rectangleCommentsUseCounts.get(rectangleIndex)! + 1
              );
            }
          }
        );
      });

      // Set landUseCount in the class scope
      this.landUseCount = landUseCount;

      // Iterate over rectangleLandUseCounts to find the landUseType with the maximum count for each rectangle
      this.rectangleLandUseCounts.forEach((landUseCounts, rectangleIndex) => {
        let maxCount = 0;
        let dominantLandUseType: string | null = null;

        landUseCounts.forEach((count, landUseType) => {
          if (count > maxCount) {
            maxCount = count;
            dominantLandUseType = landUseType;
          }
        });

        // Set the dominant landUseType to the corresponding entity
        if (dominantLandUseType) {
          const entity = this.tileRectangleIndex.get(rectangleIndex);
          if (entity) {
            entity.landUseType = dominantLandUseType;
          }
        }
      });
    } else {
      console.error("No posts found");
    }
  }

  isFarEnough(
    entity: LandUseEntity,
    topRectangles: { entity: LandUseEntity; count: number }[]
  ): boolean {
    const currentRectangle = entity.rectangle!.coordinates!.getValue(
      Cesium.JulianDate.now()
    );
    for (const { entity: otherEntity } of topRectangles) {
      const otherRectangle = otherEntity.rectangle!.coordinates!.getValue(
        Cesium.JulianDate.now()
      );
      const dx = Math.abs(currentRectangle.east - otherRectangle.east);
      const dy = Math.abs(currentRectangle.north - otherRectangle.north);
      // Check if the rectangle is less than 2 rectangles away in either dimension
      if (dx < 1 * currentRectangle.width || dy < 1 * currentRectangle.height) {
        return false;
      }
    }
    return true;
  }

  getAllTopLevelPoints() {
    let pointIds: number[] = [];
    for (const entity of this.tileEntities) {
      if (entity.pointIds) {
        pointIds = [...pointIds, ...entity.pointIds];
      }
    }

    return pointIds;
  }

  getTopRectangles(): { entity: LandUseEntity; count: number }[] {
    // Extract and sort rectangle indexes by count
    const sortedRectangleIndexes = Array.from(
      this.rectangleLandUseCounts.entries()
    )
      .map(([index, counts]) => ({
        index,
        maxCount: Math.max(...Array.from(counts.values())),
      }))
      .sort((a, b) => b.maxCount - a.maxCount);

    const topRectangles: { entity: LandUseEntity; count: number }[] = [];

    for (const { index, maxCount } of sortedRectangleIndexes) {
      const entity = this.tileRectangleIndex.get(index);
      if (entity && this.isFarEnough(entity, topRectangles)) {
        topRectangles.push({ entity, count: maxCount });
        if (topRectangles.length >= 42) {
          break;
        }
      }
    }

    return topRectangles;
  }

  clearresultsModels() {
    this.resultsModels.forEach((box) => {
      this.viewer!.entities.remove(box);
    });
    this.resultsModels = [];
    this.resultsModelsUsed = new Map<string, boolean>();
  }

  getRectangleIndexAtOffset(
    rectangleIndex: string,
    i: number,
    j: number
  ): string {
    const [westStr, southStr, eastStr, northStr] = rectangleIndex.split("|");
    const west = parseFloat(westStr);
    const south = parseFloat(southStr);
    const east = parseFloat(eastStr);
    const north = parseFloat(northStr);

    const widthInDegrees = east - west;
    const heightInDegrees = north - south;

    const newWest = west + i * widthInDegrees;
    const newEast = newWest + widthInDegrees;
    const newSouth = south + j * heightInDegrees;
    const newNorth = newSouth + heightInDegrees;

    return `${newWest}|${newSouth}|${newEast}|${newNorth}`;
  }

  async updateCommentResults() {
    const deferredCommentEntities: { entity: Entity; rectangleEntity: any }[] =
      [];

    const commentPromises = Array.from(
      this.rectangleCommentsUseCounts.entries()
    ).map(async ([rectangleIndex, commentCount]) => {
      const rectangleEntity = this.tileRectangleIndex.get(rectangleIndex);
      const rectangle = rectangleEntity?.rectangle!.coordinates!.getValue(
        Cesium.JulianDate.now()
      );

      if (rectangleEntity && rectangle) {
        const centerPosition = Cesium.Rectangle.center(rectangle);
        const terrainHeight = await this.getTerrainHeight(centerPosition);
        // Calculate the highest point in the rectangle
        const maxEntityHeight =
          this.rectangleMaxHeights.get(rectangleIndex) || terrainHeight;

        // Find the maximum entity height among the 8 adjacent rectangles
        const adjacentMaxHeights = [];
        for (let i = -4; i <= 4; i++) {
          for (let j = -4; j <= 4; j++) {
            // Exclude the center rectangle (0, 0)
            if (!(i === 0 && j === 0)) {
              const adjacentRectangleIndex = this.getRectangleIndexAtOffset(
                rectangleIndex,
                i,
                j
              );
              if (adjacentRectangleIndex) {
                const adjacentMaxHeight =
                  this.rectangleMaxHeights.get(adjacentRectangleIndex) ||
                  maxEntityHeight;
                adjacentMaxHeights.push(adjacentMaxHeight);
              }
            }
          }
        }
        const maxAdjacentEntityHeight =
          Math.max(...adjacentMaxHeights) || maxEntityHeight + 5500;

        //console.error(`maxAdjacentEntityHeight: ${maxAdjacentEntityHeight}`);

        const chatBubbleHeight = commentCount > 1 ? 550 : 275;
        const positionHeight =
          maxAdjacentEntityHeight + chatBubbleHeight + 2048;

        // Calculate position for the chat bubble
        const position = new Cesium.ConstantPositionProperty(
          Cesium.Ellipsoid.WGS84.cartographicToCartesian(
            new Cesium.Cartographic(
              centerPosition.longitude,
              centerPosition.latitude,
              positionHeight
            )
          )
        );

        const modelUrl =
          commentCount > 1
            ? "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/chatBubble5.glb"
            : "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/chatBubble5.glb";

        if (
          rectangleEntity.pointId ||
          (rectangleEntity.pointIds && rectangleEntity.pointIds.length > 0)
        ) {
          const newCommentEntity = this.createModel(
            modelUrl,
            position,
            chatBubbleHeight,
            {
              rectangleIndex: rectangleEntity.rectangleIndex!,
            },
            true
          );

          deferredCommentEntities.push({
            entity: newCommentEntity,
            rectangleEntity: rectangleEntity,
          });
        }
      }
    });

    // Wait for all computations to finish
    await Promise.all(commentPromises);

    deferredCommentEntities.forEach(({ entity, rectangleEntity }) => {
      const addedEntity = this.viewer!.entities.add(entity);
      rectangleEntity.commentEntity = addedEntity;
      this.resultsModels.push(addedEntity); // Assuming you want to keep track of these as well
    });
  }

  async updateTileResults() {
    return new Promise<void>(async (resolve) => {
      this.clearresultsModels();

      const deferredEntities: any[] = [];

      const processTile = async ([rectangleIndex, landUseCounts]: [
        string,
        Map<string, number>
      ]) => {
        // Get the rectangle from the rectangleIndex
        const rectangleEntity = this.tileRectangleIndex.get(rectangleIndex);

        const rectangle = rectangleEntity?.rectangle!.coordinates!.getValue(
          Cesium.JulianDate.now()
        );

        if (rectangleEntity && rectangle) {
          const centerPosition = Cesium.Rectangle.center(rectangle);
          const centerLatitude = Cesium.Math.toDegrees(centerPosition.latitude);
          const terrainHeight = await this.getTerrainHeight(centerPosition);
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

          let maxCount = 1;
          const upperCountNormalized = 5;

          // Find the maxCount
          this.landUseCount.forEach((count, landUseType) => {
            if (count > maxCount) {
              maxCount = count;
            }
          });

          let highestCount = 1;

          landUseCounts.forEach((count, landUseType) => {
            if (count > highestCount) {
              highestCount = count;
            }
          });

          landUseCounts.forEach((count, landUseType) => {
            if (
              (!this.selectedLandUse || landUseType === this.selectedLandUse) &&
              (this.showAllTileResults || count === highestCount)
            ) {
              //count = ((count - 1) / (maxCount - 1)) * (upperCountNormalized - 0.1) + 0.1;
              //count = Math.sqrt(((count - 1) / (maxCount - 1)) * (upperCountNormalized - 0.1) + 0.1);

              // Create box entity with size based on the count
              //console.log("count", count);
              const alpha = Math.min(0.4, 0.05 + count / 20);
              //console.log("alpha", alpha)
              let height = count * 3000;

              //TODO: Get some caching working even if this will not work
              const modelIndex = `${rectangleIndex}|${landUseType}|${
                centerPosition.longitude
              }|${centerPosition.latitude}|${
                terrainHeight + height / 2
              }|${width}|${depth}|${height}|${alpha}`;
              if (this.resultsModelsUsed.get(modelIndex) !== true) {
                const newEntity = {
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
                    material: this.getColorForLandUse(
                      landUseType,
                      alpha
                    ) as any,
                  },
                };

                deferredEntities.push(newEntity);
                this.resultsModelsUsed.set(modelIndex, true);

                // Update the maximum height for the rectangle
                const currentMaxHeight =
                  this.rectangleMaxHeights.get(rectangleIndex) || 0;
                if (terrainHeight + height > currentMaxHeight) {
                  this.rectangleMaxHeights.set(
                    rectangleIndex,
                    terrainHeight + height
                  );
                }
              } else {
                console.info("Model already used: " + modelIndex);
              }
            }
          });
        } else {
          if (window.location.href.indexOf("localhost") > -1) {
            //console.error("No rectangle entity found for index: " + rectangleIndex);
          }
        }
      };

      const processTopRectangle = async ({
        entity: rectangleEntity,
        count,
      }: {
        entity: any;
        count: number;
      }) => {
        const rectangle = rectangleEntity.rectangle!.coordinates!.getValue(
          Cesium.JulianDate.now()
        );
        const centerPosition = Cesium.Rectangle.center(rectangle);
        const terrainHeight = await this.getTerrainHeight(centerPosition);

        const landUseType = rectangleEntity.landUseType;
        if (landUseType) {
          //@ts-ignore
          const modelUrl = landUseModelPaths[landUseType];
          //@ts-ignore
          const modelScale = landUseModelScales[landUseType];

          // Use count for calculating the height
          const modelHeight = 3000 * count; // Adjust the height value based on count
          const positionProperty = new Cesium.ConstantPositionProperty(
            Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(centerPosition.longitude),
              Cesium.Math.toDegrees(centerPosition.latitude),
              terrainHeight + modelHeight
            )
          );

          // Update the maximum height for the rectangle
          const rectangleIndex = rectangleEntity.rectangleIndex!;
          const currentMaxHeight =
            this.rectangleMaxHeights.get(rectangleIndex) || 0;
          if (terrainHeight + modelHeight > currentMaxHeight) {
            this.rectangleMaxHeights.set(
              rectangleIndex,
              terrainHeight + modelHeight
            );
          }

          const entity = {
            name: modelUrl,
            position: positionProperty,
            model: {
              uri: modelUrl,
              scale: modelScale,
            },
          };

          deferredEntities.push(entity);
        }
      };

      const tiles = Array.from(this.rectangleLandUseCounts.entries());
      const topRectangles = this.getTopRectangles();
      let index = 0;

      const processNextBatch = () => {
        if (index < tiles.length) {
          processTile(tiles[index]);
          index++;
        } else if (index < tiles.length + topRectangles.length) {
          processTopRectangle(topRectangles[index - tiles.length]);
          index++;
        } else {
          // All tiles and rectangles have been processed
          deferredEntities.forEach((newEntity) => {
            const addedEntity = this.viewer!.entities.add(newEntity);
            this.resultsModels.push(addedEntity);
          });
          resolve();
          return;
        }

        setTimeout(processNextBatch, 0);
      };

      processNextBatch();
    });
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

  rangarThGeoData = {
    type: "FeatureCollection",
    name: "Bláskógabyggð_landuse_glacierclip",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: { Name: "Bláskógabyggð", LandUse: "restoration" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [-18.6038, 64.2497],
                [-18.5335, 64.2154],
                [-18.4996, 64.2022],
                [-18.5215, 64.1798],
                [-18.6145, 64.154],
                [-18.6498, 64.1367],
                [-18.678, 64.1116],
                [-18.7601, 64.0686],
                [-18.7908, 64.0553],
                [-18.8416, 64.029],
                [-18.9167, 63.9778],
                [-18.9457, 63.9452],
                [-18.998, 63.8915],
                [-18.9963, 63.8828],
                [-18.9385, 63.7996],
                [-19.0284, 63.7501],
                [-19.0795, 63.7233],
                [-19.1126, 63.7846],
                [-19.1604, 63.8125],
                [-19.1994, 63.819],
                [-19.238, 63.839],
                [-19.3182, 63.8308],
                [-19.3173, 63.8349],
                [-19.3192, 63.8384],
                [-19.3178, 63.8427],
                [-19.318, 63.8436],
                [-19.3985, 63.8327],
                [-19.4779, 63.8195],
                [-19.483, 63.8176],
                [-19.4972, 63.8182],
                [-19.5231, 63.8176],
                [-19.5677, 63.7859],
                [-19.7395, 63.7948],
                [-19.855, 63.7843],
                [-19.9404, 63.7916],
                [-19.958, 63.7885],
                [-20.0381, 63.7975],
                [-20.1182, 63.7984],
                [-20.1986, 63.7885],
                [-20.2778, 63.7777],
                [-20.3591, 63.7605],
                [-20.3365, 63.7302],
                [-20.3728, 63.7157],
                [-20.4604, 63.738],
                [-20.4913, 63.7472],
                [-20.5191, 63.7548],
                [-20.5595, 63.7375],
                [-20.6086, 63.7097],
                [-20.6807, 63.7366],
                [-20.6887, 63.7389],
                [-20.7722, 63.7673],
                [-20.7529, 63.7892],
                [-20.7034, 63.8193],
                [-20.677, 63.8351],
                [-20.5975, 63.8225],
                [-20.598, 63.822],
                [-20.5974, 63.8214],
                [-20.5985, 63.8207],
                [-20.5976, 63.8198],
                [-20.5981, 63.8186],
                [-20.5985, 63.8178],
                [-20.5976, 63.8166],
                [-20.5015, 63.7751],
                [-20.4649, 63.8241],
                [-20.553, 63.8384],
                [-20.5177, 63.8685],
                [-20.5178, 63.8698],
                [-20.5173, 63.8737],
                [-20.5178, 63.8765],
                [-20.5176, 63.8779],
                [-20.5225, 63.8861],
                [-20.5252, 63.8981],
                [-20.5236, 63.8978],
                [-20.521, 63.8981],
                [-20.5172, 63.8993],
                [-20.5313, 63.9447],
                [-20.519, 63.9788],
                [-20.5176, 63.9823],
                [-20.4093, 64.02],
                [-20.3563, 64.0196],
                [-20.2752, 64.0079],
                [-20.1972, 64.031],
                [-20.1169, 64.055],
                [-20.0916, 64.0585],
                [-20.0632, 64.0579],
                [-20.0534, 64.0582],
                [-20.0377, 64.0666],
                [-19.9577, 64.0942],
                [-19.8759, 64.0825],
                [-19.8682, 64.058],
                [-19.8414, 64.0584],
                [-19.7969, 64.0625],
                [-19.7146, 64.1276],
                [-19.6944, 64.1388],
                [-19.6324, 64.1569],
                [-19.5573, 64.1808],
                [-19.4727, 64.1914],
                [-19.3977, 64.1889],
                [-19.3166, 64.2111],
                [-19.2372, 64.1857],
                [-19.1566, 64.1743],
                [-19.076, 64.1556],
                [-18.997, 64.1463],
                [-18.767, 64.2497],
                [-18.6901, 64.2863],
                [-18.6038, 64.2497],
              ],
            ],
          ],
        },
      },
    ],
  };

  thingEGeoData = {
    type: "FeatureCollection",
    name: "Þingeyjarsveit_full_simplified",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: { NAME: "Þingeyjarsveit", LANDUSE: "energy" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [-17.666232616999931, 66.012455156000044],
                [-17.665386166999948, 66.012455156000044],
                [-17.665386166999948, 66.01279297800005],
                [-17.666232616999931, 66.01279297800005],
                [-17.666232616999931, 66.012455156000044],
              ],
            ],
            [
              [
                [-17.667046281999948, 66.030380575000024],
                [-17.666194826999966, 66.030380575000024],
                [-17.666194826999966, 66.030779086000052],
                [-17.667046281999948, 66.030779086000052],
                [-17.667046281999948, 66.030380575000024],
              ],
            ],
            [
              [
                [-17.671410863999942, 66.032951541000045],
                [-17.670497810999962, 66.032951541000045],
                [-17.670497810999962, 66.03317190000007],
                [-17.671410863999942, 66.03317190000007],
                [-17.671410863999942, 66.032951541000045],
              ],
            ],
            [
              [
                [-17.883615133999971, 66.156561702000019],
                [-17.833577733999959, 66.156561702000019],
                [-17.833577733999959, 66.17255351700004],
                [-17.883615133999971, 66.17255351700004],
                [-17.883615133999971, 66.156561702000019],
              ],
            ],
            [
              [
                [-16.383690893244303, 65.79744374506906],
                [-16.378858941637471, 65.7282018201509],
                [-16.341713445241744, 65.684035943143883],
                [-16.260004733617397, 65.659799950211138],
                [-16.238195133304032, 65.647880768282789],
                [-16.178749696856755, 65.601056060041685],
                [-16.120077970383591, 65.566094476809155],
                [-16.128840184041792, 65.48927485076922],
                [-16.142534805759222, 65.408369623189401],
                [-16.101351811580287, 65.392435058263729],
                [-16.021488862206755, 65.343040305547788],
                [-16.007755343710137, 65.328998600035504],
                [-16.022023058783535, 65.315549198932089],
                [-16.103083827097578, 65.260808398832353],
                [-16.136522151438214, 65.249126006622305],
                [-16.183569552036889, 65.213064023517902],
                [-16.211699436559858, 65.169129861855424],
                [-16.209783728583037, 65.088352275437614],
                [-16.262066671346812, 65.013672078110289],
                [-16.323207535694507, 65.009250751236948],
                [-16.34404627337722, 65.003949459472594],
                [-16.423217403285545, 64.945206178724789],
                [-16.502295555859742, 64.93364155199157],
                [-16.526936110620053, 64.929258048074416],
                [-16.582251710505091, 64.920260586994573],
                [-16.638405175754599, 64.848886415863205],
                [-16.66216505143024, 64.834474922044805],
                [-16.682655581027575, 64.767816539586363],
                [-16.709342721409598, 64.688019825023375],
                [-16.738038387396905, 64.601689186320186],
                [-16.744674396725429, 64.581645544382511],
                [-16.764965141364769, 64.520172538540237],
                [-16.797100420179447, 64.42223776332952],
                [-16.864854042412613, 64.420504045988991],
                [-16.916256827693186, 64.41916764522982],
                [-16.999517903320115, 64.416964375134626],
                [-17.078850449878871, 64.414820639768138],
                [-17.150463345818988, 64.412848264128783],
                [-17.234179967722984, 64.410497692598824],
                [-17.305788604534143, 64.436151257079345],
                [-17.322241385109063, 64.451459520012733],
                [-17.38327820096163, 64.508084547025305],
                [-17.407117597920546, 64.53013013406256],
                [-17.465822029065009, 64.584248972546789],
                [-17.503151655275538, 64.618538692142465],
                [-17.541911527895536, 64.642222105882809],
                [-17.623405579085386, 64.650167088207112],
                [-17.707637547014375, 64.658326837976688],
                [-17.801377586908647, 64.667345414930196],
                [-17.867073684277504, 64.673626896621201],
                [-17.94400941933543, 64.68743505136905],
                [-17.956019110835204, 64.689680463874197],
                [-18.028623724193835, 64.713835769627664],
                [-18.101868572457708, 64.747850343369848],
                [-18.123854120015213, 64.769392097070849],
                [-18.182169363366658, 64.787061719781093],
                [-18.262825247111213, 64.777453221025539],
                [-18.26167027011957, 64.805628459470086],
                [-18.214738156712261, 64.849416732152406],
                [-18.180928139949462, 64.909366481675406],
                [-18.158694384942915, 64.932388618979459],
                [-18.103268127368608, 65.010116396793407],
                [-18.10178052505978, 65.012208478464899],
                [-18.039330917198299, 65.099725456043913],
                [-18.002968274570662, 65.150408150041855],
                [-17.977876456704283, 65.185479437801689],
                [-17.940943267675781, 65.236975349345528],
                [-17.931756696364001, 65.249751684929493],
                [-17.923337106807594, 65.343704896506608],
                [-17.914088328413015, 65.417807239511816],
                [-17.844351302810541, 65.442119016916351],
                [-17.84405182514519, 65.489383122514937],
                [-17.863583861231067, 65.561857188041969],
                [-17.876023526931419, 65.572950395248483],
                [-17.936233708988706, 65.649304103065091],
                [-17.941996578219005, 65.65320434590808],
                [-17.986793384116535, 65.734422947784552],
                [-17.998271646881619, 65.809529964414594],
                [-17.940748909505029, 65.860412940512049],
                [-17.925650309621805, 65.893165892713682],
                [-17.942305532831082, 65.931535164366551],
                [-17.97584823036556, 65.969456643824955],
                [-17.964330382725731, 66.049580971337363],
                [-18.021901354723298, 66.084447524565235],
                [-18.02143607525198, 66.085753991592412],
                [-18.021836016830267, 66.092842410332423],
                [-18.021268945887524, 66.093783259000531],
                [-18.016653050545926, 66.129328341932293],
                [-18.02290199402734, 66.130047739813335],
                [-18.021749695999976, 66.154311298000039],
                [-17.939393762999941, 66.147931043000028],
                [-17.899403470999975, 66.129216794000044],
                [-17.859835159999932, 66.106078632000049],
                [-17.781578581999948, 66.084633436000033],
                [-17.704609177999941, 66.048564882000051],
                [-17.701451116999984, 66.044250897000026],
                [-17.621199783999941, 65.986917658000039],
                [-17.538812977999953, 65.984126704000047],
                [-17.461307676999976, 65.987119163000045],
                [-17.447594589141378, 65.957039666480512],
                [-17.381646123906023, 65.945132926486906],
                [-17.356350820747878, 65.889059413018174],
                [-17.301828258018357, 65.867819856970357],
                [-17.219305203843817, 65.871956449644983],
                [-17.140938514393099, 65.874857578035503],
                [-17.120894212663927, 65.890559317274267],
                [-17.060919259493573, 65.949699049518088],
                [-16.970502394999475, 65.958670947243093],
                [-16.894099841591469, 65.960350929983576],
                [-16.764889803730341, 65.964781783897749],
                [-16.778575125155839, 65.872219414389178],
                [-16.728726037455093, 65.812603363955361],
                [-16.620112356120448, 65.802213332102667],
                [-16.384484419269828, 65.814358359413973],
                [-16.388871180835743, 65.809186982683968],
                [-16.383690893244303, 65.79744374506906],
              ],
            ],
            [
              [
                [-17.673890009999976, 66.035073165000028],
                [-17.672813759999936, 66.035073165000028],
                [-17.672813759999936, 66.035867280000033],
                [-17.673890009999976, 66.035867280000033],
                [-17.673890009999976, 66.035073165000028],
              ],
            ],
            [
              [
                [-17.665958126999957, 66.040834365000066],
                [-17.665072553999948, 66.040834365000066],
                [-17.665072553999948, 66.041184696000059],
                [-17.665958126999957, 66.041184696000059],
                [-17.665958126999957, 66.040834365000066],
              ],
            ],
          ],
        },
      },
    ],
  };

  blaskoGeoData = {
    type: "FeatureCollection",
    name: "Bláskógabyggð_full_simplified",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: { NAME: "Bláskógabyggð", LANDUSE: "conservation" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [-20.8881, 64.152],
                [-20.9275, 64.1965],
                [-20.8903, 64.2476],
                [-20.8425, 64.2792],
                [-20.8069, 64.2989],
                [-20.7115, 64.3711],
                [-20.7313, 64.3686],
                [-20.7968, 64.3465],
                [-20.8116, 64.3362],
                [-20.8921, 64.2824],
                [-20.9197, 64.2663],
                [-20.9621, 64.1835],
                [-20.8889, 64.1524],
                [-20.9785, 64.166],
                [-21.1454, 64.1859],
                [-21.1549, 64.1897],
                [-21.1713, 64.1881],
                [-21.2304, 64.1728],
                [-21.3335, 64.1874],
                [-21.3719, 64.1946],
                [-21.3567, 64.2594],
                [-21.3328, 64.2751],
                [-21.2901, 64.3095],
                [-21.1625, 64.3512],
                [-21.0637, 64.4081],
                [-20.9981, 64.4346],
                [-20.9341, 64.4662],
                [-20.7164, 64.4534],
                [-20.6593, 64.4271],
                [-20.6029, 64.4651],
                [-20.5162, 64.5455],
                [-20.488, 64.5669],
                [-20.3486, 64.637],
                [-20.1088, 64.6716],
                [-19.9996, 64.7551],
                [-19.8205, 64.8676],
                [-19.7589, 64.8671],
                [-19.5684, 64.8144],
                [-19.4996, 64.8157],
                [-19.355, 64.7935],
                [-19.2073, 64.7789],
                [-18.8701, 64.8342],
                [-18.8118, 64.8105],
                [-18.9999, 64.7496],
                [-19.0899, 64.7177],
                [-19.139, 64.7051],
                [-19.2142, 64.704],
                [-19.2935, 64.6928],
                [-19.3715, 64.6886],
                [-19.3689, 64.6921],
                [-19.3719, 64.6931],
                [-19.451, 64.7043],
                [-19.5248, 64.6668],
                [-19.5322, 64.6601],
                [-19.6116, 64.628],
                [-19.6923, 64.5872],
                [-19.733, 64.5082],
                [-19.7721, 64.4715],
                [-19.8512, 64.4499],
                [-19.9344, 64.4389],
                [-19.9977, 64.4276],
                [-20.0119, 64.3774],
                [-20.0565, 64.3487],
                [-20.092, 64.332],
                [-20.171, 64.2923],
                [-20.2075, 64.2687],
                [-20.2516, 64.2359],
                [-20.3176, 64.1885],
                [-20.332, 64.1709],
                [-20.4144, 64.1441],
                [-20.4876, 64.1083],
                [-20.4995, 64.0726],
                [-20.5733, 64.0818],
                [-20.5666, 64.1051],
                [-20.5615, 64.1096],
                [-20.5709, 64.1154],
                [-20.5704, 64.1267],
                [-20.5756, 64.1679],
                [-20.5963, 64.1891],
                [-20.6355, 64.1843],
                [-20.6994, 64.154],
                [-20.7315, 64.153],
                [-20.8881, 64.152],
              ],
            ],
          ],
        },
      },
    ],
  };

  async readGeoData(groupId: number) {
    try {
      //const response = await fetch("/testData/geodata.json");
      if ([665, 232, 30172, 30173].includes(groupId)) {
        this.geojsonData = this.blaskoGeoData;
        this.showAllView = {
          jsonData: `{"position":{"x":2681153.3345786585,"y":-1020373.641531956,"z":5732000.507483105},"heading":0.2308371355878256,"pitch":-0.5229351907865474,"roll":0.0000034734011649106833}`,
        };
      } else if ([666, 222, 29745, 30174].includes(groupId)) {
        this.geojsonData = this.rangarThGeoData;
        this.showAllView = {
          jsonData: `{"position":{"x":2730077.9397880966,"y":-1051424.2223537476,"z":5717253.418268907},"heading":0.5806750868435868,"pitch":-0.5553392139027684,"roll":0.000024663968019034144}`,
        };
      } else if ([667, 28858, 30175].includes(groupId)) {
        this.geojsonData = this.thingEGeoData;
        this.showAllView = {
          jsonData: `{"position":{"x":2626379.528061472,"y":-897562.5295321164,"z":5762602.5559962075},"heading":0.6922606145583803,"pitch":-0.4089817132726761,"roll":6.282533936902459}`,
        };
      }

      this.geojsonData.features.forEach((feature: GeoJSONFeature) => {
        const coordinates = feature.geometry.coordinates;
        const color = Cesium.Color.BLUE.withAlpha(0.0);

        coordinates.forEach((polygon) => {
          const wallHeight = this.wide ? 1800 : 2500;
          const wallColor = Cesium.Color.BLUE.withAlpha(0.2); // Set the desired wall color: ;
          this.createWallFromGeoJSON(polygon[0], wallHeight, wallColor);
          const rectangle = Cesium.Rectangle.fromCartographicArray(
            polygon[0].map((coord) =>
              Cesium.Cartographic.fromDegrees(coord[0], coord[1])
            )
          );

          this.createTiles(rectangle, coordinates);

          const sharedMaterial = new Cesium.ColorMaterialProperty(color);

          // Add each tile as a rectangle entity to the EntityCollection
          this.allTiles.forEach((tile) => {
            const entity = new LandUseEntity({
              rectangle: {
                coordinates: tile,
                material: sharedMaterial,
              },
              landUseType: this.selectedLandUse,
            });

            this.tileRectangleIndex.set(entity.rectangleIndex!, entity);

            this.viewer!.entities.add(entity);
            this.tileEntities.push(entity);
          });
        });
      });
      this.calculateTileCounts();
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  }

  createModel(
    url: string,
    position: PositionProperty,
    scale = 1.0,
    properties: any = undefined,
    deferAddToViewer: boolean = false
  ) {
    const entity = new Cesium.Entity({
      name: url,
      position: position,
      properties: properties,
      model: {
        uri: url,
        scale: scale,
      },
    });

    if (!deferAddToViewer) {
      this.viewer!.entities.add(entity);
    }

    return entity;
  }

  addCommentToRectangle(rectangleId: string, pointId: number) {
    // Find the rectangle entity
    const rectangleEntity = this.viewer!.entities.getById(
      rectangleId
    ) as LandUseEntity;

    if (rectangleEntity) {
      // Add the comment to the rectangle entity
      rectangleEntity.pointId = pointId;

      // Add a 3D comment models from https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/comment.glb
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
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/chatBubble5.glb",
        //        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/chatBubble6a.glb",
        position,
        275,
        {
          rectangleIndex: rectangleEntity.rectangleIndex!,
        }
      );

      this.calculateTileCounts();
    }
  }

  deleteCommentFromPoint(pointId: number) {
    // Find the rectangle entity
    const targetEntity = this.tileEntities.find(
      (entity) =>
        entity.pointId === pointId ||
        (entity.pointIds && entity.pointIds.includes(pointId))
    );

    if (targetEntity) {
      // Remove the comment from the rectangle entity
      targetEntity.pointId = undefined;

      // Remove the 3D comment model
      if (targetEntity.commentEntity) {
        this.viewer!.entities.remove(targetEntity.commentEntity);
        targetEntity.commentEntity = undefined;
      }

      this.calculateTileCounts();
    }
  }

  deleteCommentFromRectangle(rectangleId: string) {
    // Find the rectangle entity
    const rectangleEntity = this.viewer!.entities.getById(
      rectangleId
    ) as LandUseEntity;

    if (rectangleEntity) {
      // Remove the comment from the rectangle entity
      rectangleEntity.pointId = undefined;

      // Remove the 3D comment model
      if (rectangleEntity.commentEntity) {
        this.viewer!.entities.remove(rectangleEntity.commentEntity);
        rectangleEntity.commentEntity = undefined;
      }

      this.calculateTileCounts();
    }
  }

  disableLookAtMode(): void {
    this.viewer!.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }

  getRectangleId(pointId: number): string {
    const targetEntity = this.tileEntities.find(
      (entity) =>
        entity.pointId === pointId ||
        (entity.pointIds && entity.pointIds.includes(pointId))
    );

    return targetEntity?.id!;
  }

  deletePoint(pointId: number) {
    this.deleteCommentFromPoint(pointId);

    const targetEntity = this.tileEntities.find(
      (entity) =>
        entity.pointId === pointId ||
        (entity.pointIds && entity.pointIds.includes(pointId))
    );

    if (targetEntity) {
      if (targetEntity.pointIds) {
        targetEntity.pointIds = targetEntity.pointIds.filter(
          (id) => id !== pointId
        );
      }

      if (targetEntity.pointId === pointId) {
        targetEntity.pointId = undefined;
      }
    }
  }

  showComment(pointId: number): void {
    // Search for the tile entity with the given pointId
    const targetEntity = this.tileEntities.find(
      (entity) =>
        entity.pointId === pointId ||
        (entity.pointIds && entity.pointIds.includes(pointId))
    );

    if (targetEntity && targetEntity.commentEntity) {
      // Obtain the comment entity's position
      const position = targetEntity.commentEntity.position!.getValue(
        Cesium.JulianDate.now()
      );

      // Create a HeadingPitchRange to set the camera's position relative to the comment entity
      const heading = this.viewer!.camera.heading; // Keep the camera's current heading
      const pitch = Cesium.Math.toRadians(-20); // Keep the camera's current pitch
      const range = 4200; // Fixed range for a close-up view
      this.viewer!.camera.cancelFlight();
      // Set the camera's position using lookAt
      this.viewer!.camera.lookAt(
        position!,
        new Cesium.HeadingPitchRange(heading, pitch, range)
      );
    } else {
      console.warn(`No entity or comment entity found for pointId: ${pointId}`);
    }
  }

  clearLandUsesAndComments(): void {
    // Loop over all tile entities
    for (const entity of this.tileEntities) {
      // Clear the land use type and comment
      entity.landUseType = undefined;
      entity.pointId = undefined;
      entity.landUseVotes = new Map<string, number>();

      // If there is a comment entity associated, remove it from the viewer's entities
      if (entity.commentEntity) {
        this.viewer!.entities.remove(entity.commentEntity);
        entity.commentEntity = undefined;
      }

      // Reset the rectangle material to a default color (e.g., transparent white)
      if (entity.rectangle) {
        entity.rectangle.material = new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.0)
        );
      }
    }

    // Clear the existing boxes
    for (const box of this.existingBoxes.values()) {
      this.viewer!.entities.remove(box);
    }
    this.existingBoxes.clear();

    for (const model of this.landAnimatedModels) {
      this.viewer!.entities.remove(model);
    }
    this.landAnimatedModels = [];

    // Reset the land use count
    this.landUseCount.clear();

    // Reset the number of tiles with comments and land use
    this.numberOfTilesWithComments = 0;
    this.numberOfTilesWithLandUse = 0;
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
        window.appGlobals.activity("landUseClick", "removeLandUse");
      } else {
        window.appGlobals.activity("landUseClick", "setLandUse");
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
            100001 // Adjust the value to control how far the model moves upward
          );

          const animationClock = new Cesium.Clock({
            startTime: Cesium.JulianDate.now(),
            currentTime: this.viewer!.clock.currentTime,
          });

          const currentTime = animationClock.currentTime;
          const durationInSeconds = 100;
          const endTime = new Cesium.JulianDate();
          Cesium.JulianDate.addSeconds(currentTime, durationInSeconds, endTime);

          const positionProperty = new Cesium.SampledPositionProperty();

          positionProperty.setInterpolationOptions({
            interpolationDegree: 1,
            interpolationAlgorithm: Cesium.LinearApproximation,
          });

          positionProperty.addSample(animationClock.currentTime, startPosition);
          positionProperty.addSample(endTime, endPosition);

          const modelInstance = this.createModel(
            url,
            positionProperty,
            //@ts-ignore
            landUseModelScales[this.selectedLandUse]
          );

          this.landAnimatedModels.push(modelInstance);

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

  exportJSON(): string {
    const entitiesWithLandUseType = this.tileEntities.filter(
      (entity) =>
        entity.landUseType !== undefined || entity.pointId !== undefined
    );
    const jsonData = JSON.stringify(
      entitiesWithLandUseType.map((entity) => entity.toJSON()),
      null,
      2
    );
    console.log(
      `All entities length: ${this.tileEntities.length} entitiesWithLandUseType length: ${entitiesWithLandUseType.length}`
    );
    return jsonData;
  }

  calculateTileCounts() {
    let numberOfTilesWithComments = 0;
    let numberOfTilesWithLandUse = 0;

    this.tileEntities.forEach((landUseEntity: LandUseEntity) => {
      if (landUseEntity.landUseType) {
        numberOfTilesWithLandUse += 1;
      }
      if (landUseEntity.pointId) {
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
    console.log(`totalNumberOfTiles: ${this.tileEntities.length}`);
  }

  async setInputActionForResults(event: any) {
    const pickedFeatures = this.viewer!.scene.drillPick(event.position);

    // Filter the pickedFeatures to get the rectangle entity
    const rectangleEntityContainer = pickedFeatures.find(
      (pickedFeature) =>
        pickedFeature.id &&
        pickedFeature.id._name &&
        pickedFeature.id._name.indexOf("chat") > -1
    );

    if (rectangleEntityContainer) {
      const rectangleEntity = rectangleEntityContainer.id;
      const index =
        rectangleEntity.properties.getValue("rectangleIndex").rectangleIndex;
      const entity = this.tileRectangleIndex.get(index);
      window.appGlobals.activity("landUseClick", "openComment");
      this.fire("open-comments", { entity }, document);
    }
  }

  async setInputAction(event: any) {
    const pickedFeatures = this.viewer!.scene.drillPick(event.position);

    // Filter the pickedFeatures to get the rectangle entity
    const rectangleEntity = pickedFeatures.find(
      (pickedFeature) => pickedFeature.id && pickedFeature.id.rectangle
    );

    const rectangleEntityCommentContainer = pickedFeatures.find(
      (pickedFeature) =>
        pickedFeature.id &&
        pickedFeature.id._name &&
        pickedFeature.id._name.indexOf("chat") > -1
    );

    if (rectangleEntityCommentContainer) {
      const rectangleCommentEntity = rectangleEntityCommentContainer.id;
      const index =
        rectangleCommentEntity.properties.getValue(
          "rectangleIndex"
        ).rectangleIndex;
      const entity = this.tileRectangleIndex.get(index);
      this.fire("edit-comment", { entity }, document);
      return;
    }

    console.log(`rectangleEntity: ${rectangleEntity}`);

    if (rectangleEntity) {
      const rectangleId = rectangleEntity.id.id;

      if (this.isCommenting) {
        this.fire("open-new-comment", { rectangleId }, document);
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
      } else {
        this.fire("no-land-use-selected", null, document);
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

  getColorForLandUse(landUse: string, alpha = 0.3) {
    // Return a Cesium.Color based on the selected land use
    switch (landUse) {
      case "energy":
        return Cesium.Color.RED.withAlpha(alpha);
      case "gracing":
        return Cesium.Color.BLUE.withAlpha(alpha);
      case "tourism":
        return Cesium.Color.ORANGE.withAlpha(alpha);
      case "recreation":
        return Cesium.Color.YELLOW.withAlpha(alpha);
      case "restoration":
        return Cesium.Color.CYAN.withAlpha(alpha);
      case "conservation":
        return Cesium.Color.PURPLE.withAlpha(alpha);
      default:
        return Cesium.Color.TRANSPARENT;
    }
  }
}
