import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-magic-text/yp-magic-text.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { render } from 'ejs';

class YpSurveyGroupLit extends YpBaseElement {
  static get properties() {
    return {
      idRoute: Object,
      tabRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,

      surveyGroupId: {
        type: Number,
        observer: '_surveyGroupIdChanged',
      },

      surveySubmitError: {
        type: String,
        value: null,
      },

      surveyCompleted: {
        type: Boolean,
        value: false,
      },

      surveyGroup: {
        type: Object,
        value: null,
      },

      structuredQuestions: {
        type: Array,
        value: null,
      },

      structuredAnswers: {
        type: Array,
        value: null,
      },

      initiallyLoadedAnswers: {
        type: Array,
        value: null,
      },

      submitHidden: {
        type: Boolean,
        value: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
        }

        #submitButton {
          margin-top: 8px;
          margin-bottom: 128px;
          background-color: var(--accent-color);
          color: #fff;
          font-size: 18px;
          padding: 16px;
        }

        .submitSpinnerContainer {
          height: 90px;
        }

        .surveyContainer {
          margin-left: 32px;
          margin-right: 32px;
          max-width: 800px;
          width: 800px;
        }

        @media (max-width: 800px) {
          yp-structured-question-edit {
            margin-left: 16px;
            padding-left: 0;
            padding-right: 0;
            margin-right: 16px;
          }

          .surveyContainer {
            margin-left: 0;
            margin-right: 0;
            max-width: 100%;
            width: 100%;
          }

          :host {
            width: 100vw;
          }
        }

        .surveyCompleted {
          font-size: 28px;
          margin: 128px;
        }
      `,
      YpFlexLayout,
    ];
  }

  render() {
    return html`
      <lite-signal
        @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

      <iron-media-query
        query="(min-width: 1024px)"
        query-matches="${this.wideWidth}"></iron-media-query>
      <iron-media-query
        query="(max-width: 700px)"
        query-matches="${this.phoneWidth}"></iron-media-query>

      <app-route
        route="${this.idRoute}"
        .pattern="/:id"
        data="${this.idRouteData}"
        .tail="${this.tabRoute}">
      </app-route>

      <app-route
        route="${this.tabRoute}"
        .pattern="/:tabName"
        data="${this.tabRouteData}"
        .tail="${this.listRoute}">
      </app-route>

      ${!this.surveyCompleted
        ? html`
            ${this.structuredQuestions
              ? html`
                  <div class="layout vertical center-center">
                    <div class="surveyContainer">
                      <div id="surveyContainer">
                        ${this.structuredQuestions.map(
                          question => html`
                            <yp-structured-question-edit
                              index="${this.index}"
                              id="structuredQuestionContainer_${this.index}"
                              .structuredAnswers="${this
                                .initiallyLoadedAnswers}"
                              @changed="${this._saveState}"
                              .question="${this.question}"
                              is-last-rating="${this._isLastRating(index)}"
                              is-first-rating="${this._isFirstRating(index)}"
                              @hide-to-question="${this._hideToQuestion}">
                            </yp-structured-question-edit>
                          `
                        )}
                      </div>
                      <div
                        class="layout horizontal center-center submitSpinnerContainer">
                        <yp-ajax
                          .largeSpinner
                          id="submitAjax"
                          .method="POST"
                          .ironMethod="POST"
                          @response="${this._surveySubmitResponse}"></yp-ajax>
                      </div>
                      <div
                        class="layout horizontal center-center"
                        hidden="${this.submitHidden}">
                        <paper-button
                          id="submitButton"
                          raised
                          @tap="${this._submit}"
                          >${this.t('submitSurvey')}</paper-button
                        >
                      </div>
                    </div>
                  </div>
                `
              : html``}
          `
        : html`
            <div class="surveyCompleted layout vertical center-center">
              ${this.t('thankYouForCompletingTheSurvey')}
              ${this.surveyGroup.configuration.customThankYouTextNewPosts
                ? html`
                    <yp-magic-text
                      id="customThankYouTextNewPostsId"
                      hidden
                      contentId="${this.surveyGroup.id}"
                      .textOnly
                      content="${this.surveyGroup.configuration
                        .customThankYouTextNewPosts}"
                      .contentLanguage="${this.surveyGroup.language}"
                      .textType="customThankYouTextNewPosts"></yp-magic-text>
                  `
                : html` ${this.t('thankYouForCompletingTheSurvey')} `}
            </div>
          `}

      <div class="layout horizontal center-center">
        <yp-ajax
          .largeSpinner=""
          id="ajax"
          @response="${this._surveyGroupResponse}"></yp-ajax>
        <yp-ajax
          hidden
          id="pagesAjax"
          @response="${this._pagesResponse}"></yp-ajax>
      </div>
    `;
  }

  /*
  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior,
    ypDetectOldiOs,
    ypNumberFormatBehavior
  ],


  observers: [
    '_routeIdChanged(idRouteData.id)'
  ],
*/

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-skip-to-unique-id', this._skipToId);
    this.addListener('yp-open-to-unique-id', this._openToId);
    this.addListener('yp-goto-next-index', this._goToNextIndex);
    this.addListener('yp-answer-content-changed', this._saveState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-skip-to-unique-id', this._skipToId);
    this.removeListener('yp-open-to-unique-id', this._openToId);
    this.removeListener('yp-goto-next-index', this._goToNextIndex);
    this.removeListener('yp-answer-content-changed', this._saveState);
  }

  _isLastRating(index) {
    return (
      this.structuredQuestions[index].subType === 'rating' &&
      index + 2 < this.structuredQuestions.length &&
      this.structuredQuestions[index + 1].subType !== 'rating'
    );
  }

  _isFirstRating(index) {
    return (
      this.structuredQuestions[index].subType === 'rating' &&
      this.structuredQuestions[index - 1] &&
      this.structuredQuestions[index - 1].subType !== 'rating'
    );
  }

  _openToId(event, detail) {
    this._skipToId(event, detail, true);
  }

  _skipToId(event, detail, showItems) {
    console.log(detail);
    const foundFirst = false;
    const children = this.$$('#surveyContainer').children;
    for (let i = 0; i < children.length; i++) {
      const toId = detail.toId.replace(/]/g, '');
      const fromId = detail.fromId.replace(/]/g, '');
      if (
        children[i + 1] &&
        children[i + 1].question &&
        children[i + 1].question.uniqueId &&
        children[i + 1].question.uniqueId.substring(
          children[i + 1].question.uniqueId.length - 1
        ) === 'a'
      ) {
        children[i].question.uniqueId = children[
          i + 1
        ].question.uniqueId.substring(
          0,
          children[i + 1].question.uniqueId.length - 1
        );
      }
      if (
        children[i].question &&
        detail.fromId &&
        children[i].question.uniqueId === fromId
      ) {
        foundFirst = true;
      } else if (
        children[i].question &&
        detail.toId &&
        (children[i].question.uniqueId === toId ||
          children[i].question.uniqueId === toId + 'a')
      ) {
        break;
      } else {
        if (foundFirst) {
          if (showItems) {
            children[i].hidden = false;
          } else {
            children[i].hidden = true;
          }
        }
      }
    }
  }

  _goToNextIndex(event, detail) {
    const currentPos = this.liveQuestionIds.indexOf(detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      const item = this.$$(
        '#structuredQuestionContainer_' + this.liveQuestionIds[currentPos + 1]
      );
      item.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      item.focus();
    }
  }

  _serializeAnswers() {
    const answers = [];
    this.liveQuestionIds.forEach(
      function (liveIndex) {
        const questionElement = this.$$(
          '#structuredQuestionContainer_' + liveIndex
        );
        if (questionElement) {
          answers.push(questionElement.getAnswer());
        }
      }.bind(this)
    );
    this.structuredAnswers = answers;
  }

  _serializeAnswersWithSubCodesIfNeeded() {
    const answers = [];
    this.liveQuestionIds.forEach(
      function (liveIndex) {
        const questionElement = this.$$(
          '#structuredQuestionContainer_' + liveIndex
        );
        if (questionElement) {
          if (
            this.surveyGroup &&
            this.surveyGroup.configuration &&
            this.surveyGroup.configuration.storeSubCodesWithRadiosAndCheckboxes
          ) {
            answers.push(questionElement.getAnswer({ withSubCodes: true }));
          } else {
            answers.push(questionElement.getAnswer());
          }
        }
      }.bind(this)
    );
    this.structuredAnswersWithSubCodesIfNeeded = answers;
  }

  _surveySubmitResponse(event, detail) {
    if (detail.error) {
      this.surveySubmitError = detail.error;
    } else {
      this.surveyCompleted = true;
    }
  }

  _submit() {
    this._serializeAnswersWithSubCodesIfNeeded();
    const submitAjax = this.$$('#submitAjax');
    submitAjax.url = '/api/groups/' + this.surveyGroup.id + '/survey';
    submitAjax.method = 'POST';
    submitAjax.body = {
      structuredAnswers: this.structuredAnswersWithSubCodesIfNeeded,
    };
    submitAjax.generateRequest();
  }

  _saveState(event, detail) {
    if (detail && detail.value && (detail.value !== '' || detail.value > 1)) {
      this.submitHidden = false;
      this._serializeAnswers();
      localStorage.setItem(
        'yp-survey-response-for-' + this.surveyGroup.id,
        JSON.stringify(this.structuredAnswers)
      );
    }
  }

  _clearState() {
    localStorage.setItem('yp-survey-response-for-' + this.surveyGroup.id, null);
  }

  _checkAndLoadState() {
    const answers = localStorage.getItem(
      'yp-survey-response-for-' + this.surveyGroup.id
    );
    if (answers) {
      this.structuredAnswers = JSON.parse(answers);
      this.initiallyLoadedAnswers = JSON.parse(answers);
    }
  }

  _isIpad() {
    return /iPad/.test(navigator.userAgent) && !window.MSStream;
  }

  _routeIdChanged(newId) {
    if (newId) {
      this.surveyGroupId = newId;
    }
  }

  _surveyGroupIdChanged(groupId) {
    if (groupId) {
      this.surveyGroup = null;
      this._getSurveyGroup();
    }
  }

  _getSurveyGroup() {
    this.$$('#ajax').url = '/api/groups/' + this.surveyGroupId + '/survey';
    this.$$('#ajax').retryMethodAfter401Login = this._getSurveyGroup.bind(this);
    this.$$('#ajax').generateRequest();
  }

  _pagesResponse(event, detail) {
    this.fire('yp-set-pages', detail.response);
  }

  _surveyGroupResponse(event, detail) {
    this.surveyGroup = detail.response.surveyGroup;
    this.structuredQuestions =
      detail.response.surveyGroup.configuration.structuredQuestionsJson;
    this.surveyGroup.configuration = window.appGlobals.overrideGroupConfigIfNeeded(
      this.surveyGroup.id,
      this.surveyGroup.configuration
    );

    this.refresh();
    this.async(function () {
      this.liveQuestionIds = [];
      this.liveUniqueIds = [];
      this.liveUniqueIdsAll = [];
      this.uniqueIdsToElementIndexes = {};
      if (this.structuredQuestions) {
        this.structuredQuestions.forEach(
          function (question, index) {
            if (
              question.type.toLowerCase() === 'textfield' ||
              question.type.toLowerCase() === 'textfieldlong' ||
              question.type.toLowerCase() === 'textarea' ||
              question.type.toLowerCase() === 'textarealong' ||
              question.type.toLowerCase() === 'numberfield' ||
              question.type.toLowerCase() === 'checkboxes' ||
              question.type.toLowerCase() === 'radios' ||
              question.type.toLowerCase() === 'dropdown'
            ) {
              this.liveQuestionIds.push(index);
              this.uniqueIdsToElementIndexes[question.uniqueId] = index;
              this.liveUniqueIds.push(question.uniqueId);
              this.liveUniqueIdsAll.push({
                uniqueId: question.uniqueId,
                atIndex: index,
              });
            }
          }.bind(this)
        );
      }
      this._checkAndLoadState();
    });

    window.appGlobals.postLoadGroupProcessing(this.surveyGroup);
  }

  _useHardBack(configuration) {
    if (configuration && configuration.customBackURL) {
      const backUrl = configuration.customBackURL;
      if (
        backUrl.startsWith('/community/') ||
        backUrl.startsWith('/group/') ||
        backUrl.startsWith('/domain/') ||
        backUrl.startsWith('/post/')
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  refresh() {
    if (this.surveyGroup) {
      this.fire('yp-set-home-link', {
        type: 'group',
        id: this.surveyGroup.id,
        name: this.surveyGroup.name,
      });

      if (this.surveyGroup.configuration.defaultLocale != null) {
        window.appGlobals.changeLocaleIfNeeded(
          this.surveyGroup.configuration.defaultLocale
        );
      }

      window.appGlobals.setCommunityAnalyticsTracker(
        this.surveyGroup.Community.google_analytics_code
      );

      if (
        this.surveyGroup.theme_id != null ||
        (this.surveyGroup.configuration &&
          this.surveyGroup.configuration.themeOverrideColorPrimary != null)
      ) {
        this.setTheme(
          this.surveyGroup.theme_id,
          this.surveyGroup.configuration
        );
      } else if (
        this.surveyGroup.Community &&
        (this.surveyGroup.Community.theme_id != null ||
          (this.surveyGroup.Community.configuration &&
            this.surveyGroup.Community.configuration.themeOverrideColorPrimary))
      ) {
        this.setTheme(
          this.surveyGroup.Community.theme_id,
          this.surveyGroup.Community.configuration
        );
      } else if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.Domain &&
        this.surveyGroup.Community.Domain.theme_id != null
      ) {
        this.setTheme(this.surveyGroup.Community.Domain.theme_id);
      } else {
        this.setTheme(1);
      }

      this.fire('change-header', {
        headerTitle: this.surveyGroup.configuration.customBackName
          ? this.surveyGroup.configuration.customBackName
          : this.surveyGroup.Community.name,
        headerDescription: this.surveyGroup.Community.description,
        headerIcon: 'social:group',
        documentTitle: this.surveyGroup.name,
        enableSearch: true,
        hideHelpIcon: this.surveyGroup.configuration.hideHelpIcon ? true : null,
        useHardBack: this._useHardBack(this.surveyGroup.configuration),
        backPath: this.surveyGroup.configuration.customBackURL
          ? this.surveyGroup.configuration.customBackURL
          : '/community/' + this.surveyGroup.community_id,
      });

      this.$$('#pagesAjax').url =
        '/api/groups/' + this.surveyGroup.id + '/pages';
      this.$$('#pagesAjax').generateRequest();

      window.appGlobals.setAnonymousGroupStatus(this.surveyGroup);

      if (
        this.surveyGroup.configuration &&
        this.surveyGroup.configuration.disableFacebookLoginForGroup === true
      ) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      if (
        this.surveyGroup.configuration &&
        this.surveyGroup.configuration.externalGoalTriggerUrl
      ) {
        window.appGlobals.externalGoalTriggerGroupId = this.surveyGroup.id;
      } else {
        window.appGlobals.externalGoalTriggerGroupId = null;
      }

      if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.signupTermsPageId &&
        this.surveyGroup.Community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId = this.surveyGroup.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = null;
      }

      if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.customSamlDeniedMessage
      ) {
        window.appGlobals.currentSamlDeniedMessage = this.surveyGroup.Community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.customSamlLoginMessage
      ) {
        window.appGlobals.currentSamlLoginMessage = this.surveyGroup.Community.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }

      window.appGlobals.currentGroup = this.surveyGroup;

      if (
        (this.surveyGroup.configuration &&
          this.surveyGroup.configuration.forceSecureSamlLogin &&
          !this.checkGroupAccess(this.surveyGroup)) ||
        (this.surveyGroup.Community &&
          this.surveyGroup.Community.configuration &&
          this.surveyGroup.Community.configuration.forceSecureSamlLogin &&
          !this.checkCommunityAccess(this.surveyGroup.Community))
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
    }
  }
}
