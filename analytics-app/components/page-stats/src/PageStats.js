import { html, css } from 'lit-element';
import { Data } from '../../analytics-app/src/data.js';
import { BaseElement } from '../../analytics-app/src/baseElement.js';
import '../../wordcloud/wordcloud.js';

export class PageStats extends BaseElement {
  static get styles() {
    return css`
      :host {
        --page-one-text-color: #000;

        padding: 25px;
        color: var(--page-one-text-color);
      }

      .container {
        display: flex;
        flex-direction: column;
        flex-basis: auto;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      dataUrl: { type: String }
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.dataUrl ="/api/analytics/"+this.collectionType+"/"+this.collectionId+"/wordcloud";
  }

  render() {
    return html`
    <div class="container">
      <ac-wordcloud .dataUrl="${this.dataUrl}"></ac-wordcloud>
    </div>
    `;
  }
}
