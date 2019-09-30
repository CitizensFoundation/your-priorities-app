import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPointNewsStoryEmbedLit extends YpBaseElement {
  static get properties() {
    return {
    }
  }

  static get styles() {
    return[
      css`
  

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
  `, YpFlexLayout]
  }
  render() {
    return html`
      ${this.point ? html` 
      <div hidden="${!this.embedData}">
        <div class="layout vertical embedContainer">
          <a href="${this.embedData.url}" class="container" target="_blank">
            <div class="layout vertical center-center">
              <iron-image sizing="contain" src="${this.embedData.thumbnail_url}" hidden="${this.embedData.html}"></iron-image>
              <div id="embedHtml" hidden="${!this.embedData.html}">
                <div inner-h-t-m-l="${this.embedData}"></div>
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
  ` : html``}
  `
  }
}

window.customElements.define('yp-point-news-story-embed-lit', YpPointNewsStoryEmbedLit)
