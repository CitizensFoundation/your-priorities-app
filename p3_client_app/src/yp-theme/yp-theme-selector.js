import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-item/paper-item.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypThemeBehavior } from './yp-theme-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      paper-dropdown-menu {
        max-width: 250px;
        width: 250px;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dropdown-menu label="[[t('theme.choose')]]">
      <paper-listbox slot="dropdown-content" selected="{{selectedTheme}}">
        <template is="dom-repeat" items="[[themes]]" as="theme">
          <paper-item name="[[index]]">[[theme.name]]</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu>
`,

  is: 'yp-theme-selector',

  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior
  ],

  properties: {

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

  },

  _objectChanged: function (newObject) {
    if (newObject && newObject.theme_id!=null) {
      this.set('selectedTheme', newObject.theme_id);
    }
  },

  _selectedThemeChanged: function (newTheme) {
    if (newTheme) {
      this.setTheme(newTheme);
    }
  }
});
