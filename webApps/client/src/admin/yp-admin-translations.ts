//import 'chart.js';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/progress/linear-progress.js';

import { ShadowStyles } from '../common/ShadowStyles.js';

import { YpAdminPage } from './yp-admin-page.js';
import { YpLanguageSelector } from '../common/languages/yp-language-selector.js';
import { YpLanguages } from '../common/languages/ypLanguages.js';

@customElement('yp-admin-translations')
export class YpAdminTranslations extends YpAdminPage {
  @property({ type: Array })
  items: Array<YpTranslationTextData> | undefined;

  @property({ type: Boolean })
  waitingOnData = false;

  @property({ type: Object })
  editActive: Record<string, boolean> = {};

  @property({ type: Object })
  override collection: YpCollectionData | undefined;

  @property({ type: String })
  targetLocale: string | undefined;

  @property({ type: Number })
  baseMaxLength: number | undefined;

  supportedLanguages: YpLanguageData[];

  static override get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        #mainSelect {
          text-align: right;
          margin-right: 22px;
          margin-top: 8px;
        }

        .wordCloudContainer {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        md-linear-progress {
          margin-bottom: 8px;
        }

        .timeButtons {
          margin-top: 8px;
        }

        .item {
          max-width: 1008px;
          width: 1008px;
          margin-bottom: 16px;
          padding: 8px;
        }

        .originalText {
          width: 400px;
          flex: 1;
          padding: 8px;
        }

        .textType {
          width: 120px;
          padding: 8px;
        }

        .translatedText {
          flex: 2;
        }

        .innerTranslatedText {
          padding: 8px;
        }

        .dont-break-out {
          /* These are technically the same, but use both */
          overflow-wrap: break-word;
          word-wrap: break-word;

          -ms-word-break: break-all;
          /* This is the dangerous one in WebKit, as it breaks things wherever */
          word-break: break-all;
          /* Instead use this non-standard one: */
          word-break: break-word;

          /* Adds a hyphen where the word breaks, if supported (No Blink) */
          -ms-hyphens: auto;
          -moz-hyphens: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
        }

        md-linear-progress {
          width: 800px;
          margin-top: -4px;
          padding-top: 0;
          margin-bottom: 12px;
        }

        .progressPlaceHolder {
          margin-top: -4px;
          padding-top: 0;
          height: 4px;
          margin-bottom: 12px;
        }

        md-outlined-select {
          margin-bottom: 32px;
        }

        .contentId {
          margin-top: 4px;
        }
      `,
    ];
  }

  async getTranslationText() {
    this.waitingOnData = true;
    this.items = (await window.adminServerApi.getTextForTranslations(
      this.collectionType,
      this.collectionId as number,
      this.targetLocale!
    )).items as Array<YpTranslationTextData>;

    this.waitingOnData = false;
  }

  constructor() {
    super();
    this.waitingOnData = false;
    this.baseMaxLength = 300;

    this.supportedLanguages = YpLanguages.allLanguages;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  selectLanguage(event: CustomEvent) {
    if (event.target && (event.target as HTMLInputElement).value) {
      this.targetLocale = (event.target as HTMLInputElement).value;
      this.getTranslationText();
    }
  }

  openEdit(item: YpTranslationTextData) {
    this.editActive[item.indexKey!] = true;
    this.requestUpdate();
  }

  cancelEdit(item: YpTranslationTextData) {
    delete this.editActive[item.indexKey!];
    this.requestUpdate();
  }

  saveItem(
    item: YpTranslationTextData,
    options: { saveDirectly: boolean } | undefined = undefined
  ) {
    if (item && !options) {
      // eslint-disable-next-line no-param-reassign
      item.translatedText = (this.$$(
        `#editFor${item.indexKey}`
      ) as HTMLInputElement).value;
    }

    const updatedItem: YpTranslationTextData = {
      contentId: item.contentId,
      content: item.originalText!,
      textType: item.textType,
      translatedText: item.translatedText,
      extraId: item.extraId,
      targetLocale: this.targetLocale!,
    };

    window.adminServerApi.updateTranslation(
      this.collectionType,
      this.collectionId as number,
      updatedItem
    );

    this.cancelEdit(item);
  }

  async autoTranslate(item: YpTranslationTextData) {
    const updateUrl = `${this.getUrlFromTextType(item)}?contentId=${
      item.contentId
    }&textType=${item.textType}&targetLanguage=${this.targetLocale}`;
    const translation = (await window.serverApi.getTranslation(
      updateUrl
    )) as YpTranslationTextData;
    if (translation) {
      item.translatedText = translation.content;
      this.saveItem(item, { saveDirectly: true });
      this.requestUpdate();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getUrlFromTextType(item: YpTranslationTextData) {
    let url;
    switch (item.textType) {
      case 'postName':
      case 'postContent':
      case 'postTranscriptContent':
        url = `/api/posts/${item.contentId}/translatedText`;
        break;
      case 'pointContent':
      case 'pointAdminPointContent':
        url = `/api/points/${item.contentId}/translatedText`;
        break;
      case 'domainName':
      case 'domainContent':
        url = `/api/domains/${item.contentId}/translatedText`;
        break;
      case 'customRatingName':
        url = `/api/ratings/${item.contentId}/${item.extraId}/translatedText`;
        break;
      case 'communityName':
      case 'communityContent':
        url = `/api/communities/${item.contentId}/translatedText`;
        break;
      case 'alternativeTextForNewIdeaButtonClosed':
      case 'alternativeTextForNewIdeaButtonHeader':
      case 'customThankYouTextNewYps':
      case 'alternativePointForHeader':
      case 'customTitleQuestionText':
      case 'customAdminPointsTitle':
      case 'urlToReviewActionText':
      case 'alternativePointAgainstHeader':
      case 'customThankYouTextNewPoints':
      case 'alternativePointForLabel':
      case 'alternativePointAgainstLabel':
      case 'groupName':
      case 'groupContent':
        url = `/api/groups/${item.contentId}/translatedText`;
        break;
      case 'categoryName':
        url = `/api/categories/${item.contentId}/translatedText`;
        break;
      case 'statusChangeContent':
        url = `/api/posts/${item.extraId}/${item.contentId}/translatedStatusText`;
        break;
      default:
        return null;
    }
    return url;
  }

  get languages(): YpLanguageMenuItem[] {
    if (YpLanguages.allLanguages) {
      let arr = [];
      const highlighted = [];
      let highlightedLocales = ["en", "is", "fr", "de", "es", "ar"];
      if (window.appGlobals.highlightedLanguages) {
        highlightedLocales = window.appGlobals.highlightedLanguages.split(",");
      }

      highlightedLocales = highlightedLocales.map((item) =>
        item.replace("-", "_").toLowerCase()
      );

      for (let l = 0; l < YpLanguages.allLanguages.length; l++) {
        const language = YpLanguages.allLanguages[l];

        if (highlightedLocales.indexOf(language.code) > -1) {
          highlighted.push({
            language: language.code,
            name: `${language.nativeName} (${language.englishName})`,
          });
        } else {
          arr.push({
            language: language.code,
            name: `${language.nativeName} (${language.englishName})`,
          });
        }
      }

      arr = arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return highlighted.concat(arr);
    } else {
      return [];
    }
  }

  getMaxLength(item: YpTranslationTextData, baseLength: number) {
    if (
      item.textType === 'groupName' ||
      item.textType === 'postName' ||
      item.textType === 'communityName'
    ) {
      return 60;
    } else if (
      item.textType == 'groupContent' ||
      item.textType == 'communityContent'
    ) {
      return baseLength;
    } else {
      return 2500;
    }
  }

  textChanged(event: CustomEvent) {
    const description = (event.target as HTMLInputElement).value;
    const urlRegex = new RegExp(/(?:https?|http?):\/\/[\n\S]+/g);
    const urlArray = description.match(urlRegex);

    if (urlArray && urlArray.length > 0) {
      let urlsLength = 0;
      for (let i = 0; i < Math.min(urlArray.length, 10); i += 1) {
        urlsLength += urlArray[i].length;
      }
      let maxLength = 300;
      maxLength += urlsLength;
      maxLength -= Math.min(urlsLength, urlArray.length * 30);
      this.baseMaxLength = maxLength;
    }
  }

  renderItem(item: YpTranslationTextData) {
    return html`
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType layout vertical">
          <div>${this.t(item.textType)}</div>
          <div class="contentId">id: ${item.contentId}</div>
        </div>
        <div class="originalText dont-break-out">
          ${item.originalText}
        </div>

        <div class="layout vertical translatedText dont-break-out">
          ${this.editActive && this.editActive[item.indexKey!]
            ? html`
                <md-outlined-text-field
                  type="textarea"
                  rows="5"
                  id="editFor${item.indexKey}"
                  .maxLength="${this.getMaxLength(item, this.baseMaxLength!)}"
                  charCounter
                  @input="${this.textChanged}"
                  label="${this.t('editTranslation')}"
                  .value="${item.translatedText ? item.translatedText : ''}"
                >
                </md-outlined-text-field>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${() => this.cancelEdit(item)}"
                  >${this.t('cancel')}</md-filled-button>
                  <md-filled-button

                    @click="${() => this.saveItem(item)}"
                  >${this.t('save')}</md-filled-button>
                </div>
              `
            : html`
                <div class="innerTranslatedText">
                  ${item.translatedText
                    ? item.translatedText
                    : this.t('noTranslation')}
                </div>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${() => this.openEdit(item)}"
                  >${this.t('edit')}</md-filled-button>
                  <md-filled-button

                    ?hidden="${item.translatedText != null}"
                    @click="${() => this.autoTranslate(item)}"
                  >${this.t('autoTranslate')}</md-filled-button>
                </div>
              `}
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="container layout vertical center-center">
        ${this.waitingOnData
          ? html`
              <md-linear-progress
                indeterminate
                ?hidden="${!this.waitingOnData}"
              ></md-linear-progress>
            `
          : html` <div class="progressPlaceHolder"></div> `}
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <md-outlined-select
              .label="${this.t('selectLanguage')}"
              id="mainSelect"
              class="layout selfEnd"
              @change="${this.selectLanguage}"
            >
              ${this.languages.map(
                language => html`
                  <md-select-option .value="${language.language}"
                    >${language.name}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          </div>
          ${this.items
            ? this.items.map(item => this.renderItem(item))
            : nothing}
        </div>
      </div>
    `;
  }
}
