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

@customElement('cs-report')
export class CsReport extends YpBaseElement {
  @property({ type: Boolean })
  storyOpen = true;

  render() {
    return html`
        <div class="layout horizontal center-center">
          <cs-story number="5"></cs-story>
        </div>
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
    setTimeout(()=>{
      this.fire('yp-change-header', {
        headerTitle: this.t('report'),
        documentTitle: this.t('report'),
        headerDescription: '',
      });
    }, 500)

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
        .header {
          font-size: 18px;
          font-weight: bold;
          margin: 16px;
        }

        .subHeader {
          font-size: 14px;
          margin: 16px;
          font-style: italic;
        }

        mwc-button {
          margin-top: 16px;
        }
      `,
    ];
  }
}
