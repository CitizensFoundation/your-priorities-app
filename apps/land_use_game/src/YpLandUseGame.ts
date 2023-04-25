import { html, css } from "lit";
import { property, query } from "lit/decorators.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element";
import { PropertyValueMap } from "lit";

import { ShadowStyles } from "./@yrpri/common/ShadowStyles";
import { Cartographic, ImageryProvider, Viewer } from "cesium";
import { TileManager } from "./TileManager";
import { PlaneManager } from "./PlaneManager";
import { CharacterManager } from "./CharacterManager";
import { Dialog } from "@material/web/dialog/lib/dialog";

import "@material/mwc-textarea/mwc-textarea.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import { UIManager } from "./UIManager";

import { landMarks } from "./TestData";
import { DragonManager } from "./DragonManager";

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Land Use Game";

  @property({ type: String })
  selectedLandUse: string | undefined;

  @property({ type: Object })
  viewer: Viewer | undefined;

  @property({ type: Object })
  existingBoxes: Map<string, any> = new Map();

  @query("#commentDialog")
  commentDialog!: MdDialog;

  tileManager!: TileManager;
  planeManager!: PlaneManager;
  characterManager!: CharacterManager;
  currentRectangleIdForComment: string | undefined;
  uiManager: UIManager | undefined;
  dragonManager!: DragonManager;

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

        #commentTextField {
          text-align: left;
          min-height: 220px;
          min-width: 500px;
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
          bottom: 10px;
          left: auto;
          right: auto;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #landUseSelection button {
          margin: 5px;
          font-size: 32px;
        }

        #navigationButtons {
          position: absolute;
          top: 10px;
          left: auto;
          right: auto;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #navigationButtons button {
          margin: 5px;
          font-size: 32px;
        }

        #terrainProviderSelection {
          position: absolute;
          top: 10px;
          right: 32px;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #terrainProviderSelection button {
          margin: 5px;
          font-size: 32px;
        }

        #gameStats {
          position: absolute;
          top: 10px;
          left: 32px;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #emptyCreditContainer {
          display: none;
        }

        #landUse1 {
          background: rgba(255, 0, 0, 0.2); /* red with 0.25 opacity */
        }

        #landUse1[selected] {
          background: rgba(255, 0, 0, 0.55); /* red with 0.25 opacity */
        }

        #landUse2 {
          background: rgba(0, 0, 255, 0.2); /* blue with 0.25 opacity */
        }

        #landUse2[selected] {
          background: rgba(0, 0, 255, 0.55); /* blue with 0.25 opacity */
        }

        #landUse3 {
          background: rgba(255, 165, 0, 0.2); /* orange with 0.25 opacity */
        }

        #landUse3[selected] {
          background: rgba(255, 165, 0, 0.55); /* orange with 0.25 opacity */
        }

        #landUse4 {
          background: rgba(255, 255, 0, 0.2); /* yellow with 0.25 opacity */
        }

        #landUse4[selected] {
          background: rgba(255, 255, 0, 0.55); /* yellow with 0.25 opacity */
        }

        #landUse5 {
          background: rgba(0, 255, 255, 0.2); /* cyan with 0.25 opacity */
        }

        #landUse5[selected] {
          background: rgba(0, 255, 255, 0.55); /* cyan with 0.25 opacity */
        }

        #landUse6 {
          background: rgba(128, 0, 128, 0.2); /* purple with 0.25 opacity */
        }

        #landUse6[selected] {
          background: rgba(128, 0, 128, 0.55); /* purple with 0.25 opacity */
        }
      `,
    ];
  }

  constructor() {
    super();
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
    this.setupEventListeners();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.currentRectangleIdForComment) {
      if (event.key === "c") {
        this.copyCameraPositionAndRotation();
      } else if (event.key === "h") {
        this.horizonMode();
      }

      // If key is 1-9 choose camera data from landMarks and fly the camera to that position
      const key = parseInt(event.key);
      if (key >= 1 && key <= 9) {
        this.setCameraFromLandMark(key - 1);
      }
    }
  }

  copyCameraPositionAndRotation() {
    const position = this.viewer!.camera.position;
    const heading = this.viewer!.camera.heading;
    const pitch = this.viewer!.camera.pitch;
    const roll = this.viewer!.camera.roll;
    const clipboardData = {
      position: position,
      heading: heading,
      pitch: pitch,
      roll: roll,
    };
    navigator.clipboard.writeText(JSON.stringify(clipboardData));
  }

  async horizonMode() {
    const clipboardData = await navigator.clipboard.readText();
    if (clipboardData) {
      const { position, heading, pitch, roll } = JSON.parse(clipboardData);

      this.viewer!.camera.setView({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll,
        },
      });
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

  async getTerrainHeight(position: Cartographic): Promise<number> {
    const terrainProvider = this.viewer!.terrainProvider;
    const positions = [position];

    const sampledPositions = await Cesium.sampleTerrainMostDetailed(
      terrainProvider,
      positions
    );

    return sampledPositions[0].height;
  }

  setLandUse(landUse: string) {
    this.selectedLandUse = landUse;
    this.tileManager.selectedLandUse = landUse;
    this.setIsCommenting(false);
  }

  setIsCommenting(isCommenting: boolean) {
    this.tileManager.isCommenting = isCommenting;
  }

  setCameraFromLandMark(landMarkIndex: number) {
    const landMark = landMarks[landMarkIndex];
    if (landMark && this.viewer) {
      const { position, heading, pitch, roll } = JSON.parse(landMark.jsonData);
      this.cancelFlyToPosition();
      this.viewer.camera.setView({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll,
        },
      });
    } else {
      console.warn("No landMark or viewer found for index", landMarkIndex);
    }
  }

  cancelFlyToPosition() {
    if (this.viewer) {
      this.viewer.camera.cancelFlight();
    }
  }

  openComment(event: any) {
    (this.$$("#commentDialog") as Dialog).open = true;
    this.currentRectangleIdForComment = event.detail.rectangleId;
  }

  closeComment() {
    (this.$$("#commentDialog") as Dialog).open = false;
    this.currentRectangleIdForComment = undefined;
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener("open-comment", this.openComment.bind(this));

    this.$$("#landUse1")!.addEventListener("click", () => {
      this.setLandUse("energy");
    });

    this.$$("#landUse2")!.addEventListener("click", () => {
      this.setLandUse("farming");
    });

    this.$$("#landUse3")!.addEventListener("click", () => {
      this.setLandUse("tourism");
    });

    this.$$("#landUse4")!.addEventListener("click", () => {
      this.setLandUse("recreation");
    });

    this.$$("#landUse5")!.addEventListener("click", () => {
      this.setLandUse("restoration");
    });

    this.$$("#landUse6")!.addEventListener("click", () => {
      this.setLandUse("conservation");
    });

    this.$$("#commentButton")!.addEventListener("click", () => {
      this.setIsCommenting(true);
    });

    this.$$("#showAll")!.addEventListener("click", () => {
      this.viewer!.trackedEntity = undefined;
      this.cancelFlyToPosition();
      this.setCameraFromLandMark(0);
    });

    this.$$("#trackPlane")!.addEventListener("click", () => {
      this.cancelFlyToPosition();
      this.viewer!.trackedEntity = this.planeManager.plane;
    });

    // Add event listeners for terrainProvider change
    this.$$("#chooseAerial")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL,
        })
      );
    });

    this.$$("#chooseAerialWithLabels")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
        })
      );
    });

    this.$$("#chooseOpenStreetMap")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
          url: "https://a.tile.openstreetmap.org/",
        })
      );
    });
  }

  async initScene() {
    const container = this.$$("#cesium-container")!;
    const emptyCreditContainer = this.$$("#emptyCreditContainer")!;

    //@ts-ignore
    Cesium.Ion.defaultAccessToken = __CESIUM_ACCESS_TOKEN__;

    let imageProvider: false | ImageryProvider | undefined;

    if (window.location.href.indexOf("localhost") > -1) {
      imageProvider = new Cesium.IonImageryProvider({ assetId: 3954 });
    } else {
      imageProvider = Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL,
      });
    }

    this.viewer = new Cesium.Viewer(container, {
      infoBox: false, //Disable InfoBox widget
      selectionIndicator: false, //Disable selection indicator
      shouldAnimate: true, // Enable animations
      animation: false,
      creditContainer: emptyCreditContainer,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      //      requestRenderMode: true,
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
      imageryProvider: imageProvider,
    });

    this.viewer.scene.globe.baseColor = Cesium.Color.GRAY;

    this.tileManager = new TileManager(this.viewer);
    const iconUrls = [
      "models/CesiumBalloon.glb",
      "models/CesiumBalloon.glb",
      "models/CesiumBalloon.glb",
      "models/CesiumBalloon.glb",
      "models/CesiumBalloon.glb",
      "models/CesiumBalloon.glb",
      "models/chatBubble5.glb",
    ];

    //this.uiManager = new UIManager(this.viewer, iconUrls);

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction(
      async (event: any) => this.tileManager.setInputAction(event),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    //this.viewer.scene.postProcessStages.bloom.enabled = true;
    setTimeout(async () => {
      await this.tileManager.readGeoData();
      this.planeManager = new PlaneManager(
        this.viewer!,
        this.tileManager.geojsonData
      );
      this.planeManager.setup();

      const longLatStart = [63.46578246639273, -18.86733120920245];
      const longLatEnd = [64.74664895142547, -19.35433358999831];

      // Convert lang/lat to cartesian
      const giantStart = Cesium.Cartesian3.fromDegrees(
        longLatStart[1],
        longLatStart[0]
      );

      const giantEnd = Cesium.Cartesian3.fromDegrees(
        longLatEnd[1],
        longLatEnd[0]
      );

      this.characterManager = new CharacterManager(
        this.viewer!,
        giantStart,
        giantEnd
      );
      this.characterManager.setupCharacter();

      const dragonLongLatStart = [65.56472600995652, -14.117065946587537];
      const dragonLongLatEnd = [64.80437929394297, -18.70322644445653];

      // Convert lang/lat to cartesian
      const dragonStart = Cesium.Cartesian3.fromDegrees(
        dragonLongLatStart[1],
        dragonLongLatStart[0]
      );

      const dragonEnd = Cesium.Cartesian3.fromDegrees(
        dragonLongLatEnd[1],
        dragonLongLatEnd[0]
      );

      this.dragonManager = new DragonManager(
        this.viewer!,
        dragonStart,
        dragonEnd
      );
      this.dragonManager.setupCharacter();
    });

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      35000,
      7,
      -Cesium.Math.PI_OVER_TWO / 1.3
    );

    // Second flyTo
    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      20000,
      3,
      -Cesium.Math.PI_OVER_TWO / 3.2
    );
  }

  saveComment() {
    const comment = (this.$$("#commentTextField") as HTMLInputElement)!.value;
    if (this.currentRectangleIdForComment) {
      this.tileManager.addCommentToRectangle(
        this.currentRectangleIdForComment,
        comment
      );
      (this.$$("#commentTextField") as HTMLInputElement)!.value = "";
    } else {
      console.error("Can't find rectangle for comment");
    }
    this.closeComment();
  }

  renderFooter() {
    return html` <div class="layout horizontal">
      <md-outlined-button
        label="Close"
        class="cancelButton self-start"
        @click="${this.closeComment}"
      ></md-outlined-button>
      <md-filled-button
        label="Submit"
        id="save"
        @click="${this.saveComment}"
      ></md-filled-button>
    </div>`;
  }

  render() {
    return html`
      <div id="cesium-container"></div>
      <div id="emptyCreditContainer"></div>
      <div id="landUseSelection">
        <button id="landUse1" ?selected=${this.selectedLandUse === "energy"}>
          Energy
        </button>
        <button id="landUse2" ?selected=${this.selectedLandUse === "farming"}>
          Farming
        </button>
        <button id="landUse3" ?selected=${this.selectedLandUse === "tourism"}>
          Tourism
        </button>
        <button
          id="landUse4"
          ?selected=${this.selectedLandUse === "recreation"}
        >
          Recreation
        </button>
        <button
          id="landUse5"
          ?selected=${this.selectedLandUse === "restoration"}
        >
          Restoration
        </button>
        <button
          id="landUse6"
          ?selected=${this.selectedLandUse === "conservation"}
        >
          Conservation
        </button>
        <button id="commentButton">Comment</button>
      </div>

      <div id="navigationButtons">
        <button id="showAll">Show all</button>
        <button id="trackPlane">Plane</button>
      </div>

      <div id="terrainProviderSelection">
        <button id="chooseAerial">Aerial</button>
        <button id="chooseAerialWithLabels">Labels</button>
        <button id="chooseOpenStreetMap">Map</button>
      </div>

      <div id="gameStats"></div>
      <md-dialog id="commentDialog">
        <div slot="header" class="postHeader">Your comment</div>
        <div id="content">
          <mwc-textarea rows="7" id="commentTextField" label=""></mwc-textarea>
        </div>
        <div slot="footer">${this.renderFooter()}</div>
      </md-dialog>
    `;
  }
}
