import { html, css, nothing } from "lit";
import { property, query } from "lit/decorators.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/chips/chip-set.js";
import "@material/web/chips/filter-chip.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element";
import { PropertyValueMap } from "lit";

import { ShadowStyles } from "./@yrpri/common/ShadowStyles";
import { Cartographic, ImageryProvider, Viewer } from "cesium";
import { TileManager } from "./TileManager";
import { PlaneManager } from "./PlaneManager";
import { CharacterManager } from "./CharacterManager";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";

import "@material/mwc-textarea/mwc-textarea.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";

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
import "./yp-new-comment-dialog.js";
import { YpNewCommentDialog } from "./yp-new-comment-dialog.js";
import { YpPageDialog } from "./@yrpri/yp-page/yp-page-dialog";
import {
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { YpCommentsDialog } from "./yp-comments-dialog";

import "./yp-comments-dialog.js";
import "./yp-edit-comment-dialog.js";

import { Tutorial } from "./Tutorial";
import { Layouts } from "./flexbox-literals/classes";
import { YpEditCommentDialog } from "./yp-edit-comment-dialog.js";

const GameStage = {
  Intro: 1,
  Play: 2,
  Results: 3,
};

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Landsleikur";

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

  @property({ type: Array })
  allTopLevelPoints: YpPointData[] = [];

  @property({ type: Number })
  numberOfTilesWithLandUse: number | undefined;

  @property({ type: Number })
  numberOfTilesWithComments: number | undefined;

  @property({ type: Number })
  currentPointIdToDelete: number | undefined;

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

  @property({ type: Array })
  helpPages: YpHelpPageData[]  | undefined;

  @property({ type: Boolean })
  disableSubmitButton = true;

  @property({ type: Boolean })
  landUseTypeDisabled = false;

  @property({ type: String })
  currentErrorText = "";

  @property({ type: Boolean })
  planeDisabled = true;

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
  tutorial: Tutorial;

  haveShownLandUseActionHelp = false
  haveShownCommentActionHelp = false

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

  errorDialogClosed() {
    this.currentErrorText = "";
  }

  ypError(event: any) {
    let error;

    console.error(JSON.stringify(event.detail));

    if (event.detail && event.detail.message) {
      error = event.detail.message;
    } else if (
      event.detail &&
      event.detail.response &&
      event.detail.response.statusText
    ) {
      error = event.detail.response.statusText;
    } else {
      error = event.detail;
    }

    this.currentErrorText = error;
    if (event.detail.showUserError) {
      (this.$$("#errorDialog") as Dialog).show();
    }
  }

  static get styles() {
    return [
      super.styles,
      Layouts,
      ShadowStyles,
      css`
       md-dialog {
        //height: 100%;
       }

       md-dialog[open][is-safari] {

       }

      :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }

        #errorDialog {
          --md-dialog-container-color: var(--md-sys-color-error-container);
          --md-dialog-headline-color: var(--md-sys-color-on-error-container);
          --md-text-button-label-text-color: var(
            --md-sys-color-on-error-container
          );
          --md-text-button-focus-label-text-color: var(
            --md-sys-color-on-error-container
          );
          --md-text-button-hover-label-text-color: var(
            --md-sys-color-on-error-container
          );
          --md-dialog-supporting-text-color: var(
            --md-sys-color-on-error-container
          );
        }

        @media (min-width: 960px) {
          :host {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            font-size: calc(10px + 2vmin);
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

        #cesium-container {
          cursor: all-scroll;
        }

        #cesium-container[has-landuse-selected] {
          cursor: crosshair;
        }

        #cesium-container[is-commenting] {
          cursor: text;
        }

        #cesium-container[is-results-mode] {
          cursor: pointer
        }

        #landUseSelection {
          position: absolute;
          bottom: 10px;
          left: auto;
          right: auto;
          z-index: 1;
          padding: 8px;
          background-color: transparent;
          color: var(--md-sys-color-on-surface);
          border-radius: 5px;
        }

        md-filter-chip {
          background-color: var(--md-sys-color-surface);
        }

        md-outlined-icon-button {
          background-color: var(--md-sys-color-surface);
        }

        #landUseSelection button {
          margin: 8px;
          font-size: 34px;
        }

        #navigationButtons {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          z-index: 1;
          padding: 8px;
          background-color: transparent;
          border-radius: 5px;
        }

        .navButton {
          margin: 6px;
          margin-right: 0;
        }

        .helpButton {
          --md-icon-button-icon-color: var(--md-sys-color-surface);
          --md-icon-button-focused-icon-color: var(--md-sys-color-surface);
          --md-icon-button-blurred-icon-color: var(--md-sys-color-surface);
          --md-icon-button-hover-icon-color: var(--md-sys-color-surface);
          --md-icon-button-selected-icon-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-surface);
          background: transparent;
        }

        @media (min-width: 900px) {
          .navButton {
          }

          .navButton md-icon {
          }
        }

        .divider {
          height: 32px;
        }

        #submitButton {
          font-size: 20px;
          margin-top: 6px;
        }

        .participantsStats {
          font-size: 24px;
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
          background-color: transparent
          border-radius: 5px;
        }

        #terrainProviderSelection button {
          margin: 5px;
          font-size: 32px;
        }

        #gameStats {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
          opacity: 0;
          height: 88px;
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
          left: 50%;
          transform: translateX(-50%);
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
          border-top: solid 4px rgba(255, 0, 0, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse1[selected] {
          border-top: solid 7px rgba(255, 0, 0, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #landUse2 {
          border-top: solid 4px rgba(0, 0, 255, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse2[selected] {
          border-top: solid 7px rgba(0, 0, 255, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #landUse3 {
          border-top: solid 4px rgba(255, 165, 0, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse3[selected] {
          border-top: solid 7px rgba(255, 165, 0, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #landUse4 {
          border-top: solid 4px rgba(255, 255, 0, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse4[selected] {
          border-top: solid 7px rgba(255, 255, 0, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #landUse5 {
          border-top: solid 4px rgba(0, 255, 255, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse5[selected] {
          border-top: solid 7px rgba(0, 255, 255, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #landUse6 {
          border-top: solid 4px rgba(128, 0, 128, 0.4);
          margin-top: 6px;
          border-radius: 2px;
        }

        #landUse6[selected] {
          border-top: solid 7px rgba(128, 0, 128, 0.99);
          margin-top: 0;
          border-radius: 2px;
        }

        #commentButton {
          border-top: solid 4px rgba(255, 255, 255, 0.0);
          margin-left: 4px;
          margin-top: -8px;
        }

        #commentButton[is-selected] {
          border-top: solid 4px rgba(255, 255, 255, 0.0);
        }

        #showAllButton {
          border-top: solid 4px rgba(255, 255, 255, 0.4);
        }

        #showAllButton[selected] {
          border-top: solid 7px rgba(255, 255, 255, 0.9);
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
          background-color: var(--md-sys-color-primary);
        }

        .progressBarComments {
          background-color: #3c87f2;
        }

        @media (max-width: 960px) {
          #commentTextField {
            min-width: 100%;
          }

          #landUseSelection {
            bottom: 4px;
            padding: 12px;
            border-radius: 0;
          }

          #landUseSelection button {
            margin: 5px;
            font-size: 16px;
          }

          #commentButton {
            position: absolute;
            left: 12px;
            bottom: 168px;
          }

          #navigationButtons {
          top: 33%;
          transform: translateY(-33%);
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
            text-align:center;
            height: 75px;
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
    this.addGlobalListener(
      "yp-logged-in-via-polling",
      this.afterLogginPolling.bind(this)
    );
    this.tutorial = new Tutorial();
  }

  afterLogginPolling() {
    setTimeout(() => {
      console.log("afterLogginPolling checkRegistrationAnswersCurrent");
      window.appUser.checkRegistrationAnswersCurrent();
    }, 550);
  }

  async _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;
    this.hideUI = false;
    if (this.gameStage === GameStage.Results) {
      this.landUseTypeDisabled = true;
      setTimeout(async () => {
        await this.setupTileResults();
        await this.loadAllTopLevelPoints();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await this.setLandUse(undefined);
        await this.tileManager.updateCommentResults();
      }, 3000);
    }
  }

  async connectedCallback() {
    // @ts-ignore
    window.CESIUM_BASE_URL = "";
    this.setupEventListeners();
    this.themeChanged();
    window.appGlobals.analytics.sendToAnalyticsTrackers('send', 'pageview', location.pathname);
    // If query parameter called "skipToResults" then set mode to results
    if (window.location.search.indexOf("skipToResults") > -1) {
      this.gameStage = GameStage.Results;
    }
    this.group = await window.appGlobals.setupGroup();
    super.connectedCallback();
    this.themeChanged();
    this.resetHelpPages();
    if (window.location.search.indexOf("skipToResults") > -1) {
      this.cancelFlyToPosition();
    }
  }

  async getHelpPages() {
    this.helpPages = (await window.serverApi.getHelpPages(
      "group",
      this.group!.id
    )) as YpHelpPageData[];
  }

  async resetHelpPages() {
    if (this.group) {
      if (!this.helpPages) {
        await this.getHelpPages();
      }

      let welcomePageId = this.group?.configuration?.welcomePageId;
      let welcomePage;

      if (welcomePageId) {
        welcomePage = this.helpPages!.find((page) => page.id === welcomePageId);
      }

      this._openPage(welcomePage || this.helpPages![0], true);
    }
  }

  registrationQuestionDone() {
    this.startGame();
  }

  openUserLoginOrStart() {
    if (!this.loggedInUser) {
      window.appUser.openUserlogin();
    } else {
      if (this.gameStage !== GameStage.Results) {
        window.appUser.checkRegistrationAnswersCurrent();
      } else {
        this.cancelFlyToPosition();
        this.setCameraFromView(this.tileManager.showAllView);
      }
    }
  }

  async startGame() {
    if (window.location.search.indexOf("skipToResults") > -1) {
      this.cancelFlyToPosition();
      this.setCameraFromView(this.tileManager.showAllView);
    } else {
      this.gameStage = GameStage.Play;
      if (this.tileManager) {
        this.finishStartingGame();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 250));
        this.finishStartingGame();
      }
    }
  }

  async finishStartingGame() {
    this.disableBrowserTouchEvents = true;
    this.tutorial.openStage("navigation", async () => {
      this.cancelFlyToPosition();
      this.setCameraFromView(this.tileManager.showAllView);
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.tutorial.openStage("functionality");
    });
  }

  async openHelp() {
    window.appGlobals.activity('open', "help");
    if (!this.helpPages) {
      await this.getHelpPages();
    }
    this.tutorial.openAll(this.helpPages!);
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
        //this.horizonMode();
      }

      // If key is 1-9 choose camera data from landMarks and fly the camera to that position
      const key = parseInt(event.key);
      if (key >= 1 && key <= 9) {
        //this.setCameraFromLandMark(key - 1);
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
    await this.tileManager.setupTileResults(this.posts!);
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

  async setLandUse(landUse: string | undefined) {
    if (this.selectedLandUse === landUse) {
      this.selectedLandUse = undefined;
    } else {
      this.selectedLandUse = landUse as any;
    }
    this.tileManager.selectedLandUse = this.selectedLandUse;

    if (this.gameStage === GameStage.Results) {
      this.landUseTypeDisabled = true;
      await this.tileManager.updateTileResults();
      this.landUseTypeDisabled = false;
    }
    setTimeout(() => {
      this.setIsCommenting(false);
    });

    if (!this.haveShownLandUseActionHelp && landUse && this.gameStage === GameStage.Play) {
      this.haveShownLandUseActionHelp = true;
      this.tutorial.openStage("landUseAction", undefined, 1);
    }

    window.appGlobals.activity('setLandUse', landUse || "undefined");
  }

  //TODO: Fix and remove the selected land sue when commenting and also possible toggle commenting on and off
  setIsCommenting(isCommenting: boolean) {
    if (isCommenting) {
      window.appGlobals.activity('setLandUseCommenting', isCommenting ? "true" : "false");

      if (!this.haveShownCommentActionHelp) {
        this.haveShownCommentActionHelp = true;
        this.tutorial.openStage("commentAction", undefined, 1);
      }
    }

    this.tileManager.isCommenting = isCommenting;
    if (isCommenting) {
      this.selectedLandUse = undefined;
    }
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

  setCameraFromView(cameraView: any) {
    if (cameraView && this.viewer) {
      const { position, heading, pitch, roll } = JSON.parse(
        cameraView.jsonData
      );
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
      console.warn("No landMark or viewer found for view");
    }
  }

  cancelFlyToPosition() {
    if (this.viewer) {
      this.viewer.camera.cancelFlight();
    }
  }

  openNewComment(event: any) {
    window.appGlobals.activity('landUseOpen', "newComment");
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = event.detail.rectangleId;
    this.disableBrowserTouchEvents = false;
  }

  async openEditComment(event: any) {
    window.appGlobals.activity('landUseOpen', "editComment");
    const point = await window.serverApi.getParentPoint(this.group!.id, event.detail.entity.pointId);
    (this.$$("#editCommentDialog") as YpEditCommentDialog).openDialog(point);
    this.currentRectangleIdForComment = event.detail.entity.id;
    this.disableBrowserTouchEvents = false;
  }

  closeNewComment() {
    window.appGlobals.activity('landUseClose', "newComment");
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = undefined;
    this.disableBrowserTouchEvents = true;
  }

  openComments(event: any) {
    window.appGlobals.activity('landUseOpen', "comments");
    this.showAll();
    (this.$$("#commentsDialog") as YpCommentsDialog).open(event);
    this.disableBrowserTouchEvents = false;
  }

  closeComment() {
    window.appGlobals.activity('landUseClose', "comments");
    (this.$$("#commentsDialog") as YpCommentsDialog).closeDialog();
    this.disableBrowserTouchEvents = true;
  }

  _getPageLocale(page: YpHelpPageData) {
    let pageLocale = "en";
    if (page.title[window.appGlobals.locale!]) {
      pageLocale = window.appGlobals.locale!;
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

  _openPage(page: YpHelpPageData, modal = false) {
    window.appGlobals.activity("open", "pages", page.id);
    window.appDialogs.getDialogAsync("pageDialog", (dialog: YpPageDialog) => {
      const pageLocale = this._getPageLocale(page);
      dialog.open(
        page,
        pageLocale,
        this.openUserLoginOrStart.bind(this),
        undefined,
        modal
      );
    });
  }

  noLandUseSelected() {
    window.appGlobals.activity("open", "noLandUseHelp");
    this.tutorial.openStage("noLandUseSelected", undefined, 1);
  }

  updateTileCount(event: any) {
    this.totalNumberOfTiles = event.detail.totalNumberOfTiles;
    this.numberOfTilesWithComments = event.detail.numberOfTilesWithComments;
    this.numberOfTilesWithLandUse = event.detail.numberOfTilesWithLandUse;

    if (this.numberOfTilesWithLandUse && this.numberOfTilesWithLandUse > 0) {
      this.disableSubmitButton = false;
    }
  }

  languageLoaded(event: any) {
    if (event.detail.language && event.detail.language == "en") {
      this.fireGlobal("yp-auto-translate", true);
      window.appGlobals.autoTranslate = true;
      window.autoTranslate = true;
    } else {
      this.fireGlobal("yp-auto-translate", false);
      window.appGlobals.autoTranslate = false;
      window.autoTranslate = false;
    }

    this.resetHelpPages();
  }

  setupEventListeners() {
    document.addEventListener("yp-error", this.ypError.bind(this));
    document.addEventListener("yp-network-error", this.ypError.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener(
      "yp-language-loaded",
      this.languageLoaded.bind(this)
    );

    document.addEventListener(
      "disableBrowserTouch",
      () => (this.disableBrowserTouchEvents = true)
    );
    document.addEventListener(
      "enableBrowserTouch",
      () => (this.disableBrowserTouchEvents = false)
    );

    document.addEventListener(
      "yp-registration-questions-done",
      this.registrationQuestionDone.bind(this)
    );

    document.addEventListener(
      "open-new-comment",
      this.openNewComment.bind(this)
    );

    document.addEventListener(
      "no-land-use-selected",
      this.noLandUseSelected.bind(this)
    );

    document.addEventListener("open-comments", this.openComments.bind(this));

    document.addEventListener("edit-comment", this.openEditComment.bind(this));

    document.addEventListener(
      "update-tile-count",
      this.updateTileCount.bind(this)
    );
  }

  async loadAllTopLevelPoints() {
    const allPointIds = this.tileManager.getAllTopLevelPoints();
    const allTopLevelPoints = [];
    for (let p = 0; p < allPointIds.length; p++) {
      const point = await window.serverApi.getParentPoint(
        this.group!.id,
        allPointIds[p]
      );
      if (point && point.id) {
        allTopLevelPoints.push(point);
      } else {
        this.tileManager.deletePoint(allPointIds[p]);
      }
    }

    this.allTopLevelPoints = allTopLevelPoints;
  }

  async afterNewPost() {
    this.gameStage = GameStage.Results;
    this.landUseTypeDisabled = true;
    this.tileManager.clearLandUsesAndComments();
    this.tutorial.openStage("openResults");
    await new Promise((resolve) => setTimeout(resolve, 200));
    await this.setupTileResults();
    await this.loadAllTopLevelPoints();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.setLandUse(undefined);
    await this.tileManager.updateCommentResults();
    this.disableBrowserTouchEvents = true;
    this.landUseTypeDisabled = false;
  }

  _newPost() {
    window.appGlobals.activity('landUseOpen', "newPost");
    if (this.tileManager.numberOfTilesWithComments === 0) {
      (this.$$("#noCommentsAddedDialog") as Dialog).show();
    } else {
      this._reallyNewPost();
    }
  }

  _reallyNewPost() {
    window.appGlobals.activity("landUseOpen", "reallyNewPost");
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

  async setupCharacters() {
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

      this.eagleManager = new EagleManager(this.viewer!, eagleStart, eagleEnd);
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
  }

  async inputAction(event: any) {
    if (this.gameStage === GameStage.Play) {
      this.tileManager.setInputAction(event);
    } else if (this.gameStage === GameStage.Results) {
      this.tileManager.setInputActionForResults(event);
    }
  }

  async toggleShowAllResults() {
    window.appGlobals.activity('landUseToggle', "showAllResults");
    this.showAllTileResults = !this.showAllTileResults;
    this.landUseTypeDisabled = true;
    await this.tileManager.setShowAllTileResults(this.showAllTileResults);
    this.landUseTypeDisabled = false;
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

    let baseLayer;
    if (window.location.href.indexOf("localhost") > -1) {
      baseLayer = Cesium.ImageryLayer.fromProviderAsync(
        Cesium.IonImageryProvider.fromAssetId(3954, {}),
        {} // Options object, can be customized as needed
      );
    } else {
      baseLayer = Cesium.ImageryLayer.fromProviderAsync(
        Cesium.createWorldImageryAsync({
          style: Cesium.IonWorldImageryStyle.AERIAL,
        }),
        {} // Options object, can be customized as needed
      );
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
      baseLayer: baseLayer,
      requestRenderMode: true,
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
    });

    window.addEventListener(
      "touchmove",
      (event) => {
        //@ts-ignore
        if (event.scale !== 1) {
          if (this.disableBrowserTouchEvents) {
            event.preventDefault();
          } else {
          }
        }
      },
      { passive: false }
    );

    this.disableBrowserTouchEvents = false;

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

    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    //this.viewer.scene.postProcessStages.bloom.enabled = true;
    setTimeout(async () => {
      await this.tileManager.readGeoData(this.group!.id);
      this.planeDisabled = true;
      this.planeManager = new PlaneManager(
        this.viewer!,
        this.tileManager.geojsonData
      );
      await this.planeManager.setup();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.planeDisabled = false;
    });

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    if (this.gameStage !== GameStage.Results) {
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
    } else {
      // Wait for 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.setCameraFromView(this.tileManager.showAllView);
    }
  }

  themeChanged(target: HTMLElement | undefined = undefined) {
    let themeCss = {} as any;

    const isDark =
      this.themeDarkMode === undefined
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : this.themeDarkMode;

    const theme = themeFromSourceColor(argbFromHex("#73ae2c"), [
      {
        name: "up-vote",
        value: argbFromHex("#0F0"),
        blend: true,
      },
      {
        name: "down-vote",
        value: argbFromHex("#F00"),
        blend: true,
      },
    ]);

    applyTheme(theme, { target: document.body, dark: false });
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

  async reallyDeleteComment(event: CustomEvent) {
    if (this.currentRectangleIdForComment  && this.currentPointIdToDelete) {
      await window.serverApi.deletePoint(this.currentPointIdToDelete);
      this.tileManager.deleteCommentFromPoint(
        this.currentPointIdToDelete
      );
      if (this.gameStage == GameStage.Results) {
        await this.loadAllTopLevelPoints();
      }
    } else {
      console.error("Can't find rectangle for comment");
    }
    (this.$$("#deleteCommentDialog") as MdDialog).close();
  }

  async deleteComment(event: CustomEvent) {
    this.currentPointIdToDelete = event.detail.pointId;
    this.currentRectangleIdForComment = event.detail.rectangleId;
    (this.$$("#deleteCommentDialog") as MdDialog).show();
  }

  showAll() {
    this.viewer!.trackedEntity = undefined;
    this.cancelFlyToPosition();
    this.setCameraFromView(this.tileManager.showAllView);
    window.appGlobals.activity('landUseClick', "showAll");
  }

  trackPlane() {
    this.cancelFlyToPosition();
    this.viewer!.trackedEntity = this.planeManager.plane;
    window.appGlobals.activity('landUseClick', "trackPlane");
  }

  async chooseAerial() {
    this.viewer!.imageryLayers.removeAll();
    const imageryProvider = await Cesium.createWorldImageryAsync({
      style: Cesium.IonWorldImageryStyle.AERIAL,
    });
    this.viewer!.imageryLayers.addImageryProvider(imageryProvider);
    window.appGlobals.activity("landUseClick", "aerial");
  }

  async chooseAerialWithLabels() {
    this.viewer!.imageryLayers.removeAll();
    const imageryProvider = await Cesium.createWorldImageryAsync({
      style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    });
    this.viewer!.imageryLayers.addImageryProvider(imageryProvider);
    window.appGlobals.activity("landUseClick", "aerialWithLabels");
  }

  chooseOpenStreetMap() {
    this.viewer!.imageryLayers.removeAll();
    this.viewer!.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      })
    );
    window.appGlobals.activity("landUseClick", "openStreetMap");
  }

  async logout() {
    (this.$$("#logoutDialog") as MdDialog).show();
  }

  async reallyLogout() {
    window.appUser.logout();
    await new Promise((resolve) => setTimeout(resolve, 750));
    location.reload();
  }

  cancelLogout() {
    (this.$$("#logoutDialog") as MdDialog).close();
  }

  cancelDeleteComment() {
    (this.$$("#deleteCommentDialog") as MdDialog).close();
  }


  async restart() {
    (this.$$("#restartDialog") as MdDialog).show();
    window.appGlobals.activity('landUseClick', "openRestart");
  }

  async reallyRestart() {
    window.appGlobals.activity('landUseClick', "reallyRestart");
    location.reload();
  }

  cancelRestart() {
    (this.$$("#restartDialog") as MdDialog).close();
    window.appGlobals.activity('landUseClick', "cancelRestart");
  }

  renderUI() {
    if (this.hideUI) return nothing;
    else
      return html`
        <div
          id="landUseSelection"
          class="layout vertical center-center"
          ?hidden="${this.gameStage === GameStage.Intro}"
        >
          <md-chip-set
            type="filter"
            class="layout horizontal center-center  ${!this.wide
              ? "wrap"
              : "start"}"
          >
            <md-filter-chip
              id="landUse1"
              .label="${this.t("Energy")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("energy")}"
              ?selected=${this.selectedLandUse === "energy"}
            >
              <md-icon slot="icon" aria-hidden="true">electric_bolt</md-icon>
            </md-filter-chip>
            <md-filter-chip
              id="landUse2"
              .label="${this.t("Grazing")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("gracing")}"
              ?selected=${this.selectedLandUse === "gracing"}
            >
              <md-icon slot="icon" aria-hidden="true">grass</md-icon>
            </md-filter-chip>
            <md-filter-chip
              id="landUse3"
              .label="${this.t("Tourism")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("tourism")}"
              ?selected=${this.selectedLandUse === "tourism"}
            >
              <md-icon slot="icon" aria-hidden="true">concierge</md-icon>
            </md-filter-chip>
            <md-filter-chip
              id="landUse4"
              .label="${this.t("Recreation")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("recreation")}"
              ?selected=${this.selectedLandUse === "recreation"}
            >
              <md-icon slot="icon" aria-hidden="true">snowmobile</md-icon>
            </md-filter-chip>
            <md-filter-chip
              id="landUse5"
              .label="${this.t("Restoration")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("restoration")}"
              ?selected=${this.selectedLandUse === "restoration"}
            >
              <md-icon slot="icon" aria-hidden="true">eco</md-icon>
            </md-filter-chip>
            <md-filter-chip
              id="landUse6"
              .label="${this.t("Conservation")}"
              ?disabled=${this.landUseTypeDisabled}
              @click="${() => this.setLandUse("conservation")}"
              ?selected=${this.selectedLandUse === "conservation"}
            >
              <md-icon slot="icon" aria-hidden="true">landscape</md-icon>
            </md-filter-chip>
            <md-filled-icon-button
              id="commentButton"
              toggle
              .title="${this.t("selectAndClickOnMapToComment")}"
              .label="${this.t("Comment")}"
              ?is-selected="${this.tileManager?.isCommenting}"
              .selected="${this.tileManager?.isCommenting}"
              @click="${() =>
                this.setIsCommenting(
                  this.tileManager?.isCommenting ? false : true
                )}"
              class="navButton"
              ?hidden="${this.gameStage === GameStage.Results}"
            >
              <md-icon slot="selectedIcon">stylus</md-icon>
              <md-icon>edit</md-icon>
            </md-filled-icon-button>
            <md-filled-icon-button
              id="commentButton"
              .title="${this.t("openComments")}"
              .label="${this.t("openComments")}"
              @click="${() => this.openComments(null)}"
              class="navButton"
              ?disabled="${!this.allTopLevelPoints ||
              this.allTopLevelPoints.length === 0}"
              ?hidden="${this.gameStage !== GameStage.Results}"
            >
              <md-icon>forum</md-icon>
            </md-filled-icon-button>
          </md-chip-set>
        </div>

        <div
          id="navigationButtons"
          ?hidden="${this.gameStage === GameStage.Intro}"
        >
          <div class="layout vertical navButtonsContainer">
            <md-filled-icon-button
              id="showAll"
              class="navButton"
              @click="${this.showAll}"
              .title="${this.t("Show all")}"
              .label="${this.t("Show all")}"
              ><md-icon>home</md-icon></md-filled-icon-button
            >

            <md-filled-icon-button
              id="trackPlane"
              class="navButton"
              @click="${this.trackPlane}"
              .label="${this.t("Plane")}"
              .title="${this.t("Plane")}"
              ?disabled="${this.planeDisabled}"
              ><md-icon>travel</md-icon></md-filled-icon-button
            >
            <div class="divider"></div>

            <md-filled-tonal-icon-button
              id="chooseAerial"
              class="navButton"
              @click="${this.chooseAerial}"
              .label="${this.t("Aerial")}"
              .title="${this.t("Aerial")}"
              ><md-icon>public</md-icon></md-filled-tonal-icon-button
            >

            <md-filled-tonal-icon-button
              id="chooseAerialWithLabels"
              class="navButton"
              @click="${this.chooseAerialWithLabels}"
              .label="${this.t("Aerial with labels")}"
              .title="${this.t("Aerial with labels")}"
              ><md-icon>travel_explore</md-icon></md-filled-tonal-icon-button
            >

            <md-filled-tonal-icon-button
              id="chooseOpenStreetMap"
              class="navButton"
              @click="${this.chooseOpenStreetMap}"
              .label="${this.t("Map")}"
              .title="${this.t("Map")}"
              ><md-icon>map</md-icon></md-filled-tonal-icon-button
            >

            <md-icon-button
              id="openHelpButton"
              class="navButton helpButton"
              @click="${this.openHelp}"
              .label="${this.t("Help")}"
              ><md-icon>help</md-icon></md-icon-button
            >
            <md-icon-button
              id="restartButton"
              class="navButton helpButton"
              @click="${this.restart}"
              .label="${this.t("restart")}"
              .title="${this.t("restart")}"
              ><md-icon>restart_alt</md-icon></md-icon-button
            >
            <md-icon-button
              id="logoutButton"
              ?hidden="${!window.appUser.user}"
              class="navButton helpButton"
              @click="${this.logout}"
              .title="${this.t("user.logout")}"
              .label="${this.t("Logout")}"
              ><md-icon>logout</md-icon></md-icon-button
            >
          </div>
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
                <div hidden>
                  <button
                    id="showAllButton"
                    @click="${this.toggleShowAllResults}"
                    ?selected="${this.showAllTileResults}"
                  >
                    ${this.t("Show 'losing' votes")}
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
                  <div hidden class="progressBarContainer">
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
          <md-filled-button
            id="submitButton"
            @click="${() => this._newPost()}"
            ?disabled="${this.disableSubmitButton}"
          >
            ${this.t("submitLandUse")}
          </md-filled-button>
        </div>
      `;
  }

  closeErrorDialog() {
    (this.$$("#errorDialog") as Dialog).close();
  }

  renderNoCommentsAddedDialog() {
    return html`
      <md-dialog
        id="noCommentsAddedDialog"
        ?is-safari="${this.isSafari}"
        @cancel="${this.scrimDisableAction}"
      >
        <div slot="headline">${this.t("noCommentsAdded")}</div>
        <div slot="content">${this.t("noCommentsInfo")}</div>
        <div slot="actions">
          <md-text-button
            @click="${() => {
              this._reallyNewPost();
              (this.$$("#noCommentsAddedDialog") as Dialog).close();
            }}"
            >${this.t("noThanks")}</md-text-button
          >
          <md-text-button
            @click="${() => {
              this.setIsCommenting(true);
              (this.$$("#noCommentsAddedDialog") as Dialog).close();
            }}"
            >${this.t("addComment")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  renderErrorDialog() {
    return html`
      <md-dialog
        id="errorDialog"
        ?is-safari="${this.isSafari}"
        @closed="${this.errorDialogClosed}"
      >
        <div slot="headliner">${this.t("Error")}</div>
        <div slot="content">${this.currentErrorText}</div>
        <div slot="actions">
          <md-text-button @click="${this.closeErrorDialog}"
            >${this.t("ok")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  //TODO: Refactor those dialogs, they are all the same
  renderLogoutDialog() {
    return html`
      <md-dialog
        id="logoutDialog"
        ?is-safari="${this.isSafari}"
        @cancel="${this.scrimDisableAction}"
      >
        <div slot="headliner">${this.t("user.logout")}</div>
        <div slot="content">${this.t('areYouSureYouWantToLogout')}</div>
        <div slot="actions">
          <md-text-button @click="${this.cancelLogout}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button @click="${this.reallyLogout}"
            >${this.t("user.logout")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  renderDeleteConfirmDialog() {
    return html`
      <md-dialog
        id="deleteCommentDialog"
        ?is-safari="${this.isSafari}"
        @cancel="${this.scrimDisableAction}"
      >
        <div slot="headliner">${this.t("deleteComment")}</div>
        <div slot="content">${this.t('areYouSureYouWantToDeleteComment')}</div>
        <div slot="actions">
          <md-text-button @click="${this.cancelDeleteComment}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button @click="${this.reallyDeleteComment}"
            >${this.t("deleteComment")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  renderRestartDialog() {
    return html`
      <md-dialog
        id="restartDialog"
        ?is-safari="${this.isSafari}"
        @cancel="${this.scrimDisableAction}"
      >
        <div slot="headliner">${this.t("restart")}</div>
        <div slot="content">${this.t('areYouSureYouWantToRestart')}</div>
        <div slot="actions">
          <md-text-button @click="${this.cancelRestart}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button @click="${this.reallyRestart}"
            >${this.t("restart")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  commentsDialogClosed() {
    this.disableBrowserTouchEvents = true;
    this.tileManager.disableLookAtMode();
  }

  render() {
    return html`
      ${this.renderDeleteConfirmDialog()} ${this.renderRestartDialog()} ${this.renderLogoutDialog()} ${this.renderErrorDialog()} ${this.renderNoCommentsAddedDialog()}
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>
      <div
        id="cesium-container"
        ?has-landuse-selected="${this.selectedLandUse}"
        ?is-commenting="${this.tileManager?.isCommenting}"
        ?is-results-mode="${this.gameStage === GameStage.Results}"
      ></div>
      <div id="emptyCreditContainer"></div>

      <yp-new-comment-dialog
        id="newCommentDialog"
        .group="${this.group}"
        @close="${() => (this.disableBrowserTouchEvents = true)}"
        @save="${this.saveComment}"
      ></yp-new-comment-dialog>

      <yp-edit-comment-dialog
        id="editCommentDialog"
        .group="${this.group!}"
        .tileManager="${this.tileManager}"
        @close="${() => (this.disableBrowserTouchEvents = true)}"
        @save="${this.saveComment}"
        @delete="${this.deleteComment}"
      ></yp-edit-comment-dialog>

      <yp-comments-dialog
        id="commentsDialog"
        .topLevelPoints="${this.allTopLevelPoints}"
        .tileManager="${this.tileManager}"
        @closed="${this.commentsDialogClosed}"
        .group="${this.group!}"
        @delete="${this.deleteComment}"
      ></yp-comments-dialog>
      ${this.renderUI()}
    `;
  }
}
