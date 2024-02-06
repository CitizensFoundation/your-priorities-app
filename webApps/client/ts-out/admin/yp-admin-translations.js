var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import 'chart.js';
import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/progress/linear-progress.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpAdminPage } from './yp-admin-page.js';
import { YpLanguages } from '../common/languages/ypLanguages.js';
let YpAdminTranslations = class YpAdminTranslations extends YpAdminPage {
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
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
        this.items = (await window.adminServerApi.getTextForTranslations(this.collectionType, this.collectionId, this.targetLocale)).items;
        this.waitingOnData = false;
    }
    constructor() {
        super();
        this.waitingOnData = false;
        this.editActive = {};
        this.waitingOnData = false;
        this.baseMaxLength = 300;
        this.supportedLanguages = YpLanguages.allLanguages;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    selectLanguage(event) {
        if (event.target && event.target.value) {
            this.targetLocale = event.target.value;
            this.getTranslationText();
        }
    }
    openEdit(item) {
        this.editActive[item.indexKey] = true;
        this.requestUpdate();
    }
    cancelEdit(item) {
        delete this.editActive[item.indexKey];
        this.requestUpdate();
    }
    saveItem(item, options = undefined) {
        if (item && !options) {
            // eslint-disable-next-line no-param-reassign
            item.translatedText = this.$$(`#editFor${item.indexKey}`).value;
        }
        const updatedItem = {
            contentId: item.contentId,
            content: item.originalText,
            textType: item.textType,
            translatedText: item.translatedText,
            extraId: item.extraId,
            targetLocale: this.targetLocale,
        };
        window.adminServerApi.updateTranslation(this.collectionType, this.collectionId, updatedItem);
        this.cancelEdit(item);
    }
    async autoTranslate(item) {
        const updateUrl = `${this.getUrlFromTextType(item)}?contentId=${item.contentId}&textType=${item.textType}&targetLanguage=${this.targetLocale}`;
        const translation = (await window.serverApi.getTranslation(updateUrl));
        if (translation) {
            item.translatedText = translation.content;
            this.saveItem(item, { saveDirectly: true });
            this.requestUpdate();
        }
    }
    // eslint-disable-next-line class-methods-use-this
    getUrlFromTextType(item) {
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
    get languages() {
        let arr = [];
        const highlighted = [];
        let highlightedLocales = ['en', 'en_gb', 'is', 'fr', 'de', 'es', 'ar'];
        if (this.collection &&
            this.collection.configuration &&
            this.collection.configuration.highlightedLanguages) {
            highlightedLocales = this.collection.configuration.highlightedLanguages.split(',');
        }
        for (const key in this.supportedLanguages) {
            if (this.supportedLanguages.hasOwnProperty(key)) {
                if (highlightedLocales.indexOf(key) > -1) {
                    highlighted.push({ locale: key, name: this.supportedLanguages[key] });
                }
                else {
                    arr.push({ locale: key, name: this.supportedLanguages[key] });
                }
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
    }
    getMaxLength(item, baseLength) {
        if (item.textType === 'groupName' ||
            item.textType === 'postName' ||
            item.textType === 'communityName') {
            return 60;
        }
        else if (item.textType == 'groupContent' ||
            item.textType == 'communityContent') {
            return baseLength;
        }
        else {
            return 2500;
        }
    }
    textChanged(event) {
        const description = event.target.value;
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
    renderItem(item) {
        return html `
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType layout vertical">
          <div>${this.t(item.textType)}</div>
          <div class="contentId">id: ${item.contentId}</div>
        </div>
        <div class="originalText dont-break-out">
          ${item.originalText}
        </div>

        <div class="layout vertical translatedText dont-break-out">
          ${this.editActive && this.editActive[item.indexKey]
            ? html `
                <md-outlined-text-field
                  type="textarea"
                  rows="5"
                  id="editFor${item.indexKey}"
                  .maxLength="${this.getMaxLength(item, this.baseMaxLength)}"
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
            : html `
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
    render() {
        return html `
      <div class="container layout vertical center-center">
        ${this.waitingOnData
            ? html `
              <md-linear-progress
                indeterminate
                ?hidden="${!this.waitingOnData}"
              ></md-linear-progress>
            `
            : html ` <div class="progressPlaceHolder"></div> `}
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <md-outlined-select
              .label="${this.t('selectLanguage')}"
              id="mainSelect"
              class="layout selfEnd"
              @change="${this.selectLanguage}"
            >
              ${this.languages.map(language => html `
                  <md-select-option .value="${language.locale}"
                    >${language.name}</md-select-option
                  >
                `)}
            </md-outlined-select>
          </div>
          ${this.items
            ? this.items.map(item => this.renderItem(item))
            : nothing}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Array })
], YpAdminTranslations.prototype, "items", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminTranslations.prototype, "waitingOnData", void 0);
__decorate([
    property({ type: Object })
], YpAdminTranslations.prototype, "editActive", void 0);
__decorate([
    property({ type: Object })
], YpAdminTranslations.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpAdminTranslations.prototype, "targetLocale", void 0);
__decorate([
    property({ type: Number })
], YpAdminTranslations.prototype, "baseMaxLength", void 0);
YpAdminTranslations = __decorate([
    customElement('yp-admin-translations')
], YpAdminTranslations);
export { YpAdminTranslations };
//# sourceMappingURL=yp-admin-translations.js.map