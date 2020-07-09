import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-fab/paper-fab.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js' ;
import { YpBaseElement } from '../yp-base-element.js';
import { styles } from 'chalk';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPageLit extends YpBaseElement {
  static get properties() {
    return {
      wideWidth: {
        type: Boolean,
        value: false
      },

      createFabIcon: {
        type: String,
        value: null
      },

      createFabTitle: {
        type: String
      },

      isPost: {
        type: Boolean,
        value: false
      },

      hasLargeButton: {
        type: Boolean,
        value: false
      },

      hideAllTabs: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`
      :host {
        height: 100%;
        width: 100%;
      }

        .mainArea {
          background-color: var(--primary-background-color);
          height: 100%;
          width: 100%;
        }

        .topArea {
          background-color: var(--primary-background-color);
          background-image: var(--top-area-background-image, none);
          height: 300px;
        }

        .topArea {
          min-height: 300px;
        }

        .tab-wrapper {
          min-height: 64px;
        }

        .largeButtonWrapper {
          min-height: 120px;
        }

        .middleArea {
          background-color: var(--primary-color-600);
        }

        .createFab {
          position: fixed;
          bottom: 24px;
          right: 28px;
          background-color: var(--accent-color);
          color: #FFF;

          --paper-fab-iron-icon: {
            color: var(--icon-general-color, #FFF);
            height: 40px;
            width: 40px;
          }
        }

        .createFab[wide-layout] {
          width: 72px;
          height: 72px;
          --paper-fab-iron-icon: {
            color: var(--icon-general-color, #FFF);
            width: 60px;
            height: 60px;
          }
        }

        .createFabContainer[wide-layout] .createFab {
        }

        paper-fab[wide-layout]::shadow #icon {
          width: 40px;
          height: 40px;
        }

        .tab-wrapper ::slotted(.tabs) {
          width: 1100px;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .tab-wrapper ::slotted(.tabs .tab) {

        }

        @media (max-width: 1024px) {
          .tab-wrapper ::slotted(.tabs) {
            max-width: 920px;
          }

          .tab-wrapper ::slotted(.tabs .tab) {
            width: 200px;
          }

          .topArea {
            height: auto;
            min-height: auto;
          }
        }

        @media (max-width: 945px) {
          .tab-wrapper ::slotted(.tabs) {
            width: 100%;
            font-size: 14px !important;
            word-wrap: break-word !important;
          }

          .tab-wrapper ::slotted(.tabs .tab) {
            width: 120px;
            word-wrap: break-word !important;
          }

          .tab-wrapper {
            min-height: 60px;
          }

          .topArea[is-post] {
            min-height: 470px;
          }
        }

        @media (max-width: 380px) {
          .tab-wrapper ::slotted(.tabs) {
            max-width: 330px;
            font-size: 12px !important;
          }

          .tab-wrapper ::slotted(paper-tab) {
            width: 100px;
          }

          .topArea[is-post] {
            min-height: 530px;
          }

          .largeButtonWrapper {
            min-height: 80px;
          }
        }

        @media (max-width: 480px) {
        }

        [hidden] {
          display: none !important;
        }
    `, YpFlexLayout]
  }


  render() {
    return html`
    <div class="layout vertical mainArea">
      <div id="topArea" class="large-card-wrapper layout horizontal center-center topArea" is-post="${this.isPost}">
        <slot .name="largeCard"></slot>
      </div>

      ${ this.hasLargeButton ? html`
        <div class="largeButtonWrapper layout horizontal center-center" ?hidden="${!this.wideWidth}">
          <slot .name="largeAddButton"></slot>
        </div>
      `: html``}

      <div class="tab-wrapper layout horizontal center-center" ?hidden="${this.hideAllTabs}">
        <slot .name="tabs"></slot>
      </div>
      <div class="tab-pages-wrapper layout vertical">
        <slot .name="tabPages"></slot>
      </div>
    </div>
    <div class="create-fab-wrapper layout horizontal end-justified createFabContainer middleArea">

      ${ this.createFabIcon ? html`
        <paper-fab class="createFab" icon="${this.createFabIcon}" elevation="5" wide-layout="${this.wideWidth}" title="${this.createFabTitle}" @click="${this._createTap}"></paper-fab>
      `: html``}

    </div>
    <iron-media-query query="(min-width: 1024px)" query-matches="${this.wideWidth}"></iron-media-query>
    `
  }

/*
  behaviors: [
    ypMediaFormatsBehavior
  ],
*/

  connectedCallback() {
    super.connectedCallback()
      this.addEventListener("yp-setup-header-image", this._setupTopHeaderImageEvent);
  }

  _setupTopHeaderImageEvent( _event, image) {
    setupTopHeaderImage(image);
  }

  setupTopHeaderImage(image) {
    if (this.wideWidth) {
      let path;
      if (image) {
        path = 'url(' + this.getImageFormatUrl(image, 0) + ')';
      } else {
        path = 'none';
      }
      updateStyles({ '--top-area-background-image': path });
    }
  }

  _fabTabChanged(newValue) {
  }

  _createTap() {
    this.fire('yp-create-fab-tap');
  }

}

window.customElements.define('yp-page-lit', YpPageLit);