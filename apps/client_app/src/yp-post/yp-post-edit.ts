import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';

import '@material/mwc-circular-progress-four-color';
import { CircularProgressFourColorBase } from '@material/mwc-circular-progress-four-color/mwc-circular-progress-four-color-base';
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';

import { YpForm } from '../@yrpri/yp-form.js';
import { Snackbar } from '@material/mwc-snackbar';
import { YpEditBase } from '../@yrpri/yp-edit-base.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('yp-post-edit')
export class YpPostEdit extends YpEditBase {
  @property({ type: String })
  action = '/posts'

  static get prsasasoperties() {
    return {
      action: {
        type: String,
        value: '/api/posts',
      },

      newPost: {
        type: Boolean,
        value: false,
      },

      initialStructuredAnswersJson: {
        type: Array,
        value: null,
      },

      post: {
        type: Object,
        observer: '_postChanged',
      },

      group: {
        type: Object,
      },

      locationHidden: {
        type: Boolean,
        value: false,
        observer: '_locationHiddenChanged',
      },

      location: {
        type: Object,
        observer: '_locationChanged',
      },

      encodedLocation: {
        type: String,
        observer: '_encodedLocationChanged',
      },

      selectedCategoryArrayId: {
        type: Number,
        observer: '_selectedCategoryChanged',
      },

      selectedCategoryId: {
        type: Number,
      },

      emailValidationPattern: {
        type: String,
        value:
          '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
      },

      selectedCoverMediaType: {
        type: String,
        value: 'none',
        observer: '_coverMediaTypeValueChanged',
      },

      uploadedHeaderImageId: {
        type: String,
        observer: '_uploadedHeaderImageIdChanged',
      },

      uploadedVideoId: {
        type: String,
        value: null,
      },

      uploadedAudioId: {
        type: String,
        value: null,
      },

      currentVideoId: {
        type: String,
        value: null,
      },

      currentAudioId: {
        type: String,
        value: null,
      },

      showVideoCover: {
        type: Boolean,
        computed: '_showVideoCover(uploadedVideoId, currentVideoId)',
      },

      showAudioCover: {
        type: Boolean,
        computed: '_showAudioCover(uploadedAudioId, currentAudioId)',
      },

      newPointShown: {
        type: Boolean,
        computed: '_newPointShown(newPost, group)',
      },

      mediaHidden: {
        type: Boolean,
        computed: '_mediaHidden(newPost, group)',
      },

      selected: {
        type: Number,
        value: 0,
        observer: '_selectedChanged',
      },

      mapActive: {
        type: Boolean,
        value: false,
      },

      postDescriptionLimit: {
        type: Number,
        value: null,
      },

      structuredQuestions: {
        type: Array,
        computed: '_structuredQuestions(post, group)',
      },

      hasStructuredQuestions: {
        type: Boolean,
        computed: '_hasStructuredQuestions(structuredQuestions)',
      },

      replacedName: {
        type: String,
        computed: '_replacedName(post, group, newPost)',
      },

      sructuredAnswers: {
        type: String,
        value: null,
      },

      sructuredAnswersJson: {
        type: Object,
        value: null,
      },

      uploadedDocumentUrl: String,
      uploadedDocumentFilename: String,

      pointMaxLength: {
        type: Number,
        computed: '_pointMaxLength(group)',
      },

      hasOnlyOneTab: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        .access {
        }

        mwc-button {
          background-color: var(--accent-color);
          color: #fff;
        }

        yp-file-upload {
          margin-top: 16px;
        }

        .accessHeader {
          color: var(--primary-color, #777);
          font-weight: normal;
          margin-bottom: 0;
        }

        paper-radio-button {
          display: block;
        }

        .container {
          width: 100%;
          width: 100%;
        }

        yp-post-location {
          min-height: 320px;
        }

        @media (max-width: 600px) {
          .container {
            padding-right: 16px;
          }

          .subContainer {
          }

          paper-tab {
            font-size: 12px;
          }
        }

        yp-post-location {
        }

        section {
          margin-top: 32px;
        }

        .imageSizeInfo {
          font-size: 12px;
          padding-bottom: 16px;
          color: #444;
        }

        paper-dropdown-menu {
          max-width: 250px;
        }

        .optional {
          font-size: 12px;
        }

        .icon {
          padding-right: 8px;
        }

        [hidden] {
          display: none !important;
        }

        paper-checkbox {
          margin-left: 8px;
          margin-top: 4px;
        }

        section {
          width: 100%;
        }

        .contactInfo {
          margin-top: 16px;
        }

        #description {
          --paper-input-container-input: {
            max-height: 125px;
          }
        }

        .postEmoji {
          margin-left: 16px;
          direction: ltr !important;
        }

        .pointEmoji {
          direction: ltr !important;
        }

        .uploadSection {
          max-width: 220px;
          vertical-align: top;
          margin-left: 8px;
          margin-right: 8px;
        }

        @media (max-width: 600px) {
          .uploadSection {
            max-width: 100%;
          }

          .videoCam {
            --iron-icon-height: 15px;
            --iron-icon-width: 15px;
            --iron-icon-fill-color: #555;
          }

          yp-structured-question-edit {
            max-width: calc(100vw - 64px);
          }
        }

        .postCoverVideoInfo {
          margin-top: 8px;
        }

        .videoUploadDisclamer {
          margin-top: 6px;
          font-size: 12px;
          padding: 0;
          max-width: 200px;
        }

        .categoryDropDown {
          margin-bottom: 8px;
        }

        .topNewPostContainer[no-title] {
          margin-top: -42px;
        }

        paper-tabs[title-disabled] {
          margin-bottom: 24px;
        }

        .videoCamIcon {
          margin-left: 6px;
          margin-bottom: 2px;
        }

        .mediaTab {
          vertical-align: center;
        }
      `
    ];
  }

  render() {
    return html`
      <yp-edit-dialog
        .name="postEdit"
        double-width
        id="editDialog"
        .icon="lightbulb-outline"
        .action="${this.action}"
        .use-next-tab-action="${this.newPost}"
        @next-tab-action="${this._nextTab}"
        .method="${this.method}"
        title="${this.editHeaderText}"
        .saveText="${this.saveText}"
        class="container"
        custom-submit
        .next-action-text="${this.t('next')}"
        .toastText="${this.toastText}"
        .params="${this.params}">
        <paper-tabs
          ?title-disabled="${this.group.configuration
            .hideNameInputAndReplaceWith}"
          .selected="${this.selected}"
          id="paperTabs"
          ?focused
          hidden="${this.hasOnlyOneTab}">
          <paper-tab><span>${this.t('post.yourPost')}</span></paper-tab>

          ${this.newPointShown
            ? html`
                <paper-tab>
                  <div class="layout vertical center-center">
                    <div>
                      ${this.t('post.yourPoint')}
                    </div>
                    <div
                      class="optional"
                      ?hidden="${!this.group.configuration.newPointOptional}">
                      ${this.t('optional')}
                    </div>
                  </div>
                </paper-tab>
              `
            : nothing}
          ${!this.locationHidden
            ? html` <paper-tab>${this.t('post.location')}</paper-tab> `
            : nothing}
          ${!this.mediaHidden
            ? html`
                <paper-tab>
                  <div>
                    ${this.t('media')}
                  </div>
                  <div class="videoCamIcon">
                    <iron-icon
                      class="videoCam"
                      icon="videocam"
                      style="color: #555"></iron-icon>
                  </div>
                </paper-tab>
              `
            : nothing}
        </paper-tabs>

        <div
          class="layout vertical wrap topNewPostContainer"
          ?no-title="${this.group.configuration.hideNameInputAndReplaceWith}">
          <iron-pages
            id="pages"
            class="layout horizontal"
            .selected="${this.selected}">
            <section>
              <div class="layout vertical flex">
                ${!this.group.configuration.hideNameInputAndReplaceWith
                  ? html`
                      <input
                        type="hidden"
                        name="name"
                        value="${this.replacedName}" />
                    `
                  : html`
                      <paper-input
                        id="name"
                        required
                        minlength="3"
                        name="name"
                        type="text"
                        .label="${this.t('title')}"
                        .value="${this.post.name}"
                        maxlength="60"
                        char-counter>
                      </paper-input>
                    `}
                ${this._showCategories(group)
                  ? html`
                      <paper-dropdown-menu
                        class="categoryDropDown"
                        .label="${this.t('category.select')}"
                        ?required="${this.group.configuration
                          .makeCategoryRequiredOnNewPost}">
                        <paper-listbox
                          slot="dropdown-content"
                          .selected="${this.selectedCategoryArrayId}">
                          ${this.group.Categories.map(
                            category => html`
                              <paper-item
                                .data-category-id="${this.category.id}"
                                >${this.category.name}</paper-item
                              >
                            `
                          )}
                        </paper-listbox>
                      </paper-dropdown-menu>
                      <input
                        .type="hidden"
                        .name="categoryId"
                        .value="${this.selectedCategoryId}" />
                    `
                  : nothing}
                ${this.postDescriptionLimit
                  ? html`
                      <mwc-textarea
                        id="description"
                        ?hidden="${this.hasStructuredQuestions}"
                        ?required="${!this.hasStructuredQuestions}"
                        minlength="3"
                        name="description"
                        .value="${this.post.description}"
                        ?always-float-label="${this._floatIfValueOrIE(
                          post.description
                        )}"
                        .label="${this.t('post.description')}"
                        aria-label="${this.t('post.description')}"
                        @value-changed="${this._resizeScrollerIfNeeded}"
                        char-counter
                        rows="2"
                        max-rows="5"
                        maxrows="5"
                        maxlength="${this.postDescriptionLimit}">
                      </mwc-textarea>

                      <div
                        class="horizontal end-justified layout postEmoji"
                        ?hidden="${this.group.configuration.hideEmoji}">
                        <emoji-selector
                          id="emojiSelectorDescription"
                          ?hidden="${this
                            .hasStructuredQuestions}"></emoji-selector>
                      </div>
                    `
                  : nothing}
                ${this.hasStructuredQuestions
                  ? html`
                      ${this.structuredQuestions.map(
                        question => html`
                          <yp-structured-question-edit
                            .index="${this.index}"
                            is-from-new-post
                            use-small-font
                            id="structuredQuestionContainer_${this.index}"
                            ?dontFocusFirstQuestion="${!this.group.configuration
                              .hideNameInputAndReplaceWith}"
                            @resize-scroller="${this._resizeScrollerIfNeeded}"
                            .structuredAnswers="${this
                              .initialStructuredAnswersJson}"
                            ?isLastRating="${this._isLastRating(this.index)}"
                            isFirstRating="${this._isFirstRating(this.index)}"
                            ?hideQuestionIndex="${this.group.configuration
                              .hideQuestionIndexOnNewPost}"
                            .question="${this.question}">
                          </yp-structured-question-edit>
                        `
                      )}
                    `
                  : nothing}
                ${this.group.configuration.attachmentsEnabled
                  ? html`
                      <yp-file-upload
                        id="attachmentFileUpload"
                        raised
                        .accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,image/*"
                        .target="/api/groups/${this.group.id}/upload_document"
                        .method="POST"
                        @success="${this._documentUploaded}">
                        <iron-icon class="icon" .icon="attach-file"></iron-icon>
                        <span>${this.t('uploadAttachment')}</span>
                      </yp-file-upload>

                      ${this.post.data.attachment.url
                        ? html`
                            <paper-checkbox .name="deleteAttachment"
                              >${this.t('deleteAttachment')}:
                              ${this.post.data.attachment
                                .filename}</paper-checkbox
                            >
                          `
                        : nothing}
                    `
                  : nothing}
                ${this.group.configuration.moreContactInformation
                  ? html`
                      <h2 class="contactInfo">
                        ${this.t('contactInformation')}
                      </h2>
                      <paper-input
                        id="contactName"
                        .name="contactName"
                        .type="text"
                        .label="${this.t('user.name')}"
                        .value="${this.post.data.contact.name}"
                        char-counter>
                      </paper-input>
                      <paper-input
                        id="contactEmail"
                        .name="contactEmail"
                        .type="text"
                        .label="${this.t('user.email')}"
                        .value="${this.post.data.contact.email}"
                        char-counter>
                      </paper-input>
                      <paper-input
                        id="contactTelephone"
                        .name="contacTelephone"
                        .type="text"
                        .label="${this.t('contactTelephone')}"
                        .value="${this.post.data.contact.telephone}"
                        .maxlength="20"
                        char-counter>
                      </paper-input>
                      <paper-input
                        id="contactAddress"
                        name="contactAddress"
                        type="text"
                        ?hidden="${!this.group.configuration
                          .moreContactInformationAddress}"
                        .label="${this.t('contactAddress')}"
                        .value="${this.post.data.contact.address}"
                        maxlength="300"
                        char-counter>
                      </paper-input>
                    `
                  : nothing}
              </div>
            </section>

            ${this.newPointShown
              ? html`
                  <section class="subContainer">
                    <mwc-textarea
                      id="pointFor"
                      ?required="${!this.group.configuration.newPointOptional}"
                      minlength="3"
                      name="pointFor"
                      .value="${live(this.post.pointFor)}"
                      ?always-float-label="${this._floatIfValueOrIE(
                        post.pointFor
                      )}"
                      .label="${this.t('point.for')}"
                      aria-label="${this.t('point.for')}"
                      char-counter
                      rows="2"
                      max-rows="5"
                      maxlength="${this._pointMaxLength(this.group)}">
                    </mwc-textarea>
                    <div
                      class="horizontal end-justified layout pointEmoji"
                      ?hidden="${this.group.configuration.hideEmoji}">
                      <emoji-selector
                        id="emojiSelectorPointFor"></emoji-selector>
                    </div>
                  </section>
                `
              : nothing}
            ${this.mapActive
              ? html`
                  <yp-post-location
                    .encodedLocation="${this.encodedLocation}"
                    .location="${this.location}"
                    .group="${this.group}"
                    .post="${this.post}"></yp-post-location>
                `
              : nothing}
            ${!this.locationHidden
              ? html`
                  <section>
                    ${this.mapActive
                      ? html`
                          <yp-post-location
                            .encodedLocation="${this.encodedLocation}"
                            .location="${this.location}"
                            .group="${this.group}"
                            .post="${this.post}"></yp-post-location>
                        `
                      : nothing}
                  </section>
                `
              : nothing}

            <section>
              <div class="layout vertical center-center">
                <div class="layout horizontal center-center wrap">
                  <div
                    class="layout vertical center-center self-start uploadSection"
                    ?hidden="${this.group.configuration.hidePostImageUploads}">
                    <yp-file-upload
                      id="imageFileUpload"
                      raised
                      .target="/api/images?itemType=post-header"
                      .method="POST"
                      @success="${this._imageUploaded}">
                      <iron-icon class="icon" icon="photo-camera"></iron-icon>
                      <span>${this.t('image.upload')}</span>
                    </yp-file-upload>
                    <div class="imageSizeInfo layout horizontal">
                      <div>864 x 486 (16/9 widescreen)</div>
                    </div>
                    <div>${this.t('post.cover.imageInfo')}</div>
                  </div>

                  ${this.group.configuration.allowPostVideoUploads
                    ? html`
                        <div
                          class="layout vertical center-center self-start uploadSection">
                          <yp-file-upload
                            id="videoFileUpload"
                            container-type="posts"
                            .group="${this.group}"
                            .raised="true"
                            .uploadLimitSeconds="${this.group.configuration
                              .videoPostUploadLimitSec}"
                            .multi="false"
                            .video-upload=""
                            .method="POST"
                            @success="${this._videoUploaded}">
                            <iron-icon class="icon" icon="videocam"></iron-icon>
                            <span>${this.t('uploadVideo')}</span>
                          </yp-file-upload>
                          <div
                            class="videoUploadDisclamer"
                            ?hidden="${!this.group.configuration
                              .showVideoUploadDisclaimer ||
                            !this.uploadedVideoId}">
                            ${this.t('videoUploadDisclaimer')}
                          </div>
                        </div>
                      `
                    : nothing}
                  ${this.group.configuration.allowPostAudioUploads
                    ? html`
                        <div
                          class="layout vertical center-center self-start uploadSection">
                          <yp-file-upload
                            id="audioFileUpload"
                            container-type="posts"
                            group="${this.group}"
                            raised="true"
                            upload-limit-seconds="${this.group.configuration
                              .audioPostUploadLimitSec}"
                            .multi="false"
                            .audio-upload=""
                            .method="POST"
                            @success="${this._audioUploaded}">
                            <iron-icon
                              class="icon"
                              .icon="keyboard-voice"></iron-icon>
                            <span>${this.t('uploadAudio')}</span>
                          </yp-file-upload>
                        </div>
                      `
                    : nothing}
                </div>
                <br />
                <h3 class="accessHeader">${this.t('post.cover.media')}</h3>
                <paper-radio-group
                  id="coverMediaType"
                  name="coverMediaType"
                  class="coverMediaType layout horizontal wrap"
                  .selected="${this.selectedCoverMediaType}">
                  <paper-radio-button .name="none"
                    >${this.t('post.cover.none')}</paper-radio-button
                  >
                  <paper-radio-button
                    .name="image"
                    ?hidden="${!this.uploadedHeaderImageId}"
                    >${this.t('post.cover.image')}</paper-radio-button
                  >
                  <paper-radio-button
                    .name="video"
                    ?hidden="${!this.showVideoCover}"
                    >${this.t('postCoverVideo')}</paper-radio-button
                  >
                  <paper-radio-button
                    .name="audio"
                    ?hidden="${!this.showAudioCover}"
                    >${this.t('postCoverAudio')}</paper-radio-button
                  >

                  ${this.location
                    ? html`
                        <paper-radio-button .name="map"
                          >${this.t('post.cover.map')}</paper-radio-button
                        >
                        <paper-radio-button .name="streetView"
                          >${this.t(
                            'post.cover.streetview'
                          )}</paper-radio-button
                        >
                      `
                    : nothing}
                </paper-radio-group>
              </div>
            </section>
          </iron-pages>
          <input
            type="hidden"
            name="location"
            .value="${this.encodedLocation}" />
          <input
            type="hidden"
            name="coverMediaType"
            .value="${this.selectedCoverMediaType}" />
          <input
            type="hidden"
            name="uploadedHeaderImageId"
            .value="${this.uploadedHeaderImageId}" />
          <input
            type="hidden"
            name="uploadedDocumentUrl"
            .value="${this.uploadedDocumentUrl}" />
          <input
            type="hidden"
            name="uploadedDocumentFilename"
            .value="${this.uploadedDocumentFilename}" />
          <input
            type="hidden"
            name="structuredAnswers"
            .value="${this.structuredAnswers}" />
          <input
            type="hidden"
            name="structuredAnswersJson"
            value="${this.structuredAnswersJson}" />
        </div>
      </yp-edit-dialog>

      ${this.group.configuration.alternativeTextForNewIdeaButtonHeader
        ? html`
            <yp-magic-text
              id="alternativeTextForNewIdeaButtonHeaderId"
              hidden
              .contentId="${this.group.id}"
              textOnly
              .content="${this.group.configuration
                .alternativeTextForNewIdeaButtonHeader}"
              .contentLanguage="${this.group.language}"
              @new-translation="${this
                ._alternativeTextForNewIdeaButtonHeaderTranslation}"
              text-type="alternativeTextForNewIdeaButtonHeader"></yp-magic-text>
          `
        : nothing}
      ${this.group.configuration.customThankYouTextNewPosts
        ? html`
            <yp-magic-text
              id="customThankYouTextNewPostsId"
              hidden
              .contentId="${this.group.id}"
              text-only
              .content="${this.group.configuration.customThankYouTextNewPosts}"
              .contentLanguage="${this.group.language}"
              text-type="customThankYouTextNewPosts"></yp-magic-text>
          `
        : nothing}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-debate-info', this._updateDebateInfo);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-debate-info', this._updateDebateInfo);
  }

  /*
  observers: [
    '_setupTranslation(language,t)'
  ],
*/

  _isLastRating(index) {
    return (
      this.structuredQuestions[index].subType === 'rating' &&
      index + 2 < this.structuredQuestions.length &&
      this.structuredQuestions[index + 1].subType !== 'rating'
    );
  }

  _isFirstRating(index) {
    return (
      this.structuredQuestions[index].subType === 'rating' &&
      this.structuredQuestions[index - 1] &&
      this.structuredQuestions[index - 1].subType !== 'rating'
    );
  }

  _openToId(event, detail) {
    this._skipToId(event, detail, true);
  }

  _goToNextIndex(event, detail) {
    var currentPos = this.liveQuestionIds.indexOf(detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      var item = this.$$(
        '#structuredQuestionContainer_' + this.liveQuestionIds[currentPos + 1]
      );
      item.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      item.focus();
    }
  }

  _hasStructuredQuestions(questions) {
    return questions != null;
  }

  _skipToId(event, detail, showItems) {
    var foundFirst = false;
    if (this.$$('#surveyContainer')) {
      var children = this.$$('#surveyContainer').children;
      for (var i = 0; i < children.length; i++) {
        var toId = detail.toId.replace(/]/g, '');
        var fromId = detail.fromId.replace(/]/g, '');
        if (
          children[i + 1] &&
          children[i + 1].question &&
          children[i + 1].question.uniqueId &&
          children[i + 1].question.uniqueId.substring(
            children[i + 1].question.uniqueId.length - 1
          ) === 'a'
        ) {
          children[i].question.uniqueId = children[
            i + 1
          ].question.uniqueId.substring(
            0,
            children[i + 1].question.uniqueId.length - 1
          );
        }
        if (
          children[i].question &&
          detail.fromId &&
          children[i].question.uniqueId === fromId
        ) {
          foundFirst = true;
        } else if (
          children[i].question &&
          detail.toId &&
          (children[i].question.uniqueId === toId ||
            children[i].question.uniqueId === toId + 'a')
        ) {
          break;
        } else {
          if (foundFirst) {
            if (showItems) {
              children[i].hidden = false;
            } else {
              children[i].hidden = true;
            }
          }
        }
      }
    } else {
      console.error('No survey container found');
    }
  }

  _replacedName(post, group) {
    if (post && group && group.configuration.hideNameInputAndReplaceWith) {
      let text = group.configuration.hideNameInputAndReplaceWith;
      text = text.replace(
        '<DATESECONDS>',
        moment(new Date()).format('DD/MM/YYYY hh:mm:ss')
      );
      text = text.replace(
        '<DATEMINUTES>',
        moment(new Date()).format('DD/MM/YYYY hh:mm')
      );
      text = text.replace('<DATE>', moment(new Date()).format('DD/MM/YYYY'));
      return text;
    } else {
      return null;
    }
  }

  _pointMaxLength(group) {
    if (group && group.configuration && group.configuration.pointCharLimit) {
      return group.configuration.pointCharLimit;
    } else {
      return 500;
    }
  }

  _floatIfValueOrIE(value) {
    const ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  _newPointShown(newPost, group) {
    let hideNewPoint = false;
    if (
      group &&
      group.configuration &&
      group.configuration.hideNewPointOnNewIdea === true
    ) {
      hideNewPoint = true;
    }

    return newPost && !hideNewPoint;
  }

  _customSubmit(value, valueB) {
    if (
      this.group.configuration &&
      this.group.configuration.structuredQuestionsJson
    ) {
      var answers = [];
      this.liveQuestionIds.forEach(
        function (liveIndex) {
          var questionElement = this.$$(
            '#structuredQuestionContainer_' + liveIndex
          );
          if (questionElement) {
            answers.push(questionElement.getAnswer());
          }
        }.bind(this)
      );
      this.structuredAnswersJson = JSON.stringify(answers);
      this.$.editDialog._reallySubmit();
    } else if (
      this.structuredQuestions &&
      this.structuredQuestions.length > 0
    ) {
      var description = '',
        answers = '';
      for (i = 0; i < this.structuredQuestions.length; i += 1) {
        description += this.structuredQuestions[i].question;
        if (
          this.structuredQuestions[i].question &&
          this.structuredQuestions[i].question[
            this.structuredQuestions[i].question.length - 1
          ] !== '?'
        )
          description += ':';
        description += '\n';
        description += this.structuredQuestions[i].value;
        answers += this.structuredQuestions[i].value;
        if (i !== this.structuredQuestions.length - 1) {
          answers += '%!#x';
          description += '\n\n';
        }
      }
      this.post.description = description;
      this.structuredAnswers = answers;
      this.$.editDialog._reallySubmit();
    } else {
      this.$.editDialog._reallySubmit();
    }
  }

  _resizeScrollerIfNeeded() {
    this.$$('#editDialog').scrollResize();
  }

  _structuredQuestions(post, group) {
    if (post && group && group.configuration.structuredQuestionsJson) {
      return group.configuration.structuredQuestionsJson;
    } else if (
      post &&
      group &&
      group.configuration.structuredQuestions &&
      group.configuration.structuredQuestions !== ''
    ) {
      var structuredQuestions = [];

      var questionComponents = group.configuration.structuredQuestions.split(
        ','
      );
      for (var i = 0; i < questionComponents.length; i += 2) {
        var question = questionComponents[i];
        var maxLength = questionComponents[i + 1];
        structuredQuestions.push({
          text: question,
          question: question,
          maxLength: maxLength,
          value: '',
        });
      }
      if (
        !this.newPost &&
        post.public_data.structuredAnswers &&
        post.public_data.structuredAnswers !== ''
      ) {
        var answers = post.public_data.structuredAnswers.split('%!#x');
        for (i = 0; i < answers.length; i += 1) {
          if (structuredQuestions[i]) structuredQuestions[i].value = answers[i];
        }
      }
      return structuredQuestions;
    } else {
      return null;
    }
  }

  _showVideoCover(uploaded, current) {
    return uploaded || current;
  }

  _showAudioCover(uploaded, current) {
    return uploaded || current;
  }

  _videoUploaded(event, detail) {
    this.uploadedVideoId = detail.videoId;
    this.selectedCoverMediaType = 'video';
    this.async(function () {
      this.fire('iron-resize');
    }, 50);
  }

  _audioUploaded(event, detail) {
    this.uploadedAudioId = detail.audioId;
    this.selectedCoverMediaType = 'audio';
    this.async(function () {
      this.fire('iron-resize');
    });
  }

  _documentUploaded(event, detail) {
    const document = JSON.parse(detail.xhr.response);
    this.uploadedDocumentUrl = document.url;
    this.uploadedDocumentFilename = document.filename;
  }

  customFormResponse() {
    document.dispatchEvent(
      new CustomEvent('lite-signal', {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-group-posts', data: { id: 4 } },
      })
    );
  }

  _updateEmojiBindings() {
    this.async(
      function () {
        const description = this.$$('#description');
        const emojiSelector = this.$$('#emojiSelectorDescription');
        if (description && emojiSelector) {
          emojiSelector.inputTarget = description;
        } else {
          console.warn("Post edit: Can't bind emojis :(");
        }
        const emojiSelectorPointFor = this.$$('#emojiSelectorPointFor');
        const pointFor = this.$$('#pointFor');
        if (emojiSelectorPointFor && pointFor) {
          emojiSelectorPointFor.inputTarget = pointFor;
        }
      }.bind(this),
      500
    );
  }

  _locationHiddenChanged(newValue) {
    this.async(function () {
      const pages = this.$$('#pages');
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      const paperTabs = this.$$('#paperTabs');
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
      }
      console.log('Location hidden changed');
    }, 10);
  }

  _formInvalid() {
    if (this.newPointShown && !this.$$('#pointFor').validate()) {
      this.selected = 1;
    } else {
      this.selected = 0;
    }
    if (this.$$('#name')) this.$$('#name').autoValidate = true;
    if (this.$$('#description')) this.$$('#description').autoValidate = true;
    if (this.newPointShown) {
      this.$$('#pointFor').autoValidate = true;
    }
  }

  _encodedLocationChanged(newValue) {}

  _locationChanged(newValue) {
    if (
      newValue &&
      (!this.selectedCoverMediaType ||
        this.selectedCoverMediaType == '' ||
        this.selectedCoverMediaType == 'none')
    ) {
      this.selectedCoverMediaType = 'map';
    }
  }

  _uploadedHeaderImageIdChanged(newValue) {
    if (newValue) {
      this.selectedCoverMediaType = 'image';
    }
  }

  _nextOnEnter(event) {
    if (event.keyCode === 13) {
      this._searchMap();
    }
  }

  _getTabLength() {
    let length = 4;

    if (!this.newPointShown) {
      length -= 1;
    }

    if (this.locationHidden) {
      length -= 1;
    }

    if (this.mediaHidden) {
      length -= 1;
    }

    return length;
  }

  _nextTab() {
    const length = this._getTabLength();

    if (this.selected < length) {
      this.selected = this.selected + 1;
    }
  }

  _selectedChanged(newValue) {
    this.async(function () {
      if (!this.locationHidden && newValue == (this.newPointShown ? 2 : 1)) {
        this.mapActive = true;
      } else {
        this.mapActive = false;
      }

      var finalTabNumber = this._getTabLength() - 1;

      if (finalTabNumber === 0) {
        this.hasOnlyOneTab = true;
      }

      if (newValue == finalTabNumber) {
        this.$$('#editDialog').useNextTabAction = false;
      } else {
        this.$$('#editDialog').useNextTabAction = true;
      }

      if (newValue == 0) {
        var nameElement = this.$$('#name');
        if (nameElement) {
          nameElement.focus();
        }
      }
      if (newValue == 1 && this.newPointShown) {
        var pointFor = this.$$('#pointFor');
        if (pointFor) {
          pointFor.focus();
        }
      }
      this.async(function () {
        this._resizeScrollerIfNeeded();
      }, 50);
    });
  }

  _selectedCategoryChanged(newCategoryArrayId, oldValue) {
    if (newCategoryArrayId != null && newCategoryArrayId != undefined)
      this.selectedCategoryId = this.group.Categories[newCategoryArrayId].id;
  }

  _showCategories(group) {
    if (group && group.Categories) {
      return group.Categories.length > 0;
    } else {
      return false;
    }
  }

  getPositionInArrayFromId(collection, id) {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].id == id) {
        return i;
      }
    }
    return null;
  }

  _postChanged(newPost, oldPost) {
    if (newPost) {
      if (newPost.location) {
        this.location = newPost.location;
        this.encodedLocation = JSON.stringify(this.location);
      }
      if (newPost.cover_media_type)
        this.selectedCoverMediaType = newPost.cover_media_type;
    }
    this._updateEmojiBindings();
  }

  _updateInitialCategory(group) {
    if (group && this.post && this.post.category_id) {
      this.selectedCategoryId = this.post.category_id;
      this.selectedCategoryArrayId = this.getPositionInArrayFromId(
        group.Categories,
        this.post.category_id
      );
    }
  }

  _imageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  _coverMediaTypeValueChanged(newValue, oldValue) {}

  _coverMediaTypeChanged(event, detail) {}

  _customRedirect(post) {
    if (post) {
      if (
        post.newEndorsement &&
        window.appUser &&
        window.appUser.endorsementPostsIndex
      ) {
        window.appUser.endorsementPostsIndex[post.id] = post.newEndorsement;
      }
      let ajax;
      if (this.uploadedVideoId) {
        this.post = post;
        ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/videos/' + this.post.id + '/completeAndAddToPost';
        ajax.method = 'PUT';
        ajax.body = {
          videoId: this.uploadedVideoId,
          appLanguage: this.language,
        };
        ajax.addEventListener(
          'response',
          function (event) {
            this._finishRedirect(post);
            this.async(function () {
              window.appGlobals.showSpeechToTextInfoIfNeeded();
            }, 20);
          }.bind(this)
        );
        ajax.generateRequest();
      } else if (this.uploadedAudioId && this.newPost) {
        this.post = post;
        ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/audios/' + this.post.id + '/completeAndAddToPost';
        ajax.method = 'PUT';
        ajax.body = {
          audioId: this.uploadedAudioId,
          appLanguage: this.language,
        };
        ajax.addEventListener(
          'response',
          function (event) {
            this._finishRedirect(post);
          }.bind(this)
        );
        this.async(function () {
          window.appGlobals.showSpeechToTextInfoIfNeeded();
        }, 20);
        ajax.generateRequest();
      } else {
        this._finishRedirect(post);
      }
    } else {
      console.warn('No post found on custom redirect');
    }
  }

  _finishRedirect(post) {
    this.fire('yp-reset-keep-open-for-page');
    window.appGlobals.activity('completed', 'newPost');

    var text = this.t('thankYouForYourSubmission');
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.customThankYouTextNewPosts &&
      this.$$('#customThankYouTextNewPostsId') &&
      this.$$('#customThankYouTextNewPostsId').content
    ) {
      if (this.$$('#customThankYouTextNewPostsId').finalContent) {
        text = this.$$('#customThankYouTextNewPostsId').finalContent;
      } else {
        text = this.$$('#customThankYouTextNewPostsId').content;
      }
    }

    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'masterToast',
        function (toast) {
          toast.text = text;
          toast.duration = 5000;
          toast.show();
        }.bind(this)
      );

    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.allPostsBlockedByDefault
    ) {
      // Nothing?
    } else {
      YpNavHelpers.redirectTo('/post/' + (post ? post.id : this.post.id));
    }
  }

  clear() {
    if (this.newPost) {
      this.post = { name: '', description: '', pointFor: '', categoryId: null };
      this.location = null;
      this.selectedCategoryArrayId = null;
      this.selectedCategoryId = null;
      this.selected = 0;
      this.uploadedHeaderImageId = null;
      this.uploadedVideoId = null;
      this.uploadedAudioId = null;
      this.currentVideoId = null;
      this.currentAudioId = null;
      this.selectedCoverMediaType = 'none';
      this.async(function () {
        this.fire('iron-resize');
      });
      if (this.$$('#imageFileUpload')) {
        this.$$('#imageFileUpload').clear();
      }
    }
  }

  setup(post, newNotEdit, refreshFunction, group) {
    this._setupGroup(group);
    if (post) {
      this.post = post;
      if (post.PostVideos && post.PostVideos.length > 0) {
        this.currentVideoId = post.PostVideos[0].id;
      }

      if (post.PostAudios && post.PostAudios.length > 0) {
        this.currentAudioId = post.PostAudios[0].id;
      }
    } else {
      this.post = null;
    }
    this._updateInitialCategory(group);
    this.newPost = newNotEdit;
    this.refreshFunction = refreshFunction;
    this.setupTranslation();
    this.clear();
  }

  _setupGroup(group) {
    if (group) {
      this.group = group;
      if (group.configuration) {
        if (group.configuration.locationHidden) {
          if (group.configuration.locationHidden == true) {
            this.locationHidden = true;
          } else {
            this.locationHidden = false;
          }
        } else {
          this.locationHidden = false;
        }
        if (group.configuration.postDescriptionLimit) {
          this.postDescriptionLimit = group.configuration.postDescriptionLimit;
        } else {
          this.postDescriptionLimit = 500;
        }

        if (group.configuration.structuredQuestionsJson) {
          this.async(function () {
            this.liveQuestionIds = [];
            this.uniqueIdsToElementIndexes = {};
            this.liveUniqueIds = [];

            group.configuration.structuredQuestionsJson.forEach(
              function (question, index) {
                if (
                  question.type.toLowerCase() === 'textfield' ||
                  question.type.toLowerCase() === 'textfieldlong' ||
                  question.type.toLowerCase() === 'textarea' ||
                  question.type.toLowerCase() === 'textarealong' ||
                  question.type.toLowerCase() === 'numberfield' ||
                  question.type.toLowerCase() === 'checkboxes' ||
                  question.type.toLowerCase() === 'radios' ||
                  question.type.toLowerCase() === 'dropdown'
                ) {
                  this.liveQuestionIds.push(index);
                  this.uniqueIdsToElementIndexes[question.uniqueId] = index;
                  this.liveUniqueIds.push(question.uniqueId);
                }
              }.bind(this)
            );
          });
        }
      } else {
        this.postDescriptionLimit = 500;
      }

      this.async(function () {
        if (this.structuredQuestions) {
          this.postDescriptionLimit = 9999;
        }
      }, 50);
    }
  }

  setupAfterOpen(params) {
    this._setupGroup(params.group);
    this.async(
      function () {
        const nameElement = this.$$('#name');
        if (nameElement) {
          nameElement.focus();
        }
      }.bind(this),
      250
    );

    if (
      !this.newPost &&
      this.post.public_data &&
      this.post.public_data.structuredAnswersJson
    ) {
      this.initialStructuredAnswersJson = this.post.public_data.structuredAnswersJson;
    }
  }

  _alternativeTextForNewIdeaButtonHeaderTranslation() {
    this.async(function () {
      var label = this.$$('#alternativeTextForNewIdeaButtonHeaderId');
      if (label && label.finalContent) {
        this.editHeaderText = label.finalContent;
      }
    });
  }

  setupTranslation() {
    this.async(
      function () {
        if (this.t) {
          if (this.newPost) {
            if (
              this.group &&
              this.group.configuration &&
              this.group.configuration.alternativeTextForNewIdeaButtonHeader
            ) {
              var label = this.$$('#alternativeTextForNewIdeaButtonHeaderId');
              this.editHeaderText =
                label && label.finalContent
                  ? label.finalContent
                  : this.group.configuration
                      .alternativeTextForNewIdeaButtonHeader;
            } else {
              this.editHeaderText = this.t('post.new');
            }
            this.toastText = this.t('postCreated');
            this.saveText = this.t('create');
          } else {
            this.saveText = this.t('save');
            this.editHeaderText = this.t('post.edit');
            this.toastText = this.t('postUpdated');
          }
        }
      }.bind(this),
      20
    );
  }
}