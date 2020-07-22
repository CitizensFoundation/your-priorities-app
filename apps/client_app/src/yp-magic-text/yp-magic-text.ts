import { property, html, css, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { Menu } from '@material/mwc-menu';
import { YpCollectionHelpers } from '../@yrpri/YpCollectionHelpers.js';

declare module "./sanitize-html.min.js";

import * as sanitizeHtml from './sanitize-html.min.js';
import { twemoji } from '@kano/twemoji/index.es.js';
import linkifyStr from 'linkifyjs/string';

@customElement('yp-magic-text')
export class YpMagicText extends YpBaseElement {
  @property({ type: String })
  content: string | undefined;

  @property({ type: String })
  truncatedContent: string | undefined;

  @property({ type: String })
  contentId: string | undefined;

  @property({ type: String })
  extraId: string | undefined;

  @property({ type: String })
  textType: string | undefined;

  @property({ type: String })
  contentLanguage: string | undefined;

  @property({ type: String })
  processedContent: string | undefined;

  @property({ type: String })
  finalContent: string | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: Number })
  truncate: number | undefined;

  @property({ type: String })
  moreText: string | undefined;

  @property({ type: String })
  closeDialogText: string | undefined;

  @property({ type: Boolean })
  textOnly = false;

  @property({ type: Boolean })
  isDialog = false;

  @property({ type: Boolean })
  disableTranslation = false;

  @property({ type: Boolean })
  simpleFormat = false;

  @property({ type: Boolean })
  skipSanitize = false;

  @property({ type: Boolean })
  removeUrls = false;

  @property({ type: String })
  structuredQuestionsConfig: string | undefined;

  @property({ type: Number })
  linkifyCutoff = 25;

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener('yp-auto-translate', this._autoTranslateEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener('yp-auto-translate', this._autoTranslateEvent);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .container[rtl] {
          direction: rtl;
        }

        .container[more-text] {
        }

        .moreText {
          color: var(--accent-color);
          background-color: #fff;
          margin-top: 8px;
        }

        @media (max-width: 600px) {
          .moreText {
            margin-bottom: 2px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="container layout-center-center layout-vertical"
        ?rlt="${this.rtl}"
        ?more-text="${this.showMoreText}">
        <!-- add max-width for IE11 -->
        <div
          ?hidden="${!this.finalContent}"
          inner-h-t-m-l="${ifDefined(this.finalContent)}"
          style="max-width:100%"></div>
        <div ?hidden="${this.finalContent!=null}" style="max-width:100%">
          ${this.truncatedContent}
        </div>

        ${this.showMoreText
          ? html`
              <mwc-button
                class="moreText"
                @click="${this._openFullScreen}"
                .label="${this.moreText}"></mwc-button>
            `
          : nothing }
      </div>

      <iron-ajax
        id="getTranslationAjax"
        @response="${this._getTranslationResponse}"></iron-ajax>
    `;
  }

  static get doubleWidthLanguages() {
    return ['zh_TW', 'hy'];
  }

  static get cyrillicLanguages() {
    return ['ru', 'ky'];
  }

  get showMoreText(): boolean {
    return (
      this.moreText!==undefined &&
      this.content!==undefined &&
      this.truncate!==undefined &&
      this.content.length > this.truncate
    );
  }

  _openFullScreen() {
    window.dialogs.getDialogAsync(
        'magicTextDialog',
        (dialog) => {
          dialog.open(
            this.content,
            this.contentId,
            this.extraId,
            this.textType,
            this.contentLanguage,
            this.closeDialogText,
            this.structuredQuestionsConfig,
            this.skipSanitize
          );
        }
      );
  }

  subClassProcessing() {
    // For sub classes
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('content')) {
      if (this.content && this.content !== '') {
        this.finalContent = undefined;
        if (window.appGlobals.autoTranslate) {
          this.autoTranslate = window.appGlobals.autoTranslate;
        }
        if (this.autoTranslate && this.truncate) {
          this.truncatedContent =  YpMagicText.truncateText(YpMagicText.trim(this.content), this.truncate);
        } else {
          this.truncatedContent = this.content;
        }
        this._update();
      } else {
        this.truncatedContent = undefined;
        this.finalContent = undefined;
      }
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._update();
  }

  _languageEvent(event: CustomEvent) {
    super._languageEvent(event);
    this._update();
  }

  get indexKey(): string {
    return `${this.textType}-${this.contentId}-${this.language}`;
  }

  _startTranslationAndFinalize() {
    if (window.appGlobals.cache.autoTranslateCache[this.indexKey]) {
      //console.warn("Using cache: "+window.appGlobals.autoTranslateCache[indexKey]);
      this.processedContent = window.appGlobals.cache.autoTranslateCache[this.indexKey];
      this._finalize();
    } else {
      this.$$('#getTranslationAjax').params = {
        textType: this.textType,
        contentId: this.contentId,
        targetLanguage: this.language,
      };
      switch (this.textType) {
        case 'postName':
        case 'postContent':
        case 'postTranscriptContent':
          this.$$('#getTranslationAjax').url =
            '/api/posts/' + this.contentId + '/translatedText';
          break;
        case 'pointContent':
        case 'pointAdminCommentContent':
          this.$$('#getTranslationAjax').url =
            '/api/points/' + this.contentId + '/translatedText';
          break;
        case 'domainName':
        case 'domainContent':
          this.$$('#getTranslationAjax').url =
            '/api/domains/' + this.contentId + '/translatedText';
          break;
        case 'customRatingName':
          this.$.getTranslationAjax.url =
            '/api/ratings/' +
            this.contentId +
            '/' +
            this.extraId +
            '/translatedText';
          break;
        case 'communityName':
        case 'communityContent':
          this.$$('#getTranslationAjax').url =
            '/api/communities/' + this.contentId + '/translatedText';
          break;
        case 'alternativeTextForNewIdeaButton':
        case 'alternativeTextForNewIdeaButtonClosed':
        case 'alternativeTextForNewIdeaButtonHeader':
        case 'customThankYouTextNewPosts':
        case 'alternativePointForHeader':
        case 'customAdminCommentsTitle':
        case 'alternativePointAgainstHeader':
        case 'alternativePointForLabel':
        case 'alternativePointAgainstLabel':
        case 'groupName':
        case 'groupContent':
          this.$$('#getTranslationAjax').url =
            '/api/groups/' + this.contentId + '/translatedText';
          break;
        case 'categoryName':
          this.$$('#getTranslationAjax').url =
            '/api/categories/' + this.contentId + '/translatedText';
          break;
        case 'statusChangeContent':
          this.$$('#getTranslationAjax').url =
            '/api/posts/' +
            this.extraId +
            '/' +
            this.contentId +
            '/translatedStatusText';
          break;
        default:
          console.error(
            'No valid textType for magic text to translate: ' + this.textType
          );
          return;
      }
      if (this.contentId) {
        this.$$('#getTranslationAjax').generateRequest();
      } else {
        console.error('No content id for: ' + this.textType);
        this._finalize();
      }
    }
  }

  _getTranslationResponse(event: CustomEvent) {
    this.processedContent = event.detail.response.content;
    if (this.processedContent) {
      window.appGlobals.cache.autoTranslateCache[this.indexKey] = this.processedContent;
    } else {
      console.error('No content for magic text');
    }
    this.fire('new-translation');
    this._finalize();
  }

  _update() {
    this.processedContent = this.content;
    if (this.processedContent) {
      if (
        this.autoTranslate &&
        this.language !== this.contentLanguage &&
        !this.disableTranslation &&
        this.contentLanguage !== '??'
      ) {
        this._startTranslationAndFinalize();
      } else {
        this._finalize();
      }
    }
  }

  _setupStructuredQuestions() {
    if (this.structuredQuestionsConfig) {
      let structuredQuestionsJson;
      try {
        structuredQuestionsJson = JSON.parse(this.structuredQuestionsConfig);
      } catch (error) {
        structuredQuestionsJson = null;
      }

      if (structuredQuestionsJson) {
        // TODO: setup json display
      } else {
        const structuredQuestions = [];
        const questionComponents = this.structuredQuestionsConfig.split(',');
        if (questionComponents && questionComponents.length > 1) {
          for (let i = 0; i < questionComponents.length; i += 2) {
            structuredQuestions.push(questionComponents[i]);
          }
          const regEx = new RegExp(
            '(' + structuredQuestions.join('|') + ')',
            'ig'
          );
          this.processedContent = this.processedContent?.replace(
            regEx,
            '<b>$1</b>'
          );
        } else {
          console.warn('Not questions for structuredQuestionsConfig');
        }
      }
    }
  }

  _finalize() {
    if (!this.textOnly) {
      this._linksAndEmojis();
    }

    if (!this.isDialog && !this.truncate) {
      this.truncate = 500;
    }

    if (
      this.truncate &&
      this.content &&
      (this.content.length > this.truncate || this.autoTranslate)
    ) {
      let truncateBy = this.truncate;
      if (
        this.autoTranslate &&
        YpMagicText.doubleWidthLanguages.indexOf(this.language) > -1
      ) {
        truncateBy = truncateBy / 2;
      }
      if (this.processedContent)
        this.processedContent = YpMagicText.truncateText(
          YpMagicText.trim(this.processedContent),
          truncateBy,
          '...'
      );
    }

    if (this.simpleFormat && this.processedContent) {
      this.processedContent = this.processedContent
        .trim()
        .replace(/(\n)/g, '<br>');
    }

    if (this.removeUrls && this.processedContent) {
      this.processedContent = this.processedContent.replace(
        /(?:https?|ftp):\/\/[\n\S]+/g,
        ''
      );
    }

    this._setupStructuredQuestions();

    this.subClassProcessing();

    if (this.processedContent !== this.finalContent) {
      if (!window.appGlobals.magicTextIronResizeDebouncer) {
        window.appGlobals.magicTextIronResizeDebouncer = window.setTimeout(
          () => {
            window.appGlobals.magicTextIronResizeDebouncer = undefined;
            this.fire('iron-resize');
          },
          100
        );
      }
    }

    if (
      this.processedContent &&
      this.processedContent !== 'undefined' &&
      this.content !== this.processedContent
    ) {
      this.finalContent = this.processedContent;
    } else {
      this.finalContent = undefined;
    }
  }

  _linksAndEmojis() {
    if (!this.skipSanitize) {
      this.processedContent = sanitizeHtml(this.processedContent, {
        allowedTags: ['b', 'i', 'em', 'strong'],
      }) as string;
      this.processedContent = this.processedContent.replace(/&amp;/g, '&');
      this.processedContent = linkifyStr(this.processedContent, {
        format: (value, type) => {
          if (type === 'url' && value.length > this.linkifyCutoff - 1) {
            value = value.slice(0, this.linkifyCutoff) + '…';
          }
          return value;
        }
      });
      this.processedContent = this.processedContent.replace(/&amp;/g, '&');
      this.processedContent = twemoji
        .parse(this.processedContent)
        .replace(/&amp;quot;/g, '"')
        .replace(
          /class="emoji" /g,
          'style="height: 1em;width: 1em;margin: 0 .3em 0 .3em;vertical-align: -0.1em;" '
        );
    }
  }

  static truncateText(
    input: string,
    length: number,
    killwords: string | undefined = undefined,
    end: number | undefined = undefined
  ) {
    length = length || 255;

    if (input.length <= length) return input;

    if (killwords) {
      input = input.substring(0, length);
    } else {
      let idx = input.lastIndexOf(' ', length);
      if (idx === -1) {
        idx = length;
      }

      input = input.substring(0, idx);
    }

    input += end !== undefined && end !== null ? end : '...';
    return input;
  }

  static trim(input: string): string {
    return input.replace(/^\s*|\s*$/g, '').trim();
  }
}
