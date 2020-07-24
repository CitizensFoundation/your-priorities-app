import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
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
      },

      group: {
        type: Object
      }
    };
  }

  static get styles() {
    return [
      css`

      :host {
        margin-top: 8px;
        margin-bottom: 8px;
        width: 100%;
      }

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
        outline-color: var(--accent-color);
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
      <div class="layout vertical center-center container">
        <paper-card ?disabled="${this.disabled}" .elevation="${this.elevation}"
          aria-disabled="${this.disabled}" role="button" aria-label="${this.t('post.add_new')}" tabindex="0" @keydown="${this._keyDown}"
          class="postCard" @click="${this._newPost}">
          <div class="layout horizontal center-center addNewIdeaText">
            <iron-icon ?disabled="${this.disabled}" icon="lightbulb-outline"></iron-icon>
            ${ this.disable ? html`
              <div class="flex addText closed">
                ${ !this.group.configuration.alternativeTextForNewIdeaButtonClosed ? html`
                  ${this.t('closedForNewPosts')}
                ` : html`
                  <yp-magic-text .contentId="${this.group.id}" extraId="${this.index}" text-only
                    .content="${this.group.configuration.alternativeTextForNewIdeaButtonClosed}" .contentLanguage="${this.group.language}"
                    class="ratingName" textType="alternativeTextForNewIdeaButtonClosed"></yp-magic-text>
                `}
              </div>
            ` : html`
              <div class="flex addText" ?hidden="${this.disabled}">
                ${ !this.group.configuration.alternativeTextForNewIdeaButtonClosed ? html`
                  ${this.t('post.add_new')}
                ` : html`
                  <yp-magic-text .contentId="${this.group.id}" extraId="${this.index}" text-only
                    .content="${this.group.configuration.alternativeTextForNewIdeaButton}" .contentLanguage="${this.group.language}"
                    class="ratingName" textType="alternativeTextForNewIdeaButton"></yp-magic-text>
                `}
              </div>
            `}
          </div>
        </paper-card>
      </div>
    `;
  }

  _keyDown(event) {
    if (event.keyCode===13) {
      this._newPost();
    }
  }

  _newPost() {
    if (!this.disabled) {
      this.fire('new-post');
    }
  }
}

window.customElements.define('yp-post-card-add-lit', YpPostCardAddLit);

