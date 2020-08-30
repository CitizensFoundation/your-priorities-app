import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../yp-app-globals/paper-textarea-aria.js';
import '../yp-behaviors/yp-language-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';

class YpStructuredQuestionEditLit extends YpBaseElement {
  static get properties() {
    return {
      question: {
        type: Object
      },

      index: {
        type: Number
      },

      language: {
        type: String,
      },

      hideQuestionIndex: {
        type: Boolean,
        value: false
      },

      dontFocusFirstQuestion: {
        type: Boolean,
        value: false
      },

      useSmallFont: {
        type: Boolean,
        value: false
      },

      structuredAnswers: {
        type: Array,
        observer: '_structuredAnsweredChanged'
      },

      longFocus: {
        type: Boolean,
        value: false
      },

      isLastRating: {
        type: Boolean,
        value: false
      },

      isFirstRating: {
        type: Boolean,
        value: false
      }
    }
  }
  static get styles() {
    return [
        css`
    
      :host {
        display: block;
        font-size: 16px;
      }

      a {
        color: #000;
      }

      .question {
        margin-top: 32px;
        margin-bottom: 8px;
        color: #000;
        font-size: 18px;
        line-height: 1.5;
      }

      .question[use-small-font] {
        font-size: 16px;
      }

      hr {
        border-top: 2px dashed var(--accent-color);
        margin-top: 48px;
        margin-bottom: 32px;
      }

      .general {
        color: #000;
      }

      .noBottomMargin {
        margin-bottom: 0;
      }

      .header[is-not-first] {
        margin-top: 54px;
      }

      paper-dropdown-menu {
        margin-top: 16px;
      }

      .numberInput {
      }

      paper-checkbox {
        margin-bottom: 16px;
      }

      paper-input, paper-textarea-aria {
        --paper-input-container-label: {
          color: #000;
          font-size: 18px;
        }
      }

      paper-input[use-small-font], paper-textarea-aria[use-small-font] {
        --paper-input-container-label: {
          font-size: 16px;
        }
      }

      paper-input {
        margin-bottom: 32px;
      }

      paper-radio-group {
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 16px;
      }

      paper-radio-button {
        --paper-radio-button-label-color: #333;
        font-size: 16px;
      }

      .checkBoxesLabel {
        margin-bottom: 36px;
      }

      .radiosLabel {
        margin-bottom: 16px;
        margin-top: 48px;
      }

      .radiosLabel[is-first-rating] {
        margin-top: 24px;
      }

      paper-textarea-aria.textAreaLong {
        --paper-input-container: {
          margin: 0;
          padding: 0;
        }
      }

      paper-input.textAreaLong {
        --paper-input-container: {
          margin: 0;
          padding: 0;
        }
      }

      .longQuestion {
        font-size: 18px;
        font-weight: 400;
        color: #000;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      .longQuestion[use-small-font] {
        font-size: 16px;
        color: #333;
      }

      .longQuestion[has-content] {
        font-size: 12px;
      }

      .longQuestion[has-focus] {
        color: var(--accent-color);
      }

      paper-checkbox {
        --paper-checkbox-label-color: #333;
        margin-left: 42px;
        margin-bottom: 24px;
      }

      .general[less-bottom-margin] {
        margin-bottom: -32px;
      }

      .general[extra-top-margin] {
        margin-top: 32px;
      }

      .lessBottomMargin {
        margin-bottom: -32px;
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
        background-color: var(--accent-color);
        color: #FFF;
        font-size: 32px;
        padding: 24px;
      }

      @media (min-width: 800px) {
        paper-input[half-width-desktop] {
          width: 50%;
        }

        :host {
          padding: 0;
          margin: 0;
        }
      }

      paper-radio-button {
        margin-left: 24px;
      }

      .specifyInput {
        max-width: 220px;
        margin-left: 24px;
        margin-top: -16px;
        margin-bottom: 0;
      }

      .specifyCheckBox {
        margin-left: 42px;
        margin-bottom: 12px;
      }

      @media (max-width: 600px) {
        .header {
          font-size: 22px;
        }

        .header[is-first] {
          font-size: 24px;
        }
      }
    `, ypFlexLayout];
  }
    

  render() {
    return html`
    ${this._isTextField(question) ? html`
      ${this._isNumberSubType(question) ? html`     
        <paper-input id="structuredQuestion_${this.index}" .value="${this.question.value}" .alwaysFloatLabel="${this._floatIfValueOrIE(question.value)}" .label="${this._getTextWithIndex(question)}" char-counter .useSmallFont="${this.useSmallFont}" .title="${this.question.text}" @keypress="${this._keyPressed}" type="text" .allowedPattern="[0-9]" half-width-desktop="${this.question.halfWidthDesktop}" @value-changed="${this._debounceChangeEvent}" required="${this.question.required}" .maxlength="${this.question.maxLength}">
        </paper-input>
      `: html`
        <paper-input id="structuredQuestion_${this.index}" value="${this.question.value}" always-float-label="${this._floatIfValueOrIE(question.value)}" .label="${this._getTextWithIndex(question)}" char-counter .useSmallFont="${this.useSmallFont}" .title="${this.question.text}" @keypress="${this._keyPressed}" .type="${this.question.subType}" .halfWidthDesktop="${this.question.halfWidthDesktop}" @value-changed="${this._debounceChangeEvent}" required="${this.question.required}" .maxlength="${this.question.maxLength}">
        </paper-input>
      `}
    `: nothing} 
    ${this._isTextFieldLong(question) ? html`
      <div class="question general longQuestion" .hasFocus="${this.longFocus}" .useSmallFont="${this.useSmallFont}" id="structuredQuestionIntro_${this.index}" inner-h-t-m-l="${this._getTextWithIndex(question)}"></div>

      ${this._isNumberSubType(question) ? html` 
        <paper-input id="structuredQuestion_${this.index}" value="${this.question.value}" char-counter .useSmallFont="${this.useSmallFont}" @keypress="${this._keyPressed}" @focus="${this.setLongFocus}" @blur="${this.setLongUnFocus}" allowed-pattern="[0-9]" type="text" .title="${this.question.text}" no-label-float half-width-desktop="${this.question.halfWidthDesktop}" @value-changed="${this._debounceChangeEvent}" required="${this.question.required}" maxlength="${this.question.maxLength}">
        </paper-input>
      ` : html`
        <paper-input id="structuredQuestion_${this.index}" value="${this.question.value}" char-counter .useSmallFont="${this.useSmallFont}" @keypress="${this._keyPressed}" @focus="${this.setLongFocus}" @blur="${this.setLongUnFocus}" type="${this.question.subType}" .title="${this.question.text}" .noLabelFloat half-width-desktop="${this.question.halfWidthDesktop}" @alue-changed="${this._debounceChangeEvent}" required="${this.question.required}" maxlength="${this.question.maxLength}">
        </paper-input>  
      `} 
    `: nothin}
    
    ${this._isTextarea(question) ? html`     
      <paper-textarea-aria id="structuredQuestion_${this.index}" data-type="text" value="${this.question.value}" @keypress="${this._keyPressed}" minlength="2" alwaysFloatLabel="${this._floatIfValueOrIE(question.value)}" .label="${this._getTextWithIndex(question)}" char-counter useSmallFont="${this.useSmallFont}" @value-changed="${this._debounceChangeEvent}" rows="3" max-rows="5" maxrows="5" required="${this.question.required}" maxlength="${this.question.maxLength}">
      </paper-textarea-aria>
    ` : nothing}

    ${this._isTextareaLong(question) ? html`     
      <div class="question general longQuestion" has-focus="${this.longFocus}" has-content="${this.question.value}" useSmallFont="${this.useSmallFont}" id="structuredQuestionIntro_${this.index}" inner-h-t-m-l="${this._getTextWithIndex(question)}"></div>
      <paper-textarea-aria id="structuredQuestion_${this.index}" data-type="text" value="${this.question.value}" @keypress="${this._keyPressed}" minlength="2" char-counter @focus="${this.setLongFocus}" @blur="${this.setLongUnFocus}" no-label-float .useSmallFont="${this.useSmallFont}" @value-changed="${this._debounceChangeEvent}" rows="3" max-rows="5" maxrows="5" required="${this.question.required}" maxlength="${this.question.maxLength}">
      </paper-textarea-aria>
    ` : nothing}

    ${this._isTextHeader(question) ? html`     
      <div class="header" is-not-first="${this.index}" is-first="${!this.index}">${this.question.text}</div>
    ` : nothing}

    ${this._isTextDescription(question) ? html`     
      <div class="question general" id="structuredQuestionQuestion_${this.index}" .useSmallFont="${this.useSmallFont}" inner-h-t-m-l="${this._textWithLinks(question)}" extra-top-margin="${this.question.extraTopMargin}" less-bottom-margin="${this.question.lessBottomMargin}"></div>
    ` : nothing}

    ${this._isSeparator(question) ? html`     
      <hr>
    ` : nothing}
  
    ${this._isRadios(question) ? html`       
     <div class="question general radiosLabel" useSmallFont="${this.useSmallFont}" .isFirstRating="${this.isFirstRating}" id="structuredQuestionIntro_${this.index}" inner-h-t-m-l="${this._getTextWithIndex(question)}"></div>
      <paper-radio-group required="${this.question.required}" data-type="radios" @selected-changed="${this._radioChanged}" id="structuredQuestion_${this.index}" .name="structuredQuestionRatioGroup_${this.index}" class="${this._getRadioClass(question)}">
        ${this.question.radioButtons.map(radioButton=> html`
          ${!this.radioButton.isSpecify ? html` 
            <paper-radio-button .useSmallFont="${this.useSmallFont}" @keypress="${this.setRadioEventType}" id="structuredQuestionRatioGroup_${this.index}_${this.buttonIndex}" .name="${this.radioButton.text}">
              ${this.radioButton.text}
            </paper-radio-button>
          ` : html` 
            <paper-radio-button useSmallFont="${this.useSmallFont}" @keypress="${this.setRadioEventType}" id="structuredQuestionRatioGroup_${this.index}_${this.buttonIndex}" name="${this.radioButton.text}">
              ${this.radioButton.text}
            </paper-radio-button>
            ${!this._isNumberSubType(radioButton) ? html`
              <paper-input class="specifyInput" hidden .noLabelFloat @value-changed="${this._debounceChangeEvent}" maxlength="${this.question.maxLength}" allowed-pattern="[0-9]" type="text" id="structuredQuestion_${this.index}_${this.buttonIndex}__radioOther"></paper-input>
            ` : html` 
              <paper-input class="specifyInput" hidden .noLabelFloat @value-changed="${this._debounceChangeEvent}" maxlength="${this.question.maxLength}" type="${this.radioButton.subType}" id="structuredQuestion_${this.index}_${this.buttonIndex}__radioOther"></paper-input>
            `}
          `}
        `)}
      </paper-radio-group>
    ` : nothing}
    ${this._isCheckboxes(question) ? html`  
      <div id="structuredQuestionIntro_${this.index}" class="question general checkBoxesLabel" .useSmallFont="${this.useSmallFont}" inner-h-t-m-l="${this._getTextWithIndex(question)}"></div>
      <div id="structuredQuestion_${this.index}" data-type="checkboxes" class="layout vertical">
        ${this.question.checkboxes.map(checkbox=> html`
          ${!this.checkbox.isSpecify ? html`
            <paper-checkbox id="structuredQuestionCheckbox_${this.index}_${this.buttonIndex}" @change="${this._checkboxChanged}">
              ${this.checkbox.text}
            </paper-checkbox>
          ` : html`
            <paper-checkbox id="structuredQuestionCheckbox_${this.index}_${this.buttonIndex}" @change="${this._checkboxChanged}">
              ${this.checkbox.text}
            </paper-checkbox>
            <paper-input class="specifyInput specifyCheckBox" hidden .noLabelFloat @value-changed="${this._debounceChangeEvent}" type="${this.checkbox.subType}" id="structuredQuestion_${this.index}_${this.buttonIndex}_checkboxOther"></paper-input>
          `}
        `)}
      </div>
    ` : nothing}
    ${this._isDropDown(question) ? html`  
     <paper-dropdown-menu id="structuredQuestion_${this.index}" data-type="dropdown" .label="${this._getTextWithIndex(question)}" required="${this.question.required}">
        <paper-listbox slot="dropdown-content" attr-for-selected="name">
        ${this.question.dropdownOptions.map(dropDownOptions=> html`
          <paper-item name="${this.dropDownOptions.text}">${this.dropDownOptions.text}</paper-item>
        `)}  
        </paper-listbox>
      </paper-dropdown-menu>
    ` : nothing}
  `
  }

  setLongUnFocus() {
    this.longFocus = false;
  }

  setLongFocus() {
    this.longFocus = true;
  }

  _isNumberSubType (item) {
    return item && item.subType==="number"
  }

  _keyPressed(event) {
    if (event.which == 13 || event.keyCode == 13) {
      this.fire('yp-goto-next-index', {currentIndex: this.index});
    }
  }

  setRadioEventType (event) {
    this.radioKeypress = true;
  }

  _sendDebouncedChange(detail) {
    if (!this.debunceChangeEventTimer) {
      this.debunceChangeEventTimer = this.async(function () {
        this.fire('yp-answer-content-changed', detail);
        this.debunceChangeEventTimer = null;
        this._resizeScrollerIfNeeded();
      }, 2000);
    }
  }

  _debounceChangeEvent(event, detail) {
    event.stopPropagation();
    this._sendDebouncedChange(detail);
  }

  _getTextWithIndex(question) {
    return question.text;
    //TODO: Think about if we need that
    /*if (question.questionIndex && !this.hideQuestionIndex) {
      return question.questionIndex + ". " + question.text;
    } else {
      return question.text;
    }*/
  }

  _getRadioClass(question) {
    if (question.subType && question.subType === "rating" && !this.isLastRating) {
      return "layout horizontal wrap lessBottomMargin";
    } else if (question.subType && question.subType === "rating") {
      return "layout horizontal wrap";
    } else {
      return "layout vertical";
    }
  }

  _textWithLinks(question) {
    const text = linkifyHtml(question.text);
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  _resizeScrollerIfNeeded() {
    this.fire('resize-scroller');
  }

  _floatIfValueOrIE(value) {
    let ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  validate() {
    return true;
    const liveQuestion = this.$$("#structuredQuestion_" + this.index);
    if (liveQuestion) {
      if (liveQuestion.dataset.type === "dropdown") {
        return true; // DO something if required
      } else if (liveQuestion.dataset.type === "radios") {
        return true; // DO something if required
      } else if (liveQuestion.dataset.type === "checkboxes") {
        return true; // DO something if required
      } else {
        if (liveQuestion) {
          return liveQuestion.validate();
        } else {
          return true;
        }
      }
    }
  }

  focus() {
    if (this.question.type.toLowerCase() === "textfield" ||
      this.question.type.toLowerCase() === "textfieldlong" ||
      this.question.type.toLowerCase() === "textarea" ||
      this.question.type.toLowerCase() === "textarealong" ||
      this.question.type.toLowerCase() === "numberfield"
    ) {
      const item = this.$$("#structuredQuestion_" + this.index);
      if (item) {
        this.async(function () {
          item.focus();
        }, 250);
      }
    }
  }

  cleanValue (value) {
    if (value) {
      return value.replace(/,/g,';').replace(/:/g,';');
    } else {
      console.warn("No value for cleanValue");
      return "";
    }
  }

  getAnswer (options) {
    const item = this.$$("#structuredQuestion_" + this.index);

    if (item) {
      const value = null;

      if (this.question.type.toLowerCase() === "textfield" ||
        this.question.type.toLowerCase() === "textfieldlong" ||
        this.question.type.toLowerCase() === "textarea" ||
        this.question.type.toLowerCase() === "textarealong" ||
        this.question.type.toLowerCase() === "numberfield"
      ) {
        value = item.value;
      } else if (this.question.type.toLowerCase() === "radios") {
        if (item.selected) {
          const selectedRadio = null;
          this.question.radioButtons.forEach(function (button, buttonIndex) {
            if (button.text === item.selected) {
              selectedRadio = button;
              if (selectedRadio.isSpecify) {
                const radioInput = this.$$("#structuredQuestion_" + this.index + "_"+buttonIndex+"__radioOther");
                if (radioInput) {
                  value = selectedRadio.text + ":" + this.cleanValue(radioInput.value);
                } else {
                  value = selectedRadio.text;
                }
              } else {
                value = selectedRadio.text;
              }
              if (value && options && options.withSubCodes && button.subCode) {
                value = button.subCode + " "+ value;
              }
            }
          }.bind(this));
        }
      } else if (this.question.type.toLowerCase() === "checkboxes") {
        const selectedCheckboxes = "";
        for (let i = 0; i < item.children.length; i++) {
          if (item.children[i].checked) {
            const checkboxSubId = item.children[i].id.split("_")[2];
            const selectedCheckbox = this.question.checkboxes[checkboxSubId];
            let subCode = "";
            if (options && options.withSubCodes && selectedCheckbox.subCode) {
              subCode = selectedCheckbox.subCode + " ";
            }
            if (selectedCheckbox.isSpecify) {
              const checkboxInput = this.$$("#structuredQuestion_" + this.index + "_" + checkboxSubId + "_checkboxOther");
              if (checkboxInput && checkboxInput.value !== "") {
                selectedCheckboxes += subCode + selectedCheckbox.text + ":" + this.cleanValue(checkboxInput.value) + ",";
              } else {
                selectedCheckboxes += subCode + selectedCheckbox.text + ",";
              }
            } else {
              selectedCheckboxes += subCode + selectedCheckbox.text + ",";
            }
          }
        }

        if (selectedCheckboxes !== "") {
          value = selectedCheckboxes.substring(0, selectedCheckboxes.length - 1);
        }
      }

      return {uniqueId: this.question.uniqueId, value: value}
    } else {
      console.error("Can't find question item for "+this.question.text);
    }
  }

  setAnswer(value) {
    if (value) {
      const item = this.$$("#structuredQuestion_" + this.index);

      if (item) {
        if (this.question.type.toLowerCase() === "textfield" ||
          this.question.type.toLowerCase() === "textfieldlong" ||
          this.question.type.toLowerCase() === "textarea" ||
          this.question.type.toLowerCase() === "textarealong" ||
          this.question.type.toLowerCase() === "numberfield"
        ) {
          item.value = value;
        } else if (this.question.type.toLowerCase() === "radios") {
          const specifyInput = null;
          if (value.indexOf(":") > -1) {
            const splitText = value.split(":");
            value = splitText[0];
            specifyInput = splitText[1];
          }

          this.question.radioButtons.forEach(function (button, buttonIndex) {
            if (button.text === value) {
              item.select(value);
              if (specifyInput) {
                const input = this.$$("#structuredQuestion_" + this.index + "_"+buttonIndex+"__radioOther");
                if (input) {
                  input.hidden = false;
                  input.value = specifyInput;
                } else {
                  debugger;
                  console.error("Can't find checkbox specify value");
                }
              }
            }
          }.bind(this));
      } else if (this.question.type.toLowerCase() === "checkboxes") {
        const checkboxValues = value.split(',');
        let specifyInputs = {};
        const hasSpecifyInputs = false;
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
            const selectedCheckbox = this.question.checkboxes[checkboxSubId];
            if (selectedCheckbox) {
              if (checkboxValues.indexOf(selectedCheckbox.text) > -1) {
                item.children[i].checked = true;
                if (hasSpecifyInputs) {
                  const input = this.$$("#structuredQuestion_" + this.index + "_" + checkboxSubId + "_checkboxOther");
                  if (input && specifyInputs[selectedCheckbox.text]) {
                    input.hidden = false;
                    input.value = specifyInputs[selectedCheckbox.text];
                  } else {
                    console.error("Can't find checkbox specify value");
                  }
                }
              }
            } else {
              console.debug("No selectedCheckbox");
            }
          }
        }
      }
    } else {
      console.error("cant find answer for item index "+this.index);
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
    } else {
      console.error("Can't find question index: "+this.index);
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
    } else {
      console.error("Can't find question index: "+this.index);
    }
  }

  _openSubQuestion() {
    this.dispatchEvent(new CustomEvent('yp-open-sub-question', {
      bubbles: true,
      composed: true,
      detail: this.question.id
    }));
  }

  _closeSubQuestion() {
    this.dispatchEvent(new CustomEvent('yp-close-sub-question', {
      bubbles: true,
      composed: true,
      detail: this.question.id
    }));
  }

  _checkboxChanged(event, detail) {
    if (event.target.checked) {
      const checkboxSubId = event.target.id.split("_")[2];

      const selectedCheckbox = this.question.checkboxes[checkboxSubId];
      if (selectedCheckbox.isSpecify) {
        const checkboxInput = this.$$("#structuredQuestion_" + this.index + "_" + checkboxSubId + "_checkboxOther");
        if (checkboxInput) {
          checkboxInput.hidden = false;
          if (!checkboxInput.value) {
            checkboxInput.value ="";
          }
          checkboxInput.focus();
        } else {
          console.error("Can't find checkbox input");
        }
      }
    }

    if (this.question.maxLength) {
      const checkedCount = 0;
      const item = this.$$("#structuredQuestion_"+this.index);
      for (let i = 0; i < item.children.length; i++) {
        if (item.children[i].tagName.toLowerCase()==="paper-checkbox" && item.children[i].checked) {
          checkedCount+=1;
        }
      }

      if (checkedCount>=parseInt(this.question.maxLength)) {
        for (let x = 0; x < item.children.length; x++) {
          if (item.children[x].tagName.toLowerCase()==="paper-checkbox" && !item.children[x].checked) {
            item.children[x].disabled = true;
          }
        }
      } else {
        for (let n = 0; n < item.children.length; n++) {
          if (item.children[n].tagName.toLowerCase()==="paper-checkbox" && item.children[n].disabled) {
            item.children[n].disabled = false;
          }
        }
      }
    }

    event.stopPropagation();
    this._sendDebouncedChange({value: 1});
  }

  _radioChanged(event, detail) {
    event.stopPropagation();
    this._sendDebouncedChange({value: 1});

    const selectedRadio = null;

    this.question.radioButtons.forEach(function (button, buttonIndex) {
      if (button.text === detail.value) {
        selectedRadio = button;
        if (selectedRadio.skipTo) {
          this.fire('yp-skip-to-unique-id', {fromId: this.question.uniqueId, toId: selectedRadio.skipTo});
        } else if (selectedRadio.isSpecify) {
          const input = this.$$("#structuredQuestion_" + this.index + "_"+buttonIndex+"__radioOther");
          if (input) {
            input.hidden = false;
            input.focus();
          } else {
            debugger;
            console.error("Can't find radio specify value");
          }
        } else {
          this.async(function () {
            if(!this.radioKeypress) {
              this.fire('yp-goto-next-index', { currentIndex: this.index });
            }
          });

          const hasSkipToId;

          this.question.radioButtons.forEach(function (button) {
            if (button.skipTo) {
              hasSkipToId = button.skipTo;
            }
          }.bind(this));

          if (hasSkipToId) {
            this.fire('yp-open-to-unique-id', {fromId: this.question.uniqueId, toId: hasSkipToId});
          }
        }
      }
    }.bind(this));
  }

  _isTextarea(question) {
    return (question.type && question.type.toLowerCase() === 'textarea') || (question.type === undefined && question.maxLength > 1);
  }

  _isTextareaLong(question) {
    return (question.type && question.type.toLowerCase() === 'textarealong');
  }

  _isTextField(question) {
    return (question.type && question.type.toLowerCase() === 'textfield');
  }

  _isTextFieldLong(question) {
    return (question.type && question.type.toLowerCase() === 'textfieldlong');
  }

  _isNumberField(question) {
    return (question.type && question.type.toLowerCase() === 'numberfield');
  }

  _isTextHeader(question)
  {
    return (question.type && question.type.toLowerCase() === 'textheader');
  }

  _isTextDescription(question) {
    return (question.type && question.type.toLowerCase() === 'textdescription');
  }

  _isCheckboxes(question) {
    return (question.type && question.type.toLowerCase() === 'checkboxes');
  }

  _isSeparator(question) {
    return (question.type && question.type.toLowerCase() === 'separator');
  }

  _isRadios(question) {
    return (question.type && question.type.toLowerCase() === 'radios');
  }

  _isDropDown(question) {
    return (question.type && question.type.toLowerCase() === 'dropdown');
  }

  _structuredAnsweredChanged(structuredAnswers) {
    if (structuredAnswers && this.question.uniqueId) {
      const BreakException = {};
      try {
        structuredAnswers.forEach(function (answer) {
          if (this.question.uniqueId === answer.uniqueId) {
            this.async(function () {
              this.setAnswer(answer.value);
            }, 100);
            throw BreakException;
          }
        }.bind(this));
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  ready() {
    if (window.i18nTranslation) {
      this.language = window.locale;
    }

    if (this.question) {
      if (this.question.type==="numberField") {
        this.question.type="textField";
        this.question.subType="number"
      }
    }

    this.async(function () {
      if (this.question.questionIndex === 1 && !this.dontFocusFirstQuestion) {
        this.focus();
      }
    }, 500);

    super.ready();
  }
}

customElements.define('yp-structured-question-edit-lit', YpStructuredQuestionEditLit);
