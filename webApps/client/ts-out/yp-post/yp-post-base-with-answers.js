var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { YpSurveyHelpers } from '../yp-survey/YpSurveyHelpers.js';
export const YpPostBaseWithAnswers = (superClass) => {
    class YpPostBaseWithAnswersElement extends superClass {
        constructor() {
            super(...arguments);
            this.autoTranslate = false;
        }
        connectedCallback() {
            super.connectedCallback();
            if (window.autoTranslate) {
                this.autoTranslate = true;
            }
            this.addGlobalListener('yp-auto-translate', this._autoTranslateEvent.bind(this));
            setTimeout(() => {
                this._getSurveyTranslationsIfNeeded();
            }, 100);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeGlobalListener('yp-auto-translate', this._autoTranslateEvent.bind(this));
        }
        _autoTranslateEvent(event) {
            this.autoTranslate = event.detail;
            this._getSurveyTranslationsIfNeeded();
        }
        _languageEvent(event) {
            super._languageEvent(event);
            this._getSurveyTranslationsIfNeeded();
        }
        async _getSurveyTranslationsIfNeeded() {
            this.translatedQuestions = undefined;
            this.translatedAnswers = undefined;
            if (this.post &&
                this.post.public_data &&
                this.post.public_data.structuredAnswersJson &&
                this.autoTranslate &&
                this.language !== this.post.language) {
                const questionsIndexKey = this.getIndexTranslationKey('GroupQuestions');
                const answersIndexKey = this.getIndexTranslationKey('PostAnswers');
                if (window.appGlobals.cache.autoTranslateCache[questionsIndexKey] &&
                    window.appGlobals.cache.autoTranslateCache[answersIndexKey]) {
                    this.translatedQuestions = window.appGlobals.cache.autoTranslateCache[questionsIndexKey];
                    this.translatedAnswers = window.appGlobals.cache.autoTranslateCache[answersIndexKey];
                }
                else {
                    const translatedResponse = (await window.serverApi.getSurveyTranslations(this.post, this.language));
                    if (this.post &&
                        this.autoTranslate &&
                        (this.language !== this.post.language || this.post.language == '??')) {
                        const translatedQuestionTexts = translatedResponse[0];
                        const translatedAnswerTexts = translatedResponse[1];
                        const currentQuestions = JSON.parse(JSON.stringify(this.post.Group.configuration.structuredQuestionsJson));
                        const currentAnswers = JSON.parse(JSON.stringify(this.post.public_data.structuredAnswersJson));
                        if (translatedQuestionTexts.length ===
                            YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)) {
                            let translationCounter = 0;
                            for (let i = 0; i < currentQuestions.length; i++) {
                                const question = currentQuestions[i];
                                question.text = translatedQuestionTexts[translationCounter++];
                                if (question.type === 'radios' &&
                                    question.radioButtons &&
                                    question.radioButtons.length > 0) {
                                    translationCounter += question.radioButtons.length;
                                }
                                else if (question.type === 'checkboxes' &&
                                    question.checkboxes &&
                                    question.checkboxes.length > 0) {
                                    translationCounter += question.checkboxes.length;
                                }
                                else if (question.type === 'dropdown' &&
                                    question.dropdownOptions &&
                                    question.dropdownOptions.length > 0) {
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
                            const questionsIndexKey = this.getIndexTranslationKey('GroupQuestions');
                            const answersIndexKey = this.getIndexTranslationKey('PostAnswers');
                            window.appGlobals.cache.autoTranslateCache[questionsIndexKey] =
                                currentQuestions;
                            window.appGlobals.cache.autoTranslateCache[answersIndexKey] =
                                currentAnswers;
                        }
                        else {
                            console.error('Questions and Translated texts length does not match');
                        }
                    }
                    else {
                        this.translatedQuestions = undefined;
                        this.translatedAnswers = undefined;
                    }
                }
            }
        }
        getIndexTranslationKey(textType) {
            return `${textType}-${this.post.id}-${this.language}`;
        }
        _jsonToHtml(data) {
            // If given data is JSON in string form, parse it
            let parsedData;
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                }
                catch (err) {
                    // If parsing fails, treat it as a raw string
                    return `<div>${data}</div>`;
                }
            }
            else {
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
            if (this.post &&
                this.post.public_data &&
                this.post.public_data.structuredAnswersJson &&
                this.post.Group.configuration &&
                this.post.Group.configuration.structuredQuestionsJson) {
                const questionHash = {};
                const showDescriptionBeforeIdHash = {};
                const showDescriptionAfterIdHash = {};
                let outText = '';
                this.post.Group.configuration.structuredQuestionsJson.forEach(question => {
                    if (question.uniqueId) {
                        questionHash[question.uniqueId] = question;
                    }
                    else {
                        if (question.showBeforeAnswerId) {
                            showDescriptionBeforeIdHash[question.showBeforeAnswerId] =
                                question;
                        }
                        if (question.showAfterAnswerId) {
                            showDescriptionAfterIdHash[question.showAfterAnswerId] =
                                question;
                        }
                    }
                });
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
                                }
                                else {
                                    // Default behavior
                                    outText += answer.value + '\n\n';
                                }
                            }
                            else {
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
            }
            else {
                return '';
            }
        }
    }
    __decorate([
        property({ type: Array })
    ], YpPostBaseWithAnswersElement.prototype, "translatedQuestions", void 0);
    __decorate([
        property({ type: Array })
    ], YpPostBaseWithAnswersElement.prototype, "translatedAnswers", void 0);
    __decorate([
        property({ type: Boolean })
    ], YpPostBaseWithAnswersElement.prototype, "autoTranslate", void 0);
    __decorate([
        property({ type: Object })
    ], YpPostBaseWithAnswersElement.prototype, "post", void 0);
    return YpPostBaseWithAnswersElement;
};
//# sourceMappingURL=yp-post-base-with-answers.js.map