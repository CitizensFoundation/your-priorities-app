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
      <iron-icon title\$="[[t('stats.posts')]]" icon="lightbulb-outline" class="stats-icon"></iron-icon>
      <div title\$="[[t('stats.posts')]]" class="stats-text" style="">{{formatNumber(group.counter_posts)}}</div>

      <iron-icon title\$="[[t('stats.discussions')]]" icon="chat-bubble-outline" class="stats-icon"></iron-icon>
      <div title\$="[[t('stats.discussions')]]" class="stats-text">{{formatNumber(group.counter_points)}}</div>

      <iron-icon title\$="[[t('stats.users')]]" icon="face" class="stats-icon"></iron-icon>
      <div title\$="[[t('stats.users')]]" class="stats-text">{{formatNumber(group.counter_users)}}</div>
    </div>
`,

  is: 'yp-group-stats',

  behaviors: [
    ypLanguageBehavior,
    ypNumberFormatBehavior
  ],

  properties: {
    group: {
      type: Object
    }
  },

  ready: function () {
    // Inaccurate fudge for Your Priorities country pages that mostly have a common user database not connected to
    // the group
    if (this.group && this.group.IsoCountry) {
      this.group.counter_users = this.group.counter_users * 30;
    }
  }
});
