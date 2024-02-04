var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YpMagicText_1;
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import linkifyHtml from "linkify-html";
import { YpBaseElement } from "../common/yp-base-element.js";
import { twemoji } from "@kano/twemoji/index.es.js";
import '@material/web/progress/linear-progress.js';
let YpMagicText = YpMagicText_1 = class YpMagicText extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.autoTranslate = false;
        this.textOnly = false;
        this.isDialog = false;
        this.disableTranslation = false;
        this.simpleFormat = false;
        this.skipSanitize = false;
        this.removeUrls = false;
        this.isFetchingTranslation = false;
        this.linkifyCutoff = 25;
        this.widetext = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener("yp-auto-translate", this._autoTranslateEvent.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-auto-translate", this._autoTranslateEvent.bind(this));
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .container[rtl] {
          direction: rtl;
        }

        .container[more-text] {
        }

        .moreText {
          margin-top: 8px;
        }

        md-linear-progress {
          margin-top: 12px;
          width: 80%;
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
        return html `
      <div
        class="container layout vertical center-center"
        ?rlt="${this.rtl}"
        ?more-text="${this.showMoreText}"
      >
        ${this.finalContent
            ? html ` <div>${unsafeHTML(this.finalContent)}</div> `
            : html ` <div>${this.truncatedContent}</div> `}
        ${this.showMoreText && this.moreText
            ? html `
                <md-outlined-button
                  class="moreText"
                  @click="${this._openFullScreen}"
                  .label="${this.moreText}"
                ></md-outlined-button>
              `
            : nothing}
        <md-linear-progress indeterminate ?hidden="${!this.isFetchingTranslation}"></md-linear-progress>
      </div>
    `;
    }
    static get doubleWidthLanguages() {
        return ["zh_TW", "hy"];
    }
    static get cyrillicLanguages() {
        return ["ru", "ky"];
    }
    static get widerLanguages() {
        return ["uk", "ky", "uz", "ru", "sr", "zh_TW", "hy", "bg"];
    }
    get showMoreText() {
        //TODO: Find a more appropiate place for this logic below
        if (!this.isDialog && !this.truncate) {
            this.truncate = 500;
        }
        else if (this.isDialog) {
            this.truncate = undefined;
        }
        return (this.moreText !== undefined &&
            this.content !== undefined &&
            this.truncate !== undefined &&
            this.content.length > this.truncate);
    }
    _openFullScreen() {
        //TODO: Fix ts type
        window.appDialogs.getDialogAsync("magicTextDialog", (dialog) => {
            dialog.open(this.content, this.contentId, this.extraId, this.additionalId, this.textType, this.contentLanguage, this.closeDialogText, this.structuredQuestionsConfig, this.skipSanitize, this.disableTranslation);
        });
    }
    subClassProcessing() {
        // For sub classes
    }
    updated(changedProperties) {
        //console.error(`Map Contents: ${JSON.stringify(Array.from(changedProperties.entries()))}`);
        super.updated(changedProperties);
        if (changedProperties.has("content")) {
            if (this.content && this.content !== "") {
                this.finalContent = undefined;
                if (window.appGlobals.autoTranslate) {
                    this.autoTranslate = window.appGlobals.autoTranslate;
                }
                if (this.autoTranslate && this.truncate) {
                    this.truncatedContent = YpMagicText_1.truncateText(YpMagicText_1.trim(this.content), this.truncate);
                }
                else {
                    this.truncatedContent = this.content;
                }
                if ((this.contentLanguage && this.largeFont) ||
                    YpMagicText_1.widerLanguages.indexOf(this.contentLanguage) > -1) {
                    this.widetext = true;
                }
                else {
                    this.widetext = false;
                }
                this._update();
            }
            else {
                this.truncatedContent = undefined;
                this.finalContent = undefined;
            }
        }
    }
    _autoTranslateEvent(event) {
        this.autoTranslate = event.detail;
        this._update();
    }
    _languageEvent(event) {
        super._languageEvent(event);
        this._update();
    }
    get indexKey() {
        if (this.extraId && this.additionalId) {
            return `${this.textType}-${this.contentId}-${this.language}-${this.extraId}-${this.additionalId}`;
        }
        else if (this.extraId) {
            return `${this.textType}-${this.contentId}-${this.language}-${this.extraId}`;
        }
        else {
            return `${this.textType}-${this.contentId}-${this.language}`;
        }
    }
    async _startTranslationAndFinalize() {
        if (window.appGlobals.cache.autoTranslateCache[this.indexKey]) {
            this.processedContent = window.appGlobals.cache.autoTranslateCache[this.indexKey];
            this._finalize();
        }
        else {
            if (this.contentId) {
                let url;
                switch (this.textType) {
                    case "postName":
                    case "postContent":
                    case "postTags":
                    case "postTranscriptContent":
                        url = "/api/posts/" + this.contentId + "/translatedText";
                        break;
                    case "pointContent":
                    case "pointAdminCommentContent":
                        url = "/api/points/" + this.contentId + "/translatedText";
                        break;
                    case "domainName":
                    case "domainContent":
                        url = "/api/domains/" + this.contentId + "/translatedText";
                        break;
                    case "customRatingName":
                        url =
                            "/api/ratings/" +
                                this.contentId +
                                "/" +
                                this.extraId +
                                "/translatedText";
                        break;
                    case "communityName":
                    case "communityContent":
                        url = "/api/communities/" + this.contentId + "/translatedText";
                        break;
                    case "aoiQuestionName":
                        url = "/api/allOurIdeas/" + this.contentId + "/content/" + this.extraId + "/translatedText";
                        break;
                    case "aoiChoiceContent":
                        url = "/api/allOurIdeas/" + this.contentId + "/content/" + this.extraId + "/" + this.additionalId + "/translatedText";
                        break;
                    case "alternativeTextForNewIdeaButton":
                    case "alternativeTextForNewIdeaButtonClosed":
                    case "alternativeTextForNewIdeaButtonHeader":
                    case "alternativeTextForNewIdeaSaveButton":
                    case "customThankYouTextNewPosts":
                    case "customTitleQuestionText":
                    case "alternativePointForHeader":
                    case "customAdminCommentsTitle":
                    case "alternativePointAgainstHeader":
                    case "urlToReviewActionText":
                    case "alternativePointForLabel":
                    case "alternativePointAgainstLabel":
                    case "groupName":
                    case "groupContent":
                        url = "/api/groups/" + this.contentId + "/translatedText";
                        break;
                    case "categoryName":
                        url = "/api/categories/" + this.contentId + "/translatedText";
                        break;
                    case "statusChangeContent":
                        url =
                            "/api/posts/" +
                                this.extraId +
                                "/" +
                                this.contentId +
                                "/translatedStatusText";
                        break;
                    default:
                        console.error("No valid textType for magic text to translate: " + this.textType);
                        return;
                }
                url = `${url}?textType=${this.textType}&contentId=${this.contentId}&targetLanguage=${this.language}`;
                this.isFetchingTranslation = true;
                const translation = (await window.serverApi.getTranslation(url));
                this.isFetchingTranslation = false;
                this.processedContent = translation?.content;
                if (this.processedContent) {
                    window.appGlobals.cache.autoTranslateCache[this.indexKey] =
                        this.processedContent;
                    this.fire("new-translation");
                }
                else {
                    console.error("No content from translation");
                }
                this._finalize();
            }
            else {
                console.error("No content id for: " + this.textType);
                this._finalize();
            }
        }
    }
    _update() {
        this.processedContent = this.content;
        if (this.processedContent) {
            if (this.autoTranslate &&
                this.language !== this.contentLanguage &&
                !this.disableTranslation &&
                this.contentLanguage !== "??") {
                this._startTranslationAndFinalize();
            }
            else {
                this._finalize();
            }
        }
    }
    _setupStructuredQuestions() {
        if (this.structuredQuestionsConfig) {
            let structuredQuestionsJson;
            try {
                structuredQuestionsJson = JSON.parse(this.structuredQuestionsConfig);
            }
            catch (error) {
                structuredQuestionsJson = null;
            }
            if (structuredQuestionsJson) {
                // TODO: setup json display
            }
            else {
                const structuredQuestions = [];
                const questionComponents = this.structuredQuestionsConfig.split(",");
                if (questionComponents && questionComponents.length > 1) {
                    for (let i = 0; i < questionComponents.length; i += 2) {
                        structuredQuestions.push(questionComponents[i]);
                    }
                    const regEx = new RegExp("(" + structuredQuestions.join("|") + ")", "ig");
                    this.processedContent = this.processedContent?.replace(regEx, "<b>$1</b>");
                }
                else {
                    console.warn("Not questions for structuredQuestionsConfig");
                }
            }
        }
    }
    _finalize() {
        if (!this.textOnly) {
            this._linksAndEmojis();
        }
        if (this.truncate &&
            this.content &&
            (this.content.length > this.truncate || this.autoTranslate)) {
            let truncateBy = this.truncate;
            if (this.autoTranslate &&
                YpMagicText_1.doubleWidthLanguages.indexOf(this.language) > -1) {
                truncateBy = truncateBy / 2;
            }
            if (this.processedContent)
                this.processedContent = YpMagicText_1.truncateText(YpMagicText_1.trim(this.processedContent), truncateBy, "...");
        }
        if (this.simpleFormat && this.processedContent) {
            this.processedContent = this.processedContent
                .trim()
                .replace(/(\n)/g, "<br>");
        }
        if (this.removeUrls && this.processedContent) {
            this.processedContent = this.processedContent.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
        }
        this._setupStructuredQuestions();
        this.subClassProcessing();
        if (this.processedContent !== this.finalContent) {
            if (!window.appGlobals.magicTextIronResizeDebouncer) {
                window.appGlobals.magicTextIronResizeDebouncer = window.setTimeout(() => {
                    window.appGlobals.magicTextIronResizeDebouncer = undefined;
                    //TODO: See if we need to do something like that still
                    //this.fire('iron-resize');
                }, 100);
            }
        }
        if (this.processedContent &&
            this.processedContent !== "undefined" &&
            this.content !== this.processedContent) {
            this.finalContent = this.processedContent;
        }
        else {
            this.finalContent = undefined;
        }
    }
    _linksAndEmojis() {
        if (!this.skipSanitize && this.processedContent) {
            //this.processedContent = sanitizeHtml(this.processedContent, {allowedTags: ['b', 'i', 'em', 'strong']});
            this.processedContent = this.processedContent.replace(/&amp;/g, "&");
            this.processedContent = linkifyHtml(this.processedContent, {
                format: (value, type) => {
                    if (type === "url" && value.length > this.linkifyCutoff - 1) {
                        value = value.slice(0, this.linkifyCutoff) + "…";
                    }
                    return value;
                },
            });
            this.processedContent = this.processedContent.replace(/&amp;/g, "&");
            this.processedContent = twemoji
                .parse(this.processedContent)
                .replace(/&amp;quot;/g, '"')
                .replace(/class="emoji" /g, 'style="height: 1em;width: 1em;margin: 0 .3em 0 .3em;vertical-align: -0.1em;" ');
        }
        else if (this.processedContent) {
            this.processedContent = linkifyHtml(this.processedContent, {
                format: (value, type) => {
                    if (type === "url" && value.length > this.linkifyCutoff - 1) {
                        value = value.slice(0, this.linkifyCutoff) + "…";
                    }
                    return value;
                },
            });
            this.processedContent = this.processedContent.replace(/&amp;/g, "&");
        }
    }
    static truncateText(input, length, killwords = undefined, end = undefined) {
        length = length || 255;
        if (input.length <= length)
            return input;
        if (killwords) {
            input = input.substring(0, length);
        }
        else {
            let idx = input.lastIndexOf(" ", length);
            if (idx === -1) {
                idx = length;
            }
            input = input.substring(0, idx);
        }
        input += end !== undefined && end !== null ? end : "...";
        return input;
    }
    static trim(input) {
        return input.replace(/^\s*|\s*$/g, "").trim();
    }
};
__decorate([
    property({ type: String })
], YpMagicText.prototype, "content", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "truncatedContent", void 0);
__decorate([
    property({ type: Number })
], YpMagicText.prototype, "contentId", void 0);
__decorate([
    property({ type: Number })
], YpMagicText.prototype, "extraId", void 0);
__decorate([
    property({ type: Number })
], YpMagicText.prototype, "additionalId", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "textType", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "contentLanguage", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "processedContent", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "finalContent", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "autoTranslate", void 0);
__decorate([
    property({ type: Number })
], YpMagicText.prototype, "truncate", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "moreText", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "closeDialogText", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "textOnly", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "isDialog", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "disableTranslation", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "simpleFormat", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "skipSanitize", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "removeUrls", void 0);
__decorate([
    property({ type: Boolean })
], YpMagicText.prototype, "isFetchingTranslation", void 0);
__decorate([
    property({ type: String })
], YpMagicText.prototype, "structuredQuestionsConfig", void 0);
__decorate([
    property({ type: Number })
], YpMagicText.prototype, "linkifyCutoff", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpMagicText.prototype, "widetext", void 0);
YpMagicText = YpMagicText_1 = __decorate([
    customElement("yp-magic-text")
], YpMagicText);
export { YpMagicText };
//# sourceMappingURL=yp-magic-text.js.map