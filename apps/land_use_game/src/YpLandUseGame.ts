import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element";
import { PropertyValueMap } from "lit";

import { ShadowStyles } from "./@yrpri/common/ShadowStyles";
import { Rectangle, Viewer } from "cesium";

//const logo = new URL("../../assets/open-wc-logo.svg", import.meta.url).href;
import * as turf from "@turf/turf";
import * as GeoJSON from "geojson";

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Land Use Game";

  @property({ type: String })
  selectedLandUse: string | undefined;

  @property({ type: Object })
  viewer: Viewer | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          font-size: calc(10px + 2vmin);
          color: #1a2b42;
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--yp-land-use-game-background-color);
        }

        main {
          flex-grow: 1;
        }

        #cesium-container,
        .cesium-viewer,
        .cesium-viewer-cesiumWidgetContainer,
        .cesium-widget,
        .cesium-widget > canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        #landUseSelection {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1;
          padding: 5px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 5px;
        }

        #landUseSelection button {
          margin: 5px;
        }
        #emptyCreditContainer {
          display: none;
        }
      `,
    ];
  }

  connectedCallback(): void {
    // @ts-ignore
    window.CESIUM_BASE_URL = "";
    super.connectedCallback();
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.initScene();
  }

  getColor(landuse: string) {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return new Cesium.Color(red / 255, green / 255, blue / 255, 0.5);
  }

  getColorOld(landuse: string) {
    switch (landuse) {
      case "energy":
        return Cesium.Color.RED;
      case "farming":
        return Cesium.Color.GREEN;
      case "tourism":
        return Cesium.Color.BLUE;
      case "recreation":
        return Cesium.Color.YELLOW;
      case "restoration":
        return Cesium.Color.ORANGE;
      case "conservation":
        return Cesium.Color.PURPLE;
      default:
        return Cesium.Color.WHITE;
    }
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
        const color = this.getColor(landuse);

        coordinates.forEach((polygon) => {
          const rectangle = Cesium.Rectangle.fromCartographicArray(
            polygon[0].map((coord) =>
              Cesium.Cartographic.fromDegrees(coord[0], coord[1])
            )
          );

          // Create 1000m x 1000m tiles within the rectangle
          const tiles = this.createTiles(rectangle, coordinates);

          // Add each tile as a rectangle entity to the EntityCollection
          tiles.forEach((tile) => {
            this.viewer!.entities.add({
              rectangle: {
                coordinates: tile,
                material: color.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
              },
            });
          });
        });
      });
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  }

  flyToPosition(
    longitude: number,
    latitude: number,
    altitude: number,
    duration: number,
    pitch: number
  ) {
    return new Promise((resolve) => {
      this.viewer!.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          altitude
        ),
        orientation: {
          heading: 0.0,
          pitch: pitch,
          roll: 0.0,
        },
        duration: duration,
        //@ts-ignore
        complete: resolve,
      });
    });
  }

  hexToCesiumColor(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return new Cesium.Color(r, g, b, 1.0);
  }

  getGlowingMaterial(color: any) {
    return null;
  }

  async initScene() {
    const container = this.$$("#cesium-container")!;
    const emptyCreditContainer = this.$$("#emptyCreditContainer")!;

    this.$$("#landUse1")!.addEventListener("click", () => {
      this.selectedLandUse = "energy";
    });

    this.$$("#landUse2")!.addEventListener("click", () => {
      this.selectedLandUse = "farming";
    });

    this.$$("#landUse3")!.addEventListener("click", () => {
      this.selectedLandUse = "tourism";
    });

    this.$$("#landUse4")!.addEventListener("click", () => {
      this.selectedLandUse = "recreation";
    });

    this.$$("#landUse5")!.addEventListener("click", () => {
      this.selectedLandUse = "restoration";
    });

    this.$$("#landUse6")!.addEventListener("click", () => {
      this.selectedLandUse = "conservation";
    });

    //@ts-ignore
    Cesium.Ion.defaultAccessToken = __CESIUM_ACCESS_TOKEN__;

    this.viewer = new Cesium.Viewer(container, {
      infoBox: false, //Disable InfoBox widget
      selectionIndicator: false, //Disable selection indicator
      shouldAnimate: true, // Enable animations
      animation: false,
      creditContainer: emptyCreditContainer,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      //    infoBox: false,
      sceneModePicker: false,
      //      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      vrButton: false,
      //ts-ignore
      terrainProvider: await Cesium.createWorldTerrainAsync(),
      imageryProvider: Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL,
      }),
    });

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    //Enable depth testing so things behind the terrain disappear.
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;
    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      7000,
      7,
      -Cesium.Math.PI_OVER_TWO / 1.2
    );

    // Second flyTo
    await this.flyToPosition(
      -20.389429786089895,
      64.34905999541063,
      2500,
      3,
      -Cesium.Math.PI_OVER_TWO / 3.5
    );

    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction((event: any) => {
      const pickedFeature = this.viewer!.scene.pick(event.position);

      if (pickedFeature &&  pickedFeature.id && pickedFeature.id.rectangle && this.selectedLandUse) {
        const newColor = this.getColor(this.selectedLandUse).withAlpha(0.3);
        pickedFeature.id.rectangle.material.color = newColor;
        debugger;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.readGeoData();
  }

  getMaterialForLandUse(landUse: string) {
    // Return a Cesium.Color based on the selected land use
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

  render() {
    return html`
      <div id="cesium-container"></div>
      <div id="emptyCreditContainer"></div>
      <div id="landUseSelection">
        <button id="landUse1">Energy</button>
        <button id="landUse2">Farming</button>
        <button id="landUse3">Tourism</button>
        <button id="landUse4">Recreation</button>
        <button id="landUse5">Restoration</button>
        <button id="landUse6">Conservation</button>
      </div>
    `;
  }
}
