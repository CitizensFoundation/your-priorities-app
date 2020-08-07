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

import '../cs-story/cs-story.js';

import 'app-datepicker';

@customElement('cs-choose-meeting-time')
export class CsChooseMeetingTime extends YpBaseElement {
  @property({ type: Boolean })
  storyOpen = true;

  render() {
    return html`
      ${this.storyOpen
        ? html`
            <div class="layout horizontal center-center">
              <cs-story></cs-story>
            </div>
          `
        : html`
            <div class="layout vertical center-center">
              <div><h1>${this.t('chooseTimesYouAreFree')}</h1></div>

              <app-datepicker></app-datepicker>

              <mwc-button
                raised
                .label="${this.t('sendYourDates')}"
              ></mwc-button>
            </div>
          `}
    `;
  }

  async _lastStoryCard() {
    //this.fire('yp-unhide-app-bar');
    this.storyOpen = false;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('cs-last-story-card', this._lastStoryCard.bind(this));
    //this.fire('yp-hide-app-bar');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('cs-last-story-card', this._lastStoryCard.bind(this));
  }

  static get styles() {
    return [
      super.styles,
      css`
        mwc-button {
          margin-top: 16px;
        }
      `,
    ];
  }
}
