/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpSurveyHelpers } from '../yp-survey/YpSurveyHelpers.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class YpPostBaseWithAnswersInterface {
  autoTranslate: boolean;
  translatedQuestions: string[] | undefined;
  post: YpPostData | undefined;
  translatedAnswers: string[] | undefined;
  addGlobalListener?: Function;
  structuredAnswersFormatted: string;
  getIndexTranslationKey: Function;
}

export const YpPostBaseWithAnswers = <T extends Constructor<YpBaseElement>>(
  superClass: T
) => {
  class YpPostBaseWithAnswersElement extends superClass {
    @property({ type: Array })
    translatedQuestions: string[] | undefined;

    @property({ type: Array })
    translatedAnswers: string[] | undefined;

    @property({ type: Boolean })
    autoTranslate = false;

    @property({ type: Object })
    post: YpPostData | undefined;

    override connectedCallback() {
      super.connectedCallback();
      if (window.autoTranslate) {
        this.autoTranslate = true;
      }
      this.addGlobalListener(
        'yp-auto-translate',
        this._autoTranslateEvent.bind(this)
      );

      setTimeout(()=>{
        this._getSurveyTranslationsIfNeeded();
      }, 100)
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this.removeGlobalListener(
        'yp-auto-translate',
        this._autoTranslateEvent.bind(this)
      );
    }

    _autoTranslateEvent(event: CustomEvent) {
      this.autoTranslate = event.detail;
      this._getSurveyTranslationsIfNeeded();
    }

    override _languageEvent(event: CustomEvent) {
      super._languageEvent(event);
      this._getSurveyTranslationsIfNeeded();
    }

    async _getSurveyTranslationsIfNeeded() {
      this.translatedQuestions = undefined;
      this.translatedAnswers = undefined;
      if (
        this.post &&
        this.post.public_data &&
        this.post.public_data.structuredAnswersJson &&
        this.autoTranslate &&
        this.language !== this.post.language
      ) {
        const questionsIndexKey =
          this.getIndexTranslationKey('GroupQuestions');
        const answersIndexKey = this.getIndexTranslationKey('PostAnswers');
        if (
          window.appGlobals.cache.autoTranslateCache[questionsIndexKey] &&
          window.appGlobals.cache.autoTranslateCache[answersIndexKey]
        ) {
          this.translatedQuestions = window.appGlobals.cache.autoTranslateCache[
            questionsIndexKey
          ] as string[];
          this.translatedAnswers = window.appGlobals.cache.autoTranslateCache[
            answersIndexKey
          ] as string[];
        } else {
          const translatedResponse =
            (await window.serverApi.getSurveyTranslations(
              this.post,
              this.language!
            )) as string[][];

          if (
            this.post &&
            this.autoTranslate &&
            (this.language !== this.post.language || this.post.language == '??')
          ) {
            const translatedQuestionTexts = translatedResponse[0];
            const translatedAnswerTexts = translatedResponse[1];
            const currentQuestions = JSON.parse(
              JSON.stringify(
                this.post.Group.configuration.structuredQuestionsJson
              )
            );
            const currentAnswers = JSON.parse(
              JSON.stringify(this.post.public_data.structuredAnswersJson)
            );

            if (
              translatedQuestionTexts.length ===
              YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)
            ) {
              let translationCounter = 0;
              for (let i = 0; i < currentQuestions.length; i++) {
                const question = currentQuestions[i];
                question.text = translatedQuestionTexts[translationCounter++];

                if (
                  question.type === 'radios' &&
                  question.radioButtons &&
                  question.radioButtons.length > 0
                ) {
                  translationCounter += question.radioButtons.length;
                } else if (
                  question.type === 'checkboxes' &&
                  question.checkboxes &&
                  question.checkboxes.length > 0
                ) {
                  translationCounter += question.checkboxes.length;
                } else if (
                  question.type === 'dropdown' &&
                  question.dropdownOptions &&
                  question.dropdownOptions.length > 0
                ) {
                  translationCounter += question.dropdownOptions.length;
                }
              }

              for (let i = 0; i < currentAnswers.length; i++) {
                if (currentAnswers[i].value) {
                  currentAnswers[i].value = translatedAnswerTexts[i];
                }
              }

              this.translatedQuestions = currentQuestions;
              this.translatedAnswers = currentAnswers;

              const questionsIndexKey =
                this.getIndexTranslationKey('GroupQuestions');
              const answersIndexKey =
                this.getIndexTranslationKey('PostAnswers');

              window.appGlobals.cache.autoTranslateCache[questionsIndexKey] =
                currentQuestions;
              window.appGlobals.cache.autoTranslateCache[answersIndexKey] =
                currentAnswers;
            } else {
              console.error(
                'Questions and Translated texts length does not match'
              );
            }
          } else {
            this.translatedQuestions = undefined;
            this.translatedAnswers = undefined;
          }
        }
      }
    }

    getIndexTranslationKey(textType: string) {
      return `${textType}-${this.post!.id}-${this.language}`;
    }

    _jsonToHtml(data: unknown): string {
      // If given data is JSON in string form, parse it
      let parsedData: unknown;
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data);
        } catch (err) {
          // If parsing fails, treat it as a raw string
          return `<div>${data}</div>`;
        }
      } else {
        parsedData = data;
      }

      // Handle arrays
      if (Array.isArray(parsedData)) {
        let itemsHtml = '';
        for (const item of parsedData) {
          itemsHtml += `<li>${this._jsonToHtml(item)}</li>`;
        }
        return `<ul>${itemsHtml}</ul>`;
      }

      // Handle objects
      if (parsedData !== null && typeof parsedData === 'object') {
        let entriesHtml = '';
        for (const [key, value] of Object.entries(parsedData)) {
          entriesHtml += `<div style="padding: 4px;margin-top: 8px;"><b>${key}</b></div>`;
          entriesHtml += `<div style="padding: 4px">${this._jsonToHtml(value)}</div>`;
        }
        return `<div>${entriesHtml}</div>`;
      }

      // Primitives (string, number, boolean, null, undefined, etc.)
      return `<span>${String(parsedData)}</span>`;
    }

    get structuredAnswersFormatted() {
      if (
        this.post &&
        this.post.public_data &&
        this.post.public_data.structuredAnswersJson &&
        this.post.Group.configuration &&
        this.post.Group.configuration.structuredQuestionsJson
      ) {
        const questionHash: Record<string, YpStructuredQuestionData> = {};
        const showDescriptionBeforeIdHash: Record<
          string,
          YpStructuredQuestionData
        > = {};
        const showDescriptionAfterIdHash: Record<
          string,
          YpStructuredQuestionData
        > = {};
        let outText = '';
        this.post.Group.configuration.structuredQuestionsJson.forEach(
          question => {
            if (question.uniqueId) {
              questionHash[question.uniqueId] = question;
            } else {
              if (question.showBeforeAnswerId) {
                showDescriptionBeforeIdHash[question.showBeforeAnswerId] =
                  question;
              }

              if (question.showAfterAnswerId) {
                showDescriptionAfterIdHash[question.showAfterAnswerId] =
                  question;
              }
            }
          }
        );

        this.post.public_data.structuredAnswersJson.forEach(answer => {
          if (answer && answer.value) {
            const question = questionHash[answer.uniqueId];
            if (!question || question.hiddenToUser === true) {
              return;
            }

            if (question) {
              if (showDescriptionBeforeIdHash[answer.uniqueId]) {
                outText +=
                  showDescriptionBeforeIdHash[answer.uniqueId].text + '\n\n';
              }
              outText += '<b>' + question.text + '</b>\n';

              if (answer.value) {
                if (question.type === 'textAreaJson') {
                  // Special handling for JSON
                  const jsonHtml = this._jsonToHtml(answer.value);
                  outText += jsonHtml + '\n\n';
                } else {
                  // Default behavior
                  outText += answer.value + '\n\n';
                }
              } else {
                outText += '\n\n';
              }

              if (showDescriptionAfterIdHash[answer.uniqueId]) {
                outText +=
                  showDescriptionAfterIdHash[answer.uniqueId].text + '\n\n';
              }
            }
          }
        });

        return outText;
      } else {
        return '';
      }
    }
  }
  return YpPostBaseWithAnswersElement as Constructor<YpPostBaseWithAnswersInterface> &
    T;
};
