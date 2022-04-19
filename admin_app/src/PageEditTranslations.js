/* eslint-disable no-unneeded-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable dot-notation */
/* eslint-disable no-plusplus */
import 'chart.js';
import { html, css } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';
import '@material/mwc-select';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-textarea';
import '@material/mwc-textfield';
import '@material/mwc-linear-progress';

export class PageEditTranslations extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        #mainSelect {
          text-align: right;
          margin-right: 22px;
          margin-top: 8px;
        }

        .surveyTextField {
          width: 100%;
        }

        .wordCloudContainer {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        mwc-linear-progress {
          margin-bottom: 8px;
        }

        .timeButtons {
          margin-top: 8px;
        }

        .item {
          max-width: 1008px;
          width: 1008px;
          background-color: white;
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
          min-width: 120px;
          padding: 8px;
          word-break: break-all;
          overflow: hidden;
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

        mwc-linear-progress {
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

        mwc-select {
          margin-bottom: 32px;
        }

        .contentId {
          color: #999;
          margin-top: 4px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      items: { type: Array },
      surveyQuestionTranslations: { type: Array },
      registrationQuestionTranslations: { type: Array },
      structuredQuestionsFlat: { type: Array },
      structuredQuestionsForAnswers: { type: Array },
      registrationQuestionsFlat: { type: Array },
      waitingOnData: { type: Boolean },
      editActive: { type: Object },
      collection: { type: Object },
      targetLocale: { type: String },
      baseMaxLength: { type: Number },
    };
  }

  getTranslationText() {
    this.waitingOnData = true;
    fetch(
      `${this.getTextForTranslationsUrl}?targetLocale=${this.targetLocale}`,
      { credentials: 'same-origin' }
    )
      .then(res => this.handleNetworkErrors(res))
      .then(res => res.json())
      .then(response => {
        this.waitingOnData = false;
        this.items = response.items;
        if (this.collectionType == 'groups') {
          if (this.collection.configuration.structuredQuestionsJson) {
            this.surveyQuestionTranslations =
              response.surveyQuestionTranslations;
            this.structuredQuestionsFlat = this._flattenQuestions(
              this.collection.configuration.structuredQuestionsJson
            );

            this.structuredQuestionsForAnswers = this.collection.configuration.structuredQuestionsJson.filter( question => {
              return question.uniqueId!=null
            })
          }

          if (this.collection.configuration.registrationQuestionsJson) {
            this.registrationQuestionTranslations =
              response.registrationQuestionTranslations;
            this.registrationQuestionsFlat = this._flattenQuestions(
              this.collection.configuration.registrationQuestionsJson
            );
          }
        } else {
          this.surveyQuestionTranslations = undefined;
          this.registrationQuestionTranslations = undefined;
          this.structuredQuestionJson = undefined;
          this.registrationQuestionsJson = undefined;
        }
      })
      .catch(error => {
        this.waitingOnData = false;
        this.fire('app-error', error);
      });
  }

  _flattenQuestions(questions) {
    const outQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      outQuestions.push(question.text);

      if (
        question.type === 'radios' &&
        question.radioButtons &&
        question.radioButtons.length > 0
      ) {
        for (let n = 0; n < question.radioButtons.length; n++) {
          outQuestions.push(question.radioButtons[n].text);
        }
      } else if (
        question.type === 'checkboxes' &&
        question.checkboxes &&
        question.checkboxes.length > 0
      ) {
        for (let n = 0; n < question.checkboxes.length; n++) {
          outQuestions.push(question.checkboxes[n].text);
        }
      } else if (
        question.type === 'dropdown' &&
        question.dropdownOptions &&
        question.dropdownOptions.length > 0
      ) {
        for (let n = 0; n < question.dropdownOptions.length; n++) {
          outQuestions.push(question.dropdownOptions[n].text);
        }
      }
    }

    return outQuestions;
  }

  constructor() {
    super();
    this.waitingOnData = false;
    this.editActive = {};
    this.baseMaxLength = 300;

    this.supportedLanguages = {
      en: 'English (US)',
      en_GB: 'English (GB)',
      fr: 'Français',
      is: 'Íslenska',
      es: 'Español',
      et: 'Eesti',
      cs: 'čeština',
      it: 'Italiano',
      ar: 'اَلْعَرَبِيَّةُ',
      ar_EG: 'اَلْعَرَبِيَّةُ (EG)',
      ca: 'Català',
      ro_MD: 'Moldovenească',
      ro: 'Românește',
      de: 'Deutsch',
      da: 'Dansk',
      sv: 'Svenska',
      en_CA: 'English (CA)',
      nl: 'Nederlands',
      el: 'Ελληνικά',
      no: 'Norsk',
      lv: "Latviešu",
      uk: 'українська',
      sq: 'Shqip',
      ky: 'Кыргызча',
      uz: 'Ўзбек',
      tr: 'Türkçe',
      fa: 'فارسی',
      pl: 'Polski',
      pt: 'Português',
      pt_BR: 'Português (Brazil)',
      ru: 'Русский',
      hu: 'Magyar',
      zh_TW: '国语 (TW)',
      sk: 'Slovenčina',
      sl: 'Slovenščina',
      sr: 'Srpski',
      sr_latin: 'Srpski (latin)',
      hr: 'Hrvatski',
      bg: 'български'
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.getTextForTranslationsUrl = `/api/${this.collectionType}/${this.collectionId}/get_translation_texts`;
  }

  firstUpdated() {
    super.firstUpdated();
  }

  selectLanguage(event) {
    if (event.target && event.target.value) {
      this.targetLocale = event.target.value;
      this.getTranslationText();
    }
  }

  openEdit(indexKey) {
    this.editActive[indexKey] = true;
    this.requestUpdate();
  }

  cancelEdit(indexKey) {
    delete this.editActive[indexKey];
    this.requestUpdate();
  }

  saveItem(item, options) {
    if (!options) {
      // eslint-disable-next-line no-param-reassign
      item.translatedText = this.$$(`#editFor${item.indexKey}`).value;
    }
    const updateUrl = `/api/${this.collectionType}/${this.collectionId}/update_translation`;
    fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentId: item.contentId,
        content: item.originalText,
        textType: item.textType,
        translatedText: item.translatedText,
        extraId: item.extraId,
        targetLocale: this.targetLocale,
      }),
    });
    this.cancelEdit(item.indexKey);
  }

  saveQuestions(questions, type) {
    const translations = [];

    let translationCounter = 0;
    for (let i = 0; i < questions.length; i++) {
      if (this.$$(`#${type}${translationCounter}`)) {
        translations.push(this.$$(`#${type}${translationCounter++}`).value);
      } else {
        translations.push("");
      }
    }

    const updateUrl = `/api/${this.collectionType}/${this.collectionId}/update_structured_translations`;
    fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        translations,
        questions,
        type,
        targetLocale: this.targetLocale,
      }),
    }).then(()=>{
      this.getTranslationText();
    });

    delete this.editActive[type];
    this.requestUpdate();
  }

  autoTranslate(item) {
    const updateUrl = this.getUrlFromTextType(item);
    fetch(
      `${updateUrl}?contentId=${item.contentId}&textType=${item.textType}&targetLanguage=${this.targetLocale}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(translation => {
        if (translation) {
          // eslint-disable-next-line no-param-reassign
          item.translatedText = translation.content;
          this.saveItem(item, { saveDirectly: true });
          this.requestUpdate();
        }
      });
  }

  // eslint-disable-next-line class-methods-use-this
  getUrlFromTextType(item) {
    let url;
    switch (item.textType) {
      case 'postName':
      case 'postContent':
      case 'postTags':
      case 'postTranscriptContent':
        url = `/api/posts/${item.contentId}/translatedText`;
        break;
      case 'pointContent':
      case 'pointAdminCommentContent':
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
      case 'alternativeTextForNewIdeaButton':
      case 'alternativeTextForNewIdeaButtonClosed':
      case 'alternativeTextForNewIdeaButtonHeader':
      case 'alternativeTextForNewIdeaSaveButton':
      case 'customCategoryQuestionText':
      case 'customThankYouTextNewPosts':
      case 'alternativePointForHeader':
      case 'customTitleQuestionText':
      case 'urlToReviewActionText':
      case 'customAdminCommentsTitle':
      case 'customTabTitleNewLocation':
      case 'alternativePointAgainstHeader':
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
    let highlightedLocales = ['en', 'en_GB', 'is', 'fr', 'de', 'es', 'ar'];
    if (
      this.collection.configuration &&
      this.collection.configuration.highlightedLanguages
    ) {
      highlightedLocales = this.collection.configuration.highlightedLanguages.split(
        ','
      );
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.supportedLanguages) {
      if (this.supportedLanguages.hasOwnProperty(key)) {
        if (highlightedLocales.indexOf(key) > -1) {
          highlighted.push({ locale: key, name: this.supportedLanguages[key] });
        } else {
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
    if (item.textType=="PostAnswer") {
      return this.renderItemAnswers(item);
    } else {
      return this.renderItemNormal(item);
    }
  }

  renderItemAnswers(item) {
    return this.structuredQuestionsForAnswers
      ? this.renderQuestions(
      item.indexKey,
        this.structuredQuestionsForAnswers,
      item.translatedText ? JSON.parse(item.translatedText) : []
      )
      : nothing
  }

  renderItemNormal(item) {
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
          ${this.editActive[item.indexKey]
            ? html`
                <mwc-textarea
                  rows="5"
                  id="editFor${item.indexKey}"
                  .maxLength="${this.getMaxLength(item, this.baseMaxLength)}"
                  charCounter
                  @input="${this.textChanged}"
                  .label="${this.t('editTranslation')}"
                  .value="${item.translatedText ? item.translatedText : ''}"
                >
                </mwc-textarea>
                <div class="layout horizontal endAligned">
                  <mwc-button
                    .label="${this.t('cancel')}"
                    @click="${() => this.cancelEdit(item.indexKey)}"
                  ></mwc-button>
                  <mwc-button
                    .label="${this.t('save')}"
                    @click="${() => this.saveItem(item)}"
                  ></mwc-button>
                </div>
              `
            : html`
                <div class="innerTranslatedText">
                  ${item.translatedText
                    ? item.translatedText
                    : this.t('noTranslation')}
                </div>
                <div class="layout horizontal endAligned">
                  <mwc-button
                    .label="${this.t('edit')}"
                    @click="${() => this.openEdit(item.indexKey)}"
                  ></mwc-button>
                  <mwc-button
                    .label="${this.t('autoTranslate')}"
                    ?hidden="${item.translatedText}"
                    @click="${() => this.autoTranslate(item)}"
                  ></mwc-button>
                </div>
              `}
        </div>
      </div>
    `;
  }

  renderQuestionItem(type, index, translatedText) {
    return html`
      ${
        this.editActive[type]
          ? html`
              <mwc-textarea
                id="${type}${index}"
                maxLength="20000"
                rows="5"
                style="width: 850px;"
                class="surveyTextField"
                .label="${this.t('editTranslation')}"
                .value="${translatedText ? translatedText : ''}"
              >
              </mwc-textarea>
            `
          : html`
              <div class="innerTranslatedText">
                ${translatedText ? translatedText : this.t('noTranslation')}
              </div>
            `
      }
        </div>

    `;
  }

  renderQuestions(type, questions, translations) {
    return html`
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType layout vertical">
          <div>${type}</div>
          <div class="contentId">id: ${this.collectionId}</div>
        </div>
        <div class="layout vertical">
          <div class="layout vertical translatedText dont-break-out">
            ${this.editActive[type]
              ? html`
                  <div class="layout horizontal endAligned">
                    <mwc-button
                      .label="${this.t('cancel')}"
                      @click="${() => this.cancelEdit(type)}"
                    ></mwc-button>
                    <mwc-button
                      .label="${this.t('save')}"
                      @click="${() => this.saveQuestions(questions, type)}"
                    ></mwc-button>
                  </div>
                `
              : html`
                  <div class="layout horizontal endAligned">
                    <mwc-button
                      .label="${this.t('edit')}"
                      @click="${() => this.openEdit(type)}"
                    ></mwc-button>
                  </div>
                `}
          </div>
          ${questions.map((question, index) => {
            return html`
              <div class="innerTranslatedText">
                ${question.text ? question.text : question}
              </div>

              <div>
                ${this.renderQuestionItem(type, index, translations[index])}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container layout vertical center-center">
        ${this.waitingOnData
          ? html`
              <mwc-linear-progress
                indeterminate
                ?hidden="${!this.waitingOnData}"
              ></mwc-linear-progress>
            `
          : html` <div class="progressPlaceHolder"></div> `}
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <mwc-select
              outlined
              .label="${this.t('selectLanguage')}"
              id="mainSelect"
              class="layout selfEnd"
              @selected="${this.selectLanguage}"
            >
              ${this.languages.map(
                language => html`
                  <mwc-list-item .value="${language.locale}"
                    >${language.name}</mwc-list-item
                  >
                `
              )}
            </mwc-select>
          </div>
          ${this.items
            ? this.items.map(item => this.renderItem(item))
            : nothing}
          ${this.structuredQuestionsFlat
            ? this.renderQuestions(
                'survey',
                this.structuredQuestionsFlat,
                this.surveyQuestionTranslations
              )
            : nothing}
          ${this.registrationQuestionsFlat
            ? this.renderQuestions(
                'registration',
                this.registrationQuestionsFlat,
                this.registrationQuestionTranslations
              )
            : nothing}
        </div>
      </div>
    `;
  }
}

window.customElements.define('page-edit-translations', PageEditTranslations);
