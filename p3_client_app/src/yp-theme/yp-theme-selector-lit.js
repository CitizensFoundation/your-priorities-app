import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypThemeBehavior } from './yp-theme-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpThemeSelectorLit extends YpBaseElement {
  static get properties() {
    return {
      selectedTheme: {
        type: Number,
        value: null,
        notify: true,
        observer: '_selectedThemeChanged'
      },
  
      object: {
        type: Object,
        observer: '_objectChanged'
      }
    }
  }

  static get styles() {
    return [
      css`

        paper-dropdown-menu {
          max-width: 250px;
          width: 250px;
        }
    `, YpFlexLayout]
  }

  render() {
    return html`
    ${this.theme ? html`
    <paper-dropdown-menu .label="${this.t('theme.choose')}">
      <paper-listbox .slot="dropdown-content" .selected="${this.selectedTheme}">
        <template is="dom-repeat" .items="${this.themes}" as="theme">
          <paper-item name="${this.index}">${this.theme.name}</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu>
`: html``}
`
  }

/*
  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior
  ],
*/

  _objectChanged(newObject) {
    if (newObject && newObject.theme_id!=null) {
      this.set('selectedTheme', newObject.theme_id);
    }
  }

  _selectedThemeChanged(newTheme) {
    if (newTheme) {
      this.setTheme(newTheme);
    }
  }
}

window.customElements.define('yp-theme-selector-lit', YpThemeSelectorLit)