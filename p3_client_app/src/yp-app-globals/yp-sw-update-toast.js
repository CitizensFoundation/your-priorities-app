/* Originally from https://github.com/morbidick/serviceworker-helpers */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-toast/paper-toast.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * # Service worker update toast
 * `<sw-update-toast>` displays a toast requesting the user to reload the page when a source code update is available.
 *
 * ## Styling
 *   * `--primary-color`,  link color defaults to orange
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 *
 */
class YPSWUpdateToast extends PolymerElement {
  static get template() {
    return html`
    <style>
      span {
        margin-right: 1em;
      }
      a {
        color: var(--paper-orange-a200, orange);
        text-decoration: none;
      }
    </style>
    <paper-toast id="toast" duration="[[ duration ]]" opened="[[ opened ]]">
      <span>[[ message ]]</span>
      <a href="" on-click="_reload">[[ buttonLabel ]]</a>
    </paper-toast>
`;
  }

  static get is() { return 'yp-sw-update-toast'; }

  static get properties() {
    return {
      /** message to display */
      message: {
        type: String
      },

      /** label for reload button */
      buttonLabel: {
        type: String
      },
      /** duration the toast should be shown, default 0 to persist. */
      duration: {
        type: Number,
        value: 0,
      },
      /** open the toast */
      opened: {
        type: Boolean,
        value: false,
      }
    };
  }

  ready() {
    super.ready();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.addEventListener('updatefound', () => {
              if ('storage' in navigator && 'estimate' in navigator.storage) {
                navigator.storage.estimate().then(({usage, quota}) => {
                  if (usage>=quota) {
                    console.error(`Using ${usage} out of ${quota} bytes. Not showing toast.`);
                  } else {
                    //this.$.toast.open();
                  }
                });
              }
            });
          }
        });
      });
      this._triggerUpdatePolling()
    }
  }

  _triggerUpdatePolling() {
    setTimeout(function () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
            this._triggerUpdatePolling();
          }
        });
      }
    }.bind(this), 60*60*1000); // Poll for new service worker every hour
  }

  _reload() {
    window.location.reload();
  }
}

customElements.define(YPSWUpdateToast.is, YPSWUpdateToast);
