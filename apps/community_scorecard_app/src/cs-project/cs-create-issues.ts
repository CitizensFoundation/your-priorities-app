import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-circular-progress-four-color';
import '../cs-story/cs-story.js';

import 'app-datepicker';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';

export const CreationStages: Record<string, number> = {
  IntroStory: 0,
  WaitToStart: 1,
  IntroSurvey: 2,
  ElectSecretary: 3,
  AddAndRateIssues: 4,
  FinalIssues: 5,
  NextMeeting: 6,
};

@customElement('cs-create-issues')
export class CsCreateIssues extends YpBaseElement {
  @property({ type: Number })
  stage = CreationStages.IntroStory;

  renderCurrentStage(): TemplateResult | undefined {
    let stage: TemplateResult | undefined;

    switch (this.stage) {
      case CreationStages.IntroStory:
        stage = this.renderIntroStory();
        break;
      case CreationStages.WaitToStart:
        stage = this.renderWaitToStart();
        break;
      case CreationStages.IntroSurvey:
        stage = this.renderIntroSurvey();
        break;
      case CreationStages.ElectSecretary:
        stage = this.renderIntroSurvey();
        break;
    }

    return stage;
  }

  renderIntroStory() {
    return html`
      <div class="layout vertical center-center">
        <cs-story number="2"></cs-story>
      </div>
    `;
  }

  renderWaitToStart() {
    return html`
      <div class="layout vertical center-center">
        <div
          class="waitingToStartBox layout vertical center-center shadow-elevation-4dp shadow-transition"
        >
          <div>${this.t('waitingOnEverybodyToCompleteIntro')}</div>
          <mwc-circular-progress-four-color
            class="spinner"
            indeterminate
          ></mwc-circular-progress-four-color>
        </div>
      </div>
    `;
  }

  renderIntroSurvey() {
    return html`
      <div class="layout vertical center-center">
        <div
          class="waitingToStartBox layout vertical center-center shadow-elevation-4dp shadow-transition"
        >
          <div>${this.t('waitingOnEverybodyToCompleteIntro')}</div>
          <mwc-circular-progress-four-color
            class="spinner"
            indeterminate
          ></mwc-circular-progress-four-color>
        </div>
      </div>
    `;
  }

  render() {
    return html` ${this.renderCurrentStage()} `;
  }

  _lastStoryCard() {
    this.stage = CreationStages.WaitToStart;
    setTimeout(() => {
      this.stage = CreationStages.IntroSurvey;
    }, 7000);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('cs-last-story-card', this._lastStoryCard.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('cs-last-story-card', this._lastStoryCard.bind(this));
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        mwc-button {
          margin-top: 16px;
        }

        .spinner {
          margin: 32px;
        }

        .waitingToStartBox {
          background-color: var(--mdc-theme-surface);
          padding: 16px;
          margin: 32px;
        }
      `,
    ];
  }
}
