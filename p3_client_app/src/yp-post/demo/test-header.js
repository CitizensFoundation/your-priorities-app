import '../../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../../@polymer/paper-card/paper-card.js';
import '../../yp-app-globals/yp-app-icons.js';
import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
import { ypLanguageBehavior } from '../../yp-behaviors/yp-language-behavior.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .grid {
        @apply --layout-vertical;
      }

      yp-post-header {
        padding: 64px;
      }

    </style>

    <div class="grid">
      <yp-post-header id="post2" street-view=""></yp-post-header>
    </div>
`,

  is: 'test-header',

  behaviors: [
    ypLanguageBehavior
  ],

  ready: function (e) {
    this.$.post2.post = {id: 101,
      name:'Iceland top posts',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'Your posts and participation will help provide a series of recommendations to the European Commission on the best strategies, policies and funding instruments.',
      Category: {id: 105, icon_file_name: "NHS_icons_GG-2.png" },
      counter_endorsements_up: 5454, counter_points: 7778, counter_endorsements_down: 1232
    };
  }
});
