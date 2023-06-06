import { html, css, nothing } from "lit";
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
import { BullManager } from "./BullManager";
import { EagleManager } from "./EagleManager";
import { YpServerApi } from "./@yrpri/common/YpServerApi";
import { LandUseAppGlobals } from "./LandUseAppGlobals";
import { YpAppUser } from "./@yrpri/yp-app/YpAppUser";
import { YpAppDialogs } from "./@yrpri/yp-dialog-container/yp-app-dialogs";

import "./@yrpri/yp-dialog-container/yp-app-dialogs.js";
import { YpPostEdit } from "./@yrpri/yp-post/yp-post-edit";
import { YpCommentDialog } from "./yp-comment-dialog.js";
import "./yp-comment-dialog.js";
import "./yp-new-comment-dialog.js";
import { YpNewCommentDialog } from "./yp-new-comment-dialog.js";
import { YpPageDialog } from "./@yrpri/yp-page/yp-page-dialog";

const GameStage = {
  Intro: 1,
  Play: 2,
  Results: 3,
};

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Land Use Game";

  @property({ type: Number })
  gameStage = GameStage.Intro;

  @property({ type: String })
  selectedLandUse:
    | "energy"
    | "gracing"
    | "tourism"
    | "recreation"
    | "restoration"
    | "conservation"
    | undefined;

  @property({ type: Number })
  totalNumberOfTiles: number | undefined;

  @property({ type: Number })
  numberOfTilesWithLandUse: number | undefined;

  @property({ type: Number })
  numberOfTilesWithComments: number | undefined;

  @property({ type: Boolean })
  hideUI = true;

  @property({ type: Boolean })
  showAllTileResults = false;

  @property({ type: Object })
  viewer: Viewer | undefined;

  @property({ type: Object })
  loggedInUser: YpUserData | undefined;

  @property({ type: Object })
  existingBoxes: Map<string, any> = new Map();

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Boolean })
  disableSubmitButton = true;

  @property({ type: Boolean })
  disableBrowserTouchEvents = false;

  @query("#newCommentDialog")
  newCommentDialog!: MdDialog;

  targetCommentCount = 5;
  tileManager!: TileManager;
  planeManager!: PlaneManager;
  characterManager!: CharacterManager;
  currentRectangleIdForComment: string | undefined;
  uiManager: UIManager | undefined;
  dragonManager!: DragonManager;
  bullManager!: BullManager;
  eagleManager!: EagleManager;
  frameCount = 0;
  lastFPSLogTime = new Date().getTime();
  orbit: ((clock: any) => void) | undefined;
  posts: YpPostData[] | undefined;

  logFramerate() {
    this.frameCount++;

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.lastFPSLogTime;

    if (elapsedTime >= 1000) {
      // Log framerate every second
      const fps = (this.frameCount / elapsedTime) * 1000;
      console.log(`Framerate: ${fps.toFixed(2)} FPS`);
      this.frameCount = 0;
      this.lastFPSLogTime = currentTime;
    }

    window.requestAnimationFrame(this.logFramerate.bind(this));
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          background-color: var(--yp-land-use-game-background-color);
        }

        @media (min-width: 960px) {
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
          }
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

        #submitButton {
          font-size: 24px;
        }

        .participantsStats {
          font-size: 24px;
        }

        #navigationButtons button {
          margin: 5px;
          font-size: 32px;
        }

        #showAllButton {
          font-size: 24px;
        }

        #showAllButton button {
          margin: 5px;
          font-size: 32px;
          margin-top: 16px;
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
          opacity: 0;
          transition: opacity 5s ease-in-out;
        }

        #gameStats[hidden] {
          opacity: 0;
        }

        #gameStats:not([hidden]) {
          opacity: 1;
        }

        #resultsStats {
          position: absolute;
          top: 10px;
          left: 32px;
          z-index: 1;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
          opacity: 0;
          transition: opacity 5s ease-in-out;
        }

        #resultsStats[hidden] {
          opacity: 0;
        }

        #resultsStats:not([hidden]) {
          opacity: 1;
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
          background: rgba(128, 0, 128, 0.55);
        }

        #commentButton {
          background: rgba(255, 255, 255, 0.2);
        }

        #commentButton[selected] {
          background: rgba(255, 255, 255, 0.55);
        }

        #showAllButton {
          background: rgba(255, 255, 255, 0.2);
        }

        #showAllButton[selected] {
          background: rgba(255, 255, 255, 0.55);
        }

        #progressBars {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 250px;
          margin-bottom: 8px;
        }

        .progressBarContainer {
          width: 100%;
          height: 30px;
          background-color: rgba(220, 220, 220, 0.5);
          border-radius: 5px;
          position: relative;
        }

        .progressBar {
          height: 100%;
          width: 0%;
          border-radius: 3px;
          position: absolute;
          left: 0;
          background-color: #953000;
        }

        .progressBarComments {
          background-color: #3c87f2;
        }

        @media (max-width: 960px) {
          #commentTextField {
            min-width: 100%;
          }

          #landUseSelection {
            bottom: 0;
            text-align: center;
            padding: 4px;
            border-radius: 0;
          }

          #landUseSelection button {
            font-size: 12px;
          }

          #navigationButtons {
            text-align: center;
            top: initial;
            bottom: 68px;
            left: 0;
            border-radius: 0;
          }

          #submitButton {
            font-size: 12px;
          }

          .participantsStats {
            font-size: 12px;

          }

          #navigationButtons button {
            font-size: 12px;
          }

          #showAllButton {
            font-size: 12px;
          }

          #showAllButton button {
            font-size: 12px;
          }

          #terrainProviderSelection {
            top: initial;
            bottom: 68px;
            right: 0;
            border-radius: 0;
          }

          #terrainProviderSelection button {
            font-size: 12px;
          }

          #gameStats {
            left: 50%;
            transform: translateX(-50%);
          }

          #resultsStats {
            left: 50%;
            transform: translateX(-50%);
          }

          .progressBarContainer {
            height: 15px;
          }
        }
      `,
    ];
  }

  constructor() {
    window.serverApi = new YpServerApi();
    window.appGlobals = new LandUseAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    if (window.location.href.indexOf("localhost:9175") > -1) {
      window.appGlobals.setupTranslationSystem();
    } else {
      window.appGlobals.setupTranslationSystem("/land_use");
    }
    super();
    this.addListener("yp-app-dialogs-ready", this._appDialogsReady.bind(this));
    this.addGlobalListener("yp-logged-in", this._loggedIn.bind(this));
  }

  async _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;
    this.hideUI = false;
    await this.updateComplete;
    this.setupEventListeners();
    if (this.gameStage === GameStage.Results) {
      setTimeout(async () => {
        this.setupTileResults();
        await this.setupTileResults();
        this.setLandUse(undefined);
      }, 3000);
    }
  }

  async connectedCallback() {
    // @ts-ignore
    window.CESIUM_BASE_URL = "";

    this.group = await window.appGlobals.setupGroup();
    super.connectedCallback();
    const helpPages = (await window.serverApi.getHelpPages(
      "group",
      this.group!.id
    )) as YpHelpPageData[];

    let welcomePageId = this.group?.configuration?.welcomePageId;
    let welcomePage;

    if (welcomePageId) {
      welcomePage = helpPages.find((page) => page.id === welcomePageId);
    }

    this._openPage(welcomePage || helpPages[0]);
  }

  registrationQuestionDone() {
    this.gameStage = GameStage.Play;
  }

  openUserLoginOrStart() {
    if (!this.loggedInUser) {
      window.appUser.openUserlogin();
    } else {
      if (this.gameStage !== GameStage.Results) {
        this.gameStage = GameStage.Play;
        this.cancelFlyToPosition();
        this.setCameraFromLandMark(0);
      }
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.initScene();
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

  async setupTileResults() {
    this.posts = await window.serverApi.getPublicPrivatePosts(this.group!.id);
    this.tileManager.setupTileResults(this.posts!);
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

  setLandUse(landUse: string | undefined) {
    if (this.selectedLandUse === landUse) {
      this.selectedLandUse = undefined;
    } else {
      this.selectedLandUse = landUse as any;
    }
    this.setIsCommenting(false);
    this.tileManager.selectedLandUse = this.selectedLandUse;

    if (this.gameStage === GameStage.Results) {
      this.tileManager.updateTileResults();
    }
  }

  //TODO: Fix and remove the selected land sue when commenting and also possible toggle commenting on and off
  setIsCommenting(isCommenting: boolean) {
    this.tileManager.isCommenting = isCommenting;
    this.requestUpdate();
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
      this.disableBrowserTouchEvents = true;
    }
  }

  openNewComment(event: any) {
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = event.detail.rectangleId;
    this.disableBrowserTouchEvents = false;
  }

  closeNewComment() {
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = undefined;
    this.disableBrowserTouchEvents = true;
  }

  openComment(event: any) {
    (this.$$("#commentDialog") as YpCommentDialog).openDialog(event);
    this.disableBrowserTouchEvents = false;
  }

  closeComment() {
    (this.$$("#commentDialog") as YpCommentDialog).closeDialog();
    this.disableBrowserTouchEvents = true;
  }

  _getPageLocale(page: YpHelpPageData) {
    let pageLocale = "en";
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    } else if (page.title["en"]) {
      pageLocale = "en";
    } else {
      const key = Object.keys(page.title)[0];
      if (key) {
        pageLocale = key;
      }
    }

    return pageLocale;
  }

  _openPage(page: YpHelpPageData) {
    window.appGlobals.activity("open", "pages", page.id);
    window.appDialogs.getDialogAsync("pageDialog", (dialog: YpPageDialog) => {
      const pageLocale = this._getPageLocale(page);
      dialog.open(page, pageLocale, this.openUserLoginOrStart.bind(this));
    });
  }

  updateTileCount(event: any) {
    this.totalNumberOfTiles = event.detail.totalNumberOfTiles;
    this.numberOfTilesWithComments = event.detail.numberOfTilesWithComments;
    this.numberOfTilesWithLandUse = event.detail.numberOfTilesWithLandUse;

    if (this.numberOfTilesWithLandUse! / this.totalNumberOfTiles! > 0.02) {
      this.disableSubmitButton = false;
    }
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener(
      "yp-registration-questions-done",
      this.registrationQuestionDone.bind(this)
    );

    document.addEventListener(
      "open-new-comment",
      this.openNewComment.bind(this)
    );
    document.addEventListener("open-comment", this.openComment.bind(this));

    document.addEventListener(
      "update-tile-count",
      this.updateTileCount.bind(this)
    );

    this.$$("#landUse1")!.addEventListener("click", () => {
      this.setLandUse("energy");
    });

    this.$$("#landUse2")!.addEventListener("click", () => {
      this.setLandUse("gracing");
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

    this.$$("#submitButton")!.addEventListener("click", () => {
      this._newPost();
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

  async afterNewPost() {
    this.gameStage = GameStage.Results;
    this.tileManager.clearLandUsesAndComments();
    await new Promise((resolve) => setTimeout(resolve, 200));
    await this.setupTileResults();
    this.setLandUse(undefined);
    this.disableBrowserTouchEvents = true;
  }

  _newPost() {
    window.appGlobals.activity("open", "newPost");
    this.disableBrowserTouchEvents = false;
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync("postEdit", (dialog: YpPostEdit) => {
      setTimeout(() => {
        dialog.setup(
          undefined,
          true,
          this.afterNewPost.bind(this),
          this.group as YpGroupData,
          {
            groupId: this.group!.id,
            group: this.group as YpGroupData,
            tileData: this.tileManager.exportJSON(),
          }
        );
      }, 50);
    });
  }

  _appDialogsReady(event: CustomEvent) {
    if (event.detail) {
      window.appDialogs = event.detail;
    }
  }

  async inputAction(event: any) {
    if (this.gameStage === GameStage.Play) {
      this.tileManager.setInputAction(event);
    } else if (this.gameStage === GameStage.Results) {
      this.tileManager.setInputActionForResults(event);
    }
  }

  toggleShowAllResults() {
    this.showAllTileResults = !this.showAllTileResults;
    this.tileManager.setShowAllTileResults(this.showAllTileResults);
  }

  async initScene() {
    const container = this.$$("#cesium-container")!;
    const emptyCreditContainer = this.$$("#emptyCreditContainer")!;

    if (!window.appGlobals.domain?.ionToken) {
      await new Promise((r) => setTimeout(r, 500));
      console.warn("no ion token - waiting");
    }

    //@ts-ignore
    Cesium.Ion.defaultAccessToken = window.appGlobals.domain!.ionToken;

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

    window.addEventListener(
      "touchmove",
      (event) => {
        //@ts-ignore
        if (event.scale !== 1) {
          if (this.disableBrowserTouchEvents) {
            event.preventDefault();
          }
        }
      },
      { passive: false }
    );

    this.disableBrowserTouchEvents = true;

    //this.logFramerate();

    this.viewer.scene.globe.baseColor = Cesium.Color.GRAY;
    try {
      this.tileManager = new TileManager(this.viewer);
      this.tileManager.showAllTileResults = this.showAllTileResults;

      const iconUrls = [
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/CesiumBalloon.glb",
        "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/chatBubble5.glb",
      ];
    } catch (error) {
      console.error(error);
    }

    //this.uiManager = new UIManager(this.viewer, iconUrls);

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction(
      this.inputAction.bind(this),
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

      /*this.characterManager = new CharacterManager(
        this.viewer!,
        giantStart,
        giantEnd
      );
      this.characterManager.setupCharacter();*/

      setTimeout(() => {
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
      }, 1000 * 60 * 60 * 60);

      setTimeout(() => {
        const eagleLongLatStart = [66.13323697690669, -18.916804650989715];
        const eagleLongLatEnd = [64.67281083721116, -18.55963945209211];

        const eagleStart = Cesium.Cartesian3.fromDegrees(
          eagleLongLatStart[1],
          eagleLongLatStart[0]
        );

        const eagleEnd = Cesium.Cartesian3.fromDegrees(
          eagleLongLatEnd[1],
          eagleLongLatEnd[0]
        );

        this.eagleManager = new EagleManager(
          this.viewer!,
          eagleStart,
          eagleEnd
        );
        this.eagleManager.setupCharacter();
      }, 1000 * 60 * 60 * 60);

      const bullLongLatStart = [64.80294898622358, -23.77641212993773];
      const bullLongLatEnd = [64.7634513702002, -19.572002677195176];

      const bullStart = Cesium.Cartesian3.fromDegrees(
        bullLongLatStart[1],
        bullLongLatStart[0]
      );

      const bullEnd = Cesium.Cartesian3.fromDegrees(
        bullLongLatEnd[1],
        bullLongLatEnd[0]
      );

      //this.bullManager = new BullManager(this.viewer!, bullStart, bullEnd);
      //this.bullManager.setupCharacter();
    });

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      35000,
      30,
      -Cesium.Math.PI_OVER_TWO / 1.3
    );

    // Second flyTo
    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      20000,
      2,
      -Cesium.Math.PI_OVER_TWO / 3.2
    );
  }

  saveComment(event: CustomEvent) {
    const pointId = event.detail;
    if (this.currentRectangleIdForComment) {
      this.tileManager.addCommentToRectangle(
        this.currentRectangleIdForComment,
        pointId
      );
    } else {
      console.error("Can't find rectangle for comment");
    }
  }

  renderUI() {
    if (this.hideUI) return nothing;
    else
      return html`
        <div
          id="landUseSelection"
          ?hidden="${this.gameStage === GameStage.Intro}"
        >
          <button id="landUse1" ?selected=${this.selectedLandUse === "energy"}>
            Energy
          </button>
          <button id="landUse2" ?selected=${this.selectedLandUse === "gracing"}>
            Gracing
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
          <button
            id="commentButton"
            ?hidden="${this.gameStage === GameStage.Results}"
            ?selected=${this.tileManager?.isCommenting}
          >
            Comment
          </button>
        </div>

        <div
          id="navigationButtons"
          ?hidden="${this.gameStage === GameStage.Intro}"
        >
          <button id="showAll">Show all</button>
          <button id="trackPlane">Plane</button>
        </div>

        <div
          id="terrainProviderSelection"
          ?hidden="${this.gameStage === GameStage.Intro}"
        >
          <button id="chooseAerial">Aerial</button>
          <button id="chooseAerialWithLabels">Labels</button>
          <button id="chooseOpenStreetMap">Map</button>
        </div>

        ${this.posts
          ? html`<div
              id="resultsStats"
              ?hidden="${this.gameStage !== GameStage.Results}"
            >
              <div class="layout vertical">
                <div class="participantsStats">
                  ${this.posts!.length} ${this.t("participants")}
                </div>
                <div>
                  <button
                    id="showAllButton"
                    @click="${this.toggleShowAllResults}"
                    ?selected="${this.showAllTileResults}"
                  >
                    Show "losing" votes
                  </button>
                </div>
              </div>
            </div> `
          : nothing}

        <div id="gameStats" ?hidden="${this.gameStage !== GameStage.Play}">
          <div id="progressBars">
            ${this.numberOfTilesWithLandUse != undefined &&
            this.totalNumberOfTiles != undefined &&
            this.numberOfTilesWithComments != undefined
              ? html`
                  <div class="progressBarContainer">
                    <div
                      class="progressBar"
                      style="width: ${(this.numberOfTilesWithLandUse /
                        this.totalNumberOfTiles) *
                      100}%"
                    ></div>
                  </div>
                  <div class="progressBarContainer">
                    <div
                      class="progressBar progressBarComments"
                      style="width: ${(this.numberOfTilesWithComments /
                        this.targetCommentCount) *
                      100}%"
                    ></div>
                  </div>
                `
              : nothing}
          </div>
          <button id="submitButton" ?disabled="${this.disableSubmitButton}">
            Submit
          </button>
        </div>
      `;
  }

  render() {
    return html`
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>
      <div id="cesium-container"></div>
      <div id="emptyCreditContainer"></div>

      ${this.renderUI()}

      <yp-new-comment-dialog
        id="newCommentDialog"
        .group="${this.group}"
        @save="${this.saveComment}"
      ></yp-new-comment-dialog>
      <yp-comment-dialog
        id="commentDialog"
        .group="${this.group}"
      ></yp-comment-dialog>
    `;
  }
}
