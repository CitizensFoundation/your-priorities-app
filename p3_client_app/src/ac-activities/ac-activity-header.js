import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-user/yp-user-with-organization.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      yp-user-with-organization {
        padding-top: 0;
        padding-bottom: 0;
        margin: 0;
      }
    </style>
    <yp-user-with-organization user\$="[[activity.User]]" inverted=""></yp-user-with-organization>
`,

  is: 'ac-activity-header',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    activity: {
      type: Object,
      observer: '_activityChanged'
    }
  },

  _activityChanged: function (newValue) {
  }
});
