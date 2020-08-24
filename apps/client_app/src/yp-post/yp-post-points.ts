/* eslint-disable @typescript-eslint/camelcase */
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from '../yp-collection/yp-collection.js';
import { customElement, html, property, LitElement, css } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';

import '@material/mwc-textarea';
import { Menu } from '@material/mwc-menu';

import '../yp-post/yp-posts-list.js';
import '../yp-post/yp-post-card-add.js';
import { YpPostsList } from '../yp-post/yp-posts-list.js';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpPostCard } from './yp-post-card.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpBaseElementWithLogin } from '../@yrpri/yp-base-element-with-login.js';
import { RangeChangeEvent } from 'lit-virtualizer';
import { YpMagicText } from '../yp-magic-text/yp-magic-text.js';

// TODO: Remove
interface AcActivity extends LitElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  loadNewData(): () => void;
}

@customElement('yp-post-points')
export class YpPostPoints extends YpBaseElementWithLogin {
  @property({ type: String })
  host: string | undefined;

  @property({ type: Boolean })
  ajaxActive = false;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  disableDebate = false;

  @property({ type: Array })
  points: Array<YpPointData> | undefined;

  @property({ type: Array })
  downPoints: Array<YpPointData> | undefined;

  @property({ type: Array })
  upPoints: Array<YpPointData> | undefined;

  @property({ type: String })
  textValueUp = '';

  @property({ type: String })
  textValueDown = '';

  @property({ type: String })
  newPointTextCombined: string | undefined;

  @property({ type: Object })
  post!: YpPostData;

  @property({ type: String })
  textValueMobileUpOrDown: string | undefined;

  @property({ type: String })
  labelMobileUpOrDown: string | undefined;

  @property({ type: String })
  labelUp: string | undefined;

  @property({ type: String })
  labelDown: string | undefined;

  @property({ type: String })
  pointUpOrDownSelected = 'pointFor';

  @property({ type: Number })
  latestPointCreatedAt: Date | undefined;

  @property({ type: Number })
  scrollToId: number | undefined;

  @property({ type: Boolean })
  addPointDisabled = false;

  @property({ type: Number })
  uploadedVideoUpId: number | undefined;

  @property({ type: Number })
  uploadedVideoDownId: number | undefined;

  @property({ type: Number })
  uploadedVideoMobileId: number | undefined;

  @property({ type: Number })
  currentVideoId: number | undefined;

  @property({ type: Boolean })
  hideUpVideo = false

  @property({ type: Boolean })
  hideDownVideo = false

  @property({ type: Boolean })
  hideMobileVideo = false

  @property({ type: Number })
  uploadedAudioUpId: number | undefined;

  @property({ type: Number })
  uploadedAudioDownId: number | undefined;

  @property({ type: Number })
  uploadedAudioMobileId: number | undefined;

  @property({ type: Number })
  currentAudioId: number | undefined;

  @property({ type: Boolean })
  hideUpAudio = false

  @property({ type: Boolean })
  hideDownAudio = false

  @property({ type: Boolean })
  hideMobileAudio = false

  @property({ type: Boolean })
  hideUpText = false

  @property({ type: Boolean })
  hideDownText = false

  @property({ type: Boolean })
  hideMobileText = false

  @property({ type: Boolean })
  selectedPointForMobile = false

  @property({ type: Boolean })
  isAndroid = false

  @property({ type: String })
  hasCurrentUpVideo: string | undefined;

  @property({ type: String })
  hasCurrentDownVideo: string | undefined;

  @property({ type: String })
  hasCurrentMobileVideo: string | undefined;

  @property({ type: String })
  hasCurrentUpAudio: string | undefined;

  @property({ type: String })
  hasCurrentDownAudio: string | undefined;

  @property({ type: String })
  hasCurrentMobileAudio: string | undefined;

  @property({ type: Array })
  storedPoints: Array<YpPointData> | undefined;

  loadedPointIds: Record<number, boolean> = {};

  loadMoreInProgress = false

  totalCount: number | undefined;

  storedUpPointsCount = 0;

  storedDownPointsCount = 0;

  noMorePoints = false

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('wide')) {
      this._updateEmojiBindings();
    }
    if (changedProperties.has('points')) {
      this._pointsChanged();
    }

    if (changedProperties.has('post')) {
      this._postChanged();
    }

    if (changedProperties.has('isAdmin')) {
      this._isAdminChanged();
    }

    if (changedProperties.has('pointUpOrDownSelected')) {
      this._pointUpOrDownSelectedChanged();
    }

    if (changedProperties.has('hasCurrentUpVideo')) {
      this._hasCurrentUpVideo();
    }


    if (changedProperties.has('hasCurrentDownVideo')) {
      this._hasCurrentDownVideo();
    }

    if (changedProperties.has('hasCurrentMobileVideo')) {
      this._hasCurrentMobileVideo();
    }
    if (changedProperties.has('hasCurrentUpAudio')) {
      this._hasCurrentUpAudio();
    }


    if (changedProperties.has('hasCurrentDownAudio')) {
      this._hasCurrentDownAudio();
    }

    if (changedProperties.has('hasCurrentMobileAudio')) {
      this._hasCurrentMobileAudio();
    }
  }

  static get styles() {
    return [
      css`
        super.styles,
        :host {
          display: block;
        }

        .item {
        }

        .main-container {
          background-color: var(--primary-background-color);
        }

        .point {
          padding-top: 32px;
          padding-bottom: 32px;
          padding-left: 24px;
          padding-right: 24px;
          width: 398px;
        }

        .pointInputMaterial {
          padding-top: 24px;
          padding-left: 16px;
          padding-right: 16px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          background-color: #fff;
        }

        paper-toast {
          z-index: 9999;
        }

        paper-material {
          background-color: #fff;
        }

        yp-point {
          padding-top: 8px;
        }

        .pointMaterial {
          padding-top: 8px;
          background-color: #fff;
          padding-left: 0;
          padding-right: 0;
          width: 430px;
          margin-bottom: 12px;
        }

        .thumbIcon {
          height: 64px;
          width: 64px;
          padding-bottom: 16px;
          color: var(--primary-color);
        }

        .editIcon {
          height: 28px;
          width: 28px;
          padding-bottom: 16px;
          color: var(--primary-color);
        }

        .addPointFab {
          width: 100%;
          color: #fff;
          margin-bottom: 18px;
        }

        paper-textarea {
          --paper-input-container-label: {
            font-size: 22px;
            height: 30px;
            overflow: visible;
            color: #aaaaaa;
          }
        }

        .howToWriteInfoText {
          padding-top: 4px;
          color: var(--primary-color);
        }

        .point .main-container .topContainer {
          background-color: var(--primary-background-color) !important;
        }

        .penContainer {
          margin-top: 42px;
        }

        .upOrDown {
          margin-top: 72px;
        }

        paper-radio-button {
          --paper-radio-button-checked-color: var(--accent-color) !important;
          font-size: 16px;
        }

        #pointUpOrDownMaterial {
          margin-top: 16px;
          width: 100%;
        }

        .mobileFab {
          margin-top: 8px;
        }

        mwc-button {
          color: #fff;
          background-color: var(--accent-color);
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

          #pointUpOrDownMaterial {
            margin-top: 16px;
          }

          .main-container {
            width: 100%;
          }

          iron-list {
            width: 100vw;
          }

          .pointMaterial {
          }
        }

        @media (max-width: 420px) {
          .pointInputMaterial {
            width: 90%;
            max-width: 90%;
          }
        }

        .mobilePaperTextArea {
          --paper-input-container-label: {
            font-size: 19px;
          }
        }

        .pointMainHeader {
          font-size: 26px;
          margin-bottom: 16px;
          color: #555;
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

        iron-list {
          height: 80vh;
        }

        iron-list {
          --iron-list-items-container: {
          }
        }

        :focus {
        }

        #ironListMobile[debate-disabled] {
          margin-top: 16px;
        }

        .mainSpinner {
          margin: 32px;
        }

        mwc-button[disabled] {
          background-color: #333;
          color: #fff;
        }

        .uploadNotLoggedIn {
          min-width: 100px;
          background-color: #fff;
          color: #000;
          margin-bottom: 24px;
        }

        .uploadNotLoggedIn > .icon {
          padding-right: 8px;
        }

        .pointButtons {
          margin-bottom: 4px;
        }

        .bottomDiv {
          margin-bottom: 64px;
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

        .pointMaterialMobile {
        }

        div[rtl] {
          direction: rtl;
        }

        paper-radio-button {
          --paper-radio-button-label: {
            padding-right: 6px;
          }
        }
      `,
    ];
  }

  renderPointList(
    type: string,
    header: string,
    alternativeHeader: string | undefined,
    label: string,
    headerTextType: string,
    hideVideo: boolean,
    hideText: boolean,
    hasCurrentVideo: string,
    videoUploadedFunc: Function,
    uploadVideoHeader: string,
    uploadedVideoId: number,
    pointKeyDownFunction: Function,
    hideAudio: boolean,
    hasCurrentAudio: string,
    uploadAudioPointHeader: string,
    ifLengthIsRight: boolean,
    addPointFunc: Function,
    points: Array<YpPointData>,
    mobile = false
  ) {
    return html`
      <div class="point">
        ${!alternativeHeader
          ? html`
              <div
                class="pointMainHeader layout horizontal center-center"
                role="heading"
                aria-level="2">
                > ${header}
              </div>
            `
          : html`
              <div class="pointMainHeader layout horizontal center-center">
                <yp-magic-text
                  .contentId="${this.post.Group.id}"
                  textOnly
                  .content="${alternativeHeader}"
                  .contentLanguage="${this.post.Group.language}"
                  role="heading"
                  aria-level="2"
                  class="ratingName"
                  textType="${headerTextType}">
                </yp-magic-text>
              </div>
            `}

        <div
          id="point${type}Material"
          class="pointInputMaterial
                    layout vertical
                  shadow-elevation-2dp shadow-transition"
          ?hidden="${this.post.Group.configuration.disableDebate}">
          <mwc-textarea
            id="${type}_point"
            @keydown="${pointKeyDownFunction}"
            @focus="${this.focusTextArea}"
            @blur="${this.blurTextArea}"
            .value="${this.textValueUp}"
            .label="${label}"
            charCounter
            rows="2"
            ?hidden="${hideText}"
            maxrows="3"
            .maxlength="${this.pointMaxLength}">
          </mwc-textarea>

          ${mobile
            ? html`
                <div class="layout vertical end-justified">
                  <div class="layout horizontal center-center pointButtons">
                    <paper-radio-group
                      id="upOrDown"
                      ?hidden="${this.post.Group.configuration
                        .hidePointAgainst}"
                      attributeForSelected="name"
                      class="layout horizontal"
                      .selected="${this.pointUpOrDownSelected}">
                      <paper-radio-button .name="pointFor"
                        >${this.t('pointForShort')}</paper-radio-button
                      >
                      <paper-radio-button .name="pointAgainst"
                        >${this.t('pointAgainstShort')}</paper-radio-button
                      >
                    </paper-radio-group>
                  </div>
                </div>
              `
            : nothing}

          <div
            class="horizontal end-justified layout"
            ?hidden="${this.post.Group.configuration.hideEmoji}">
            <emoji-selector
              id="pointUpEmojiSelector"
              ?hidden="${hideText}"></emoji-selector>
          </div>

          <div class="layout horizontal center-justified">
            ${this.post.Group.configuration.allowPointVideoUploads
              ? html`
                  <div ?hidden="${hideVideo}" class="uploadSection">
                    <div
                      class="layout vertical center-center self-start"
                      ?hidden="${!this.isLoggedIn}">
                      <yp-file-upload
                        id="videoFileUploadUp"
                        noDefaultCoverImage
                        .uploadLimitSeconds="${this.post.Group.configuration
                          .videoPointUploadLimitSec}"
                        .currentFile="${hasCurrentVideo}"
                        containerType="points"
                        .group="${this.post.Group}"
                        raised
                        video-upload
                        method="POST"
                        @success="${videoUploadedFunc}">
                        <iron-icon class="icon" icon="videocam"></iron-icon>
                        <span>${uploadVideoHeader}</span>
                      </yp-file-upload>
                    </div>
                    <div
                      class="videoUploadDisclamer"
                      ?hidden="${!this.post.Group.configuration
                        .showVideoUploadDisclaimer || !uploadedVideoId}">
                      ${this.t('videoUploadDisclaimer')}
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button
                        class="uploadNotLoggedIn"
                        icon="videocam"
                        raised
                        ?hidden="${this.isLoggedIn}"
                        @click="${this._openLogin}"
                        .label="${uploadVideoHeader}">
                        <iron-icon class="icon"></iron-icon>
                      </mwc-button>
                    </div>
                  </div>
                `
              : html``}
            ${this.post.Group.configuration.allowPointAudioUploads
              ? html`
                  <div ?hidden="${hideAudio}" class="uploadSection">
                    <div
                      class="layout vertical center-center"
                      ?hidden="${!this.isLoggedIn}">
                      <yp-file-upload
                        id="audioFileUploadUp"
                        current-file="${hasCurrentAudio}"
                        container-type="points"
                        .uploadlimitSeconds="${this.post.Group.configuration
                          .audioPointUploadLimitSec}"
                        .group="${this.post.Group}"
                        raised
                        audio-upload
                        method="POST"
                        @success="${this._audioUpUploaded}">
                        <mwc-icon class="icon">keyboard_voice</mwc-icon>
                        <span>${uploadAudioPointHeader}</span>
                      </yp-file-upload>
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button
                        class="uploadNotLoggedIn"
                        icon="keyboard_voice"
                        raised
                        ?hidden="${this.isLoggedIn}"
                        @click="${this._openLogin}"
                        .label="${uploadAudioPointHeader}">
                      </mwc-button>
                    </div>
                  </div>
                `
              : html``}
          </div>

          <div ?hidden="${ifLengthIsRight}">
            <div class="addPointFab layout horizontal center-center">
              <mwc-button
                raised
                class="submitButton"
                ?disabled="${this.addPointDisabled}"
                icon="add"
                @click="${addPointFunc}"
                .label="${this.t('postPoint')}"></mwc-button>
            </div>
          </div>
        </div>

        <lit-virtualizer
          id="list${type}"
          .items=${points}
          .scrollTarget="${window}"
          .renderItem=${this.renderPointItem}
          @rangechange=${this.scrollEvent}></lit-virtualizer>
      </div>
    `;
  }

  renderPointItem(point: YpPointData, index: number): TemplateResult {
    return html`<div
      class="item layout-horizontal"
      tabindex="${index}"
      role="listitem"
      aria-level="3">
      >
      <div id="point${point.id}" class="pointMaterial">
        <yp-point .point="${point}"></yp-point>
      </div>
    </div>`;
  }

  scrollEvent(event: RangeChangeEvent) {}

  render() {
    return html`
      <lite-signal
        @lite-signal-yp-update-points-for-post="${this
          ._loadNewPointsIfNeeded}"></lite-signal>
      <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>

      <iron-media-query
        query="(min-width: 985px)"
        query-matches="${this.wide}"></iron-media-query>

      <div class="layout horizontal center-center" ?hidden="${this.ajaxActive}">
        <yp-ajax
          id="ajax"
          .large-spinner=""
          .active="${this.ajaxActive}"
          @response="${this._response}"></yp-ajax>
      </div>

      <div class="layout horizontal center-center" hidden="">
        <yp-ajax
          id="moreAjax"
          hidden=""
          @response="${this._morePointsResponse}"></yp-ajax>
      </div>

      ${this.wideReady
        ? html`
            <div ?rtl="${this.rtl}" class="layout vertical topContainer">
              <div class="main-container layout horizontal">
                ${this.renderPointList(
                  'Up',
                  this.t('pointsFor'),
                  this.post.Group.configuration.alternativePointForHeader,
                  'alternativePointForHeader',
                  this.labelUp,
                  this.hideUpVideo,
                  this.hideUpText,
                  this.hasCurrentUpVideo,
                  this._videoUpUploaded,
                  this.t('uploadVideoPointFor'),
                  this.uploadedVideoUpId,
                  this.focusUpPoint,
                  this.hideUpAudio,
                  this._hasCurrentUpAudio,
                  this.t('uploadAudioPointFor'),
                  this.ifLengthUpIsRight,
                  this.addPointUp,
                  this.upPoints
                )}
                ${this.renderPointList(
                  'Down',
                  this.t('pointsAgainst'),
                  this.post.Group.configuration.alternativePointAgainstHeader,
                  'alternativePointAgainstHeader',
                  this.labelDown,
                  this.hideDownVideo,
                  this.hideDownText,
                  this.hasCurrentDownVideo,
                  this._videoDownUploaded,
                  this.t('uploadVideoPointAgainst'),
                  this.uploadedVideoDownId,
                  this.focusDownPoint,
                  this.hideDownAudio,
                  this._hasCurrentDownAudio,
                  this.t('uploadAudioPointAgainst'),
                  this.ifLengthDownIsRight,
                  this.addPointDown,
                  this.downPoints
                )}
              </div>
            </div>
          `
        : nothing}

      ${this.smallReady
        ? html`
            <div ?rtl="${this.rtl}" class="layout vertical center-center">
              ${this.renderPointList(
                'Mobile',
                this.t('pointsAgainst'),
                this.post.Group.configuration.alternativePointAgainstHeader,
                'alternativePointAgainstHeader',
                this.labelMobileUpOrDown,
                this.hideMobileVideo,
                this.hideMobileText,
                this.hasCurrentMobileVideo,
                this._videoMobileUploaded,
                this.t('uploadVideoPointAgainst'),
                this.uploadedVideoMobileId,
                this.focusMobilePoint,
                this.hideMobileAudio,
                this._hasCurrentMobileudio,
                this.t('uploadAudioPointAgainst'),
                this.ifLengthMobileIsRight,
                this.addPointMobile,
                this.points,
                true
              )}
            </div>
          `
        : nothing}

      <div class="layout vertical center-center">
        <yp-ajax
          id="newPointsAjax"
          @response="${this._newPointsResponse}"></yp-ajax>
        <yp-ajax
          id="newPointAjax"
          @error="${this._newPointError}"
          method="POST"
          url="/api/points"
          @response="${this._newPointResponse}"></yp-ajax>
      </div>

      <paper-toast
        id="newPointToast"
        .text="${this.newPointTextCombined}"></paper-toast>

      ${!this.post.Group.configuration.alternativePointForLabel
        ? html`
            <yp-magic-text
              id="alternativePointForLabelId"
              hidden
              contentId="${this.post.Group.id}"
              textOnly
              .content="${this.post.Group.configuration
                .alternativePointForLabel}"
              .contentLanguage="${this.post.Group.language}"
              @new-translation="${this._updatePointLabels}"
              role="heading"
              aria-level="2"
              textType="alternativePointForLabel">
            </yp-magic-text>
          `
        : nothing}
      ${!this.post.Group.configuration.alternativePointAgainstLabel
        ? html`
            <yp-magic-text
              id="alternativePointAgainstLabelId"
              hidden
              contentId="${this.post.Group.id}"
              textOnly
              .content="${this.post.Group.configuration
                .alternativePointAgainstLabel}"
              .contentLanguage="${this.post.Group.language}"
              @new-translation="${this._updatePointLabels}"
              role="heading"
              aria-level="2"
              textType="alternativePointAgainstLabel">
            </yp-magic-text>
          `
        : nothing}
    `;
  }

  /*
  behaviors: [
    ypTruncateBehavior,
    ypLoggedInUserBehavior
  ],
*/

  get wideReady() {
    return this.wide && this.post;
  }

  get smallReady() {
    return !this.wide && this.post;
  }

  get pointMaxLength() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.pointCharLimit
    ) {
      return this.post.Group.configuration.pointCharLimit;
    } else {
      return 500;
    }
  }

  _openLogin() {
    this.fire('yp-open-login');
  }

  _videoUpUploaded(event: CustomEvent) {
    this.uploadedVideoUpId = event.detail.videoId;
  }

  _videoDownUploaded(event: CustomEvent) {
    this.uploadedVideoDownId = event.detail.videoId;
  }

  _videoMobileUploaded(event: CustomEvent) {
    this.uploadedVideoMobileId = event.detail.videoId;
  }

  _audioUpUploaded(event: CustomEvent) {
    this.uploadedAudioUpId = event.detail.audioId;
  }

  _audioDownUploaded(event: CustomEvent) {
    this.uploadedAudioDownId = event.detail.audioId;
  }

  _audioMobileUploaded(event: CustomEvent) {
    this.uploadedAudioMobileId = event.detail.audioId;
  }

  get mobileScrollOffset() {
    if (!this.wide && this.post) {
      const element = this.$$('#ironListMobile');
      if (element) {
        let top = element.getBoundingClientRect().top;
        if (top <= 0) {
          top = 800;
        }
        return top;
      } else {
        console.warn("Can't find mobile list element, returning 800");
        return 800;
      }
    }
  }

  _newPointError() {
    this.addPointDisabled = false;
  }

  get ironListResizeScrollThreshold() {
    if (!this.wide) {
      return 300;
    } else {
      return 300;
    }
  }

  get ironListPaddingTop() {
    if (this.wide) {
      return 600;
    } else {
      return 500;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    if (isAndroid) {
      this.isAndroid = true;
    }
    window.addEventListener('resize', this._processStoredPoints.bind(this));
    this.addListener('yp-point-deleted', this._pointDeleted);
    this.addListener('yp-update-point-in-list', this._updatePointInLists);
    this.addListener('yp-iron-resize', this._ypIronResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-point-deleted', this._pointDeleted);
    this.removeListener('yp-update-point-in-list', this._updatePointInLists);
    this.removeListener('yp-iron-resize', this._ypIronResize);
    window.removeEventListener('resize', this._processStoredPoints);
  }

  /*
  observers: [
    '_setupPointTextStartState(pointUpOrDownSelected, post)'
  ],
*/
  _setupPointTextStartState(pointUpOrDownSelected, post) {
    if (post) {
      this._pointUpOrDownSelectedChanged(pointUpOrDownSelected);
    }
  }

  _ypIronResize() {
    if (this.$$('#ironListUp')) this.$$('#ironListUp').fire('iron-resize');
    if (this.$$('#ironListDown')) this.$$('#ironListDown').fire('iron-resize');
    if (this.$$('#ironListMobile'))
      this.$$('#ironListMobile').fire('iron-resize');
  }

  _loadNewPointsIfNeeded(event: CustomEvent) {
    if (this.post && this.post.id == event.detail.postId) {
      if (this.latestPointCreatedAt) {
        this.$$('#newPointsAjax').url =
          '/api/posts/' + this.post.id + '/newPoints';
        this.$$('#newPointsAjax').params = {
          latestPointCreatedAt: this.latestPointCreatedAt,
        };
        this.$$('#newPointsAjax').generateRequest();
      } else {
        console.error('Trying to send point without latestPointCreatedAt');
      }
    }
  }

  _loadMorePoints() {
    if (!this.loadMoreInProgress && !this.noMorePoints) {
      this.loadMoreInProgress = true;
      if (this.post && this.storedPoints && this.storedPoints.length > 0) {
        if (this.host) {
          this.$.moreAjax.url =
            this.host + '/api/posts/' + this.post.id + '/points';
        } else {
          this.$.moreAjax.url = '/api/posts/' + this.post.id + '/points';
        }
        this.$.moreAjax.params = {
          offsetUp: this.storedUpPointsCount ? this.storedUpPointsCount : 0,
          offsetDown: this.storedDownPointsCount
            ? this.storedDownPointsCount
            : 0,
        };
        this.$.moreAjax.generateRequest();
      } else {
        console.warn('Trying to load more points early');
        this.loadMoreInProgress = false;
      }
    }
  }

  _interleaveMorePoints(points: Array<YpPointData>) {
    const upPoints = [];
    const downPoints = [];

    for (let i = 0; i < points.length; i++) {
      if (points[i].value > 0) {
        upPoints.push(points[i]);
      } else if (points[i].value < 0) {
        downPoints.push(points[i]);
      }
    }

    return this.interleaveArrays(upPoints, downPoints);
  }

  _morePointsResponse(event: CustomEvent) {
    this.loadMoreInProgress = false;
    let points = this._preProcessPoints(event.detail.response.points);
    if (points.length === 0) {
      this.noMorePoints = true;
    }

    let haveAddedPoint = false;
    points = this._interleaveMorePoints(points);
    points.forEach(
     (point)  => {
        if (this._addMorePoint(point)) {
          haveAddedPoint = true;
        }
      }
    );
    this.async(function () {
      if (this.$$('#ironListUp')) this.$$('#ironListUp').fire('iron-resize');
      if (this.$$('#ironListDown'))
        this.$$('#ironListDown').fire('iron-resize');
      if (this.$$('#ironListMobile'))
        this.$$('#ironListMobile').fire('iron-resize');
    }, 5);

    if (haveAddedPoint) {
      this._clearScrollTrigger();
    }
  }

  _clearScrollTrigger() {
    if (this.$$('#ironScrollThesholdUp'))
      this.$$('#ironScrollThesholdUp').clearTriggers();
    if (this.$$('#ironScrollThesholdDown'))
      this.$$('#ironScrollThesholdDown').clearTriggers();
    if (this.$$('#ironScrollThesholdMobile'))
      this.$$('#ironScrollThesholdMobile').clearTriggers();
  }

  _newPointsResponse(event, detail) {
    const points = this._preProcessPoints(detail.response);
    points.forEach(
      function (point) {
        this._insertNewPoint(point);
      }.bind(this)
    );

    this._updateCounterInfo();
  }

  _pointDeleted() {
    this.$$('#ajax').generateRequest();
  }

  _pointsChanged(points) {
    if (points) {
      this._updateEmojiBindings();
    }
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      if (this.wide) {
        const upPoint = this.$$('#up_point');
        const downPoint = this.$$('#down_point');
        const upEmoji = this.$$('#pointUpEmojiSelector');
        const downEmoji = this.$$('#pointDownEmojiSelector');
        if (upPoint && downPoint && upEmoji && downEmoji) {
          upEmoji.inputTarget = upPoint;
          downEmoji.inputTarget = downPoint;
        } else {
          console.warn("Wide: Can't bind emojis :(");
        }
      } else {
        const upDownPoint = this.$$('#mobileUpOrDownPoint');
        const upDownEmoji = this.$$('#pointUpDownEmojiSelector');
        if (upDownPoint && upDownEmoji) {
          upDownEmoji.inputTarget = upDownPoint;
        } else {
          console.warn("Small: Can't bind emojis :(");
        }
      }
    }, 500);
  }

  _pointUpOrDownSelectedChanged(newValue) {
    if (newValue == 'pointFor') {
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointForLabel
      ) {
        this.labelMobileUpOrDown = this.post.Group.configuration.alternativePointForLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.for');
      }
      this.selectedPointForMobile = true;
    } else if (newValue == 'pointAgainst') {
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointAgainstLabel
      ) {
        this.labelMobileUpOrDown = this.post.Group.configuration.alternativePointAgainstLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.against');
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
    if (this.$$('#videoFileUploadUp')) (this.$$('#videoFileUploadUp') as YpFileUpload).clear();
    if (this.$$('#videoFileUploadDown'))
      (this.$$('#videoFileUploadDown') as YpFileUpload).clear();
    if (this.$$('#videoFileUploadMobile'))
      (this.$$('#videoFileUploadMobile') as YpFileUpload).clear();
  }

  _clearAudio() {
    this.uploadedAudioUpId = undefined;
    this.uploadedAudioDownId = undefined;
    this.uploadedAudioMobileId = undefined;
    this.currentAudioId = undefined;
    this.hideUpAudio = false;
    this.hideDownAudio = false;
    this.hideMobileAudio = false;
    if (this.$$('#audioFileUploadUp')) this.$$('#audioFileUploadUp').clear();
    if (this.$$('#audioFileUploadDown'))
      this.$$('#audioFileUploadDown').clear();
    if (this.$$('#audioFileUploadMobile'))
      this.$$('#audioFileUploadMobile').clear();
  }

  _isAdminChanged() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.disableDebate &&
      !this.isAdmin
    ) {
      this.disableDebate = true;
    } else {
      this.disableDebate = false;
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
      if (
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.disableDebate &&
        !this.isAdmin
      ) {
        this.disableDebate = true;
      } else {
        this.disableDebate = false;
      }

      if (this.host) {
        this.$.ajax.url = this.host + '/api/posts/' + this.post.id + '/points';
      } else {
        this.$.ajax.url = '/api/posts/' + this.post.id + '/points';
      }
      this.$.ajax.generateRequest();
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointForLabel
      ) {
        this.labelUp = this.post.Group.configuration.alternativePointForLabel;
      } else {
        this.labelUp = this.t('point.for');
      }
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointAgainstLabel
      ) {
        this.labelDown = this.post.Group.configuration.alternativePointAgainstLabel;
      } else {
        this.labelDown = this.t('point.against');
      }
    }

    setTimeout(() => {
      this._updatePointLabels();
    });
  }

  removeElementsByClass(rootElement: HTMLElement, className: string) {
    const elements = rootElement.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  _updatePointLabels() {
    setTimeout(() => {
      const forLabel = (this.$$('#alternativePointForLabelId') as YpMagicText);
      const againstLabel = (this.$$('#alternativePointAgainstLabelId') as YpMagicText);
      if (forLabel && forLabel.finalContent) {
        this.labelUp = forLabel.finalContent;
      }
      if (againstLabel && againstLabel.finalContent) {
        this.labelDown = againstLabel.finalContent;
      }
    });
  }

  _processStoredPoints() {
    console.info('_processStoredPoints');
    if (this.upPoints === null) {
      if (this.storedPoints && this.storedPoints.length > 0) {
        const upPoints = [];
        const downPoints = [];

        for (let i = 0; i < this.storedPoints.length; i++) {
          if (this.storedPoints[i].value > 0) {
            upPoints.push(this.storedPoints[i]);
          } else if (this.storedPoints[i].value < 0) {
            downPoints.push(this.storedPoints[i]);
          }
        }
        this.upPoints = upPoints;
        this.downPoints = downPoints;
      } else {
        this.upPoints = [];
        this.downPoints = [];
        this.points = [];
      }
    } else {
      console.log('Landscape points already setup');
    }

    if (!this.wide && !this.points) {
      this.points = this.interleaveArrays(this.upPoints, this.downPoints);
    }
    this._clearScrollTrigger();
  }

  _response(event: CustomEvent) {
    const detail = event.detail;
    this.storedPoints = this._preProcessPoints(detail.response.points);
    this.totalCount = detail.response.count;
    this.storedUpPointsCount = 0;
    this.storedDownPointsCount = 0;

    if (this.storedPoints) {
      for (let i = 0; i < this.storedPoints.length; i++) {
        if (this.storedPoints[i].value > 0) {
          this.storedUpPointsCount += 1;
        } else if (this.storedPoints[i].value < 0) {
          this.storedDownPointsCount += 1;
        }
        this.loadedPointIds[this.storedPoints[i].id] = true;
      }
      this._processStoredPoints();
      this.removeElementsByClass(this, 'inserted-outside-list');
      this._updateCounterInfo();
      this._scrollPointIntoView();
      this._checkForMultipleLanguages();
    }
  }

  _updatePointInLists(event: CustomEvent) {
    const changedPoint = event.detail as YpPointData;
    this.upPoints?.forEach(
      (point, index) => {
        if (point.id === changedPoint.id) {
          this.upPoints![index] = changedPoint;
        }
      }
    );

    this.downPoints?.forEach(
      (point, index) => {
        if (point.id === changedPoint.id) {
          this.downPoints![index] = changedPoint;
        }
      }
    );

    if (this.points && this.points.length > 0) {
      this.points.forEach(
         (point, index) => {
          if (point.id === changedPoint.id) {
            this.points![index] = changedPoint;
          }
        }
      );
    }
  }

  _checkForMultipleLanguages() {
    if (
      this.upPoints &&
      !localStorage.getItem('dontPromptForAutoTranslation') &&
      !sessionStorage.getItem('dontPromptForAutoTranslation')
    ) {
      let firstLanguage: string;
      let multipleLanguages = false;
      this.upPoints.forEach(function (point) {
        if (point.language && !multipleLanguages) {
          if (!firstLanguage && point.language !== '??') {
            firstLanguage = point.language;
          } else if (
            firstLanguage &&
            firstLanguage !== point.language &&
            point.language !== '??'
          ) {
            multipleLanguages = true;
            console.info(
              'Multiple point languages: ' +
                firstLanguage +
                ' and ' +
                point.language
            );
          }
        }
      });

      if (!multipleLanguages && this.downPoints) {
        this.downPoints.forEach(function (point) {
          if (point.language && !multipleLanguages) {
            if (!firstLanguage && point.language !== '??') {
              firstLanguage = point.language;
            } else if (
              firstLanguage &&
              firstLanguage != point.language &&
              point.language !== '??'
            ) {
              multipleLanguages = true;
              console.info(
                'Multiple point languages: ' +
                  firstLanguage +
                  ' and ' +
                  point.language
              );
            }
          }
        });
      }

      if (multipleLanguages) {
        dom(document)
          .querySelector('yp-app')
          .getDialogAsync(
            'autoTranslateDialog',
            function (dialog) {
              dialog.openLaterIfAutoTranslationEnabled();
            }.bind(this)
          );
      }
    }
  }

  interleaveArrays(arrayA, arrayB) {
    const arrs = [arrayA, arrayB];
    const maxLength = Math.max.apply(
      Math,
      arrs.map(function (arr) {
        return arr.length;
      })
    );

    const result = [];

    for (let i = 0; i < maxLength; ++i) {
      arrs.forEach(function (arr) {
        if (arr.length > i) {
          result.push(arr[i]);
        }
      });
    }

    return result;
  }

  _scrollPointIntoView() {
    if (this.scrollToId) {
      this.async(function () {
        let hasFoundIt = false;
        if (!this.wide) {
          this.points.forEach(
            function (point) {
              if (!hasFoundIt && point.id == this.scrollToId) {
                this.$$('#ironListMobile').scrollToItem(point);
                hasFoundIt = true;
              }
            }.bind(this)
          );
        } else {
          this.upPoints.forEach(
            function (point) {
              if (!hasFoundIt && point.id == this.scrollToId) {
                this.$$('#ironListUp').scrollToItem(point);
                hasFoundIt = true;
              }
            }.bind(this)
          );
          if (!hasFoundIt) {
            this.downPoints.forEach(
              function (point) {
                if (!hasFoundIt && point.id == this.scrollToId) {
                  this.$$('#ironListDown').scrollToItem(point);
                  hasFoundIt = true;
                }
              }.bind(this)
            );
          }
        }

        if (hasFoundIt) {
          this.async(function () {
            // Change elevation
            const point = this.$$('#point' + this.scrollToId);
            if (point) {
              point.elevation = 5;
              point.elevation = 1;
              point.elevation = 5;
              this.async(
                function () {
                  point.elevation = 1;
                }.bind(this),
                7000
              );
            } else {
              console.warn("Can't find point to elevate");
            }
            this.scrollToId = null;
          }, 50);
        }
      }, 20);
    }
  }

  _floatIfValueOrIE(value) {
    const ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  _preProcessPoints(points: Array<YpPointData>): Array<YpPointData> {
    for (let i = 0; i < points.length; i++) {
      if (
        !this.latestPointCreatedAt ||
        !this.latestPointCreatedAt ||
        points[i].created_at > this.latestPointCreatedAt
      ) {
        this.latestPointCreatedAt = points[i].created_at;
      }
      if (points[i].PointRevisions &&
        points[i].PointRevisions[points[i].PointRevisions.length - 1] &&
        points[i].PointRevisions[points[i].PointRevisions.length - 1].content
      ) {
        points[i].latestContent =
          points[i].PointRevisions[points[i].PointRevisions.length - 1].content;
      } else {
        console.warn('No content for point in _preProcessPoints');
      }
    }
    return points;
  }

  _updateCounterInfo() {
    if (this.wide) {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.upPoints[0],
      });
    } else {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.points[0],
      });
    }
  }

  _insertNewPoint(point: YpPointData) {
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      if (this.wide) {
        if (point.value > 0) {
          this.upPoints?.unshift(point);
          setTimeout(() => {
            //this.$$('#ironListUp').fire('iron-resize');
          }, 700);
        } else if (point.value < 0) {
          this.downPoints?.unshift(point);
          setTimeout(() => {
           // this.$$('#ironListDown').fire('iron-resize');
          }, 700);
        }
      } else {
        this.points?.unshift(point);
        setTimeout(() => {
         // this.$$('#ironListMobile').fire('iron-resize');
        }, 700);
      }
      this.storedPoints?.unshift(point);
    }
  }

  _addMorePoint(point: YpPointData) {
    let haveAddedPoints = false;
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      haveAddedPoints = true;
      if (this.wide) {
        if (point.value > 0) {
          this.upPoints?.push(point);
        } else if (point.value < 0) {
          this.downPoints?.push(point);
        }
      } else {
        this.points?.push(point);
      }

      this.storedPoints?.push(point);

      if (point.value > 0) {
        this.storedUpPointsCount += 1;
      } else if (point.value < 0) {
        this.storedDownPointsCount += 1;
      }
    }

    return haveAddedPoints;
  }

  _newPointResponse(inEvent, inDetail) {
    if (this.currentVideoId) {
      const point = this._preProcessPoints([inDetail.response])[0];
      const ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/videos/' + point.id + '/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        videoId: this.currentVideoId,
        appLanguage: this.language,
      };
      ajax.addEventListener(
        'response',
        function (event, detail) {
          this._completeNewPointResponse(event, event.detail);
          window.appGlobals.showSpeechToTextInfoIfNeeded();
        }.bind(this)
      );
      ajax.generateRequest();
    } else if (this.currentAudioId) {
      const point = this._preProcessPoints([inDetail.response])[0];
      const ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/audios/' + point.id + '/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        audioId: this.currentAudioId,
        appLanguage: this.language,
      };
      ajax.addEventListener(
        'response',
        function (event, detail) {
          this._completeNewPointResponse(event, event.detail);
          window.appGlobals.showSpeechToTextInfoIfNeeded();
        }.bind(this)
      );
      ajax.generateRequest();
    } else {
      this._completeNewPointResponse(inEvent, inDetail);
    }
  }

  _completeNewPointResponse(event, detail) {
    this.addPointDisabled = false;
    const point = this._preProcessPoints([detail.response])[0];
    if (this.currentVideoId) {
      point.checkTranscriptFor = 'video';
    } else if (this.currentAudioId) {
      point.checkTranscriptFor = 'audio';
    }
    if (point.value > 0) {
      this.newPointTextCombined =
        this.t('point.forAdded') + ' ' + this.truncate(point.content, 21);
      this.textValueUp = '';
    } else {
      this.newPointTextCombined =
        this.t('point.againstAdded') + ' ' + this.truncate(point.content, 21);
      this.textValueDown = '';
    }
    this.textValueMobileUpOrDown = '';
    this._insertNewPoint(point);
    this.post.counter_points = this.post.counter_points + 1;
    this.$$('#newPointToast').show();
    this._updateCounterInfo();
    if (point.value > 0) {
      window.appGlobals.activity('completed', 'newPointFor');
    } else {
      window.appGlobals.activity('completed', 'newPointAgainst');
    }
    this._clearVideo();
    this._clearAudio();
  }

  addPointUp() {
    this.addPoint(
      this.textValueUp,
      1,
      this.uploadedVideoUpId,
      this.uploadedAudioUpId
    );
    window.appGlobals.activity('add', 'pointUp');
  }

  addPointDown() {
    this.addPoint(
      this.textValueDown,
      -1,
      this.uploadedVideoDownId,
      this.uploadedAudioDownId
    );
    window.appGlobals.activity('add', 'pointDown');
  }

  addMobilePointUpOrDown() {
    if (this.pointUpOrDownSelected == 'pointFor') {
      this.addPoint(
        this.textValueMobileUpOrDown,
        1,
        this.uploadedVideoMobileId,
        this.uploadedAudioMobileId
      );
      window.appGlobals.activity('add', 'pointUp');
    } else if (this.pointUpOrDownSelected == 'pointAgainst') {
      this.addPoint(
        this.textValueMobileUpOrDown,
        -1,
        this.uploadedVideoMobileId,
        this.uploadedAudioMobileId
      );
      window.appGlobals.activity('add', 'pointDown');
    }
  }

  addPoint(content, value, videoId, audioId) {
    if (window.appUser.loggedIn() === true) {
      this.$$('#newPointAjax').url = '/api/points/' + this.post.group_id;
      this.$$('#newPointAjax').body = {
        postId: this.post.id,
        content: content,
        value: value,
      };
      this.$$('#newPointAjax').generateRequest();
      this.addPointDisabled = true;
      if (videoId) this.currentVideoId = videoId;
      else if (audioId) this.currentAudioId = audioId;
    } else {
      window.appUser.loginForNewPoint(this, { content: content, value: value });
    }
  }

  focusUpPoint() {
    window.appGlobals.activity('focus', 'pointUp');
  }

  focusDownPoint() {
    window.appGlobals.activity('focus', 'pointDown');
  }

  focusTextArea(event: HTMLElement) {
    if (window.innerWidth > 500)
      event.currentTarget.parentElement.elevation = 2;
  }

  blurTextArea(event) {
    event.currentTarget.parentElement.elevation = 1;
  }

  _hasCurrentUpVideo() {
    if (this.hasCurrentUpVideo) {
      this.hideUpAudio = true;
      this.hideUpText = true;
    } else {
      this.hideUpAudio = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownVideo() {
    if (this.hasCurrentDownVideo) {
      this.hideDownAudio = true;
      this.hideDownText = true;
    } else {
      this.hideDownAudio = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentUpAudio() {
    if (this.hasCurrentUpAudio) {
      this.hideUpVideo = true;
      this.hideUpText = true;
    } else {
      this.hideUpVideo = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownAudio() {
    if (this.hasCurrentDownAudio) {
      this.hideDownVideo = true;
      this.hideDownText = true;
    } else {
      this.hideDownVideo = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentMobileVideo() {
    if (this.hasCurrentMobileVideo) {
      this.hideMobileAudio = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileAudio = false;
      this.hideMobileText = false;
    }
  }

  _hasCurrentMobileAudio(value) {
    if (this.hasCurrentMobileAudio) {
      this.hideMobileVideo = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileVideo = false;
      this.hideMobileText = false;
    }
  }

  get ifLengthUpIsRight() {
    return this.ifLengthIsRight(
      'up',
      this.textValueUp,
      this.uploadedVideoUpId,
      this.uploadedAudioUpId
    );
  }

  get ifLengthDownIsRight() {
    return this.ifLengthIsRight(
      'down',
      this.textValueDown,
      this.uploadedVideoDownId,
      this.uploadedAudioDownId
    );
  }

  get ifLengthMobileRight() {
    return this.ifLengthIsRight(
      'mobile',
      this.textValueMobileUpOrDown,
      this.uploadedVideoMobileId,
      this.uploadedAudioMobileId
    );
  }

  ifLengthIsRight(
    type: string,
    textValue: string,
    hasVideoId: number,
    hasAudioId: number
  ) {
    if (hasVideoId != null) {
      if (type === 'up') {
        this.hideUpVideo = false;
        this.hideUpAudio = true;
        this.hideUpText = true;
      }
      if (type === 'down') {
        this.hideDownVideo = false;
        this.hideDownAudio = true;
        this.hideDownText = true;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = false;
        this.hideMobileAudio = true;
        this.hideMobileText = true;
      }
      return true;
    } else if (hasAudioId != null) {
      if (type === 'up') {
        this.hideUpAudio = false;
        this.hideUpVideo = true;
        this.hideUpText = true;
      }
      if (type === 'down') {
        this.hideDownAudio = false;
        this.hideDownVideo = true;
        this.hideDownText = true;
      }
      if (type === 'mobile') {
        this.hideMobileAudio = false;
        this.hideMobileVideo = true;
        this.hideMobileText = true;
      }
      return true;
    } else if (textValue != null && textValue.length === 0) {
      if (type === 'up') {
        this.hideUpVideo = false;
        this.hideUpAudio = false;
        this.hideUpText = false;
      }
      if (type === 'down') {
        this.hideDownVideo = false;
        this.hideDownAudio = false;
        this.hideDownText = false;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = false;
        this.hideMobileAudio = false;
        this.hideMobileText = false;
      }
      return false;
    } else if (textValue != null && textValue.length > 0) {
      if (type === 'up') {
        this.hideUpVideo = true;
        this.hideUpAudio = true;
        this.hideUpText = false;
      }
      if (type === 'down') {
        this.hideDownVideo = true;
        this.hideDownAudio = true;
        this.hideDownText = false;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = true;
        this.hideMobileAudio = true;
        this.hideMobileText = false;
      }
      return true;
    } else if (textValue != null && textValue.length > 1) {
      return true;
    } else {
      return false;
    }
  }
}
