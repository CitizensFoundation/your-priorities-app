import { html, css, nothing, TemplateResult } from "lit";
import { property, customElement, query } from "lit/decorators.js";

import { DateTime } from "luxon";

import "@material/web/radio/radio.js";

import "@material/web/tabs/secondary-tab.js";
import "@material/web/tabs/tabs.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/select/outlined-select.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";

import "../common/yp-generate-ai-image.js";
import "../common/yp-image.js";
import "./yp-post-location.js";

import { YpEditBase } from "../common/yp-edit-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpMagicText } from "../yp-magic-text/yp-magic-text.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
import { YpEditDialog } from "../yp-edit-dialog/yp-edit-dialog.js";
import { YpEmojiSelector } from "../common/yp-emoji-selector.js";
import { YpStructuredQuestionEdit } from "../yp-survey/yp-structured-question-edit.js";

import "../yp-survey/yp-structured-question-edit.js";
import { YpSurveyHelpers } from "../yp-survey/YpSurveyHelpers.js";

import "../yp-edit-dialog/yp-edit-dialog.js";

import "@material/web/iconbutton/filled-icon-button.js";
import { YpForm } from "../common/yp-form.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";
import { Radio } from "@material/web/radio/internal/radio.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { cache } from "lit/directives/cache.js";
import { YpGenerateAiImage } from "../common/yp-generate-ai-image.js";
import { Progress } from "@material/web/progress/internal/progress.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";

export const EditPostTabs: Record<string, number> = {
  Description: 0,
  Point: 1,
  Location: 2,
  Media: 3,
};

@customElement("yp-post-edit")
export class YpPostEdit extends YpEditBase {
  @property({ type: String })
  action = "/posts";

  @property({ type: Boolean })
  newPost = false;

  @property({ type: Number })
  selectedCategoryArrayId: number | undefined;

  @property({ type: Array })
  initialStructuredAnswersJson: Array<YpStructuredAnswer> | undefined;

  @property({ type: Array })
  structuredQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Boolean })
  saveSurveyAnswers = true;

  @property({ type: Boolean })
  disableDialog = false;

  @property({ type: Boolean })
  skipIfSavedSurveyAnswers = true;

  @property({ type: Boolean })
  locationHidden = false;

  @property({ type: Object })
  location: YpLocationData | undefined;

  @property({ type: String })
  encodedLocation: string | undefined;

  @property({ type: Number })
  selectedCategoryId: number | undefined;

  @property({ type: Number })
  uploadedVideoId: number | undefined;

  @property({ type: Number })
  uploadedAudioId: number | undefined;

  @property({ type: Object })
  response: object | undefined;

  @property({ type: String })
  errorText: string | undefined;

  @property({ type: Number })
  currentVideoId: number | undefined;

  @property({ type: Number })
  currentAudioId: number | undefined;

  @property({ type: Number })
  selected = 0;

  @property({ type: Boolean })
  mapActive = false;

  @property({ type: Boolean })
  hasOnlyOneTab = false;

  @property({ type: Number })
  postDescriptionLimit: number | undefined;

  @property({ type: String })
  sructuredAnswersString: string | undefined;

  @property({ type: String })
  structuredAnswersJson = "";

  @property({ type: String })
  structuredAnswersString = "";

  @property({ type: Array })
  translatedQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: Boolean })
  submitDisabled = false;

  @property({ type: String })
  uploadedDocumentUrl: string | undefined;

  @property({ type: String })
  uploadedVideoUrl: string | undefined;

  @property({ type: String })
  uploadedDocumentFilename: string | undefined;

  @property({ type: String })
  selectedCoverMediaType = "none";

  @property({ type: Number })
  override uploadedHeaderImageId: number | undefined;

  @property({ type: String })
  customTitleQuestionText: string | undefined;

  @query("#form")
  formElement: YpForm | undefined;

  emailValidationPattern =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

  liveQuestionIds: Array<number> = [];

  uniqueIdsToElementIndexes: Record<string, number> = {};

  liveUniqueIds: Array<string> = [];

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("post")) {
      this._postChanged();
    }

    if (changedProperties.has("locationHidden")) {
      this._locationHiddenChanged();
    }

    if (changedProperties.has("location")) {
      this._locationChanged();
    }

    if (changedProperties.has("selectedCategoryArrayId")) {
      this._selectedCategoryChanged();
    }

    if (changedProperties.has("selectedCoverMediaType")) {
      this._uploadedHeaderImageIdChanged();
    }
    if (changedProperties.has("group")) {
      this._groupChanged();
    }

    if (changedProperties.has("selected")) {
      this._selectedChanged();
      const a = this.selected;
    }

    if (!changedProperties.has("structuredQuestions")) {
      this._setupStructuredQuestions();
    }
  }

  _getQuestionLengthWithSubOptions(questions: string | any[]) {
    let length = 0;
    for (let i = 0; i < questions.length; i++) {
      length += 1;
      var question = questions[i];
      if (
        question.type === "radios" &&
        question.radioButtons &&
        question.radioButtons.length > 0
      ) {
        length += question.radioButtons.length;
      } else if (
        question.type === "checkboxes" &&
        question.checkboxes &&
        question.checkboxes.length > 0
      ) {
        length += question.checkboxes.length;
      } else if (
        question.type === "dropdown" &&
        question.dropdownOptions &&
        question.dropdownOptions.length > 0
      ) {
        length += question.dropdownOptions.length;
      }
    }

    return length;
  }

  customValidation() {
    let valid = true;
    let hasFoundOne = false;
    this.liveQuestionIds.forEach((liveIndex) => {
      const questionElement = this.$$(
        "#structuredQuestionContainer_" + liveIndex
      ) as YpStructuredQuestionEdit;
      questionElement.classList.remove("error");
      if (questionElement && !questionElement.checkValidity()) {
        valid = false;
        if (!hasFoundOne) {
          questionElement.scrollIntoView();
          hasFoundOne = true;
        }
        questionElement.classList.add("error");
      }
      questionElement.requestUpdate();
    });
    return valid;
  }

  async _getTranslationsIfNeeded() {
    this.translatedQuestions = undefined;
    if (
      this.autoTranslate &&
      this.language &&
      this.group &&
      this.language !== this.group.language
    ) {
      const translatedTexts =
        await window.serverApi.getSurveyQuestionsTranslations(
          this.group,
          this.language
        );

      if (this.autoTranslate && this.language !== this.group.language) {
        var currentQuestions = JSON.parse(
          JSON.stringify(this.group.configuration.structuredQuestionsJson)
        );

        if (
          translatedTexts.length ===
          this._getQuestionLengthWithSubOptions(currentQuestions)
        ) {
          var translatedItemCount = 0;
          for (
            var questionCount = 0;
            questionCount < currentQuestions.length;
            questionCount++
          ) {
            var question = currentQuestions[questionCount];
            question.originalText = question.text;
            question.text = translatedTexts[translatedItemCount++];

            if (
              question.type === "radios" &&
              question.radioButtons &&
              question.radioButtons.length > 0
            ) {
              for (
                var subOptionCount = 0;
                subOptionCount < question.radioButtons.length;
                subOptionCount++
              ) {
                question.radioButtons[subOptionCount].originalText =
                  question.radioButtons[subOptionCount].text;
                question.radioButtons[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === "checkboxes" &&
              question.checkboxes &&
              question.checkboxes.length > 0
            ) {
              for (
                var subOptionCount = 0;
                subOptionCount < question.checkboxes.length;
                subOptionCount++
              ) {
                question.checkboxes[subOptionCount].originalText =
                  question.checkboxes[subOptionCount].text;
                question.checkboxes[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === "dropdown" &&
              question.dropdownOptions &&
              question.dropdownOptions.length > 0
            ) {
              for (
                var subOptionCount = 0;
                subOptionCount < question.dropdownOptions.length;
                subOptionCount++
              ) {
                question.dropdownOptions[subOptionCount].originalText =
                  question.dropdownOptions[subOptionCount].text;
                question.dropdownOptions[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            }
          }

          this.translatedQuestions = currentQuestions;
        } else {
          console.error("Questions and Translated texts length does not match");
          console.error(
            `Questions: ${this._getQuestionLengthWithSubOptions(
              currentQuestions
            )} Translated: ${translatedTexts.length}`
          );
        }
      } else {
        this.translatedQuestions = undefined;
      }
    }
  }

  _groupChanged() {
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.structuredQuestionsJson &&
      this.group.configuration.structuredQuestionsJson.length > 0
    ) {
      if (window.autoTranslate) {
        this.autoTranslate = window.autoTranslate;
      }
      this._getTranslationsIfNeeded();
    }
  }

  _generateLogo(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.requestUpdate();
    const generator = this.$$("#aiImageGenerator") as YpGenerateAiImage;
    const name = this.$$("#name") as TextField;
    const description = this.$$("#description") as TextField;
    generator.open(name.value, description.value);
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          text-align: left;
        }

        .topHeader {
          font-size: 36px;
          font-weight: 700;
          font-family: var(--md-ref-typeface-brand);
          margin-bottom: 32px;
          margin-top: 32px;
        }

        .outerFrameContainer {
          max-width: 1034px;
          width: 1034px;
          background-color: var(--md-sys-color-surface);
          margin: 0 auto;
          padding: 32px;
        }

        .frameContainer {
          max-width: 970px;
          width: 970px;
          min-height: 1000px;
          margin-top: 0;
          padding: 32px;
          border-radius: 4px;
          border: 1px solid var(--md-sys-color-outline);
          position: relative;
          background-color: var(--md-sys-color-surface);
        }

        .mediaAndLocation {
          width: 50%;
        }

        .descriptionInputs {
          width: 50%;
        }

        .dividerLine {
          opacity: 0.3;
          max-width: 88%;
        }

        .access {
        }

        label {
          padding: 8px;
        }

        md-radio {
          margin-left: 8px;
        }

        md-text-button {
        }

        #generateButton {
          margin: 16px;
          margin-bottom: 26px;
          margin-right: 0;
        }

        .imageButtons {
          margin-top: 16px;
        }

        md-secondary-tab {
          --md-secondary-tab-container-color: var(
            --md-sys-color-surface-container-lowest
          );
        }

        .topNewPostContainer {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-lowest);
          padding: 32px;
          margin: 0;
          border-radius: 16px;
          padding-bottom: 64px;
          padding-top: 0;
        }

        yp-edit-dialog {
          margin: 0;
          padding: 0;
        }

        yp-file-upload {
          margin-top: 16px;
        }

        .accessHeader {
          font-weight: normal;
          margin-bottom: 0;
        }

        div {
        }

        .container {
          width: 100%;
          width: 100%;
        }

        yp-post-location {
          min-height: 320px;
        }

        md-tab {
          --md-secondary-tab-container-color: var(
            --md-sys-color-surface-container-lowest
          );
        }

        @media (max-width: 960px) {
          .container {
            padding-right: 16px;
          }

          .mediaAndLocation {
            width: 100%;
          }

          .descriptionInputs {
            width: 100%;
          }

          .outerFrameContainer {
            max-width: 100%;
            width: 100%;
            padding: 0;
          }

          .frameContainer {
            max-width: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            border-radius: 0;
            border: none;
          }

          .subContainer {
          }

          md-primary-tab {
            font-size: 12px;
          }
        }

        yp-post-location {
        }

        section {
          margin-top: 32px;
        }

        .image {
          width: 400px;
          height: 225px;
        }

        #description {
          margin-top: 16px;
        }

        .imageSizeInfo {
          font-size: 12px;
          padding-bottom: 16px;
        }

        md-outlined-select {
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

        md-checkbox {
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
          --md-outlined-text-field-container-input: {
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

        @media (max-width: 960px) {
          .uploadSection {
            max-width: 100%;
          }
          .image {
            width: 300px;
            height: 169px;
          }

          .videoCam {
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

        md-tabs[title-disabled] {
          margin-bottom: 24px;
        }

        .videoCamIcon {
          margin-left: 6px;
          margin-bottom: 2px;
        }

        .mediaTab {
          vertical-align: center;
        }

        #pointFor {
          width: 100%;
        }

        .attachmentInfo {
          margin-top: -8px;
          margin-left: 8px;
        }

        .mobileSaveButton {
          margin-top: 16px;
          margin-bottom: 32px;
        }
      `,
    ];
  }

  _setSelectedTab(event: CustomEvent) {
    this.selected = (event.target as MdTabs).activeTabIndex;
  }

  renderMoreContactInfo() {
    return html`
      <h2 class="contactInfo">${this.t("contactInformation")}</h2>
      <md-outlined-text-field
        id="contactName"
        name="contactName"
        type="text"
        .label="${this.t("user.name")}"
        charCounter
      >
      </md-outlined-text-field>
      <md-outlined-text-field
        id="contactEmail"
        name="contactEmail"
        type="text"
        .label="${this.t("user.email")}"
        charCounter
      >
      </md-outlined-text-field>
      <md-outlined-text-field
        id="contactTelephone"
        name="contacTelephone"
        type="text"
        .label="${this.t("contactTelephone")}"
        maxlength="20"
        charCounter
      >
      </md-outlined-text-field>
      <md-outlined-text-field
        id="contactAddress"
        name="contactAddress"
        type="text"
        ?hidden="${!this.group!.configuration.moreContactInformationAddress}"
        .label="${this.t("contactAddress")}"
        maxlength="300"
        charCounter
      >
      </md-outlined-text-field>
    `;
  }

  get titleQuestionText() {
    if (this.post && this.group && this.customTitleQuestionText) {
      return this.customTitleQuestionText;
    }
    if (
      this.post &&
      this.group &&
      this.group.configuration &&
      this.group.configuration.customTitleQuestionText
    ) {
      return this.group.configuration.customTitleQuestionText;
    } else {
      return this.t("title");
    }
  }

  renderCoverMediaContent() {
    if (this.uploadedVideoUrl) {
      return html`
        <video
          id="videoPlayer"
          data-id="${ifDefined(this.uploadedVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.uploadedVideoUrl}"
          playsinline
        ></video>
      `;
    } else if (this.imagePreviewUrl) {
      return html`
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="cover"
            .skipCloudFlare="${true}"
            .alt="${ifDefined(this.post?.name)}"
            .title="${ifDefined(this.post?.name)}"
            src="${this.imagePreviewUrl}"
          ></yp-image>
        </div>
      `;
    } else if (
      this.post?.PostHeaderImages &&
      this.post?.PostHeaderImages.length > 0
    ) {
      return html`
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="cover"
            .alt="${ifDefined(this.post?.name)}"
            .title="${ifDefined(this.post?.name)}"
            src="${YpMediaHelpers.getImageFormatUrl(
              this.post?.PostHeaderImages
            )}"
          ></yp-image>
        </div>
      `;
    } else {
      return html`
        <yp-image
          class="image"
          sizing="contain"
          .alt="${ifDefined(this.post?.name)}"
          .title="${ifDefined(this.post?.name)}"
          src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg"
        ></yp-image>
      `;
    }
  }

  renderDescriptionInputs() {
    return this.group
      ? html`
          <div class="layout vertical flex descriptionInputs">
            ${this.group.configuration.hideNameInputAndReplaceWith
              ? html`
                  <input
                    type="hidden"
                    name="name"
                    .value="${this.replacedName || ""}"
                  />
                `
              : this.post
              ? html`
                  <md-outlined-text-field
                    id="name"
                    required
                    minlength="1"
                    name="name"
                    type="text"
                    .label="${this.titleQuestionText}"
                    .value="${this.post.name}"
                    maxlength="60"
                    rows="7"
                    charCounter
                  >
                  </md-outlined-text-field>
                `
              : nothing}
            ${this.showCategories && this.group.Categories
              ? html`
                <md-outlined-select
                  class="categoryDropDown"
                  .label="${this.t("category.select")}"
                  .selectedIndex="${this.selectedCategoryArrayId ?? -1}"
                  @change="${this._selectedCategory}"
                  ?required="${this.group.configuration.makeCategoryRequiredOnNewPost}"
                >
                  ${this.group.Categories.map(
                    (category) => html`
                      <md-select-option .data-category-id="${category.id}"
                        >${category.name}</md-select-option
                      >
                    `
                  )}
                </md-outlined-select>
                <input
                  type="hidden"
                  name="categoryId"
                  .value="${this.selectedCategoryId
                    ? this.selectedCategoryId.toString()
                    : ""}"
                />
              `
              : nothing}
            ${this.group &&
            this.group.configuration &&
            this.group.configuration.usePostTags
              ? html` <md-outlined-text-field
                  id="name"
                  name="tags"
                  type="text"
                  .label="${this.t("commaSeperatedTags")}"
                  .value="${this.post!.public_data!.tags || ''}"
                >
                </md-outlined-text-field>`
              : nothing}
            ${this.postDescriptionLimit
              ? html`
                  <md-outlined-text-field
                    type="textarea"
                    id="description"
                    ?hidden="${this.structuredQuestions != null}"
                    ?required="${this.structuredQuestions == null}"
                    minlength="1"
                    name="description"
                    .value="${this.post!.description}"
                    .label="${this.t("post.description")}"
                    @change="${this._resizeScrollerIfNeeded}"
                    char-counter
                    rows="5"
                    max-rows="5"
                    maxlength="${this.postDescriptionLimit}"
                  >
                  </md-outlined-text-field>

                  <div
                    class="horizontal end-justified layout postEmoji"
                    ?hidden="${this.group.configuration.hideEmoji}"
                  >
                    <emoji-selector
                      id="emojiSelectorDescription"
                      ?hidden="${this.structuredQuestions != undefined}"
                    ></emoji-selector>
                  </div>
                `
              : nothing}
            ${this.structuredQuestions != undefined
              ? html`<div id="surveyContainer">
                  ${this.structuredQuestions.map(
                    (question: YpStructuredQuestionData, index: number) => html`
                      <yp-structured-question-edit
                        .index="${index}"
                        is-from-new-post
                        use-small-font
                        id="structuredQuestionContainer_${index}"
                        ?dontFocusFirstQuestion="${!this.group!.configuration
                          .hideNameInputAndReplaceWith}"
                        @resize-scroller="${this._resizeScrollerIfNeeded}"
                        .structuredAnswers="${this
                          .initialStructuredAnswersJson}"
                        ?isLastRating="${this._isLastRating(index)}"
                        ?isFirstRating="${this._isFirstRating(index)}"
                        ?hideQuestionIndex="${this.group!.configuration
                          .hideQuestionIndexOnNewPost}"
                        .question="${question}"
                      >
                      </yp-structured-question-edit>
                    `
                  )}
                </div>`
              : nothing}
            ${this.group.configuration.attachmentsEnabled
              ? html`
                  <yp-file-upload
                    id="attachmentFileUpload"
                    raised
                    attachmentUpload
                    buttonIcon="attach_file"
                    .group="${this.group}"
                    .buttonText="${this.t("uploadAttachment")}"
                    accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,image/*"
                    .target="/api/groups/${this.group.id}/upload_document"
                    method="POST"
                    @success="${this._documentUploaded}"
                  >
                  </yp-file-upload>
                  <small class="attachmentInfo"
                    >${this.t("documentOnlyVisibleToAdmins")}</small
                  >

                  ${this.post!.data?.attachment?.url
                    ? html`
                        <label>
                          ${this.t("deleteAttachment")}:
                          ${this.post!.data.attachment.filename}
                          <md-checkbox name="deleteAttachment"></md-checkbox>
                        </label>
                      `
                    : nothing}
                `
              : nothing}
            ${this.group.configuration.moreContactInformation
              ? this.renderMoreContactInfo()
              : nothing}
          </div>
        `
      : nothing;
  }

  renderPointTab() {
    return this.newPointShown
      ? html`
          <div class="subContainer">
            <md-outlined-text-field
              id="pointFor"
              ?required="${!this.group!.configuration.newPointOptional}"
              minlength="1"
              name="pointFor"
              .value="${this.post!.pointFor || ""}"
              .label="${this.t("point.for")}"
              charCounter
              type="textarea"
              rows="5"
              max-rows="5"
              .maxlength="${this.pointMaxLength}"
            >
            </md-outlined-text-field>
            <div
              class="horizontal end-justified layout pointEmoji"
              ?hidden="${this.group!.configuration.hideEmoji}"
            >
              <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
            </div>
          </div>
        `
      : nothing;
  }

  renderLocationTab() {
    return !this.locationHidden
      ? html`
          ${this.group
            ? html`<div class="layout horizontal center-center">
                <yp-post-location
                  .encodedLocation="${this.encodedLocation}"
                  .location="${this.location}"
                  .group="${this.group}"
                  .post="${this.post}"
                ></yp-post-location>
              </div> `
            : nothing}
        `
      : nothing;
  }

  renderCoverMediaSelection() {
    return html`
      <h3 class="accessHeader">${this.t("post.cover.media")}</h3>
      <div
        id="coverMediaType"
        name="coverMediaType"
        class="coverMediaType layout vertical wrap"
        .selected="${this.selectedCoverMediaType}"
      >
        <label
          >${this.t("post.cover.none")}
          <md-radio
            value="none"
            id="mediaNone"
            ?checked="${this.selectedCoverMediaType === "none"}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia"
          >
          </md-radio>
        </label>

        <label ?hidden="${!this.uploadedHeaderImageId}"
          >${this.t("post.cover.image")}
          <md-radio
            value="image"
            id="mediaImage"
            ?checked="${this.selectedCoverMediaType === "image"}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia"
          >
          </md-radio>
        </label>

        <label ?hidden="${!this.showVideoCover}"
          >${this.t("postCoverVideo")}
          <md-radio
            value="video"
            id="mediaVideo"
            ?checked="${this.selectedCoverMediaType === "video"}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia"
          >
          </md-radio>
        </label>

        <label ?hidden="${!this.showAudioCover}"
          >${this.t("postCoverAudio")}
          <md-radio
            value="audio"
            id="mediaAudio"
            ?checked="${this.selectedCoverMediaType === "audio"}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia"
          >
          </md-radio>
        </label>

        ${this.location
          ? html`
              <label
                >${this.t("post.cover.map")}
                <md-radio
                  value="map"
                  ?checked="${this.selectedCoverMediaType === "map"}"
                  id="mediaMap"
                  @change="${this._setSelectedCoverMediaType}"
                  name="radioButtonsMedia"
                >
                </md-radio>
              </label>

              <label
                >${this.t("post.cover.streetview")}
                <md-radio
                  value="streetView"
                  id="mediaStreetview"
                  ?checked="${this.selectedCoverMediaType === "streetView"}"
                  @change="${this._setSelectedCoverMediaType}"
                  name="radioButtonsMedia"
                >
                </md-radio>
              </label>
            `
          : nothing}
      </div>
    `;
  }

  renderMediaTab() {
    return html`
      <div class="layout vertical center-center" style="align-self: start">
        <div class="layout vertical center-center wrap">
          <div
            class="layout vertical center-center self-start uploadSection"
            ?hidden="${this.group!.configuration.hidePostImageUploads}"
          >
            ${this.renderCoverMediaContent()}
            <div class="layout horizontal center-center imageButtons">
              <yp-file-upload
                id="imageFileUpload"
                raised
                target="/api/images?itemType=post-header"
                method="POST"
                buttonIcon="photo_camera"
                .buttonText="${this.t("upload")}"
                @success="${this._imageUploaded}"
              >
              </yp-file-upload>

              ${this.group!.configuration.allowGenerativeImages
                ? html`
                    <md-outlined-button
                      id="generateButton"
                      trailing-icon
                      @click="${this._generateLogo}"
                      >${this.t("generateWithAi")}<md-icon slot="icon"
                        >smart_toy</md-icon
                      ></md-outlined-button
                    >
                  `
                : nothing}
            </div>
          </div>

          <div class="layout horizontal">
            ${this.group!.configuration.allowPostVideoUploads
              ? html`
                  <div
                    class="layout vertical center-center self-start uploadSection"
                  >
                    <yp-file-upload
                      id="videoFileUpload"
                      container-type="posts"
                      .group="${this.group}"
                      raised
                      .uploadLimitSeconds="${this.group!.configuration
                        .videoPostUploadLimitSec}"
                      videoUpload
                      buttonIcon="videocam"
                      .buttonText="${this.t("uploadVideo")}"
                      method="POST"
                      @success="${this._videoUploaded}"
                    >
                    </yp-file-upload>
                    <div
                      class="videoUploadDisclamer"
                      ?hidden="${!this.group!.configuration
                        .showVideoUploadDisclaimer || !this.uploadedVideoId}"
                    >
                      ${this.t("videoUploadDisclaimer")}
                    </div>
                  </div>
                `
              : nothing}
            ${this.group!.configuration.allowPostAudioUploads
              ? html`
                  <div
                    class="layout vertical center-center self-start uploadSection"
                  >
                    <yp-file-upload
                      id="audioFileUpload"
                      containerType="posts"
                      .group="${this.group}"
                      raised
                      .uploadLimitSeconds="${this.group!.configuration
                        .audioPostUploadLimitSec}"
                      ?multi="${false}"
                      audioUpload
                      method="POST"
                      buttonIcon="keyboard_voice"
                      .buttonText="${this.t("uploadAudio")}"
                      @success="${this._audioUploaded}"
                    >
                    </yp-file-upload>
                  </div>
                `
              : nothing}
          </div>
        </div>
        ${this.renderCoverMediaSelection()}
      </div>
    `;
  }

  _setSelectedCoverMediaType(event: CustomEvent) {
    this.selectedCoverMediaType = (event.target as HTMLInputElement).value;
  }

  get _pointPageHidden() {
    return !this.newPointShown || this.selected !== EditPostTabs.Point;
  }

  get _mediaPageHidden() {
    if (this.mediaHidden) {
      return true;
    } else {
      return false;
    }
  }

  renderMediaAndLocation(): TemplateResult | undefined | {} {
    return html`
      <div class="layout vertical mediaAndLocation">
        <div>${this.renderLocationTab()}</div>
        <div ?hidden="${this._mediaPageHidden}">${this.renderMediaTab()}</div>
      </div>
    `;
  }

  renderHiddenInputs() {
    return html`
      <input
        type="hidden"
        name="location"
        .value="${this.encodedLocation || ""}"
      />
      <input
        type="hidden"
        name="coverMediaType"
        .value="${this.selectedCoverMediaType}"
      />
      <input
        type="hidden"
        name="uploadedHeaderImageId"
        .value="${this.uploadedHeaderImageId
          ? this.uploadedHeaderImageId.toString()
          : ""}"
      />
      <input
        type="hidden"
        name="uploadedDocumentUrl"
        .value="${this.uploadedDocumentUrl || ""}"
      />
      <input
        type="hidden"
        name="uploadedDocumentFilename"
        .value="${this.uploadedDocumentFilename || ""}"
      />
      <input
        type="hidden"
        name="structuredAnswers"
        .value="${this.structuredAnswersString}"
      />
      <input
        type="hidden"
        name="structuredAnswersJson"
        .value="${this.structuredAnswersJson}"
      />
    `;
  }

  renderClose() {
    let pathBack;
    if (this.new) {
      pathBack = "/group/" + this.group!.id;
    } else {
      pathBack = "/post/" + this.post!.id;
    }

    return html`<md-filled-tonal-icon-button
      @click="${() => YpNavHelpers.redirectTo(pathBack)}"
      title="${this.t("close")}"
      ><md-icon>close</md-icon>
    </md-filled-tonal-icon-button>`;
  }

  async submit(validate = true) {
    this.submitDisabled = true;
    if (this.params && this.params.communityId) {
      this.action = this.action + "/" + this.params.communityId;
    } else if (this.params && this.params.groupId) {
      this.action = this.action + "/" + this.params.groupId;
    } else if (this.params && this.params.organizationId) {
      this.action = this.action + "/" + this.params.organizationId;
    } else if (this.params && this.params.userImages && this.params.postId) {
      this.action = this.action + "/" + this.params.postId + "/user_images";
    } else if (this.params && this.params.statusChange && this.params.postId) {
      this.action = this.action + "/" + this.params.postId + "/status_change";
    } else if (this.params && this.params.postId && this.params.imageId) {
      this.action =
        this.action +
        "/" +
        this.params.postId +
        "/" +
        this.params.imageId +
        "/user_images";
      // eslint-disable-next-line no-dupe-else-if
    } else if (
      this.params &&
      this.params.statusChange &&
      this.params.disableStatusEmails === true &&
      this.params.postId
    ) {
      this.action =
        this.action + "/" + this.params.postId + "/status_change_no_emails";
    } else if (this.params && this.params.postId) {
      this.action = this.action + "/" + this.params.postId;
    } else if (this.params && this.params.userId) {
      this.action = this.action + "/" + this.params.userId;
    } else if (this.params && this.params.domainId) {
      this.action = this.action + "/" + this.params.domainId;
    } else if (this.params && this.params.categoryId) {
      this.action = this.action + "/" + this.params.categoryId;
    }

    this.requestUpdate();

    const form = this.$$("#form") as YpForm;

    let validated = false;

    if (validate) {
      validated = form.validate();
    } else {
      validated = true;
    }

    if (validated) {
      form.submit();
      (this.$$("#spinner") as Progress).hidden = false;
    } else {
      this.fire("yp-form-invalid");
      //const error = this.t("form.invalid");
      //this._showErrorDialog(error);
    }
  }

  renderSaveButton() {
    return html`
      <md-filled-button
        @click="${this.customSubmit}"
        .disabled="${this.submitDisabled}"
        >${this.saveText || this.t("save")}</md-filled-button
      >
    `;
  }

  renderHeader() {
    return html`
      <div class="layout horizontal actionBar">
        ${this.renderClose()}
        <div class="flex"></div>
        <md-icon>lightbulb</md-icon>
        <div class="flex"></div>
        ${this.wide ? this.renderSaveButton() : nothing}
      </div>
      <div class="topHeader">
        ${this.editHeaderText ? this.editHeaderText : ""}
      </div>
    `;
  }

  override render() {
    return html`
        <yp-form id="form" method="POST" .params="${this.params}">
          <form
            name="ypForm"
            .method="${this.method}"
            .action="${this.action ? this.action : ""}"
          >
            ${
              this.group && this.post
                ? html`
                    <div class="layout vertical outerFrameContainer">
                      <div class="frameContainer">
                        ${this.renderHeader()}
                        <div
                          class="layout horizontal wrap"
                          ?no-title="${this.group.configuration
                            .hideNameInputAndReplaceWith}"
                        >
                          ${this.renderDescriptionInputs()}
                          ${this.renderMediaAndLocation()}
                        </div>
                        ${this.wide
                          ? nothing
                          : html`<div
                              class="mobileSaveButton layout horizontal center-center"
                            >
                              ${this.renderSaveButton()}
                            </div> `}
                      </div>
                    </div>
                    ${this.renderHiddenInputs()}
                  `
                : nothing
            }
          </form>
        </yp-form>
        <md-dialog id="formErrorDialog" modal>
          <div slot="content" id="errorText">${this.errorText}</div>
          <div class="buttons" slot="actions">
            <md-text-button autofocus @click="${this._clearErrorText}"
              >${this.t("ok")}</md-text-button
            >
          </div>
        </md-dialog>
        ${
          this.group &&
          this.group.configuration.alternativeTextForNewIdeaButtonHeader
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
                  textType="alternativeTextForNewIdeaButtonHeader"
                ></yp-magic-text>
              `
            : nothing
        }
        ${
          this.group && this.group.configuration.customThankYouTextNewPosts
            ? html`
                <yp-magic-text
                  id="customThankYouTextNewPostsId"
                  hidden
                  .contentId="${this.group.id}"
                  textOnly
                  .content="${this.group.configuration
                    .customThankYouTextNewPosts}"
                  .contentLanguage="${this.group.language}"
                  textType="customThankYouTextNewPosts"
                ></yp-magic-text>
              `
            : nothing
        }
        ${
          this.group && this.group.configuration.customTitleQuestionText
            ? html`
                <yp-magic-text
                  id="customTitleQuestionTextId"
                  hidden
                  .contentId="${this.group.id}"
                  textOnly
                  .content="${this.group.configuration.customTitleQuestionText}"
                  .contentLanguage="${this.group.language}"
                  @new-translation="${this._updatePostTitle}"
                  textType="customTitleQuestionText"
                ></yp-magic-text>
              `
            : nothing
        }
        ${
          this.group &&
          this.group.configuration.alternativeTextForNewIdeaSaveButton
            ? html`
                <yp-magic-text
                  id="alternativeTextForNewIdeaSaveButtonId"
                  hidden
                  .contentId="${this.group.id}"
                  textOnly
                  .content="${this.group.configuration
                    .alternativeTextForNewIdeaSaveButton}"
                  .contentLanguage="${this.group.language}"
                  @new-translation="${this
                    ._alternativeTextForNewIdeaSaveButtonTranslation}"
                  textType="alternativeTextForNewIdeaSaveButton"
                ></yp-magic-text>
              `
            : nothing
        }

        <yp-generate-ai-image
          id="aiImageGenerator"
          collectionType="group"
          .collectionId="${this.group!.id}"
          .name="${this.post?.name}"
          .description="${this.post?.description}"
          @got-image="${this._gotAiImage}"
        >
        </yp-generate-ai-image>
      </yp-edit-dialog>
      <md-circular-progress id="spinner" hidden></md-circular-progress>
    `;
  }

  _gotAiImage(event: CustomEvent) {
    this.imagePreviewUrl = event.detail.imageUrl;
    this.uploadedHeaderImageId = event.detail.imageId;
    this.selectedCoverMediaType = "image";
  }

  _alternativeTextForNewIdeaSaveButtonTranslation() {
    setTimeout(() => {
      const label = this.$$(
        "#alternativeTextForNewIdeaSaveButtonId"
      ) as YpMagicText;
      if (label && label.finalContent) {
        this.saveText = label.finalContent;
      }
    });
  }

  _updatePostTitle() {
    setTimeout(() => {
      const label = this.$$("#customTitleQuestionTextId") as YpMagicText;
      if (label && label.finalContent) {
        this.customTitleQuestionText = label.finalContent;
      }
    });
  }

  //TODO: Investigate if any are missing .html version of listeners
  override connectedCallback() {
    super.connectedCallback();
    this.addListener("yp-form-invalid", this._formInvalid);
    //this.addListener("yp-custom-form-submit", this._customSubmit);
    this.addListener("yp-open-to-unique-id", this._openToId);
    this.addListener("yp-skip-to-unique-id", this._skipToId);
    this.addListener("yp-goto-next-index", this._goToNextIndex);
    this.addGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );

    this.addGlobalListener(
      "yp-language-loaded",
      this.setupTranslation.bind(this)
    );

    if (this.disableDialog) {
      this.setup(this.post, this.new, undefined, this.group!);
    }

    this.addListener("yp-form-submit", this._formSubmitted);
    this.addListener("yp-form-response", this._formResponse);
    this.addListener("yp-form-error", this._formError);
    this.addListener("yp-form-invalid", this._formInvalid);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener("yp-form-invalid", this._formInvalid);
    //this.removeListener("yp-custom-form-submit", this._customSubmit);
    this.removeListener("yp-skip-to-unique-id", this._skipToId);
    this.removeListener("yp-open-to-unique-id", this._openToId);
    this.removeListener("yp-goto-next-index", this._goToNextIndex);
    this.removeGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );
    this.removeGlobalListener(
      "yp-language-loaded",
      this.setupTranslation.bind(this)
    );

    this.removeListener("yp-form-submit", this._formSubmitted);
    this.removeListener("yp-form-response", this._formResponse);
    this.removeListener("yp-form-error", this._formError);
    this.removeListener("yp-form-invalid", this._formInvalid);
  }

  _formSubmitted() {}

  _formError(event: CustomEvent) {
    if (
      !navigator.onLine &&
      this.method === "POST" &&
      window.fetch !== undefined
    ) {
      const serialized = (this.$$("#form") as YpForm).serializeForm();
      window.appGlobals.offline.sendWhenOnlineNext({
        body: serialized,
        method: this.method,
        params: this.params,
        url: this.action!,
      });
      this.response = { offlineSendLater: true };
      this.close();
    } else if (!navigator.onLine) {
      this._showErrorDialog(this.t("youAreOfflineCantSend"));
    } else {
      this.submitDisabled = false;
      console.log("Form error: ", event.detail.error);
      this._showErrorDialog(this.t("form.invalid"));
      (this.$$("#spinner") as Progress).hidden = false;
    }
  }
  _showErrorDialog(errorText: string) {
    this.errorText = errorText;
    (this.$$("#formErrorDialog") as Dialog).show();
  }

  _clearErrorText() {
    (this.$$("#formErrorDialog") as Dialog).close();
    this.errorText = undefined;
  }
  hasLongSaveText() {
    return this.saveText && this.saveText.length > 9;
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._getTranslationsIfNeeded();
  }

  _isLastRating(index: number) {
    return (
      this.structuredQuestions &&
      this.structuredQuestions[index].subType === "rating" &&
      index + 2 < this.structuredQuestions.length &&
      this.structuredQuestions[index + 1].subType !== "rating"
    );
  }

  _isFirstRating(index: number) {
    return (
      this.structuredQuestions &&
      this.structuredQuestions[index].subType === "rating" &&
      this.structuredQuestions[index - 1] &&
      this.structuredQuestions[index - 1].subType !== "rating"
    );
  }

  _openToId(event: CustomEvent) {
    this._skipToId(event, true);
  }

  _goToNextIndex(event: CustomEvent) {
    const currentPos = this.liveQuestionIds.indexOf(event.detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      const item = this.$$(
        "#structuredQuestionContainer_" + this.liveQuestionIds[currentPos + 1]
      ) as HTMLElement;
      item.scrollIntoView({
        block: "end",
        inline: "end",
        behavior: "smooth",
      });
      item.focus();
    }
  }

  _skipToId(event: CustomEvent, showItems: boolean) {
    const toId = event.detail.toId.replace(/]/g, "");
    const fromId = event.detail.fromId.replace(/]/g, "");
    const toIndex = this.uniqueIdsToElementIndexes[toId];
    const item = this.$$(
      "#structuredQuestionContainer_" + toIndex
    ) as HTMLElement;
    item.scrollIntoView({
      block: "end",
      inline: "end",
      behavior: "smooth",
    });
    item.focus();
  }

  _skipToWithHideId(event: CustomEvent, showItems: boolean) {
    let foundFirst = false;
    if (this.$$("#surveyContainer")) {
      const children = this.$$("#surveyContainer")!
        .children as unknown as Array<YpStructuredQuestionEdit>;
      for (let i = 0; i < children.length; i++) {
        const toId = event.detail.toId.replace(/]/g, "");
        const fromId = event.detail.fromId.replace(/]/g, "");
        if (
          children[i + 1] &&
          children[i + 1].question &&
          children[i + 1].question.uniqueId &&
          children[i + 1].question.uniqueId!.substring(
            children[i + 1].question.uniqueId!.length - 1
          ) === "a"
        ) {
          children[i].question.uniqueId = children[
            i + 1
          ].question.uniqueId!.substring(
            0,
            children[i + 1].question.uniqueId!.length - 1
          );
        }
        if (
          children[i].question &&
          event.detail.fromId &&
          children[i].question.uniqueId === fromId
        ) {
          foundFirst = true;
        } else if (
          children[i].question &&
          event.detail.toId &&
          (children[i].question.uniqueId === toId ||
            children[i].question.uniqueId === toId + "a")
        ) {
          break;
        } else {
          if (foundFirst) {
            if (showItems) {
              (children[i] as HTMLElement).hidden = false;
            } else {
              (children[i] as HTMLElement).hidden = true;
            }
          }
        }
      }
    } else {
      console.error("No survey container found");
    }
  }

  override firstUpdated() {
    if (!this.params) {
      this.params = {} as any;
    }
    if (this.new) {
      this.params!.groupId = this.group?.id!;
    } else {
      this.params!.postId = this.post?.id!;
    }
  }

  get replacedName() {
    const { post } = this;
    const { group } = this;
    if (post && group && group.configuration.hideNameInputAndReplaceWith) {
      let text = group.configuration.hideNameInputAndReplaceWith;
      text = text.replace(
        "<DATESECONDS>",
        DateTime.now().toFormat("DD/MM/YYYY hh:mm:ss")
      );
      text = text.replace(
        "<DATEMINUTES>",
        DateTime.now().toFormat("DD/MM/YYYY hh:mm")
      );
      text = text.replace("<DATE>", DateTime.now().toFormat("DD/MM/YYYY"));
      return text;
    }

    return null;
  }

  get pointMaxLength() {
    const { group } = this;
    if (group && group.configuration && group.configuration.pointCharLimit) {
      return group.configuration.pointCharLimit;
    }
    return 500;
  }

  _floatIfValueOrIE(value: boolean) {
    const ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  get newPointShown() {
    let hideNewPoint = false;
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.hideNewPointOnNewIdea === true
    ) {
      hideNewPoint = true;
    }

    return this.newPost && !hideNewPoint;
  }

  _submitWithStructuredQuestionsJson() {
    const answers: Array<YpStructuredAnswer> = [];
    this.liveQuestionIds.forEach((liveIndex) => {
      const questionElement = this.$$(
        "#structuredQuestionContainer_" + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement) {
        const answer = questionElement.getAnswer();
        if (answer) {
          answers.push(answer);
        } else {
          console.error("Can't find answer to question");
        }
      }
    });
    this.structuredAnswersJson = JSON.stringify(answers);
    this.submit();
  }

  _submitWithStructuredQuestionsString() {
    let description = "";
    let answers = "";

    for (let i = 0; i < this.structuredQuestions!.length; i += 1) {
      description += this.structuredQuestions![i].text;
      if (
        this.structuredQuestions![i].text &&
        this.structuredQuestions![i].text[
          this.structuredQuestions![i].text.length - 1
        ] !== "?"
      )
        description += ":";
      description += "\n";
      description += this.structuredQuestions![i].value;
      answers += this.structuredQuestions![i].value;
      if (i !== this.structuredQuestions!.length - 1) {
        answers += "%!#x";
        description += "\n\n";
      }
    }
    if (this.post) this.post.description = description;
    this.structuredAnswersString = answers;
    this.submit();
  }

  customSubmit() {
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.structuredQuestionsJson
    ) {
      this._submitWithStructuredQuestionsJson();
    } else if (
      this.structuredQuestions &&
      this.structuredQuestions.length > 0
    ) {
      this._submitWithStructuredQuestionsString();
    } else {
      this.submit();
    }
  }

  _resizeScrollerIfNeeded() {
    if (this.$$("#editDialog"))
      (this.$$("#editDialog") as YpEditDialog).scrollResize();
  }

  _getStructuredQuestionsString() {
    const structuredQuestions: Array<YpStructuredQuestionData> = [];

    const questionComponents =
      this.group!.configuration.structuredQuestions!.split(",");
    for (let i = 0; i < questionComponents.length; i += 2) {
      const question = questionComponents[i];
      const maxLength = questionComponents[i + 1];
      structuredQuestions.push({
        text: question,
        maxLength: parseInt(maxLength),
        value: "",
        type: "textfield",
      });
    }
    if (
      !this.newPost &&
      this.post &&
      this.post.public_data &&
      this.post.public_data.structuredAnswers &&
      this.post.public_data.structuredAnswers !== ""
    ) {
      const answers = this.post.public_data.structuredAnswers.split("%!#x");
      for (let i = 0; i < answers.length; i += 1) {
        if (structuredQuestions[i]) structuredQuestions[i].value = answers[i];
      }
    }

    return structuredQuestions;
  }

  _setupStructuredQuestions() {
    const { post } = this;
    const { group } = this;
    if (this.translatedQuestions) {
      this.structuredQuestions = this.translatedQuestions;
    } else if (post && group && group.configuration.structuredQuestionsJson) {
      this.structuredQuestions = group.configuration.structuredQuestionsJson;
    } else if (
      post &&
      group &&
      group.configuration.structuredQuestions &&
      group.configuration.structuredQuestions !== ""
    ) {
      this.structuredQuestions = this._getStructuredQuestionsString();
    } else {
      return undefined;
    }
  }

  get showVideoCover() {
    return this.uploadedVideoId || this.currentVideoId;
  }

  get showAudioCover() {
    return this.uploadedAudioId || this.currentAudioId;
  }

  _videoUploaded(event: CustomEvent) {
    this.uploadedVideoId = event.detail.videoId;
    this.uploadedVideoUrl = event.detail.videoUrl;
    (this.$$("#mediaVideo") as Radio).checked = true;
    setTimeout(() => {
      this.fire("iron-resize");
    }, 50);
  }

  _audioUploaded(event: CustomEvent) {
    this.uploadedAudioId = event.detail.audioId;
    this.selectedCoverMediaType = "audio";
    setTimeout(() => {
      this.fire("iron-resize");
    });
  }

  _documentUploaded(event: CustomEvent) {
    const responseURL = event.detail.xhr.responseURL.split("?")[0];
    this.uploadedDocumentUrl = responseURL;
    this.uploadedDocumentFilename = event.detail.filename;
  }

  override customFormResponse() {
    window.appGlobals.groupLoadNewPost = true;
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      const description = this.$$("#description") as HTMLInputElement;
      const emojiSelector = this.$$(
        "#emojiSelectorDescription"
      ) as YpEmojiSelector;
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Post edit: Can't bind emojis :(");
      }
      const emojiSelectorPointFor = this.$$(
        "#emojiSelectorPointFor"
      ) as YpEmojiSelector;
      const pointFor = this.$$("#pointFor") as HTMLInputElement;
      if (emojiSelectorPointFor && pointFor) {
        emojiSelectorPointFor.inputTarget = pointFor;
      }
    }, 500);
  }

  _locationHiddenChanged() {
    /*TODO: See if we need this
    setTimeout( () => {
      const pages = this.$$('#pages');
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      const paperTabs = this.$$('#paperTabs');
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
      }
      console.log('Location hidden changed');
    }, 10); */
  }

  _formInvalid() {
    if (
      this.newPointShown &&
      !(this.$$("#pointFor") as TextField).checkValidity()
    ) {
      this.selected = 1;
    } else {
      this.selected = 0;
    }
    //TODO: Check this
    //    if (this.$$("#name")) (this.$$("#name") as TextField).autoValidate = true;
    //    if (this.$$("#description"))
    //      (this.$$("#description") as TextField).autoValidate = true;
    //    if (this.newPointShown) {
    //      (this.$$("#pointFor") as TextField).autoValidate = true;
    //    }
  }

  _locationChanged() {
    if (
      this.location &&
      (!this.selectedCoverMediaType ||
        this.selectedCoverMediaType == "" ||
        this.selectedCoverMediaType == "none")
    ) {
      this.selectedCoverMediaType = "map";
    }
  }

  _uploadedHeaderImageIdChanged() {
    if (this.uploadedHeaderImageId) {
      this.selectedCoverMediaType = "image";
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

  _selectedChanged() {
    const newValue = this.selected;
    setTimeout(() => {
      if (!this.locationHidden && newValue == (this.newPointShown ? 2 : 1)) {
        this.mapActive = true;
      } else {
        this.mapActive = false;
      }

      const finalTabNumber = this._getTabLength() - 1;

      if (finalTabNumber === 0) {
        this.hasOnlyOneTab = true;
      }

      if (newValue == 0) {
        const nameElement = this.$$("#name");
        if (nameElement) {
          nameElement.focus();
        }
      }
      if (newValue == 1 && this.newPointShown) {
        const pointFor = this.$$("#pointFor");
        if (pointFor) {
          pointFor.focus();
        }
      }
      setTimeout(() => {
        this._resizeScrollerIfNeeded();
      }, 50);
    }, 50);
  }

  _selectedCategory(event: Event) {
    const select = event.target as MdOutlinedSelect;
    this.selectedCategoryArrayId = select.selectedIndex;
  }

  _selectedCategoryChanged() {
    if (this.selectedCategoryArrayId != null && this.group && this.group.Categories) {
      this.selectedCategoryId =
        this.group.Categories[this.selectedCategoryArrayId].id;
    }
  }

  get showCategories() {
    if (this.group && this.group.Categories) {
      return this.group.Categories.length > 0;
    }
    return false;
  }

  getPositionInArrayFromId(collection: Array<YpCategoryData>, id: number) {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].id == id) {
        return i;
      }
    }
    return undefined;
  }

  _postChanged() {
    if (this.newPost && this.post) {
      if (this.post.location) {
        this.location = this.post.location;
        this.encodedLocation = JSON.stringify(this.location);
      }
      if (this.post.cover_media_type)
        this.selectedCoverMediaType = this.post.cover_media_type;
    }
    this._updateEmojiBindings();
  }

  _updateInitialCategory(group: YpGroupData) {
    if (group && this.post && this.post.category_id && group.Categories) {
      this.selectedCategoryId = this.post.category_id;
      this.selectedCategoryArrayId = this.getPositionInArrayFromId(
        group.Categories,
        this.post.category_id
      );
    }
  }

  _imageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
    this.imagePreviewUrl = YpMediaHelpers.getImageFormatUrl([image]);
    this.selectedCoverMediaType = "image";
  }

  async _redirectAfterVideo(post: YpPostData) {
    this.post = post;

    await window.serverApi.completeMediaPost("videos", "PUT", this.post.id, {
      videoId: this.uploadedVideoId,
      appLanguage: this.language,
    });

    this._finishRedirect(post);

    setTimeout(() => {
      window.appGlobals.showSpeechToTextInfoIfNeeded();
    }, 20);
  }

  async _redirectAfterAudio(post: YpPostData) {
    this.post = post;

    await window.serverApi.completeMediaPost("audios", "PUT", this.post.id, {
      audioId: this.uploadedAudioId,
      appLanguage: this.language,
    });

    this._finishRedirect(post);

    setTimeout(() => {
      window.appGlobals.showSpeechToTextInfoIfNeeded();
    }, 20);
  }

  get surveyAnswerLocalstorageKey() {
    return `yp-survey-response-v2-for-${this.group!.id}-${
      window.appUser.user!.id
    }`;
  }

  saveSurveyAnswersToLocalStorage() {
    localStorage.setItem(
      this.surveyAnswerLocalstorageKey,
      JSON.stringify(this.structuredAnswersJson)
    );
  }

  async checkSurveyAnswers() {
    setTimeout(() => {
      const answersText = localStorage.getItem(
        this.surveyAnswerLocalstorageKey
      );

      if (answersText) {
        const jsonAnswers = JSON.parse(answersText);
        this.structuredAnswersJson = jsonAnswers;
        (this.$$("#editDialog") as YpEditDialog)._reallySubmit(false);
      }
    }, 10);
  }

  override customRedirect(post: YpPostData) {
    if (post) {
      if (
        post.newEndorsement &&
        window.appUser &&
        window.appUser.endorsementPostsIndex
      ) {
        window.appUser.endorsementPostsIndex[post.id] = post.newEndorsement;
      }

      if (this.saveSurveyAnswers && this.structuredAnswersJson) {
        this.saveSurveyAnswersToLocalStorage();
      }

      if (this.uploadedVideoId) {
        this._redirectAfterVideo(post);
      } else if (this.uploadedAudioId && this.newPost) {
        this._redirectAfterAudio(post);
      } else {
        this._finishRedirect(post);
      }
    } else {
      console.warn("No post found on custom redirect");
    }
  }

  _finishRedirect(post: YpPostData) {
    this.fire("yp-reset-keep-open-for-page");
    window.appGlobals.activity("completed", "newPost");

    let text = this.t("thankYouForYourSubmission");
    const customThankYouTextNewPostsId = this.$$(
      "#customThankYouTextNewPostsId"
    ) as YpMagicText;
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.customThankYouTextNewPosts &&
      customThankYouTextNewPostsId &&
      customThankYouTextNewPostsId.content
    ) {
      if (customThankYouTextNewPostsId.finalContent) {
        text = customThankYouTextNewPostsId.finalContent;
      } else {
        text = customThankYouTextNewPostsId.content;
      }
    }

    /*window.appDialogs.getDialogAsync('mastersnackbar', (snackbar: Snackbar) => {
      snackbar.textContent = text;
      snackbar.timeoutMs = 5000;
      snackbar.open = true;
    });*/

    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.allPostsBlockedByDefault
    ) {
      // Nothing?
    } else {
      YpNavHelpers.redirectTo("/post/" + (post ? post.id : this.post?.id));
    }
  }

  clear() {
    if (this.newPost) {
      this.post = {
        name: "",
        description: "",
        pointFor: "",
        categoryId: undefined,
      } as YpPostData;
      this.location = undefined;
      this.selectedCategoryArrayId = undefined;
      this.selectedCategoryId = undefined;
      this.selected = 0;
      this.uploadedHeaderImageId = undefined;
      this.uploadedVideoId = undefined;
      this.uploadedVideoUrl = undefined;
      this.uploadedAudioId = undefined;
      this.currentVideoId = undefined;
      this.currentAudioId = undefined;
      this.selectedCoverMediaType = "none";
      this.requestUpdate();
      if (this.$$("#imageFileUpload")) {
        //(this.$$('#imageFileUpload') as YpFileUpload).clear();
      }
    }
  }

  async setup(
    post: YpPostData | undefined,
    newItem: boolean,
    refreshFunction: Function | undefined,
    group: YpGroupData,
    params: any | undefined = undefined
  ) {
    if (window.appUser && window.appUser.loggedIn() === true) {
      this._setupGroup(group);
      if (newItem) {
        this.new = true;
      } else {
        this.new = false;
      }
      if (params) this.params = params;
      if (typeof this.setupAfterOpen === "function") {
        this.setupAfterOpen({ group: group });
      }

      if (post) {
        this.post = post;
        if (post.PostVideos && post.PostVideos.length > 0) {
          this.currentVideoId = post.PostVideos[0].id;
        }

        if (post.PostAudios && post.PostAudios.length > 0) {
          this.currentAudioId = post.PostAudios[0].id;
        }
      } else {
        this.post = undefined;
      }
      this._updateInitialCategory(group);
      this.newPost = newItem;
      this.refreshFunction = refreshFunction;
      this.setupTranslation();
      this.clear();
    } else {
      window.appUser.loginForEdit(this, newItem, params, this.refreshFunction!);
    }
  }

  _setupGroup(group: YpGroupData | undefined) {
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
          setTimeout(() => {
            this.liveQuestionIds = [];
            this.uniqueIdsToElementIndexes = {};
            this.liveUniqueIds = [];

            group.configuration.structuredQuestionsJson!.forEach(
              (question, index) => {
                if (
                  question.type.toLowerCase() === "textfield" ||
                  question.type.toLowerCase() === "textfieldlong" ||
                  question.type.toLowerCase() === "textarea" ||
                  question.type.toLowerCase() === "textarealong" ||
                  question.type.toLowerCase() === "numberfield" ||
                  question.type.toLowerCase() === "checkboxes" ||
                  question.type.toLowerCase() === "radios" ||
                  question.type.toLowerCase() === "dropdown"
                ) {
                  this.liveQuestionIds.push(index);
                  this.uniqueIdsToElementIndexes[question.uniqueId!] = index;
                  this.liveUniqueIds.push(question.uniqueId!);
                }
              }
            );
          });
        }
      } else {
        this.postDescriptionLimit = 500;
      }

      setTimeout(() => {
        if (this.structuredQuestions) {
          this.postDescriptionLimit = 9999;
        }
      }, 50);
    }
  }

  get mediaHidden() {
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.hideMediaInput === true
    ) {
      return true;
    }
    return false;
  }

  override setupAfterOpen(params: YpEditFormParams) {
    this._setupGroup(params.group);
    setTimeout(() => {
      const nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }, 250);

    if (
      this.post &&
      !this.newPost &&
      this.post.public_data &&
      this.post.public_data.structuredAnswersJson
    ) {
      this.initialStructuredAnswersJson =
        this.post.public_data.structuredAnswersJson;
    }

    this.checkSurveyAnswers();
  }

  _alternativeTextForNewIdeaButtonHeaderTranslation() {
    setTimeout(() => {
      const label = this.$$(
        "#alternativeTextForNewIdeaButtonHeaderId"
      ) as YpMagicText;
      if (label && label.finalContent) {
        this.editHeaderText = label.finalContent;
      }
    });
  }

  setupTranslation() {
    setTimeout(() => {
      if (this.t) {
        if (this.newPost) {
          if (
            this.group &&
            this.group.configuration &&
            this.group.configuration.alternativeTextForNewIdeaButtonHeader
          ) {
            const label = this.$$(
              "#alternativeTextForNewIdeaButtonHeaderId"
            ) as YpMagicText;
            this.editHeaderText =
              label && label.finalContent
                ? label.finalContent
                : this.group.configuration
                    .alternativeTextForNewIdeaButtonHeader;
          } else {
            this.editHeaderText = this.t("post.add_new");
          }

          if (
            this.group &&
            this.group.configuration &&
            this.group.configuration.alternativeTextForNewIdeaSaveButton
          ) {
            const label = this.$$(
              "#alternativeTextForNewIdeaSaveButtonId"
            ) as YpMagicText;
            this.saveText =
              label && label.finalContent
                ? label.finalContent
                : this.group.configuration.alternativeTextForNewIdeaSaveButton;
          } else {
            this.saveText = this.t("create");
          }
          this.snackbarText = this.t("postCreated");
        } else {
          this.saveText = this.t("save");
          this.editHeaderText = this.t("post.edit");
          this.snackbarText = this.t("postUpdated");
        }
      }
    }, 20);
  }
}
