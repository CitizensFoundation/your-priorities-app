import { LitElement, css, property, html, TemplateResult } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from './yp-admin-page.js';

import './@yrpri/yp-survey/yp-structured-question-edit.js';
import '@material/mwc-tab';
import '@material/mwc-circular-progress-four-color';
import './@yrpri/yp-file-upload/yp-file-upload.js';

import '@material/mwc-tab-bar';
import { YpForm } from './@yrpri/common/yp-form.js';
import './@yrpri/common/yp-form.js';
import { CircularProgressFourColorBase } from '@material/mwc-circular-progress-four-color/mwc-circular-progress-four-color-base';
import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
import { nothing } from 'lit-html';

export abstract class YpAdminConfigBase extends YpAdminPage {
  @property({ type: Array })
  configTabs: Array<YpConfigTabData> | undefined;

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: Boolean })
  configChanged = false;

  @property({ type: String })
  method = 'POST';

  @property({ type: String })
  action: string | undefined;

  @property({ type: Boolean })
  hasVideoUpload = false;

  @property({ type: Boolean })
  hasAudioUpload = false;

  @property({ type: Number })
  uploadedLogoImageId: number | undefined;

  @property({ type: Number })
  uploadedHeaderImageId: number | undefined;

  @property({ type: String })
  editHeaderText: string | undefined;

  @property({ type: String })
  toastText: string | undefined;

  @property({ type: String })
  saveText: string | undefined;

  @property({ type: Number })
  themeId: number | undefined;

  constructor() {
    super();
  }

  abstract setupConfigTabs(): Array<YpConfigTabData>;

  abstract renderHeader(): TemplateResult | {};


  async _formResponse(event: CustomEvent) {
    this.configChanged = false;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener('yp-has-video-upload', () => {
      this.hasVideoUpload = true;
    });
    this.addGlobalListener('yp-has-audio-upload', () => {
      this.hasAudioUpload = true;
    });
    if (window.appGlobals.hasVideoUpload) this.hasVideoUpload = true;
    if (window.appGlobals.hasAudioUpload) this.hasAudioUpload = true;
    this.addListener('yp-form-response', this._formResponse);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener('yp-has-video-upload', () => {
      this.hasVideoUpload = true;
    });
    this.removeGlobalListener('yp-has-audio-upload', () => {
      this.hasAudioUpload = true;
    });
    this.removeListener('yp-form-response', this._formResponse);
  }

  _logoImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.uploadedLogoImageId = image.id;
  }

  _headerImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  renderSaveButton() {
    return html`
      <div class="layout horizontal">
        <mwc-button
          raised
          class="saveButton"
          ?disabled="${!this.configChanged}"
          .label="${this.saveText || ''}"
          @click="${this._save}"
        ></mwc-button>
      </div>
      <div>
        <mwc-circular-progress-four-color
          id="spinner"
        ></mwc-circular-progress-four-color>
      </div>
    `;
  }

  renderTabs() {
    return html`
      <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
        ${this.configTabs!.map(
          item => html`
            <mwc-tab
              .label="${this.t(item.name)}"
              .icon="${this.t(item.icon)}"
            ></mwc-tab>
          `
        )}
      </mwc-tab-bar>
    `;
  }

  renderTabPages() {
    let allPages: Array<TemplateResult> = [];

    this.configTabs?.forEach((tab, index) => {
      allPages.push(this.renderTabPage(tab.items, index));
    });

    return html`${allPages}`;
  }

  renderTabPage(configItems: Array<YpStructuredConfigData>, itemIndex: number) {
    return html`<div ?hidden="${this.selectedTab != itemIndex}">
      ${configItems.map(
        (question, index) => html`
          ${question.type == 'html'
            ? html`<div class="adminItem">${question.templateData}</div>`
            : html`
                <yp-structured-question-edit
                  index="${index}"
                  id="configQuestion_${index}"
                  @yp-answer-content-changed="${this._configChanged}"
                  .name="${question.name || question.text}"
                  debounceTimeMs="10"
                  .value="${question.value || this._getCurrentValue(question)}"
                  .question="${{
                    ...question,
                    text: question.translationToken
                      ? this.t(question.translationToken)
                      : this.t(question.text),
                    uniqueId: `u${index}`,
                  }}"
                >
                </yp-structured-question-edit>
              `}
        `
      )}
    </div>`;
  }

  renderHeaderAndLogoImageUploads() {
    return html`
      <div class="layout vertical additionalSettings">
        <yp-file-upload
          id="logoImageUpload"
          raised
          target="/api/images?itemType=domain-logo"
          method="POST"
          buttonIcon="photo_camera"
          subText="864 x 486px"
          .buttonText="${this.t('image.logo.upload')}"
          @success="${this._logoImageUploaded}"
        >
        </yp-file-upload>
      </div>

      <div class="layout vertical additionalSettings">
        <yp-file-upload
          id="headerImageUpload"
          raised
          target="/api/images?itemType=domain-header"
          method="POST"
          buttonIcon="photo_camera"
          subText="1920 x 600px"
          .buttonText="${this.t('image.header.upload')}"
          @success="${this._headerImageUploaded}"
        >
        </yp-file-upload>
      </div>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .saveButton {
          margin-left: 16px;
        }
        mwc-textfield,
        mwc-textarea {
          width: 400px;
        }

        mwc-tab-bar {
          margin-top: 16px;
          margin-bottom: 24px;
          width: 1024px;
        }

        .adminItem {
          margin: 8px;
          max-width: 420px;
        }

        yp-structured-question-edit {
          max-width: 420px;
        }
      `,
    ];
  }
  render() {
    return this.configTabs
      ? html`
          <yp-form id="form" method="POST" customRedirect>
            <form
              name="ypForm"
              .method="${this.method}"
              .action="${this.action ? this.action : ''}"
            >
              ${this.renderHeader()} ${this.renderTabs()}
              ${this.renderTabPages()}

              <input
                type="hidden"
                name="themeId"
                .value="${this.themeId?.toString() || ''}"
              />
              <input
                type="hidden"
                name="uploadedLogoImageId"
                .value="${this.uploadedLogoImageId?.toString() || ''}"
              />
              <input
                type="hidden"
                name="uploadedHeaderImageId"
                .value="${this.uploadedHeaderImageId?.toString() || ''}"
              />
            </form>
          </yp-form>
        `
      : nothing;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this.configTabs = this.setupConfigTabs();
    }

    if (changedProperties.has('collectionId') && this.collectionId) {
      if (this.collectionId == 'new') {
        this.method = 'POST';
      } else {
        this.method = 'PUT';
      }
    }
  }

  _save() {
    const form = this.$$('#form') as YpForm;

    if (form.validate()) {
      form.submit();
      (this.$$('#spinner') as CircularProgressFourColorBase).hidden = false;
    } else {
      this.fire('yp-form-invalid');
      const error = this.t('form.invalid');
      this._showErrorDialog(error);
    }
  }

  _showErrorDialog(errorText: string) {
    this.fire('yp-error', errorText);
  }

  _configChanged() {
    this.configChanged = true;
    debugger;
  }

  _getSaveCollectionPath(path: string) {
    try {
      return eval(`this.collection.${path}`);
    } catch (e) {
      return undefined;
    }
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      const description = this.$$('#description') as HTMLInputElement;
      const emojiSelector = this.$$(
        '#emojiSelectorDescription'
      ) as YpEmojiSelector;
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Collection edit: Can't bind emojis :(");
      }
    }, 500);
  }

  _getCurrentValue(question: YpStructuredQuestionData) {
    if (this.collection && this.collection.configuration) {
      const looseConfig = this.collection.configuration as LooseObject;
      if (question.text.indexOf('.') > -1) {
        try {
          return eval(`this.collection.configuration.${question.text}`);
        } catch (e) {
          console.error(e);
        }
      } else {
        if (looseConfig[question.text]) return looseConfig[question.text];
      }
    }
  }
}
