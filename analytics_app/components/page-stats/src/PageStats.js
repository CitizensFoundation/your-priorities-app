import { html, css } from 'lit-element';
import { Data } from '../../analytics-app/src/data.js';
import { BaseElement } from '../../analytics-app/src/baseElement.js';
import '../../wordcloud/wordcloud.js';
import { ShadowStyles } from '../../analytics-app/src/shadow-styles.js';

export class PageStats extends BaseElement {
  static get styles() {
    return [css`
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
    `,ShadowStyles];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      wordCloudURL: { type: String },
      collection: { type: Object }
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.wordCloudURL ="/api/analytics/"+this.collectionType+"/"+this.collectionId+"/wordcloud";
    this.collectionURL ="/api/"+this.collectionType+"/"+this.collectionId;

    fetch(this.collectionURL, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(response => {
      this.collection = response;
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  render() {
    return html`
    <div class="container">
      <ac-wordcloud .dataUrl="${this.wordCloudURL}"></ac-wordcloud>
    </div>
    `;
  }
}
