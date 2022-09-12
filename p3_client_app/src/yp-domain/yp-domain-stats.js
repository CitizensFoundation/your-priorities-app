import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
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

      @media (max-width: 945px) {
        .hideIfMobile {
          display: none;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(max-width: 800px)" query-matches="{{narrowScreen}}"></iron-media-query>

    <div class="stats layout horizontal end-justified">
      <div class="layout horizontal wrap">
        <div class="layout horizontal">
          <iron-icon title\$="[[t('stats.posts')]]" icon="lightbulb-outline" class="stats-icon"></iron-icon>
          <div title\$="[[t('stats.posts')]]" class="stats-text" style="">{{formatNumber(domain.counter_posts)}}</div>

          <iron-icon title\$="[[t('stats.discussions')]]" icon="chat-bubble-outline" class="stats-icon"></iron-icon>
          <div title\$="[[t('stats.discussions')]]" class="stats-text">{{formatNumber(domain.counter_points)}}</div>

          <iron-icon hidden\$="[[narrowScreen]]" title\$="[[t('stats.communities')]]" icon="group-work" class="stats-icon hideIfMobile"></iron-icon>
          <div hidden\$="[[narrowScreen]]" title\$="[[t('stats.communities')]]" class="stats-text hideIfMobile" style="">{{formatNumber(domain.counter_communities)}}</div>
        </div>
        <div class="layout horizontal">
          <iron-icon hidden="" title\$="[[t('stats.groups')]]" icon="people" class="stats-icon hideIfMobile"></iron-icon>
          <div hidden="" title\$="[[t('stats.groups')]]" class="stats-text hideIfMobile" style="">{{formatNumber(domain.counter_groups)}}</div>

          <iron-icon title\$="[[t('stats.users')]]" icon="face" class="stats-icon"></iron-icon>
          <div title\$="[[t('stats.users')]]" class="stats-text">{{formatNumber(domain.counter_users)}}</div>
        </div>
      </div>
    </div>
`,

  is: 'yp-domain-stats',

  behaviors: [
    ypLanguageBehavior,
    ypNumberFormatBehavior
  ],

  properties: {
    domain: {
      type: Object
    },
    narrowScreen: Boolean
  }
});
