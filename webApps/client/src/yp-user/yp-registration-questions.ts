import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import * as linkify from "linkifyjs";

import "@material/web/progress/circular-progress.js";
import "@material/web/iconbutton/icon-button.js";

import "@material/web/radio/radio.js";

import "../yp-survey/yp-structured-question-edit.js";

import { YpStructuredQuestionEdit } from "../yp-survey/yp-structured-question-edit.js";
import { YpSurveyHelpers } from "../yp-survey/YpSurveyHelpers.js";

@customElement("yp-registration-questions")
export class YpRegistrationQuestions extends YpBaseElement {
  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Array })
  structuredAnswers: Array<Record<string, string>> | undefined;

  @property({ type: Array })
  translatedQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  selectedSegment: string | undefined;

  @property({ type: Array })
  segments: Array<YpStructuredQuestionData> | undefined;

  liveQuestionIds: Array<number> = [];

  uniqueIdsToElementIndexes: Record<string, number> = {};

  liveUniqueIds: Array<string> = [];

  liveUniqueIdsAll: Array<{ uniqueId: string; atIndex: number }> = [];

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );
    this.addListener("yp-skip-to-unique-id", this._skipToId);
    this.addListener("yp-goto-next-index", this._goToNextIndex);

    if (window.autoTranslate) {
      this.autoTranslate = true;
    }

    this._getTranslationsIfNeeded();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );
    this.removeListener("yp-skip-to-unique-id", this._skipToId);
    this.removeListener("yp-goto-next-index", this._goToNextIndex);
  }

  static override get styles() {
    return [
      super.styles,
      css`
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

  _goToNextIndex(event: CustomEvent) {
    const currentPos = this.liveQuestionIds.indexOf(event.detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      const item = this.$$(
        "#structuredQuestionContainer_" + this.liveQuestionIds[currentPos + 1]
      ) as HTMLElement;
      item.scrollIntoView({
        block: "end",
        inline: "end",
        behavior: "smooth",
      });
      item.focus();
    }
  }

  _skipToId(event: CustomEvent, showItems: boolean) {
    const toId = event.detail.toId.replace(/]/g, "");
    const fromId = event.detail.fromId.replace(/]/g, "");
    const toIndex = this.uniqueIdsToElementIndexes[toId];
    const item = this.$$(
      "#structuredQuestionContainer_" + toIndex
    ) as HTMLElement;
    item.scrollIntoView({
      block: "end",
      inline: "end",
      behavior: "smooth",
    });
    item.focus();
  }

  _skipToWithHideId(event: CustomEvent, showItems: boolean) {
    let foundFirst = false;
    if (this.$$("#surveyContainer")) {
      const children = this.$$("#surveyContainer")!
        .children as unknown as Array<YpStructuredQuestionEdit>;
      for (let i = 0; i < children.length; i++) {
        const toId = event.detail.toId.replace(/]/g, "");
        const fromId = event.detail.fromId.replace(/]/g, "");
        if (
          children[i + 1] &&
          children[i + 1].question &&
          children[i + 1].question.uniqueId &&
          children[i + 1].question.uniqueId!.substring(
            children[i + 1].question.uniqueId!.length - 1
          ) === "a"
        ) {
          children[i].question.uniqueId = children[
            i + 1
          ].question.uniqueId!.substring(
            0,
            children[i + 1].question.uniqueId!.length - 1
          );
        }
        if (
          children[i].question &&
          event.detail.fromId &&
          children[i].question.uniqueId === fromId
        ) {
          foundFirst = true;
        } else if (
          children[i].question &&
          event.detail.toId &&
          (children[i].question.uniqueId === toId ||
            children[i].question.uniqueId === toId + "a")
        ) {
          break;
        } else {
          if (foundFirst) {
            if (showItems) {
              (children[i] as HTMLElement).hidden = false;
            } else {
              (children[i] as HTMLElement).hidden = true;
            }
          }
        }
      }
    } else {
      console.error("No survey container found");
    }
  }

  override render() {
    return this.group
      ? html` ${
          this.segments
            ? html`
                <div class="segmentQuestionIntro">${this.t("choose")}</div>

                ${this.segments.map((radioButton, buttonIndex) => {
                  return html`
                    <label .label="${radioButton.text}">
                      <md-radio
                        @change="${this._radioChanged}"
                        .value="${radioButton.text}"
                        id="segmentRadio_${buttonIndex}"
                        .name="${radioButton.segmentName!}"
                      >
                      </md-radio>
                    </label>
                  `;
                })}
              `
            : nothing
        }
        ${
          this.filteredQuestions
            ? html`<div id="surveyContainer">
                ${this.filteredQuestions.map((question, index) => {
                  return html`
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
            : nothing
        }</div>`
      : nothing;
  }

  get structuredQuestions(): Array<YpStructuredQuestionData> | undefined {
    if (this.group && this.group.configuration.registrationQuestionsJson) {
      if (this.translatedQuestions) {
        return this.translatedQuestions;
      } else {
        return this.group.configuration.registrationQuestionsJson;
      }
    } else {
      return undefined;
    }
  }

  get filteredQuestions() {
    if (this.structuredQuestions) {
      const filteredQuestions: Array<YpStructuredQuestionData> = [];
      this.structuredQuestions.forEach((question) => {
        if (
          !this.segments ||
          (this.selectedSegment &&
            question.type !== "segment" &&
            question.segmentName === this.selectedSegment)
        ) {
          filteredQuestions.push(question);
        }
      });
      return filteredQuestions;
    } else {
      return null;
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._getTranslationsIfNeeded();
  }

  async _getTranslationsIfNeeded() {
    this.translatedQuestions = undefined;
    if (
      this.autoTranslate &&
      this.language &&
      this.group &&
      this.language !== this.group.language
    ) {
      const translatedTexts =
        await window.serverApi.getTranslatedRegistrationQuestions(
          this.group.id,
          this.language
        );

      if (this.autoTranslate && this.language !== this.group.language) {
        const currentQuestions = JSON.parse(
          JSON.stringify(this.group.configuration.registrationQuestionsJson)
        ) as Array<YpStructuredQuestionData>;

        if (
          translatedTexts.length ===
          YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)
        ) {
          let translatedItemCount = 0;
          for (
            let questionCount = 0;
            questionCount < currentQuestions.length;
            questionCount++
          ) {
            const question = currentQuestions[questionCount];
            question.originalText = question.text;
            question.text = translatedTexts[translatedItemCount++];

            if (
              question.type === "radios" &&
              question.radioButtons &&
              question.radioButtons.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.radioButtons.length;
                subOptionCount++
              ) {
                question.radioButtons[subOptionCount].originalText =
                  question.radioButtons[subOptionCount].text;
                question.radioButtons[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === "checkboxes" &&
              question.checkboxes &&
              question.checkboxes.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.checkboxes.length;
                subOptionCount++
              ) {
                question.checkboxes[subOptionCount].originalText =
                  question.checkboxes[subOptionCount].text;
                question.checkboxes[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === "dropdown" &&
              question.dropdownOptions &&
              question.dropdownOptions.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.dropdownOptions.length;
                subOptionCount++
              ) {
                question.dropdownOptions[subOptionCount].originalText =
                  question.dropdownOptions[subOptionCount].text;
                question.dropdownOptions[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            }
          }

          this.translatedQuestions = currentQuestions;
        } else {
          console.error("Questions and Translated texts length does not match");
          console.error(
            `Questions: ${currentQuestions.length} Texts ${translatedTexts.length}`
          );
        }
      } else {
        this.translatedQuestions = undefined;
      }
    }
  }

  _setupQuestions() {
    if (this.filteredQuestions) {
      if (window.autoTranslate) {
        this.autoTranslate = window.autoTranslate;
      }
      const liveQuestionIds: Array<number> = [];
      const liveUniqueIds: Array<string> = [];
      const liveUniqueIdsAll: Array<any> = [];
      const uniqueIdsToElementIndexes: Record<string, number> = {};
      this.filteredQuestions.forEach((question, index) => {
        if (
          (question && question.type!.toLowerCase() === "textfield") ||
          question.type!.toLowerCase() === "textfieldlong" ||
          question.type!.toLowerCase() === "textarea" ||
          question.type!.toLowerCase() === "textarealong" ||
          question.type!.toLowerCase() === "numberfield" ||
          question.type!.toLowerCase() === "checkboxes" ||
          question.type!.toLowerCase() === "radios" ||
          question.type!.toLowerCase() === "dropdown"
        ) {
          if (
            !this.segments ||
            (this.selectedSegment &&
              question.segmentName === this.selectedSegment)
          ) {
            liveQuestionIds.push(index);
            uniqueIdsToElementIndexes[question.uniqueId!] = index;
            liveUniqueIds.push(question.uniqueId!);
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
      const segments: Array<YpStructuredQuestionData> = [];
      this.structuredQuestions.forEach((question, index) => {
        if (question.type!.toLowerCase() === "segment") {
          segments.push(question);
        }
      });

      if (segments.length > 0) {
        this.segments = segments;
      }
    } else {
      this.segments = undefined;
    }
  }

  getAnswers() {
    const answers: Array<Record<string, string>> = [];
    this.liveQuestionIds.forEach((liveIndex) => {
      const questionElement = this.$$(
        "#structuredQuestionContainer_" + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement) {
        const returnAnswer: Record<string, string> = {};
        const text = questionElement.question.originalText
          ? questionElement.question.originalText
          : questionElement.question.text;

        const answer = questionElement.getAnswer();

        if (answer) {
          returnAnswer[text] = questionElement.getAnswer()!.value as string;
          answers.push(returnAnswer);
        } else {
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
      const questionElement = this.$$(
        "#structuredQuestionContainer_" + liveIndex
      ) as YpStructuredQuestionEdit;
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

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("group") ||
      changedProperties.has("translatedQuestions")
    ) {
      this._checkForSegments();
      this._setupQuestions();
    }
  }

  _radioChanged(event: CustomEvent) {
    this.selectedSegment = event.detail.value;
    this._setupQuestions();
    setTimeout(() => {
      this.fire("questions-changed");
    });
  }
}
