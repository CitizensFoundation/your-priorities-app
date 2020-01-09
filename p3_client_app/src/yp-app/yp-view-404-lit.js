import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpView404Lit extends YpBaseElement {
  static get properties() {
    return {

    }
  }
  
  static get styles() {
    return [
      css`

      .errorMesage {
        padding: 24px;
        margin-top: 48px;
      }
    `, YpFlexLayout]
  }
   
  render() {
    return html`
    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

    <div class="layout vertical center-center">
      <h1 class="errorMesage">${this.t('pageNotFound')}</h1>
    </div>
`
}

/*
  behaviors: [
    ypLanguageBehavior
  ]
*/

}

window.customElements.define('yp-view-404-lit', YpView404Lit)

