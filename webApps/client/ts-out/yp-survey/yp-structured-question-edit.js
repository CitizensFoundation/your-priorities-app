var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import linkifyHtml from "linkify-html";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/radio/radio.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./yp-simple-html-editor.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let YpStructuredQuestionEdit = class YpStructuredQuestionEdit extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.hideQuestionIndex = false;
        this.dontFocusFirstQuestion = false;
        this.useSmallFont = false;
        this.longFocus = false;
        this.isLastRating = false;
        this.isFirstRating = false;
        this.isFromNewPost = false;
        this.debounceTimeMs = 2000;
        this.disabled = false;
        this.radioKeypress = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("structuredAnswers")) {
            this._structuredAnsweredChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
          font-size: 16px;
        }

        md-outlined-text-field {
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }

        a {
        }

        .question {
          margin-top: 32px;
          margin-bottom: 8px;
          font-size: 18px;
          line-height: 1.5;
        }

        .question[use-small-font] {
          font-size: 16px;
        }

        .subTitle {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .subTitle [use-small-font] {
          font-size: 14px;
        }

        hr {
          border-top: 2px dashed var(--accent-color);
          margin-top: 48px;
          margin-bottom: 32px;
        }

        .general {
        }

        .noBottomMargin {
          margin-bottom: 0;
        }

        .header[is-not-first] {
          margin-top: 54px;
        }

        md-menu {
          margin-top: 16px;
        }

        .numberInput {
        }

        md-checkbox {
          margin-bottom: 16px;
        }

        md-outlined-text-field {
          width: 100%;
        }

        md-outlined-text-field[use-small-font],
        md-outlined-text-field[use-small-font] {
          --md-outlined-text-field-container-label: {
            font-size: 16px;
          }
        }

        md-outlined-text-field {
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .radioGroup {
          margin-top: 16px;
          margin-bottom: 16px;
          font-size: 16px;
        }

        .radioLabel {
          width: 100%;
          margin: 16px;
          margin-bottom: 8px;
        }

        md-checkbox {
          margin-left: 8px;
        }

        .checkboxLabel {
          width: 100%;
          align-self: start;
          margin-left: 12px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        md-radio {
          width: 40px;
        }

        .checkBoxesLabel {
          margin-bottom: 36px;
        }

        .radiosLabel {
          margin-bottom: 0px;
          margin-top: 42px;
        }

        .radiosLabel[is-first-rating] {
          margin-top: 42px;
        }

        md-outlined-text-field.textAreaLong {
          --md-outlined-text-field-container: {
            margin: 0;
            padding: 0;
          }
        }

        md-outlined-text-field.textAreaLong {
          --md-outlined-text-field-container: {
            margin: 0;
            padding: 0;
          }
        }

        .longQuestion {
          font-size: 18px;
          padding-bottom: 0;
          margin-bottom: 0px;
          font-weight: 500;
          font-family: var(--md-ref-typeface-brand);
        }

        .longQuestion[use-small-font] {
          font-size: 16px;
        }

        .longQuestion[is-from-new-post] {
        }

        .question[is-from-new-post] {
        }

        .longQuestion[has-content] {
          font-size: 12px;
        }

        .longQuestion[has-focus] {
        }

        md-checkbox {
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .general[less-bottom-margin] {
        }

        .general[extra-top-margin] {
        }

        .lessBottomMargin {
        }

        [hidden] {
          display: none !important;
        }

        .header {
          font-size: 26px;
          font-weight: bold;
          line-height: 1.5;
        }

        .header[is-first] {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          font-size: 32px;
          padding: 24px;
        }

        @media (min-width: 800px) {
          md-outlined-text-field[half-width-desktop] {
            width: 50%;
          }

          :host {
            padding: 0;
            margin: 0;
          }
        }

        md-radio {
        }

        .specifyInput {
          max-width: 220px;
          margin-left: 48px;
          margin-top: 0px;
          margin-bottom: 0;
        }

        .specifyCheckBox {
          margin-left: 42px;
          margin-bottom: 12px;
        }

        .error {
          border: 2px solid var(--md-sys-color-error);
          padding: 6px;
          margin: 6px;
        }

        @media (max-width: 600px) {
          .header {
            font-size: 22px;
          }

          .header[is-first] {
            font-size: 24px;
          }
        }
      `,
        ];
    }
    get value() {
        const answer = this.getAnswer(true);
        if (answer) {
            return answer.value;
        }
        else {
            return null;
        }
    }
    set value(value) {
        this.setAnswerAfterUpdate(value);
    }
    async setAnswerAfterUpdate(value) {
        await this.updateComplete;
        this.setAnswer(value);
    }
    renderTextField(skipLabel = false) {
        return html `
      <md-outlined-text-field
        id="structuredQuestion_${this.index}"
        .value="${this.question.value || ""}"
        .label="${!skipLabel ? this.textWithIndex : ""}"
        name="${this.formName || ""}"
        ?use-small-font="${this.useSmallFont}"
        .title="${this.question.text}"
        @keypress="${this._keyPressed}"
        .pattern="${this.question.pattern || ""}"
        type="text"
        .allowedPattern="${this.isNumberSubType ? "[0-9.]" : ""}"
        ?half-width-desktop="${this.question.halfWidthDesktop}"
        @change="${(e) => {
            e.detail = { value: e.currentTarget.value };
            this._debounceChangeEvent(e);
        }}"
        ?required="${this.question.required}"
        maxlength="${ifDefined(this.question.maxLength || undefined)}"
      >
      </md-outlined-text-field>
      ${this.question.subTitle
            ? html `<div class="subTitle" ?use-small-font="${this.useSmallFont}">${this.question.subTitle}</div>`
            : nothing}
    `;
    }
    renderTextFieldLong() {
        return html `
      <div
        class="question general longQuestion"
        ?is-from-new-post="${this.isFromNewPost}"
        ?has-focus="${this.longFocus}"
        id="structuredQuestionIntro_${this.index}"
      >
        ${unsafeHTML(this.textWithIndex)}
      </div>
      ${this.renderTextField(true)}
    `;
    }
    renderTextArea(skipLabel = false) {
        if (this.question.richTextAllowed) {
            return html ` <yp-simple-html-editor
        id="structuredQuestion_${this.index}"
        .question="${this.question}"
        @focus="${this.setLongFocus}"
        @blur="${this.setLongUnFocus}"
      >
      </yp-simple-html-editor>`;
        }
        else {
            return html `
        <md-outlined-text-field
          id="structuredQuestion_${this.index}"
          data-type="text"
          type="textarea"
          .label="${!skipLabel ? this.textWithIndex : ""}"
          .value="${this.question.value || ""}"
          minlength="2"
          ?charCounter="${this.question.charCounter != undefined
                ? this.question.charCounter
                : true}"
          .pattern="${this.question.pattern || ""}"
          @focus="${this.setLongFocus}"
          @blur="${this.setLongUnFocus}"
          ?use-small-font="${this.useSmallFont}"
          @change="${(e) => {
                e.detail = { value: e.currentTarget.value };
                this._debounceChangeEvent(e);
            }}"
          name="${this.formName || ""}"
          rows="${ifDefined(this.question.rows || 5)}"
          max-rows="7"
          maxrows="7"
          ?required="${this.question.required}"
          maxlength="${ifDefined(this.question.maxLength || undefined)}"
        >
        </md-outlined-text-field>
      `;
        }
    }
    renderTextAreaLong() {
        return html `
      <div
        class="question general longQuestion"
        ?is-from-new-post="${this.isFromNewPost}"
        ?has-focus="${this.longFocus}"
        ?has-content="${this.question.value}"
        ?use-small-font="${this.useSmallFont}"
        id="structuredQuestionIntro_${this.index}"
      >
        ${unsafeHTML(this.textWithLinks)}
      </div>
      ${this.renderTextArea(true)}
    `;
    }
    renderTextHeader() {
        return html `
      <div
        class="header"
        ?is-not-first="${this.index}"
        ?is-first="${!this.index}"
      >
        ${this.question.text}
      </div>
    `;
    }
    renderTextDescription() {
        return html `
      <div
        class="question general"
        id="structuredQuestionQuestion_${this.index}"
        ?is-from-new-post="${this.isFromNewPost}"
        ?use-small-font="${this.useSmallFont}"
        ?extra-top-margin="${this.question.extraTopMargin}"
        ?less-bottom-margin="${this.question.lessBottomMargin}"
      >
        ${unsafeHTML(this.textWithLinks)}
      </div>
    `;
    }
    renderSeperator() {
        return html ` <hr /> `;
    }
    renderRadioButton(radioButton, buttonIndex) {
        return html `
      <label class="layout horizontal center-center">
        <md-radio
          ?use-small-font="${this.useSmallFont}"
          @keypress="${this.setRadioEventType}"
          @change="${this._radioChanged}"
          .value="${radioButton.text}"
          id="structuredQuestionRadioGroup_${this.index}_${buttonIndex}"
          .name="radioButtons${this.index}"
        >
        </md-radio>
        <div class="radioLabel">${radioButton.text}</div>
      </label>
    `;
    }
    renderRadios() {
        return this.question.radioButtons
            ? html `
          <div
            class="question general radiosLabel"
            ?use-small-font="${this.useSmallFont}"
            ?is-from-new-post="${this.isFromNewPost}"
            ?is-first-rating="${this.isFirstRating}"
            id="structuredQuestionIntro_${this.index}"
          >
            ${unsafeHTML(this.textWithLinks)}
          </div>
          <div
            ?required="${this.question.required}"
            id="structuredQuestion_${this.index}"
            .name="structuredQuestionRadioGroup_${this.index}"
            class="${this._getRadioClass()} radioGroup"
          >
            ${this.question.radioButtons.map((radioButton, buttonIndex) => html `
                ${!radioButton.isSpecify
                ? html ` ${this.renderRadioButton(radioButton, buttonIndex)} `
                : html `
                      ${this.renderRadioButton(radioButton, buttonIndex)}
                      <md-outlined-text-field
                        class="specifyInput"
                        hidden
                        @change="${this._debounceChangeEvent}"
                        .maxlength="${this.question.maxLength || 5000}"
                        .pattern="${radioButton.subType === "number"
                    ? "[0-9]"
                    : ""}"
                        type="text"
                        id="structuredQuestion_${this
                    .index}_${buttonIndex}__radioOther"
                      ></md-outlined-text-field>
                    `}
              `)}
          </div>
        `
            : nothing;
    }
    renderCheckbox(text, buttonIndex, useTopLevelId = false) {
        const id = useTopLevelId
            ? `structuredQuestion_${this.index}`
            : `structuredQuestionCheckbox_${this.index}_${buttonIndex}`;
        return html `
      <label class="layout horizontal center-center">
        <md-checkbox
          id="${id}"
          .name="${this.formName || ""}"
          ?disabled="${this.disabled}"
          ?checked="${this.question.value || false}"
          @change="${this._checkboxChanged}"
        >
        </md-checkbox>
        <div class="checkboxLabel">${text}</div>
      </label>
    `;
    }
    renderCheckboxes() {
        return this.question.checkboxes
            ? html `
          <div
            id="structuredQuestionIntro_${this.index}"
            class="question general checkBoxesLabel"
            ?is-from-new-post="${this.isFromNewPost}"
            ?use-small-font="${this.useSmallFont}"
          >
            ${unsafeHTML(this.textWithLinks)}
          </div>
          <div
            id="structuredQuestion_${this.index}"
            data-type="checkboxes"
            class="layout vertical"
          >
            ${this.question.checkboxes.map((checkbox, buttonIndex) => html `
                ${!checkbox.isSpecify
                ? html ` ${this.renderCheckbox(checkbox.text, buttonIndex)} `
                : html `
                      ${this.renderCheckbox(checkbox.text, buttonIndex)}
                      <md-outlined-text-field
                        class="specifyInput specifyCheckBox"
                        hidden
                        @change="${this._debounceChangeEvent}"
                        .type="${checkbox.subType || "text"}"
                        id="structuredQuestion_${this
                    .index}_${buttonIndex}_checkboxOther"
                      ></md-outlined-text-field>
                    `}
              `)}
          </div>
        `
            : nothing;
    }
    //TODO: Get this working
    renderDropdown() {
        return html `
      <md-outlined-select
        .label="${this.textWithIndex}"
        @change="${this._dropDownChanged}"
      >
        ${this.question.dropdownOptions?.map((dropDownOptions) => html `
            <md-select-option name="${dropDownOptions.text}"
              >${dropDownOptions.text}</md-select-option
            >
          `)}
      </md-outlined-select>
    `;
    }
    _dropDownChanged() { }
    render() {
        let question;
        let questionType = this.question.type;
        if (!questionType)
            questionType = "textarea";
        questionType = questionType.toLowerCase();
        switch (questionType) {
            case "textarea":
                question = this.renderTextArea();
                break;
            case "textarealong":
                question = this.renderTextAreaLong();
                break;
            case "textfield":
                question = this.renderTextField();
                break;
            case "textfieldlong":
                question = this.renderTextFieldLong();
                break;
            case "textheader":
                question = this.renderTextHeader();
                break;
            case "textdescription":
                question = this.renderTextDescription();
                break;
            case "checkboxes":
                question = this.renderCheckboxes();
                break;
            case "checkbox":
                question = this.renderCheckbox(this.question.text, 0, true);
                break;
            case "radios":
                question = this.renderRadios();
                break;
            case "seperator":
                question = this.renderSeperator();
                break;
            /*case 'dropdown':
              page = this.renderSeperator()
              break*/
        }
        return html `<div class="${this.classList.contains("error") ? "error" : ""}">
      ${question}
    </div>`;
    }
    setLongUnFocus() {
        this.longFocus = false;
    }
    setLongFocus() {
        this.longFocus = true;
    }
    get isNumberSubType() {
        return this.question && this.question.subType === "number";
    }
    _keyPressed(event) {
        if (event.which == 13 || event.keyCode == 13) {
            this.fire("yp-goto-next-index", { currentIndex: this.index });
        }
    }
    setRadioEventType() {
        this.radioKeypress = true;
    }
    _sendDebouncedChange(event) {
        this.fire("yp-answer-content-changed", event.detail);
        if (!this.debunceChangeEventTimer) {
            this.debunceChangeEventTimer = setTimeout(() => {
                this.debunceChangeEventTimer = undefined;
                this.fire("yp-answer-content-changed-debounced", event.detail);
                this._resizeScrollerIfNeeded();
            }, this.debounceTimeMs);
        }
    }
    _debounceChangeEvent(event) {
        event.stopPropagation();
        this._sendDebouncedChange(event);
    }
    get textWithIndex() {
        return this.question.text;
        //TODO: Think about if we need that
        /*if (question.questionIndex && !this.hideQuestionIndex) {
          return question.questionIndex + ". " + question.text
        } else {
          return question.text
        }*/
    }
    _getRadioClass() {
        if (this.question.subType &&
            this.question.subType === "rating" &&
            !this.isLastRating) {
            return "layout vertical wrap lessBottomMargin";
        }
        else if (this.question.subType && this.question.subType === "rating") {
            return "layout vertical wrap";
        }
        else {
            return "layout vertical";
        }
    }
    get textWithLinks() {
        let text = linkifyHtml(this.question.text);
        text = text.replace(/\n/g, "<br>");
        return text;
    }
    _resizeScrollerIfNeeded() {
        this.fire("resize-scroller");
    }
    //TODO: Finish this
    checkValidity() {
        const liveQuestion = this.$$("#structuredQuestion_" + this.index);
        console.log(`liveQuestion: ${liveQuestion}`);
        if (liveQuestion) {
            if (liveQuestion.dataset.type === "dropdown") {
                return true; // DO something if required
            }
            else if (liveQuestion.name &&
                liveQuestion.name.indexOf("RadioGroup") > -1) {
                return this.checkRadioButtonValidity();
            }
            else if (liveQuestion.dataset.type === "checkboxes") {
                return true; // DO something if required
            }
            else {
                if (liveQuestion.value &&
                    liveQuestion.value.length > 0) {
                    console.log(`liveQuestion: textfield has length`);
                    return true;
                }
                else {
                    console.log(`liveQuestion: textfield has no length`);
                    return false;
                }
            }
        }
        else {
            return true;
        }
    }
    get isInputField() {
        return (this.question.type &&
            (this.question.type.toLowerCase() === "textfield" ||
                this.question.type.toLowerCase() === "textfieldlong" ||
                this.question.type.toLowerCase() === "textarea" ||
                this.question.type.toLowerCase() === "textarealong" ||
                this.question.type.toLowerCase() === "numberfield"));
    }
    focus() {
        if (this.isInputField) {
            const item = this.$$("#structuredQuestion_" + this.index);
            if (item) {
                setTimeout(() => {
                    item.focus();
                }, 250);
            }
        }
    }
    cleanValue(value) {
        if (value) {
            return value.replace(/,/g, "").replace(/:/g, "");
        }
        else {
            console.warn("No value for cleanValue");
            return "";
        }
    }
    checkRadioButtonValidity() {
        if (!this.question.required)
            return true;
        const radio = this.$$("#structuredQuestion_" + this.index);
        if (radio.checked)
            return true;
        let valid = false;
        this.question.radioButtons?.forEach((button, buttonIndex) => {
            const radioButtonElement = this.$$("#structuredQuestionRadioGroup_" + this.index + "_" + buttonIndex);
            if (radioButtonElement && radioButtonElement.checked) {
                valid = true;
            }
        });
        return valid;
    }
    getAnswer(suppressNotFoundError = false) {
        const item = this.$$("#structuredQuestion_" + this.index);
        if (item) {
            let value;
            if (this.isInputField) {
                value = item.value;
            }
            else if (this.question.type.toLowerCase() === "radios") {
                let selectedRadio;
                this.question.radioButtons?.forEach((button, buttonIndex) => {
                    const radioButtonElement = this.$$("#structuredQuestionRadioGroup_" + this.index + "_" + buttonIndex);
                    if (radioButtonElement &&
                        button.text === radioButtonElement.value &&
                        radioButtonElement.checked) {
                        selectedRadio = radioButtonElement;
                        if (button.isSpecify) {
                            const radioInput = this.$$("#structuredQuestion_" +
                                this.index +
                                "_" +
                                buttonIndex +
                                "__radioOther");
                            if (radioInput) {
                                value =
                                    selectedRadio.value + ":" + this.cleanValue(radioInput.value);
                            }
                            else {
                                value = selectedRadio.value;
                            }
                        }
                        else {
                            value = selectedRadio.value;
                        }
                    }
                });
            }
            else if (this.question.type.toLowerCase() === "checkboxes") {
                let selectedCheckboxes = "";
                for (let i = 0; i < item.children.length; i++) {
                    const checkbox = item.children[i].children[0];
                    if (checkbox && checkbox.checked) {
                        const checkboxSubId = checkbox.id.split("_")[2];
                        const selectedCheckbox = this.question.checkboxes[parseInt(checkboxSubId)];
                        if (selectedCheckbox.isSpecify) {
                            const checkboxInput = this.$$("#structuredQuestion_" +
                                this.index +
                                "_" +
                                checkboxSubId +
                                "_checkboxOther");
                            if (checkboxInput && checkboxInput.value !== "") {
                                selectedCheckboxes +=
                                    selectedCheckbox.text +
                                        ":" +
                                        this.cleanValue(checkboxInput.value) +
                                        ",";
                            }
                            else {
                                selectedCheckboxes += selectedCheckbox.text + ",";
                            }
                        }
                        else {
                            selectedCheckboxes += selectedCheckbox.text + ",";
                        }
                    }
                }
                if (selectedCheckboxes !== "") {
                    value = selectedCheckboxes.substring(0, selectedCheckboxes.length - 1);
                }
            }
            else if (this.question.type.toLowerCase() === "checkbox") {
                value = item.checked;
            }
            if (value != undefined && this.question.uniqueId && this.question.subType === "number") {
                let numValue;
                try {
                    // First, try parsing as a float
                    numValue = parseFloat(value);
                    // If it's an integer, convert it to an integer
                    if (Number.isInteger(numValue)) {
                        numValue = parseInt(value, 10);
                    }
                }
                catch (error) {
                    console.error(`Can't parse value as number: ${error}`);
                }
                if (numValue !== undefined && !isNaN(numValue)) {
                    return { uniqueId: this.question.uniqueId, value: numValue };
                }
                else {
                    return { uniqueId: this.question.uniqueId, value: value };
                }
            }
            else if (value != undefined && this.question.uniqueId) {
                return { uniqueId: this.question.uniqueId, value: value };
            }
            else {
                console.error(`Can't find answer for question: ${this.question.text}`);
                return undefined;
            }
        }
        else if (!suppressNotFoundError) {
            console.error("Can't find question item for " + this.question.text);
        }
        return undefined;
    }
    setAnswer(value) {
        if (value != null) {
            const item = this.$$("#structuredQuestion_" + this.index);
            if (item && this.question.type) {
                if (this.isInputField) {
                    if (this.question.richTextAllowed) {
                        item.setRichValue(value);
                    }
                    else {
                        item.value = value;
                    }
                }
                else if (this.question.type &&
                    this.question.type.toLowerCase() === "radios") {
                    let specifyInput;
                    if (value.indexOf(":") > -1) {
                        const splitText = value.split(":");
                        value = splitText[0];
                        specifyInput = splitText[1];
                    }
                    this.question.radioButtons?.forEach((button, buttonIndex) => {
                        if (button.text === value) {
                            const radioButtonElement = this.$$("#structuredQuestionRadioGroup_" +
                                this.index +
                                "_" +
                                buttonIndex);
                            if (radioButtonElement) {
                                radioButtonElement.checked = true;
                                if (specifyInput) {
                                    const input = this.$$("#structuredQuestion_" +
                                        this.index +
                                        "_" +
                                        buttonIndex +
                                        "__radioOther");
                                    if (input) {
                                        input.hidden = false;
                                        input.value = specifyInput;
                                    }
                                    else {
                                        console.error("Can't find checkbox specify value");
                                    }
                                }
                            }
                        }
                    });
                }
                else if (this.question.type.toLowerCase() === "checkboxes" &&
                    this.question.checkboxes) {
                    const checkboxValues = value.split(",");
                    const specifyInputs = {};
                    let hasSpecifyInputs = false;
                    for (let i = 0; i < checkboxValues.length; i++) {
                        if (checkboxValues[i].indexOf(":") > -1) {
                            const splitText = checkboxValues[i].split(":");
                            checkboxValues[i] = splitText[0];
                            specifyInputs[splitText[0]] = splitText[1];
                            hasSpecifyInputs = true;
                        }
                    }
                    for (let i = 0; i < item.children.length; i++) {
                        if (item.children[i]) {
                            const checkboxSubId = item.children[i].id.split("_")[2];
                            const selectedCheckbox = this.question.checkboxes[parseInt(checkboxSubId)];
                            if (selectedCheckbox) {
                                if (checkboxValues.indexOf(selectedCheckbox.text) > -1) {
                                    item.children[i].checked = true;
                                    if (hasSpecifyInputs) {
                                        const input = this.$$("#structuredQuestion_" +
                                            this.index +
                                            "_" +
                                            checkboxSubId +
                                            "_checkboxOther");
                                        if (input && specifyInputs[selectedCheckbox.text]) {
                                            input.hidden = false;
                                            input.value = specifyInputs[selectedCheckbox.text];
                                        }
                                        else {
                                            console.error("Can't find checkbox specify value");
                                        }
                                    }
                                }
                            }
                            else {
                                console.debug("No selectedCheckbox");
                            }
                        }
                    }
                }
                else if (this.question.type.toLowerCase() === "checkbox") {
                    if (value) {
                        item.checked = true;
                    }
                }
            }
            else {
                console.error("cant find answer for item index " + this.index);
            }
        }
    }
    hide() {
        const item = this.$$("#structuredQuestion_" + this.index);
        if (item) {
            item.hidden = true;
            const introItem = this.$$("#structuredQuestionIntro_" + this.index);
            if (introItem) {
                introItem.hidden = true;
            }
        }
        else {
            console.error("Can't find question index: " + this.index);
        }
    }
    show() {
        const item = this.$$("#structuredQuestion_" + this.index);
        if (item) {
            item.hidden = false;
            const introItem = this.$$("#structuredQuestionIntro_" + this.index);
            if (introItem) {
                introItem.hidden = false;
            }
        }
        else {
            console.error("Can't find question index: " + this.index);
        }
    }
    _checkboxChanged(event) {
        if (this.question.checkboxes && event.target.checked) {
            const checkboxSubId = event.target.id.split("_")[2];
            const selectedCheckbox = this.question.checkboxes[parseInt(checkboxSubId)];
            if (selectedCheckbox.isSpecify) {
                const checkboxInput = this.$$("#structuredQuestion_" +
                    this.index +
                    "_" +
                    checkboxSubId +
                    "_checkboxOther");
                if (checkboxInput) {
                    checkboxInput.hidden = false;
                    if (!checkboxInput.value) {
                        checkboxInput.value = "";
                    }
                    checkboxInput.focus();
                }
                else {
                    console.error("Can't find checkbox input");
                }
            }
        }
        if (this.question.maxLength) {
            let checkedCount = 0;
            const item = this.$$("#structuredQuestion_" + this.index);
            for (let i = 0; i < item.children.length; i++) {
                if (item.children[i].tagName.toLowerCase() === "md-checkbox" &&
                    item.children[i].checked) {
                    checkedCount += 1;
                }
            }
            if (checkedCount >= this.question.maxLength) {
                for (let x = 0; x < item.children.length; x++) {
                    if (item.children[x].tagName.toLowerCase() === "md-checkbox" &&
                        !item.children[x].checked) {
                        item.children[x].disabled = true;
                    }
                }
            }
            else {
                for (let n = 0; n < item.children.length; n++) {
                    if (item.children[n].tagName.toLowerCase() === "md-checkbox" &&
                        item.children[n].disabled) {
                        item.children[n].disabled = false;
                    }
                }
            }
        }
        event.stopPropagation();
        this._sendDebouncedChange({
            detail: { value: event.target.checked },
        });
    }
    _radioChanged(event) {
        event.stopPropagation();
        if (this.question.radioButtons) {
            let selectedRadio;
            this.question.radioButtons.forEach((button, buttonIndex) => {
                if (button.text === event.target.value) {
                    selectedRadio = button;
                    this._sendDebouncedChange({
                        detail: { value: button.text },
                    });
                    if (selectedRadio.skipTo) {
                        this.fire("yp-skip-to-unique-id", {
                            fromId: this.question.uniqueId,
                            toId: selectedRadio.skipTo,
                        });
                    }
                    else if (selectedRadio.isSpecify) {
                        const input = this.$$("#structuredQuestion_" +
                            this.index +
                            "_" +
                            buttonIndex +
                            "__radioOther");
                        if (input) {
                            input.hidden = false;
                            input.focus();
                        }
                        else {
                            console.error("Can't find radio specify value");
                        }
                    }
                    else {
                        setTimeout(() => {
                            if (!this.radioKeypress) {
                                this.fire("yp-goto-next-index", { currentIndex: this.index });
                            }
                        });
                        let hasSkipToId;
                        this.question.radioButtons?.forEach((button) => {
                            if (button.skipTo) {
                                hasSkipToId = button.skipTo;
                            }
                        });
                        if (hasSkipToId) {
                            this.fire("yp-open-to-unique-id", {
                                fromId: this.question.uniqueId,
                                toId: hasSkipToId,
                            });
                        }
                    }
                }
            });
        }
    }
    _structuredAnsweredChanged() {
        if (this.structuredAnswers && this.question.uniqueId) {
            const BreakException = {};
            try {
                this.structuredAnswers.forEach((answer) => {
                    if (this.question.uniqueId === answer.uniqueId && answer.value) {
                        setTimeout(() => {
                            this.setAnswer(answer.value);
                        }, 100);
                        throw BreakException;
                    }
                });
            }
            catch (e) {
                if (e !== BreakException)
                    throw e;
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.question) {
            if (this.question.type === "numberField") {
                this.question.type = "textField";
                this.question.subType = "number";
            }
        }
        setTimeout(() => {
            if (this.question.questionIndex === 1 && !this.dontFocusFirstQuestion) {
                this.focus();
            }
        }, 500);
    }
};
__decorate([
    property({ type: Object })
], YpStructuredQuestionEdit.prototype, "question", void 0);
__decorate([
    property({ type: Number })
], YpStructuredQuestionEdit.prototype, "index", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "hideQuestionIndex", void 0);
__decorate([
    property({ type: String })
], YpStructuredQuestionEdit.prototype, "formName", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "dontFocusFirstQuestion", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "useSmallFont", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "longFocus", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "isLastRating", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "isFirstRating", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "isFromNewPost", void 0);
__decorate([
    property({ type: Array })
], YpStructuredQuestionEdit.prototype, "structuredAnswers", void 0);
__decorate([
    property({ type: Number })
], YpStructuredQuestionEdit.prototype, "debounceTimeMs", void 0);
__decorate([
    property({ type: Boolean })
], YpStructuredQuestionEdit.prototype, "disabled", void 0);
YpStructuredQuestionEdit = __decorate([
    customElement("yp-structured-question-edit")
], YpStructuredQuestionEdit);
export { YpStructuredQuestionEdit };
//# sourceMappingURL=yp-structured-question-edit.js.map