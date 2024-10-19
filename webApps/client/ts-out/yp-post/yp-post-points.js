var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nothing, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/progress/linear-progress.js";
//import { Radio } from '@material/md-radio';
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/radio/radio.js";
import "../yp-file-upload/yp-file-upload.js";
import "../yp-file-upload/yp-file-upload-icon.js";
import "../common/yp-emoji-selector.js";
import "../yp-point/yp-point.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { FlowLayout } from "@lit-labs/virtualizer/layouts/flow.js";
import { ifDefined } from "lit/directives/if-defined.js";
//import { YpAutoTranslateDialog } from '../yp-dialog-container/yp-autotranslate-dialog.js';
let YpPostPoints = class YpPostPoints extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.fetchActive = false;
        this.isAdmin = false;
        this.disableDebate = false;
        this.pointUpOrDownSelected = "pointFor";
        this.addPointDisabled = false;
        this.hideUpVideo = false;
        this.hideDownVideo = false;
        this.hideMobileVideo = false;
        this.hideUpAudio = false;
        this.hideDownAudio = false;
        this.hideMobileAudio = false;
        this.hideUpText = false;
        this.hideDownText = false;
        this.hideMobileText = false;
        this.selectedPointForMobile = false;
        this.isAndroid = false;
        this.loadedPointIds = {};
        this.loadMoreInProgress = false;
        this.storedUpPointsCount = 0;
        this.storedDownPointsCount = 0;
        this.noMorePoints = false;
    }
    get textValueUp() {
        if (this.$$("#up_point"))
            return this.$$("#up_point").value;
        else
            return "";
    }
    _clearTextValueUp() {
        if (this.$$("#up_point"))
            this.$$("#up_point").value = "";
    }
    get textValueDown() {
        if (this.$$("#down_point"))
            return this.$$("#down_point").value;
        else
            return "";
    }
    _clearTextValueDown() {
        if (this.$$("#down_point"))
            this.$$("#down_point").value = "";
    }
    get textValueMobileUpOrDown() {
        if (this.$$("#mobile_point"))
            return this.$$("#mobile_point").value;
        else
            return "";
    }
    _clearTextValueMobileUpOrDown() {
        if (this.$$("#up_point"))
            this.$$("#up_point").value = "";
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("wide")) {
            this._updateEmojiBindings();
        }
        if (changedProperties.has("points")) {
            this._pointsChanged();
        }
        if (changedProperties.has("post")) {
            this._postChanged();
        }
        if (changedProperties.has("isAdmin")) {
            this._isAdminChanged();
        }
        if (changedProperties.has("pointUpOrDownSelected") ||
            changedProperties.has("post")) {
            this._pointUpOrDownSelectedChanged();
        }
        if (changedProperties.has("hasCurrentUpVideo")) {
            this._hasCurrentUpVideo();
        }
        if (changedProperties.has("hasCurrentDownVideo")) {
            this._hasCurrentDownVideo();
        }
        if (changedProperties.has("hasCurrentMobileVideo")) {
            this._hasCurrentMobileVideo();
        }
        if (changedProperties.has("hasCurrentUpAudio")) {
            this._hasCurrentUpAudio();
        }
        if (changedProperties.has("hasCurrentDownAudio")) {
            this._hasCurrentDownAudio();
        }
        if (changedProperties.has("hasCurrentMobileAudio")) {
            this._hasCurrentMobileAudio();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .mainPointInput {
          width: 100%;
        }

        md-linear-progress {
          width: 95%;
          margin-top: 64px;
        }

        md-filled-button[has-static-theme] {
          --md-filled-button-container-color: var(
            --md-sys-color-primary-container
          );
          --md-filled-button-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        .happyFace {
          color: var(--yp-sys-color-up);
          --md-icon-size: 48px;
          margin-right: 16px;
          margin-top: -6px;
          margin-left: -4px;
        }

        .sadFace {
          color: var(--yp-sys-color-down);
          --md-icon-size: 48px;
          margin-right: 16px;
          margin-top: -6px;
          margin-left: -4px;
        }

        yp-user-image {
          margin-bottom: 12px;
          margin-left: 4px;
        }

        .topContainer {
        }

        .main-container {
        }

        .processBar {
          height: 4px;
          margin: 0;
          padding: 0;
        }

        .pointInfo {
          opacity: 0.5;
          font-size: 17px;
          font-weight: 400;
          margin-top: 48px;
          margin-bottom: 32px;
        }

        .pointInfoIcon {
          width: 24px;
          height: 24px;
          padding-left: 4px;
          padding-right: 4px;
        }

        .point {
          max-width: 420px;
          margin-right: 32px;
          margin-left: 32px;
        }

        .pointInputMaterial {
        }

        yp-point {
        }

        .pointMaterial {
        }

        .thumbIcon {
        }

        .editIcon {
        }

        .addPointFab {
          width: 100%;
          margin-top: 16px;
          margin-bottom: 32px;
          margin-left: 24px;
        }

        md-filled-text-field[is-up] {
          --md-filled-text-field-container-color: var(
            --md-sys-color-surface-container
          );
          --md-filled-text-field-active-indicator-color: var(--yp-sys-color-up);
          --md-filled-text-field-caret-color: var(
            --yp-sys-color-on-container-up
          );
          --md-filled-field-focus-label-text-color: var(
            --yp-sys-color-on-container-up
          );
          --md-filled-field-focus-active-indicator-color: var(
            --yp-sys-color-up
          );
        }

        md-filled-text-field[is-down] {
          --md-filled-text-field-container-color: var(
            --md-sys-color-surface-container
          );
          --md-filled-text-field-active-indicator-color: var(
            --yp-sys-color-down
          );
          --md-filled-text-field-caret-color: var(
            --yp-sys-color-on-container-down
          );
          --md-filled-field-focus-label-text-color: var(
            --yp-sys-color-on-container-down
          );
          --md-filled-field-focus-active-indicator-color: var(
            --yp-sys-color-down
          );
        }

        .submitButton[is-up] {
          --md-filled-button-container-color: var(--yp-sys-color-up);
          --md-filled-button-label-text-color: var(--yp-sys-color-on-up);
        }

        .submitButton[is-down] {
          --md-filled-button-container-color: var(--yp-sys-color-down);
          --md-filled-button-label-text-color: var(--yp-sys-color-on-down);
        }

        .howToWriteInfoText {
          padding-top: 4px;
        }

        .penContainer {
          margin-top: 42px;
        }

        .upOrDown {
          margin-top: 72px;
        }

        #pointUpOrDownMaterial {
        }

        .mobileFab {
          margin-top: 8px;
        }

        md-outlined-button {
        }

        lit-virtualizer {
          width: 450px;
          height: 80vh;
          overflow: hidden;
        }

        @media (max-width: 985px) {
          .pointInputMaterial {
            width: 100%;
            max-width: 568px;
            font-size: 14px;
            padding-top: 4px;
            margin-top: 0;
          }

          .pointMaterial {
            width: 100%;
            max-width: 600px;
            padding-left: 0;
            padding-right: 0;
          }

          .pointMaterial[is-last-point] {
            margin-bottom: 32px;
          }

          #pointUpOrDownMaterial {
            margin-top: 16px;
          }

          .main-container {
            width: 100%;
          }

          lit-virtualizer {
            width: 100%;
          }

          .point {
            padding-left: 0;
            padding-right: 0;
          }
        }

        .pointMainHeader {
          font-size: 22px;
          font-weight: 700;
          font-family: var(--md-ref-typeface-brand);
          margin-top: 32px;
          margin-bottom: 32px;
        }

        @media (max-width: 420px) {
          .pointInputMaterial {
            width: 90%;
            max-width: 90%;
          }
        }

        #pointUpMaterialNotUsed {
          border-top: solid 2px;
          border-top-color: var(--master-point-up-color);
        }

        #pointDownMaterialNotUsed {
          border-top: solid 2px;
          border-top-color: var(--master-point-down-color);
        }

        .pointElement {
          margin-bottom: 18px;
        }

        [hidden] {
          display: none !important;
        }

        lit-virtualizer {
          height: 80vh;
        }

        #listMobile[debate-disabled] {
          margin-top: 16px;
        }

        .mainSpinner {
          margin: 32px;
        }

        .uploadNotLoggedIn {
          min-width: 100px;
          margin-bottom: 24px;
        }

        .uploadNotLoggedIn > .icon {
          padding-right: 8px;
        }

        .pointButtons {
          margin-bottom: 4px;
        }

        .bottomDiv {
          margin-bottom: 32px;
        }

        .uploadSection {
          justify-content: space-evenly;
          width: 50%;
          margin-left: 8px;
          margin-right: 8px;
          vertical-align: top;
        }

        .videoUploadDisclamer {
          font-size: 12px;
          padding: 8px;
          margin-bottom: 4px;
        }

        div[rtl] {
          direction: rtl;
        }
      `,
        ];
    }
    renderAudioUpload(type, hideAudio, hasCurrentAudio, uploadAudioPointHeader) {
        return this.post.Group.configuration?.allowPointAudioUploads
            ? html `
          <div ?hidden="${hideAudio}" class="uploadSection">
            <div
              class="layout vertical center-center"
              ?hidden="${!this.isLoggedIn}"
            >
              <yp-file-upload-icon
                simple
                id="audioFileUpload${type}"
                current-file="${ifDefined(hasCurrentAudio)}"
                container-type="points"
                .uploadlimitSeconds="${this.post.Group.configuration
                .audioPointUploadLimitSec}"
                .group="${this.post.Group}"
                raised
                audioUpload
                buttonIcon="keyboard_voice"
                .buttonText="${uploadAudioPointHeader}"
                method="POST"
                @success="${this._audioUpUploaded}"
              >
              </yp-file-upload-icon>
            </div>
            <div class="layout horizontal center-center">
              <md-icon-button
                class="uploadNotLoggedIn"
                ?hidden="${this.isLoggedIn}"
                @click="${this._openLogin}"
                .label="${uploadAudioPointHeader}"
                ><md-icon>keyboard_voice</md-icon>
              </md-icon-button>
            </div>
          </div>
        `
            : nothing;
    }
    renderVideoUpload(type, hideVideo, hasCurrentVideo, uploadVideoHeader, videoUploadedFunc, uploadedVideoId) {
        return this.post.Group.configuration?.allowPointVideoUploads
            ? html `
          <div ?hidden="${hideVideo}" class="uploadSection">
            <div
              class="layout vertical center-center self-start"
              ?hidden="${!this.isLoggedIn}"
            >
              <yp-file-upload-icon
                simple
                id="videoFileUpload${type}"
                noDefaultCoverImage
                .uploadLimitSeconds="${this.post.Group.configuration
                .videoPointUploadLimitSec}"
                .currentFile="${hasCurrentVideo}"
                containerType="points"
                .group="${this.post.Group}"
                raised
                videoUpload
                method="POST"
                buttonIcon="videocam"
                .buttonText="${uploadVideoHeader}"
                @success="${videoUploadedFunc}"
              >
              </yp-file-upload-icon>
            </div>
            <div
              class="videoUploadDisclamer"
              ?hidden="${!this.post.Group.configuration
                .showVideoUploadDisclaimer || !uploadedVideoId}"
            >
              ${this.t("videoUploadDisclaimer")}
            </div>
            <div class="layout horizontal center-center">
              <md-icon-button
                class="uploadNotLoggedIn"
                ?hidden="${this.isLoggedIn}"
                @click="${this._openLogin}"
                .label="${uploadVideoHeader}"
                ><md-icon>videocam</md-icon>
              </md-icon-button>
            </div>
          </div>
        `
            : nothing;
    }
    renderMobilePointSelection() {
        html ` <div class="layout vertical end-justified">
      <div
        class="layout horizontal center-center pointButtons"
        ?hidden="${this.post.Group.configuration?.hidePointAgainst &&
            this.post.Group.configuration?.hidePointFor}"
      >
        <label ?hidden="${this.post.Group.configuration?.hidePointFor}"
          >${this.t("pointForShort")}
          <md-radio
            @click="${this._chooseUpOrDownRadio}"
            ?selected="${this.pointUpOrDownSelected == "pointFor"}"
            id="upRadio"
            name="upOrDown"
          ></md-radio>
        </label>

        <label ?hidden="${this.post.Group.configuration?.hidePointAgainst}"
          >${this.t("pointAgainstShort")}
          <md-radio
            @click="${this._chooseUpOrDownRadio}"
            ?selected="${this.pointUpOrDownSelected == "pointAgainst"}"
            id="downRadio"
            name="upOrDown"
          ></md-radio>
        </label>
      </div>
    </div>`;
    }
    renderPointItem(point, index) {
        return html `<div
      class="item layout-horizontal"
      tabindex="${index}"
      role="listitem"
      aria-level="3"
    >
      <div
        id="point${point.id}"
        class="pointMaterial"
        ?is-last-point="${point.isLastPointInList}"
      >
        <yp-point
          .point="${point}"
          .group="${this.post.Group}"
          .post="${this.post}"
        ></yp-point>
      </div>
    </div>`;
    }
    renderHeaderIcon(headerTextType) {
        if (this.post.Group.configuration.hidePointForAgainstIcons) {
            return nothing;
        }
        else if (headerTextType == "alternativePointForHeader") {
            return html ` <md-icon class="happyFace">sentiment_satisfied</md-icon> `;
        }
        else {
            return html ` <md-icon class="sadFace">sentiment_dissatisfied</md-icon> `;
        }
    }
    renderPointHeader(header, alternativeHeader, headerTextType, pointsLength) {
        const pointsLengthText = pointsLength && pointsLength > 0 ? `(${pointsLength})` : "";
        return !alternativeHeader
            ? html `
          <div
            class="pointMainHeader layout horizontal"
            role="heading"
            aria-level="2"
          >
            ${this.renderHeaderIcon(headerTextType)} ${header}
            ${pointsLengthText}
          </div>
        `
            : html `
          <div class="pointMainHeader layout horizontal">
            ${this.renderHeaderIcon(headerTextType)}
            <yp-magic-text
              .contentId="${this.post.Group.id}"
              textOnly
              .content="${alternativeHeader}"
              .contentLanguage="${this.post.Group.language}"
              role="heading"
              aria-level="2"
              class="ratingName"
              .postfixText=${` ${pointsLengthText}`}
              textType="${headerTextType}"
            >
            </yp-magic-text>
          </div>
        `;
    }
    renderPointList(type, header, alternativeHeader, headerTextType, label, hideVideo, hideText, hasCurrentVideo, videoUploadedFunc, uploadVideoHeader, uploadedVideoId, pointFocusFunction, hideAudio, hasCurrentAudio, uploadAudioPointHeader, ifLengthIsRight, addPointFunc, points, mobile = false) {
        if (false && points && points.length == 0) {
            return html `<div class="point">
        ${this.renderPointHeader(header, "Engin rök til", headerTextType, 0)}
      </div> `;
        }
        else {
            return html `
        <div class="point">
          ${this.renderPointHeader(header, alternativeHeader, headerTextType, points ? points.length : 0)}

          <div
            id="point${type}Material"
            class="pointInputMaterial
                    layout vertical"
            ?hidden="${this.post.Group.configuration?.disableDebate}"
          >
            <div class="layout vertical">
              ${window.appUser.user
                ? html `<yp-user-image
                    medium
                    .user="${window.appUser.user}"
                  ></yp-user-image>`
                : nothing}

              <md-filled-text-field
                class="mainPointInput"
                ?is-up="${type == "Up"}"
                ?is-down="${type == "Down"}"
                id="${type.toLowerCase()}_point"
                @focus="${pointFocusFunction}"
                @blur="${this.blurOutlinedTextField}"
                .label="${label ? label : ""}"
                charCounter
                hasTrailingIcon
                type="textarea"
                rows="6"
                @keyup="${() => {
                this.requestUpdate();
            }}"
                ?hidden="${hideText}"
                maxrows="6"
                .maxLength="${this.pointMaxLength}"
                ><div class="layout vertical" slot="trailing-icon">
                  <yp-emoji-selector
                    id="point${type}EmojiSelector"
                    ?hidden="${hideText ||
                this.post.Group.configuration?.hideEmoji}"
                  ></yp-emoji-selector>

                  ${this.renderVideoUpload(type, hideVideo, hasCurrentVideo, uploadVideoHeader, videoUploadedFunc, uploadedVideoId)}
                  ${this.renderAudioUpload(type, hideAudio, hasCurrentAudio, uploadAudioPointHeader)}
                </div>
              </md-filled-text-field>
            </div>

            ${mobile ? this.renderMobilePointSelection() : nothing}

            <div class="addPointFab layout horizontal center-center">
              <md-filled-button
                ?has-static-theme="${this.hasStaticTheme}"
                class="submitButton"
                ?is-up="${type == "Up"}"
                ?is-down="${type == "Down"}"
                ?hidden="${!ifLengthIsRight}"
                ?disabled="${this.addPointDisabled || !ifLengthIsRight}"
                @click="${addPointFunc}"
                >${this.t("postPoint")}</md-filled-button
              >
            </div>
          </div>

          ${points
                ? html `
                <lit-virtualizer
                  id="list${type}"
                  .items=${points}
                  .layout="${FlowLayout}"
                  .scrollTarget="${window}"
                  .renderItem=${this.renderPointItem.bind(this)}
                  @rangeChanged=${this.scrollEvent}
                ></lit-virtualizer>
              `
                : nothing}
        </div>
      `;
        }
    }
    scrollEvent(event /*RangeChangedEvent*/) {
        //TODO
    }
    renderTranslationPlaceholders() {
        return html `${!this.post.Group.configuration?.alternativePointForLabel
            ? html `
          <yp-magic-text
            id="alternativePointForLabelId"
            hidden
            contentId="${this.post.Group.id}"
            textOnly
            .content="${this.post.Group.configuration
                ?.alternativePointForLabel}"
            .contentLanguage="${this.post.Group.language}"
            @new-translation="${this._updatePointLabels}"
            role="heading"
            aria-level="2"
            textType="alternativePointForLabel"
          >
          </yp-magic-text>
        `
            : nothing}
    ${!this.post.Group.configuration?.alternativePointAgainstLabel
            ? html `
          <yp-magic-text
            id="alternativePointAgainstLabelId"
            hidden
            contentId="${this.post.Group.id}"
            textOnly
            .content="${this.post.Group.configuration
                ?.alternativePointAgainstLabel}"
            .contentLanguage="${this.post.Group.language}"
            @new-translation="${this._updatePointLabels}"
            role="heading"
            aria-level="2"
            textType="alternativePointAgainstLabel"
          >
          </yp-magic-text>
        `
            : nothing}`;
    }
    renderPointInfo() {
        return html `
      <div
        class="pointInfo layout vertical center-center"
        ?hidden="${this.post.Group.configuration?.hidePointAgainst &&
            this.post.Group.configuration?.hidePointFor}"
      >
        <div>
          ${this.t("upvote")}
          <md-icon class="pointInfoIcon">arrow_upward</md-icon> ${this.t("orDownvote")} <md-icon class="pointInfoIcon">arrow_downward</md-icon> ${this.t("pointsByPressingTheArrows")}
        </div>
      </div>
    `;
    }
    render() {
        return html `
      <div class="processBar layout horizontal center-center">
        <md-linear-progress
          indeterminate
          ?hidden="${!this.fetchActive}"
        ></md-linear-progress>
      </div>

      ${this.wideReady
            ? html `
            <div
              ?rtl="${this.rtl}"
              class="layout vertical topContainer"
              ?hidden="${this.fetchActive}"
            >
              ${this.renderPointInfo()}
              <div
                class="main-container layout horizontal ${this.post.Group
                .configuration?.hidePointAgainst
                ? "center-center"
                : ""}"
              >
                ${!this.post.Group.configuration?.hidePointFor
                ? this.renderPointList("Up", this.t("pointsFor"), this.post.Group.configuration?.alternativePointForHeader, "alternativePointForHeader", this.labelUp, this.hideUpVideo, this.hideUpText, this.hasCurrentUpVideo, this._videoUpUploaded, this.t("uploadVideoPointFor"), this.uploadedVideoUpId, this.focusUpPoint, this.hideUpAudio, this.hasCurrentUpAudio, this.t("uploadAudioPointFor"), this.ifLengthUpIsRight, this.addPointUp, this.upPoints)
                : nothing}
                ${!this.post.Group.configuration?.hidePointAgainst
                ? this.renderPointList("Down", this.t("pointsAgainst"), this.post.Group.configuration
                    ?.alternativePointAgainstHeader, "alternativePointAgainstHeader", this.labelDown, this.hideDownVideo, this.hideDownText, this.hasCurrentDownVideo, this._videoDownUploaded, this.t("uploadVideoPointAgainst"), this.uploadedVideoDownId, this.focusDownPoint, this.hideDownAudio, this.hasCurrentDownAudio, this.t("uploadAudioPointAgainst"), this.ifLengthDownIsRight, this.addPointDown, this.downPoints)
                : nothing}
              </div>
            </div>
          `
            : nothing}
      ${this.smallReady
            ? html `
            <div ?rtl="${this.rtl}" class="layout vertical center-center">
              ${this.renderPointList("Mobile", this.t("pointsForAndAgainst"), this.post.Group.configuration?.alternativePointAgainstHeader, "alternativePointAgainstHeader", this.labelMobileUpOrDown, this.hideMobileVideo, this.hideMobileText, this.hasCurrentMobileVideo, this._videoMobileUploaded, this.t("uploadVideoPointAgainst"), this.uploadedVideoMobileId, this.focusMobilePoint, this.hideMobileAudio, this.hasCurrentMobileAudio, this.t("uploadAudioPointAgainst"), this.ifLengthMobileIsRight, this.addMobilePointUpOrDown, this.points, true)}
            </div>
          `
            : nothing}
      ${this.renderTranslationPlaceholders()}
    `;
    }
    _chooseUpOrDownRadio() {
        const up = this.$$("#upRadio");
        const down = this.$$("#downRadio");
        if (up.checked)
            this.pointUpOrDownSelected = "pointFor";
        else if (down.checked)
            this.pointUpOrDownSelected = "pointAgainst";
    }
    get wideReady() {
        return this.wide && this.post;
    }
    get smallReady() {
        return !this.wide && this.post;
    }
    get pointMaxLength() {
        if (this.post &&
            this.post.Group &&
            this.post.Group.configuration &&
            this.post.Group.configuration?.pointCharLimit) {
            return this.post.Group.configuration?.pointCharLimit;
        }
        else {
            return 500;
        }
    }
    _openLogin() {
        this.fire("yp-open-login");
    }
    _videoUpUploaded(event) {
        this.uploadedVideoUpId = event.detail.videoId;
    }
    _videoDownUploaded(event) {
        this.uploadedVideoDownId = event.detail.videoId;
    }
    _videoMobileUploaded(event) {
        this.uploadedVideoMobileId = event.detail.videoId;
    }
    _audioUpUploaded(event) {
        this.uploadedAudioUpId = event.detail.audioId;
    }
    _audioDownUploaded(event) {
        this.uploadedAudioDownId = event.detail.audioId;
    }
    _audioMobileUploaded(event) {
        this.uploadedAudioMobileId = event.detail.audioId;
    }
    get mobileScrollOffset() {
        if (!this.wide && this.post) {
            const element = this.$$("#listMobile");
            if (element) {
                let top = element.getBoundingClientRect().top;
                if (top <= 0) {
                    top = 800;
                }
                return top;
            }
            else {
                console.warn("Can't find mobile list element, returning 800");
                return 800;
            }
        }
        else {
            return 0;
        }
    }
    get listResizeScrollThreshold() {
        if (!this.wide) {
            return 300;
        }
        else {
            return 300;
        }
    }
    get listPaddingTop() {
        if (this.wide) {
            return 600;
        }
        else {
            return 500;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;
        if (isAndroid) {
            this.isAndroid = true;
        }
        window.addEventListener("resize", this._processStoredPoints.bind(this));
        this.addListener("yp-point-deleted", this._pointDeleted);
        this.addListener("yp-update-point-in-list", this._updatePointInLists);
        this.addListener("yp-list-resize", this._listResize);
        this.addListener("yp-update-points-for-post", this._loadNewPointsIfNeeded);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("resize", this._processStoredPoints);
        this.removeListener("yp-point-deleted", this._pointDeleted);
        this.removeListener("yp-update-point-in-list", this._updatePointInLists);
        this.removeListener("yp-list-resize", this._listResize);
        this.removeListener("yp-update-points-for-post", this._loadNewPointsIfNeeded);
    }
    _listResize() {
        window.scrollBy(0, 200);
    }
    _loadNewPointsIfNeeded(event) {
        if (this.post && this.post.id == event.detail.postId) {
            if (this.latestPointCreatedAt) {
                this._getNewPoints();
            }
            else {
                console.error("Trying to send point without latestPointCreatedAt");
            }
        }
    }
    _loadMorePoints() {
        if (!this.loadMoreInProgress && !this.noMorePoints) {
            this.loadMoreInProgress = true;
            if (this.post && this.storedPoints && this.storedPoints.length > 0) {
                this._getMorePoints();
            }
            else {
                console.warn("Trying to load more points early");
                this.loadMoreInProgress = false;
            }
        }
    }
    _interleaveMorePoints(points) {
        const upPoints = [];
        const downPoints = [];
        for (let i = 0; i < points.length; i++) {
            if (points[i].value > 0) {
                upPoints.push(points[i]);
            }
            else if (points[i].value < 0) {
                downPoints.push(points[i]);
            }
        }
        return this.interleaveArrays(upPoints, downPoints);
    }
    async _getMorePoints() {
        this.loadMoreInProgress = false;
        const pointsData = (await window.serverApi.getMorePoints(this.post.id, this.storedUpPointsCount ? this.storedUpPointsCount : 0, this.storedDownPointsCount ? this.storedDownPointsCount : 0));
        let points = this._preProcessPoints(pointsData.points);
        if (points.length === 0) {
            this.noMorePoints = true;
        }
        let haveAddedPoint = false;
        points = this._interleaveMorePoints(points);
        points.forEach((point) => {
            if (this._addMorePoint(point)) {
                haveAddedPoint = true;
            }
        });
        await this.updateComplete;
        this._listResize();
        if (haveAddedPoint) {
            this._clearScrollTrigger();
        }
    }
    _clearScrollTrigger() {
        //TODO: Get working if needed
        /*
        if (this.$$('#ironScrollThesholdUp'))
          this.$$('#ironScrollThesholdUp').clearTriggers();
        if (this.$$('#ironScrollThesholdDown'))
          this.$$('#ironScrollThesholdDown').clearTriggers();
        if (this.$$('#ironScrollThesholdMobile'))
          this.$$('#ironScrollThesholdMobile').clearTriggers();
          */
    }
    async _getNewPoints() {
        if (this.latestPointCreatedAt) {
            let points = (await window.serverApi.getNewPoints(this.post.id, this.latestPointCreatedAt));
            points = this._preProcessPoints(points);
            points.forEach((point) => {
                this._insertNewPoint(point);
            });
            await this.updateComplete;
            this._listResize();
            this._updateCounterInfo();
            this.addPointDisabled = false;
        }
    }
    _pointDeleted() {
        this._getPoints();
    }
    _pointsChanged() {
        if (this.points) {
            this._updateEmojiBindings();
        }
    }
    _updateEmojiBindings() {
        setTimeout(() => {
            if (this.wide) {
                const upPoint = this.$$("#up_point");
                const downPoint = this.$$("#down_point");
                const upEmoji = this.$$("#pointUpEmojiSelector");
                const downEmoji = this.$$("#pointDownEmojiSelector");
                if (upPoint && downPoint && upEmoji && downEmoji) {
                    upEmoji.inputTarget = upPoint;
                    downEmoji.inputTarget = downPoint;
                }
                else {
                    console.warn("Wide: Can't bind emojis :(");
                }
            }
            else {
                const upDownPoint = this.$$("#mobile_point");
                const upDownEmoji = this.$$("#pointMobileEmojiSelector");
                if (upDownPoint && upDownEmoji) {
                    upDownEmoji.inputTarget = upDownPoint;
                }
                else {
                    console.warn("Small: Can't bind emojis :(");
                }
            }
        }, 500);
    }
    _pointUpOrDownSelectedChanged() {
        if (this.pointUpOrDownSelected == "pointFor") {
            if (this.post &&
                this.post.Group &&
                this.post.Group.configuration &&
                this.post.Group.configuration?.alternativePointForLabel) {
                this.labelMobileUpOrDown =
                    this.post.Group.configuration?.alternativePointForLabel;
            }
            else {
                this.labelMobileUpOrDown = this.t("point.for");
            }
            this.selectedPointForMobile = true;
        }
        else if (this.pointUpOrDownSelected == "pointAgainst") {
            if (this.post &&
                this.post.Group &&
                this.post.Group.configuration &&
                this.post.Group.configuration?.alternativePointAgainstLabel) {
                this.labelMobileUpOrDown =
                    this.post.Group.configuration?.alternativePointAgainstLabel;
            }
            else {
                this.labelMobileUpOrDown = this.t("point.against");
            }
            this.selectedPointForMobile = false;
        }
    }
    _clearVideo() {
        this.uploadedVideoUpId = undefined;
        this.uploadedVideoDownId = undefined;
        this.uploadedVideoMobileId = undefined;
        this.currentVideoId = undefined;
        this.hideUpVideo = false;
        this.hideDownVideo = false;
        this.hideMobileVideo = false;
        if (this.$$("#videoFileUploadUp"))
            this.$$("#videoFileUploadUp").clear();
        if (this.$$("#videoFileUploadDown"))
            this.$$("#videoFileUploadDown").clear();
        if (this.$$("#videoFileUploadMobile"))
            this.$$("#videoFileUploadMobile").clear();
    }
    _clearAudio() {
        this.uploadedAudioUpId = undefined;
        this.uploadedAudioDownId = undefined;
        this.uploadedAudioMobileId = undefined;
        this.currentAudioId = undefined;
        this.hideUpAudio = false;
        this.hideDownAudio = false;
        this.hideMobileAudio = false;
        if (this.$$("#audioFileUploadUp"))
            this.$$("#audioFileUploadUp").clear();
        if (this.$$("#audioFileUploadDown"))
            this.$$("#audioFileUploadDown").clear();
        if (this.$$("#audioFileUploadMobile"))
            this.$$("#audioFileUploadMobile").clear();
    }
    _isAdminChanged() {
        if (this.post &&
            this.post.Group &&
            this.post.Group.configuration &&
            this.post.Group.configuration?.disableDebate) {
            if (this.isAdmin && this.post.Group.configuration?.allowAdminsToDebate) {
                this.disableDebate = false;
            }
            else {
                this.disableDebate = true;
            }
        }
        else {
            this.disableDebate = false;
        }
    }
    async _getPoints() {
        this.fetchActive = true;
        const pointsWithCount = (await window.serverApi.getPoints(this.post.id));
        this.fetchActive = false;
        if (pointsWithCount) {
            this.storedPoints = this._preProcessPoints(pointsWithCount.points);
            this.totalCount = pointsWithCount.count;
            this.storedUpPointsCount = 0;
            this.storedDownPointsCount = 0;
            if (this.storedPoints) {
                for (let i = 0; i < this.storedPoints.length; i++) {
                    if (this.storedPoints[i].value > 0) {
                        this.storedUpPointsCount += 1;
                    }
                    else if (this.storedPoints[i].value < 0) {
                        this.storedDownPointsCount += 1;
                    }
                    this.loadedPointIds[this.storedPoints[i].id] = true;
                }
                this._processStoredPoints();
                this.removeElementsByClass(this, "inserted-outside-list");
                this._updateCounterInfo();
                this._scrollPointIntoView();
                this._checkForMultipleLanguages();
            }
        }
    }
    _postChanged() {
        // Remove any manually inserted points when the list is updated
        this.points = undefined;
        this.upPoints = undefined;
        this.downPoints = undefined;
        this.latestPointCreatedAt = undefined;
        this.storedPoints = undefined;
        this._clearVideo();
        this._clearAudio();
        this.loadedPointIds = {};
        this.storedUpPointsCount = 0;
        this.storedDownPointsCount = 0;
        if (this.post) {
            if (this.post.Group &&
                this.post.Group.configuration &&
                this.post.Group.configuration?.disableDebate) {
                this.disableDebate = true;
            }
            else {
                this.disableDebate = false;
            }
            if (this.post &&
                this.post.Group &&
                this.post.Group.configuration &&
                this.post.Group.configuration?.alternativePointForLabel) {
                this.labelUp = this.post.Group.configuration?.alternativePointForLabel;
            }
            else {
                this.labelUp = this.t("point.for");
            }
            if (this.post &&
                this.post.Group &&
                this.post.Group.configuration &&
                this.post.Group.configuration?.alternativePointAgainstLabel) {
                this.labelDown =
                    this.post.Group.configuration?.alternativePointAgainstLabel;
            }
            else {
                this.labelDown = this.t("point.against");
            }
        }
        setTimeout(() => {
            this._updatePointLabels();
        });
        this._getPoints();
    }
    removeElementsByClass(rootElement, className) {
        const elements = rootElement.getElementsByClassName(className);
        if (elements) {
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }
    }
    _updatePointLabels() {
        setTimeout(() => {
            const forLabel = this.$$("#alternativePointForLabelId");
            const againstLabel = this.$$("#alternativePointAgainstLabelId");
            if (forLabel && forLabel.finalContent) {
                this.labelUp = forLabel.finalContent;
            }
            if (againstLabel && againstLabel.finalContent) {
                this.labelDown = againstLabel.finalContent;
            }
        });
    }
    _processStoredPoints() {
        console.info("_processStoredPoints");
        if (this.storedPoints && this.storedPoints.length > 0) {
            const upPoints = [];
            const downPoints = [];
            for (let i = 0; i < this.storedPoints.length; i++) {
                if (this.storedPoints[i].value > 0) {
                    upPoints.push(this.storedPoints[i]);
                }
                else if (this.storedPoints[i].value < 0) {
                    downPoints.push(this.storedPoints[i]);
                }
            }
            this.upPoints = upPoints;
            this.downPoints = downPoints;
        }
        else {
            this.upPoints = [];
            this.downPoints = [];
            this.points = [];
        }
        if (!this.wide && this.upPoints && this.downPoints) {
            this.points = this.interleaveArrays(this.upPoints, this.downPoints);
        }
        this._clearScrollTrigger();
    }
    _updatePointInLists(event) {
        const changedPoint = event.detail;
        this.upPoints?.forEach((point, index) => {
            if (point.id === changedPoint.id) {
                this.upPoints[index] = changedPoint;
            }
        });
        this.downPoints?.forEach((point, index) => {
            if (point.id === changedPoint.id) {
                this.downPoints[index] = changedPoint;
            }
        });
        if (this.points && this.points.length > 0) {
            this.points.forEach((point, index) => {
                if (point.id === changedPoint.id) {
                    this.points[index] = changedPoint;
                }
            });
        }
    }
    _checkForMultipleLanguages() {
        if (this.upPoints &&
            !localStorage.getItem("dontPromptForAutoTranslation") &&
            !sessionStorage.getItem("dontPromptForAutoTranslation")) {
            let firstLanguage;
            let multipleLanguages = false;
            this.upPoints.forEach(function (point) {
                if (point.language && !multipleLanguages) {
                    if (!firstLanguage && point.language !== "??") {
                        firstLanguage = point.language;
                    }
                    else if (firstLanguage &&
                        firstLanguage !== point.language &&
                        point.language !== "??") {
                        multipleLanguages = true;
                        console.info("Multiple point languages: " +
                            firstLanguage +
                            " and " +
                            point.language);
                    }
                }
            });
            if (!multipleLanguages && this.downPoints) {
                this.downPoints.forEach(function (point) {
                    if (point.language && !multipleLanguages) {
                        if (!firstLanguage && point.language !== "??") {
                            firstLanguage = point.language;
                        }
                        else if (firstLanguage &&
                            firstLanguage != point.language &&
                            point.language !== "??") {
                            multipleLanguages = true;
                            console.info("Multiple point languages: " +
                                firstLanguage +
                                " and " +
                                point.language);
                        }
                    }
                });
            }
            if (multipleLanguages) {
                /*window.appDialogs.getDialogAsync(
                  'autoTranslateDialog',
                  (dialog: any  YpAutoTranslateDialog) => {
                    dialog.openLaterIfAutoTranslationEnabled();
                  }
                );*/
            }
        }
    }
    interleaveArrays(arrayA, arrayB) {
        const arrs = [arrayA, arrayB];
        // eslint-disable-next-line prefer-spread
        const maxLength = Math.max.apply(Math, arrs.map((arr) => {
            return arr.length;
        }));
        const result = [];
        for (let i = 0; i < maxLength; ++i) {
            arrs.forEach(function (arr) {
                if (arr.length > i) {
                    result.push(arr[i]);
                }
            });
        }
        if (result.length > 0 &&
            (result.length === this.totalCount ||
                (this.points && this.points.length + result.length === this.totalCount))) {
            result[result.length - 1].isLastPointInList = true;
        }
        return result;
    }
    _scrollPointIntoView() {
        if (this.scrollToId) {
            setTimeout(() => {
                let hasFoundIt = false;
                if (!this.wide && this.points) {
                    this.points.forEach((point) => {
                        if (!hasFoundIt && point.id == this.scrollToId) {
                            //TODO: Fix below
                            //this.$$('#listMobile').scrollToItem(point);
                            hasFoundIt = true;
                        }
                    });
                }
                else if (this.upPoints && this.downPoints) {
                    this.upPoints.forEach((point) => {
                        if (!hasFoundIt && point.id == this.scrollToId) {
                            //TODO: Make this work
                            //this.$$('#listUp').scrollToItem(point);
                            hasFoundIt = true;
                        }
                    });
                    if (!hasFoundIt) {
                        this.downPoints.forEach((point) => {
                            if (!hasFoundIt && point.id == this.scrollToId) {
                                //TODO: Make this work
                                //this.$$('#listDown').scrollToItem(point);
                                hasFoundIt = true;
                            }
                        });
                    }
                }
                if (hasFoundIt) {
                    setTimeout(() => {
                        // Change elevation
                        //TODO: Get to work again, use a method to change the shadow-xp class
                        /*const point = this.$$('#point' + this.scrollToId);
                        if (point) {
                          point.elevation = 5;
                          point.elevation = 1;
                          point.elevation = 5;
                          setTimeout(() => {
                            point.elevation = 1;
                          }, 7000);
                        } else {
                          console.warn("Can't find point to elevate");
                        }*/
                        this.scrollToId = undefined;
                    }, 50);
                }
            }, 20);
        }
    }
    _preProcessPoints(points) {
        for (let i = 0; i < points.length; i++) {
            if (!this.latestPointCreatedAt ||
                !this.latestPointCreatedAt ||
                points[i].created_at > this.latestPointCreatedAt) {
                this.latestPointCreatedAt = points[i].created_at;
            }
            if (points &&
                points.length > 0 &&
                points[i].PointRevisions &&
                points[i].PointRevisions.length > 0 &&
                points[i].PointRevisions[points[i].PointRevisions.length - 1] &&
                points[i].PointRevisions[points[i].PointRevisions.length - 1]
                    .content) {
                points[i].latestContent =
                    points[i].PointRevisions[points[i].PointRevisions.length - 1].content;
            }
            else {
                console.warn("No content for point in _preProcessPoints");
            }
        }
        return points;
    }
    _updateCounterInfo() {
        if (this.wide && this.upPoints) {
            this.fire("yp-debate-info", {
                count: this.totalCount,
                firstPoint: this.upPoints[0],
            });
        }
        else if (this.points) {
            this.fire("yp-debate-info", {
                count: this.totalCount,
                firstPoint: this.points[0],
            });
        }
    }
    async _insertNewPoint(point) {
        if (!this.loadedPointIds[point.id]) {
            this.loadedPointIds[point.id] = true;
            if (this.wide) {
                if (point.value > 0) {
                    this.upPoints?.unshift(point);
                }
                else if (point.value < 0) {
                    this.downPoints?.unshift(point);
                }
            }
            else {
                this.points?.unshift(point);
            }
            this.requestUpdate();
            await this.updateComplete;
            this.scrollToId = point.id;
            this._scrollPointIntoView();
            setTimeout(() => {
                this._listResize();
            }, 10);
            this.storedPoints?.unshift(point);
        }
    }
    _addMorePoint(point) {
        let haveAddedPoints = false;
        if (!this.loadedPointIds[point.id]) {
            this.loadedPointIds[point.id] = true;
            haveAddedPoints = true;
            if (this.wide) {
                if (point.value > 0) {
                    this.upPoints?.push(point);
                }
                else if (point.value < 0) {
                    this.downPoints?.push(point);
                }
            }
            else {
                this.points?.push(point);
            }
            this.storedPoints?.push(point);
            if (point.value > 0) {
                this.storedUpPointsCount += 1;
            }
            else if (point.value < 0) {
                this.storedDownPointsCount += 1;
            }
        }
        return haveAddedPoints;
    }
    _completeNewPointResponse(point) {
        this.addPointDisabled = false;
        point = this._preProcessPoints([point])[0];
        if (this.currentVideoId) {
            point.checkTranscriptFor = "video";
        }
        else if (this.currentAudioId) {
            point.checkTranscriptFor = "audio";
        }
        if (point.value > 0) {
            this.newPointTextCombined =
                this.t("point.forAdded") +
                    " " +
                    YpFormattingHelpers.truncate(point.content, 21);
            this._clearTextValueUp();
        }
        else {
            this.newPointTextCombined =
                this.t("point.againstAdded") +
                    " " +
                    YpFormattingHelpers.truncate(point.content, 21);
            this._clearTextValueDown();
        }
        this._clearTextValueMobileUpOrDown();
        this._insertNewPoint(point);
        this.post.counter_points = this.post.counter_points + 1;
        //TODO: Get working with a global dialog with  this.newPointTextCombined
        //this.$$('#newPointToast').show();
        this._updateCounterInfo();
        if (point.value > 0) {
            window.appGlobals.activity("completed", "newPointFor");
        }
        else {
            window.appGlobals.activity("completed", "newPointAgainst");
        }
        this._clearVideo();
        this._clearAudio();
    }
    addPointUp() {
        this.addPoint(this.textValueUp, 1, this.uploadedVideoUpId, this.uploadedAudioUpId);
        window.appGlobals.activity("add", "pointUp");
    }
    addPointDown() {
        this.addPoint(this.textValueDown, -1, this.uploadedVideoDownId, this.uploadedAudioDownId);
        window.appGlobals.activity("add", "pointDown");
    }
    addMobilePointUpOrDown() {
        if (this.pointUpOrDownSelected == "pointFor") {
            this.addPoint(this.textValueMobileUpOrDown, 1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
            window.appGlobals.activity("add", "pointUp");
        }
        else if (this.pointUpOrDownSelected == "pointAgainst") {
            this.addPoint(this.textValueMobileUpOrDown, -1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
            window.appGlobals.activity("add", "pointDown");
        }
    }
    async addPoint(content, value, videoId, audioId) {
        if (window.appUser.loggedIn() === true) {
            if (videoId)
                this.currentVideoId = videoId;
            else if (audioId)
                this.currentAudioId = audioId;
            this.addPointDisabled = true;
            let point;
            try {
                point = await window.serverApi.addPoint(this.post.group_id, {
                    postId: this.post.id,
                    content: content,
                    value: value,
                });
            }
            catch (error) {
                if (error.offlineSendLater) {
                    this.addPointDisabled = false;
                    this._clearTextValueDown();
                    this._clearTextValueUp();
                    this._clearTextValueMobileUpOrDown();
                }
                else {
                    console.error(error);
                }
            }
            point = this._preProcessPoints([point])[0];
            if (this.currentVideoId) {
                await window.serverApi.completeMediaPoint("videos", point.id, {
                    videoId: this.currentVideoId,
                    appLanguage: this.language,
                });
                window.appGlobals.showSpeechToTextInfoIfNeeded();
            }
            else if (this.currentAudioId) {
                await window.serverApi.completeMediaPoint("audios", point.id, {
                    videoId: this.currentAudioId,
                    appLanguage: this.language,
                });
                window.appGlobals.showSpeechToTextInfoIfNeeded();
            }
            this._completeNewPointResponse(point);
            this.requestUpdate();
        }
        else {
            window.appUser.loginForNewPoint(this, { content: content, value: value });
        }
    }
    focusUpPoint() {
        window.appGlobals.activity("focus", "pointUp");
    }
    focusDownPoint() {
        window.appGlobals.activity("focus", "pointDown");
    }
    focusMobilePoint() {
        window.appGlobals.activity("focus", "mobilePoint");
    }
    focusOutlinedTextField(event) {
        if (window.innerWidth > 500) {
            //TODO: Get working again
            //event.currentTarget.parentElement.elevation = 2;
        }
    }
    blurOutlinedTextField(event) {
        //TODO: Get working again
        //event.currentTarget.parentElement.elevation = 1;
    }
    _hasCurrentUpVideo() {
        if (this.hasCurrentUpVideo) {
            this.hideUpAudio = true;
            this.hideUpText = true;
        }
        else {
            this.hideUpAudio = false;
            this.hideUpText = false;
        }
    }
    _hasCurrentDownVideo() {
        if (this.hasCurrentDownVideo) {
            this.hideDownAudio = true;
            this.hideDownText = true;
        }
        else {
            this.hideDownAudio = false;
            this.hideDownText = false;
        }
    }
    _hasCurrentUpAudio() {
        if (this.hasCurrentUpAudio) {
            this.hideUpVideo = true;
            this.hideUpText = true;
        }
        else {
            this.hideUpVideo = false;
            this.hideUpText = false;
        }
    }
    _hasCurrentDownAudio() {
        if (this.hasCurrentDownAudio) {
            this.hideDownVideo = true;
            this.hideDownText = true;
        }
        else {
            this.hideDownVideo = false;
            this.hideDownText = false;
        }
    }
    _hasCurrentMobileVideo() {
        if (this.hasCurrentMobileVideo) {
            this.hideMobileAudio = true;
            this.hideMobileText = true;
        }
        else {
            this.hideMobileAudio = false;
            this.hideMobileText = false;
        }
    }
    _hasCurrentMobileAudio() {
        if (this.hasCurrentMobileAudio) {
            this.hideMobileVideo = true;
            this.hideMobileText = true;
        }
        else {
            this.hideMobileVideo = false;
            this.hideMobileText = false;
        }
    }
    get ifLengthUpIsRight() {
        return this.ifLengthIsRight("up", this.textValueUp, this.uploadedVideoUpId, this.uploadedAudioUpId);
    }
    get ifLengthDownIsRight() {
        return this.ifLengthIsRight("down", this.textValueDown, this.uploadedVideoDownId, this.uploadedAudioDownId);
    }
    get ifLengthMobileIsRight() {
        return this.ifLengthIsRight("mobile", this.textValueMobileUpOrDown, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
    }
    ifLengthIsRight(type, textValue, hasVideoId, hasAudioId) {
        if (hasVideoId != undefined) {
            if (type === "up") {
                this.hideUpVideo = false;
                this.hideUpAudio = true;
                this.hideUpText = true;
            }
            if (type === "down") {
                this.hideDownVideo = false;
                this.hideDownAudio = true;
                this.hideDownText = true;
            }
            if (type === "mobile") {
                this.hideMobileVideo = false;
                this.hideMobileAudio = true;
                this.hideMobileText = true;
            }
            return true;
        }
        else if (hasAudioId != undefined) {
            if (type === "up") {
                this.hideUpAudio = false;
                this.hideUpVideo = true;
                this.hideUpText = true;
            }
            if (type === "down") {
                this.hideDownAudio = false;
                this.hideDownVideo = true;
                this.hideDownText = true;
            }
            if (type === "mobile") {
                this.hideMobileAudio = false;
                this.hideMobileVideo = true;
                this.hideMobileText = true;
            }
            return true;
        }
        else if (textValue && textValue.length === 0) {
            if (type === "up") {
                this.hideUpVideo = false;
                this.hideUpAudio = false;
                this.hideUpText = false;
            }
            if (type === "down") {
                this.hideDownVideo = false;
                this.hideDownAudio = false;
                this.hideDownText = false;
            }
            if (type === "mobile") {
                this.hideMobileVideo = false;
                this.hideMobileAudio = false;
                this.hideMobileText = false;
            }
            return false;
        }
        else if (textValue != null &&
            textValue.length > 0 &&
            textValue.trim().length > 0) {
            if (type === "up") {
                this.hideUpVideo = true;
                this.hideUpAudio = true;
                this.hideUpText = false;
            }
            if (type === "down") {
                this.hideDownVideo = true;
                this.hideDownAudio = true;
                this.hideDownText = false;
            }
            if (type === "mobile") {
                this.hideMobileVideo = true;
                this.hideMobileAudio = true;
                this.hideMobileText = false;
            }
            return true;
        }
        else if (textValue != null &&
            textValue.length > 1 &&
            textValue.trim().length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "fetchActive", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "isAdmin", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "disableDebate", void 0);
__decorate([
    property({ type: Array })
], YpPostPoints.prototype, "points", void 0);
__decorate([
    property({ type: Array })
], YpPostPoints.prototype, "downPoints", void 0);
__decorate([
    property({ type: Array })
], YpPostPoints.prototype, "upPoints", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "newPointTextCombined", void 0);
__decorate([
    property({ type: Object })
], YpPostPoints.prototype, "post", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "labelMobileUpOrDown", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "labelUp", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "labelDown", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "pointUpOrDownSelected", void 0);
__decorate([
    property({ type: Object })
], YpPostPoints.prototype, "latestPointCreatedAt", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "scrollToId", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "addPointDisabled", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedVideoUpId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedVideoDownId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedVideoMobileId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "currentVideoId", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideUpVideo", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideDownVideo", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideMobileVideo", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedAudioUpId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedAudioDownId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "uploadedAudioMobileId", void 0);
__decorate([
    property({ type: Number })
], YpPostPoints.prototype, "currentAudioId", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideUpAudio", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideDownAudio", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideMobileAudio", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideUpText", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideDownText", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "hideMobileText", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "selectedPointForMobile", void 0);
__decorate([
    property({ type: Boolean })
], YpPostPoints.prototype, "isAndroid", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentUpVideo", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentDownVideo", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentMobileVideo", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentUpAudio", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentDownAudio", void 0);
__decorate([
    property({ type: String })
], YpPostPoints.prototype, "hasCurrentMobileAudio", void 0);
__decorate([
    property({ type: Array })
], YpPostPoints.prototype, "storedPoints", void 0);
YpPostPoints = __decorate([
    customElement("yp-post-points")
], YpPostPoints);
export { YpPostPoints };
//# sourceMappingURL=yp-post-points.js.map