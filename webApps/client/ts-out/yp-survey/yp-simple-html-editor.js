var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
let YpSimpleHtmlEditor = class YpSimpleHtmlEditor extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.question = { maxLength: 0, text: "" };
        this.useSmallFont = false;
        this.value = "";
        this.characterCount = 0;
        this.hasFocus = false;
        this.allowFirefoxFocusHack = true;
        this.showErrorLine = false;
        /*
        ready() {
          if (window.i18nTranslation) {
            this.language = window.locale;
          }
      
          super.ready();
        }
        */
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: inline-block;
          margin-top: 8px;
          width: 100%;
        }

        #htmlEditor {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          width: 100%;
          height: 300px;
          border-top: 1px solid var(--md-sys-color-primary);
          border-bottom: 1px solid var(--md-sys-color-primary);
          outline: none;
          overflow: auto;
          padding-top: 8px;
          padding-bottom: 8px;
          transition: border-bottom-color 0.1s;
        }

        #htmlEditor:focus {
          border-bottom: 2px solid var(--md-sys-color-primary);
        }

        #htmlEditor[has-error] {
          border-bottom: 2px solid #dd2c00 !important;
        }

        .characterCounter {
          font-size: 12px;
          text-align: right;
          width: 100%;
          transition: color 0.1s;
          margin-top: 1px;
        }

        .characterCounter[has-focus] {
          margin-top: 0px;
        }

        .characterCounter[has-error] {
          color: var(--md-sys-color-error);
        }

        filled-tonal-icon-button {
          margin-left: 4px;
          margin-right: 4px;
        }

        @media (max-width: 800px) {
          #htmlEditor {
            height: 220px;
          }
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout horizontal wrap">
        <div class="layout horizontal">
          <filled-tonal-icon-button
            aria-label="${this.t("formatBold")}"
            @mousedown="${this._toggleBold}"
            ><md-icon>format_bold</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatItalic")}"
            @mousedown="${this._toggleItalic}"
            ><md-icon>format_italic</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatUnderline")}"
            @mousedown="${this._toggleUnderline}"
            ><md-icon>format_underlined</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatListBullets")}"
            @mousedown="${this._toggleListBullets}"
            ><md-icon>format_list_bulleted</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatListNumbered")}"
            @mousedown="${this._toggleListNumbers}"
            ><md-icon>format_list_numbered</md-icon></filled-tonal-icon-button
          >
        </div>
        <div class="layout horizontal">
          <filled-tonal-icon-button
            aria-label="${this.t("formatLeft")}"
            @mousedown="${this._toggleAlignLeft}"
            ><md-icon>format_align_left</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatCenter")}"
            @mousedown="${this._toggleAlignCenter}"
            ><md-icon>format_align_center</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatRight")}"
            @mousedown="${this._toggleAlignRight}"
            ><md-icon>format_align_right</md-icon></filled-tonal-icon-button
          >
        </div>

        <div class="layout horizontal">
          <filled-tonal-icon-button
            aria-label="${this.t("formatH1")}"
            @mousedown="${this._toggleH1}"
            ><md-icon>format_h1</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatH2")}"
            @mousedown="${this._toggleH2}"
            ><md-icon>format_h2</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatH3")}"
            @mousedown="${this._toggleH3}"
            ><md-icon>format_h3</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatH4")}"
            @mousedown="${this._toggleH4}"
            ><md-icon>format_h4</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatH5")}"
            @mousedown="${this._toggleH5}"
            ><md-icon>format_h5</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatH6")}"
            @mousedown="${this._toggleH6}"
            ><md-icon>format_h6</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatP")}"
            @mousedown="${this._toggleP}"
            ><md-icon>format_paragraph</md-icon></filled-tonal-icon-button
          >
          <filled-tonal-icon-button
            aria-label="${this.t("formatClear")}"
            @mousedown="${this._clearFormat}"
            ><md-icon>format_clear</md-icon></filled-tonal-icon-button
          >
        </div>
      </div>
      <div
        id="htmlEditor"
        ?has-error="${this.showErrorLine}"
        @focus="${this._setFocus}"
        @blur="${this._setBlur}"
        contenteditable="true"
        spellcheck="false"
        @keydown="${this._keydown}"
        @paste="${this._paste}"
        @click="${this._changed}"
        @keyup="${this._changed}"
        @changed="${this._changed}"
      ></div>
      <div
        ?has-focus="${this.hasFocus}"
        ?has-error="${this.showErrorLine}"
        class="layout end characterCounter"
      >
        ${this.characterCount}<span ?hidden="${!this.question.maxLength}"
          >/${this.question.maxLength}</span
        >
      </div>
    `;
    }
    _setFocus() {
        this.hasFocus = true;
        if (this._isFirefox() && this.allowFirefoxFocusHack) {
            setTimeout(() => {
                this.allowFirefoxFocusHack = false;
                this.shadowRoot.querySelector("#htmlEditor").blur();
                this.shadowRoot.querySelector("#htmlEditor").focus();
                setTimeout(() => {
                    this.allowFirefoxFocusHack = true;
                }, 150);
            });
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.setRichValue(this.value);
    }
    _setBlur(event) {
        //TODO: Fix blinking on using the icon buttons
        this.hasFocus = false;
    }
    setRichValue(value) {
        this.value = value;
        this.shadowRoot.querySelector("#htmlEditor").innerHTML = this.value;
    }
    _updateCharacterCounter() {
        const textContent = this.shadowRoot.querySelector("#htmlEditor").textContent;
        if (textContent) {
            this.characterCount = textContent.length;
        }
        else {
            this.characterCount = 0;
        }
    }
    _keydown(event) {
        this._updateCharacterCounter();
        this.showErrorLine = false;
        if (this.question.maxLength) {
            const allowedKeyCodes = [8, 37, 38, 39, 40];
            const allowedKeyCodesWithCtrlKey = [65, 90, 86, 67, 88, 8];
            const isAllowedKey = allowedKeyCodes.includes(event.keyCode);
            const isShortcut = event.ctrlKey && allowedKeyCodesWithCtrlKey.includes(event.keyCode);
            const isAllowedAction = isAllowedKey || isShortcut;
            if (isAllowedAction) {
                return;
            }
            if (this.characterCount >= this.question.maxLength) {
                event.preventDefault();
            }
        }
    }
    _paste(event) {
        if (this.question.maxLength) {
            //@ts-ignore
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData("text/plain");
            //@ts-ignore
            const content = event.target.textContent;
            const contentLength = content.length;
            //@ts-ignore
            const selectedText = window.getSelection().toString();
            const allowedPasteLength = this.question.maxLength - contentLength + selectedText.length;
            const slicedPasteText = pastedText.substring(0, allowedPasteLength);
            event.preventDefault();
            this._masterCommand("insertHTML", false, slicedPasteText);
        }
        setTimeout(() => {
            this._updateCharacterCounter();
        });
    }
    _changed() {
        this.value = this.shadowRoot.querySelector("#htmlEditor").innerHTML;
        this._updateCharacterCounter();
        this.fire('change', { value: this.value, index: this.index });
    }
    validate() {
        if (this.question.required) {
            if (this.value && this.value.length > 0) {
                this.showErrorLine = false;
                return true;
            }
            else {
                this.showErrorLine = true;
                return false;
            }
        }
        else {
            this.showErrorLine = false;
            return true;
        }
    }
    _isSafariOrIe11() {
        return ((navigator.userAgent.indexOf("Safari") > -1 &&
            navigator.userAgent.indexOf("Chrome") === -1 &&
            navigator.userAgent.indexOf("iPhone") === -1 &&
            navigator.userAgent.indexOf("iPad") === -1) ||
            /Trident.*rv[ :]*11\./.test(navigator.userAgent));
    }
    _isFirefox() {
        return navigator.userAgent.indexOf("Firefox") > -1;
    }
    _clearFormat() {
        this._masterCommand("removeFormat");
        this._masterCommand("formatBlock", false, "p");
    }
    _clearFormatM() {
        if (this._isSafariOrIe11())
            this._clearFormat();
    }
    _toggleH1() {
        this._masterCommand("formatBlock", false, "h1");
    }
    _toggleH1M() {
        if (this._isSafariOrIe11())
            this._toggleH1();
    }
    _toggleH2() {
        this._masterCommand("formatBlock", false, "h2");
    }
    _toggleH2M() {
        if (this._isSafariOrIe11())
            this._toggleH2();
    }
    _toggleH3() {
        this._masterCommand("formatBlock", false, "h3");
    }
    _toggleH3M() {
        if (this._isSafariOrIe11())
            this._toggleH3();
    }
    _toggleH4() {
        this._masterCommand("formatBlock", false, "h4");
    }
    _toggleH4M() {
        if (this._isSafariOrIe11())
            this._toggleH4();
    }
    _toggleH5() {
        this._masterCommand("formatBlock", false, "h5");
    }
    _toggleH5M() {
        if (this._isSafariOrIe11())
            this._toggleH5();
    }
    _toggleH6() {
        this._masterCommand("formatBlock", false, "h6");
    }
    _toggleH6M() {
        if (this._isSafariOrIe11())
            this._toggleH6();
    }
    _toggleP() {
        this._masterCommand("formatBlock", false, "p");
    }
    _togglePM() {
        if (this._isSafariOrIe11())
            this._toggleP();
    }
    _toggleAlignLeft() {
        this._masterCommand("JustifyLeft", false, "");
    }
    _toggleAlignLeftM() {
        if (this._isSafariOrIe11())
            this._toggleAlignLeft();
    }
    _toggleAlignRight() {
        this._masterCommand("JustifyRight", false, "");
    }
    _toggleAlignRightM() {
        if (this._isSafariOrIe11())
            this._toggleAlignRight();
    }
    _toggleAlignCenter() {
        this._masterCommand("JustifyCenter", false, "");
    }
    _toggleAlignCenterM() {
        if (this._isSafariOrIe11())
            this._toggleAlignCenter();
    }
    _toggleAlignJustify() {
        this._masterCommand("JustifyFull", false, "");
    }
    _toggleAlignJustifyM() {
        if (this._isSafariOrIe11())
            this._toggleAlignJustify();
    }
    _toggleBold() {
        this._masterCommand("bold");
    }
    _toggleBoldM() {
        if (this._isSafariOrIe11())
            this._toggleBold();
    }
    _toggleItalic() {
        this._masterCommand("italic");
    }
    _toggleItalicM() {
        if (this._isSafariOrIe11())
            this._toggleItalic();
    }
    _toggleUnderline() {
        this._masterCommand("underline");
    }
    _toggleUnderlineM() {
        if (this._isSafariOrIe11())
            this._toggleUnderline();
    }
    _toggleListBullets() {
        this._masterCommand("insertUnorderedList");
    }
    _toggleListBulletsM() {
        if (this._isSafariOrIe11())
            this._toggleListBullets();
    }
    _toggleListNumbers() {
        this._masterCommand("insertOrderedList");
    }
    _toggleListNumbersM() {
        if (this._isSafariOrIe11())
            this._toggleListNumbers();
    }
    _masterCommand(commandName, showDefaultUI = false, value = "") {
        document.execCommand(commandName, showDefaultUI, value);
        this._changed();
    }
};
__decorate([
    property({ type: Object })
], YpSimpleHtmlEditor.prototype, "question", void 0);
__decorate([
    property({ type: Number })
], YpSimpleHtmlEditor.prototype, "index", void 0);
__decorate([
    property({ type: Boolean })
], YpSimpleHtmlEditor.prototype, "useSmallFont", void 0);
__decorate([
    property({ type: String })
], YpSimpleHtmlEditor.prototype, "value", void 0);
__decorate([
    property({ type: Number })
], YpSimpleHtmlEditor.prototype, "characterCount", void 0);
__decorate([
    property({ type: Boolean })
], YpSimpleHtmlEditor.prototype, "hasFocus", void 0);
__decorate([
    property({ type: Boolean })
], YpSimpleHtmlEditor.prototype, "allowFirefoxFocusHack", void 0);
__decorate([
    property({ type: Boolean })
], YpSimpleHtmlEditor.prototype, "showErrorLine", void 0);
YpSimpleHtmlEditor = __decorate([
    customElement("yp-simple-html-editor")
], YpSimpleHtmlEditor);
export { YpSimpleHtmlEditor };
//# sourceMappingURL=yp-simple-html-editor.js.map