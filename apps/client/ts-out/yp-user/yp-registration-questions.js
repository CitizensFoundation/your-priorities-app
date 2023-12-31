var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/mwc-snackbar";
import "@material/web/radio/radio.js";
import "../yp-survey/yp-structured-question-edit.js";
import { YpSurveyHelpers } from "../yp-survey/YpSurveyHelpers.js";
let YpRegistrationQuestions = class YpRegistrationQuestions extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.autoTranslate = false;
        this.liveQuestionIds = [];
        this.uniqueIdsToElementIndexes = {};
        this.liveUniqueIds = [];
        this.liveUniqueIdsAll = [];
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener("yp-auto-translate", this._autoTranslateEvent.bind(this));
        this.addListener("yp-skip-to-unique-id", this._skipToId);
        this.addListener("yp-goto-next-index", this._goToNextIndex);
        if (window.autoTranslate) {
            this.autoTranslate = true;
        }
        this._getTranslationsIfNeeded();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-auto-translate", this._autoTranslateEvent.bind(this));
        this.removeListener("yp-skip-to-unique-id", this._skipToId);
        this.removeListener("yp-goto-next-index", this._goToNextIndex);
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
        }

        @media (max-width: 800px) {
          yp-structured-question-edit {
            padding-left: 0;
            padding-right: 0;
          }
        }

        [hidden] {
          display: none !important;
        }

        yp-structured-question-edit {
        }

        .segmentQuestionIntro {
          margin-top: 16px;
        }
      `,
        ];
    }
    _goToNextIndex(event) {
        const currentPos = this.liveQuestionIds.indexOf(event.detail.currentIndex);
        if (currentPos < this.liveQuestionIds.length - 1) {
            const item = this.$$("#structuredQuestionContainer_" + this.liveQuestionIds[currentPos + 1]);
            item.scrollIntoView({
                block: "end",
                inline: "end",
                behavior: "smooth",
            });
            item.focus();
        }
    }
    _skipToId(event, showItems) {
        const toId = event.detail.toId.replace(/]/g, "");
        const fromId = event.detail.fromId.replace(/]/g, "");
        const toIndex = this.uniqueIdsToElementIndexes[toId];
        const item = this.$$("#structuredQuestionContainer_" + toIndex);
        item.scrollIntoView({
            block: "end",
            inline: "end",
            behavior: "smooth",
        });
        item.focus();
    }
    _skipToWithHideId(event, showItems) {
        let foundFirst = false;
        if (this.$$("#surveyContainer")) {
            const children = this.$$("#surveyContainer")
                .children;
            for (let i = 0; i < children.length; i++) {
                const toId = event.detail.toId.replace(/]/g, "");
                const fromId = event.detail.fromId.replace(/]/g, "");
                if (children[i + 1] &&
                    children[i + 1].question &&
                    children[i + 1].question.uniqueId &&
                    children[i + 1].question.uniqueId.substring(children[i + 1].question.uniqueId.length - 1) === "a") {
                    children[i].question.uniqueId = children[i + 1].question.uniqueId.substring(0, children[i + 1].question.uniqueId.length - 1);
                }
                if (children[i].question &&
                    event.detail.fromId &&
                    children[i].question.uniqueId === fromId) {
                    foundFirst = true;
                }
                else if (children[i].question &&
                    event.detail.toId &&
                    (children[i].question.uniqueId === toId ||
                        children[i].question.uniqueId === toId + "a")) {
                    break;
                }
                else {
                    if (foundFirst) {
                        if (showItems) {
                            children[i].hidden = false;
                        }
                        else {
                            children[i].hidden = true;
                        }
                    }
                }
            }
        }
        else {
            console.error("No survey container found");
        }
    }
    render() {
        return this.group
            ? html ` ${this.segments
                ? html `
                <div class="segmentQuestionIntro">${this.t("choose")}</div>

                ${this.segments.map((radioButton, buttonIndex) => {
                    return html `
                    <label .label="${radioButton.text}">
                      <md-radio
                        @change="${this._radioChanged}"
                        .value="${radioButton.text}"
                        id="segmentRadio_${buttonIndex}"
                        .name="${radioButton.segmentName}"
                      >
                      </md-radio>
                    </label>
                  `;
                })}
              `
                : nothing}
        ${this.filteredQuestions
                ? html `<div id="surveyContainer">
                ${this.filteredQuestions.map((question, index) => {
                    return html `
                    <yp-structured-question-edit
                      .index="${index}"
                      use-small-font
                      is-from-new-post
                      id="structuredQuestionContainer_${index}"
                      .structured-answers="${this.structuredAnswers}"
                      .question="${question}"
                    >
                    </yp-structured-question-edit>
                  `;
                })}
              </div>`
                : nothing}</div>`
            : nothing;
    }
    get structuredQuestions() {
        if (this.group && this.group.configuration.registrationQuestionsJson) {
            if (this.translatedQuestions) {
                return this.translatedQuestions;
            }
            else {
                return this.group.configuration.registrationQuestionsJson;
            }
        }
        else {
            return undefined;
        }
    }
    get filteredQuestions() {
        if (this.structuredQuestions) {
            const filteredQuestions = [];
            this.structuredQuestions.forEach((question) => {
                if (!this.segments ||
                    (this.selectedSegment &&
                        question.type !== "segment" &&
                        question.segmentName === this.selectedSegment)) {
                    filteredQuestions.push(question);
                }
            });
            return filteredQuestions;
        }
        else {
            return null;
        }
    }
    _autoTranslateEvent(event) {
        this.autoTranslate = event.detail;
        this._getTranslationsIfNeeded();
    }
    async _getTranslationsIfNeeded() {
        this.translatedQuestions = undefined;
        if (this.autoTranslate &&
            this.language &&
            this.group &&
            this.language !== this.group.language) {
            const translatedTexts = await window.serverApi.getTranslatedRegistrationQuestions(this.group.id, this.language);
            if (this.autoTranslate && this.language !== this.group.language) {
                const currentQuestions = JSON.parse(JSON.stringify(this.group.configuration.registrationQuestionsJson));
                if (translatedTexts.length ===
                    YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)) {
                    let translatedItemCount = 0;
                    for (let questionCount = 0; questionCount < currentQuestions.length; questionCount++) {
                        const question = currentQuestions[questionCount];
                        question.originalText = question.text;
                        question.text = translatedTexts[translatedItemCount++];
                        if (question.type === "radios" &&
                            question.radioButtons &&
                            question.radioButtons.length > 0) {
                            for (let subOptionCount = 0; subOptionCount < question.radioButtons.length; subOptionCount++) {
                                question.radioButtons[subOptionCount].originalText =
                                    question.radioButtons[subOptionCount].text;
                                question.radioButtons[subOptionCount].text =
                                    translatedTexts[translatedItemCount++];
                            }
                        }
                        else if (question.type === "checkboxes" &&
                            question.checkboxes &&
                            question.checkboxes.length > 0) {
                            for (let subOptionCount = 0; subOptionCount < question.checkboxes.length; subOptionCount++) {
                                question.checkboxes[subOptionCount].originalText =
                                    question.checkboxes[subOptionCount].text;
                                question.checkboxes[subOptionCount].text =
                                    translatedTexts[translatedItemCount++];
                            }
                        }
                        else if (question.type === "dropdown" &&
                            question.dropdownOptions &&
                            question.dropdownOptions.length > 0) {
                            for (let subOptionCount = 0; subOptionCount < question.dropdownOptions.length; subOptionCount++) {
                                question.dropdownOptions[subOptionCount].originalText =
                                    question.dropdownOptions[subOptionCount].text;
                                question.dropdownOptions[subOptionCount].text =
                                    translatedTexts[translatedItemCount++];
                            }
                        }
                    }
                    this.translatedQuestions = currentQuestions;
                }
                else {
                    console.error("Questions and Translated texts length does not match");
                    console.error(`Questions: ${currentQuestions.length} Texts ${translatedTexts.length}`);
                }
            }
            else {
                this.translatedQuestions = undefined;
            }
        }
    }
    _setupQuestions() {
        if (this.filteredQuestions) {
            if (window.autoTranslate) {
                this.autoTranslate = window.autoTranslate;
            }
            const liveQuestionIds = [];
            const liveUniqueIds = [];
            const liveUniqueIdsAll = [];
            const uniqueIdsToElementIndexes = {};
            this.filteredQuestions.forEach((question, index) => {
                if ((question && question.type.toLowerCase() === "textfield") ||
                    question.type.toLowerCase() === "textfieldlong" ||
                    question.type.toLowerCase() === "textarea" ||
                    question.type.toLowerCase() === "textarealong" ||
                    question.type.toLowerCase() === "numberfield" ||
                    question.type.toLowerCase() === "checkboxes" ||
                    question.type.toLowerCase() === "radios" ||
                    question.type.toLowerCase() === "dropdown") {
                    if (!this.segments ||
                        (this.selectedSegment &&
                            question.segmentName === this.selectedSegment)) {
                        liveQuestionIds.push(index);
                        uniqueIdsToElementIndexes[question.uniqueId] = index;
                        liveUniqueIds.push(question.uniqueId);
                        liveUniqueIdsAll.push({
                            uniqueId: question.uniqueId,
                            atIndex: index,
                        });
                    }
                }
            });
            this.liveQuestionIds = liveQuestionIds;
            this.liveUniqueIds = liveUniqueIds;
            this.liveUniqueIdsAll = liveUniqueIdsAll;
            this.uniqueIdsToElementIndexes = uniqueIdsToElementIndexes;
        }
    }
    _checkForSegments() {
        if (this.structuredQuestions) {
            const segments = [];
            this.structuredQuestions.forEach((question, index) => {
                if (question.type.toLowerCase() === "segment") {
                    segments.push(question);
                }
            });
            if (segments.length > 0) {
                this.segments = segments;
            }
        }
        else {
            this.segments = undefined;
        }
    }
    getAnswers() {
        const answers = [];
        this.liveQuestionIds.forEach((liveIndex) => {
            const questionElement = this.$$("#structuredQuestionContainer_" + liveIndex);
            if (questionElement) {
                const returnAnswer = {};
                const text = questionElement.question.originalText
                    ? questionElement.question.originalText
                    : questionElement.question.text;
                const answer = questionElement.getAnswer();
                if (answer) {
                    returnAnswer[text] = questionElement.getAnswer().value;
                    answers.push(returnAnswer);
                }
                else {
                    console.warn("No answer for question: " + text);
                }
            }
        });
        this.structuredAnswers = answers;
        return answers;
    }
    validate() {
        let valid = true;
        let hasFoundOne = false;
        this.liveQuestionIds.forEach((liveIndex) => {
            const questionElement = this.$$("#structuredQuestionContainer_" + liveIndex);
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
        if (this.segments && !this.selectedSegment) {
            valid = false;
        }
        return valid;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("group") ||
            changedProperties.has("translatedQuestions")) {
            this._checkForSegments();
            this._setupQuestions();
        }
    }
    _radioChanged(event) {
        this.selectedSegment = event.detail.value;
        this._setupQuestions();
        setTimeout(() => {
            this.fire("questions-changed");
        });
    }
};
__decorate([
    property({ type: Object })
], YpRegistrationQuestions.prototype, "group", void 0);
__decorate([
    property({ type: Array })
], YpRegistrationQuestions.prototype, "structuredAnswers", void 0);
__decorate([
    property({ type: Array })
], YpRegistrationQuestions.prototype, "translatedQuestions", void 0);
__decorate([
    property({ type: Boolean })
], YpRegistrationQuestions.prototype, "autoTranslate", void 0);
__decorate([
    property({ type: String })
], YpRegistrationQuestions.prototype, "selectedSegment", void 0);
__decorate([
    property({ type: Array })
], YpRegistrationQuestions.prototype, "segments", void 0);
YpRegistrationQuestions = __decorate([
    customElement("yp-registration-questions")
], YpRegistrationQuestions);
export { YpRegistrationQuestions };
//# sourceMappingURL=yp-registration-questions.js.map