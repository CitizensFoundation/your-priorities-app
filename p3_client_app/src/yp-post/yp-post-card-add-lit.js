import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPostCardAddLit extends YpBaseElement {
  static get properties() {
    return {
      elevation: {
        type: Number
      },
  
      disabled: {
        type: Boolean
      }
    }     
  }

  static get styles() {
    return [
      css`
    
      .postCard {
        width: 100%;
        min-height: 75px;
        margin-top: 8px;
        padding: 16px;
        background-color: var(--accent-color);
        color: #FFF;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 8px;
        text-align: center;
        max-width: 310px;
      }

      iron-icon {
        height: 80px;
        width: 80px;
        color: #FFF;
      }

      .header {
        padding: 0;
        margin: 0;
        padding-top: 16px;
      }

      .icon {
        --iron-icon-height: 140px;
        --iron-icon-width: 140px;
      }

      .half {
        width: 50%;
      }

      paper-fab {
      }

      .addText {
        padding-left: 0;
        padding-right: 8px;
      }

      iron-icon {
        width: 64px;
        height: 64px;
        margin-right: 8px;
        margin-left: 0;
      }

      .addNewIdeaText {
        font-size: 26px;
        color: #FFF;
      }

      .closed {
        font-size: 22px;
      }

      paper-card[disabled] {
        background-color: #888;
        cursor: initial;
      }

      iron-icon[disabled] {
      }

      @media (max-width: 420px) {
        :host {
          margin-top: 0;
        }

        .postCard {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 4px;
          padding: 16px;
        }

        .addNewIdeaText {
          font-size: 24px;
          width: auto;
        }

        iron-icon {
          height: 48px;
          width: 48px;
        }

        .closed {
          font-size: 20px;
        }
      }

      @media (max-width: 420px) {
        .postCard {
          max-width: 300px;
        }
      }

      [hidden] {
        display: none !important;
      }

      .container {
        width: 100%;
      }
    
    `, YpFlexLayout] 
  }

  render() {
    return html`
      ${this.post ? html`  
        <div class="layout vertical center-center container">
          <paper-card disabled="${this.disabled}" elevation="${this.elevation}" class="postCard" on-tap="_newPost">
            <div class="layout horizontal center-center addNewIdeaText">
              <iron-icon disabled="${this.disabled}" icon="lightbulb-outline"></iron-icon>
              <div class="flex addText" hidden="${this.disabled}">
                ${this.t('post.add_new')}
              </div>
              <div class="flex addText closed" hidden="${!this.disabled}">
                ${this.t('closedForNewPosts')}
              </div>
            </div>
          </paper-card>
        </div>
` : html``}
`  
  }

  _newPost() {
    if (!this.disabled) {
      this.fire('new-post');
    }
  }
/*
  behaviors: [
    ypLanguageBehavior
]
*/
}

window.customElements.define('yp-post-card-add-lit', YpPostCardAddLit)
