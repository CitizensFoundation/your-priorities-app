import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        width: 100%;
      }

      .stats {
        padding-top: 8px;
        padding-bottom: 8px;
        color: var(--main-stats-color-on-white);
      }

      .stats-text {
        font-size: 18px;
        text-align:right;
        vertical-align: bottom;
        padding-right:8px;
        color: var(--main-stats-color-on-white);
      }

      .stats-icon {
        padding-left:8px;
        margin-right:4px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="stats layout horizontal end-justified">
      <iron-icon title\$="[[t('stats.posts')]]" icon="lightbulb-outline" class="stats-icon bulb"></iron-icon>
      <div title\$="[[t('stats.posts')]]" class="stats-text" style="">{{formatNumber(community.counter_posts)}}</div>

      <iron-icon title\$="[[t('stats.groups')]]" icon="people" class="stats-icon"></iron-icon>
      <div title\$="[[t('stats.groups')]]" class="stats-text" style="">{{formatNumber(community.counter_groups)}}</div>

      <iron-icon title\$="[[t('stats.users')]]" icon="face" class="stats-icon"></iron-icon>
      <div title\$="[[t('stats.users')]]" class="stats-text">{{formatNumber(community.counter_users)}}</div>
    </div>
`,

  is: 'yp-community-stats',

  behaviors: [
    ypLanguageBehavior,
    ypNumberFormatBehavior
  ],

  properties: {
    community: {
      type: Object
    }
  }
});
