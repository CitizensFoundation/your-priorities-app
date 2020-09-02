import { property, html, css, customElement } from 'lit-element';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';

import '../@yrpri/yp-image.js';

@customElement('yp-point-news-story-embed')
export class YpPointNewsStoryEmbed extends YpBaseElement {
  @property({ type: Object })
  embedData!: YpEmbedData;

  static get styles() {
    return [
      super.styles,
      css`

      iron-image {
        width: 550px;
        height: 309px;
      }

      @media (max-width: 600px) {
        iron-image {
          width: 90vw !important;
          height: 51vw !important;
        }
      }

      #embedHtml {
        width: 100%;
        height: 100%;
        border: 1px solid;
        border-color: #999;
        padding: 16px;
      }

      a {
        color: #333;
        text-decoration: none;
      }

      .title {
      }

      .description {
        padding-bottom: 20px;
      }

      .container {
        border-bottom: solid #ddd;
        border-bottom-width: 1px;
        margin-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
  `
  ]
  }
  render() {
    return html`
    <div ?hidden="${!this.embedData}">
      <div class="layout vertical embedContainer">
        <a href="${this.embedData.url}" class="container" target="_blank">
          <div class="layout vertical center-center">
            <yp-image sizing="contain" src="${this.embedData.thumbnail_url}" ?hidden="${this.embedData.html != null}"></yp-image>
            <div id="embedHtml" ?hidden="${!this.embedData.html}">
              <div .inner-h-t-m-l="${this.embedData}"></div>
            </div>
          </div>
          <div class="layout vertical">
            <div class="title">
              <h2>${this.embedData.title}</h2>
            </div>
            <div class="description">
              ${this.embedData.description}
            </div>
          </div>
        </a>
      </div>
    </div>
    `
  }
}

