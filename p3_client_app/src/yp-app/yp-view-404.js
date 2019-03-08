import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .errorMesage {
        padding: 24px;
        margin-top: 48px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical center-center">
      <h1 class="errorMesage">[[t('pageNotFound')]]</h1>
    </div>
`,

  is: 'yp-view-404',

  behaviors: [
    ypLanguageBehavior
  ]
});
