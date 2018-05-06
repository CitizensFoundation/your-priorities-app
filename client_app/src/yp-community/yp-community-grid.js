import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypCardMouseBehavior } from '../yp-behaviors/yp-card-mouse-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import './yp-community-card.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .card[wide] {
        padding: 16px;
      }

      .card {
        padding: 0;
        padding-top: 16px;
      }

      .archivedText {
        font-size: 25px;
        color: #333;
      }

      .archivedBorder {
        border-bottom: 1px solid;
        width: 95%;
        margin-bottom: 12px;
        border-color: #444;
      }

      iron-list {
      }

      #ironList {
      }

      [hidden] {
        display: none !important;
      }

      :focus {
        outline: none;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>

    <iron-list id="ironList" scroll-offset="350" items="[[activeCommunities]]" as="community" scroll-target="document" grid="">
      <template>
        <yp-community-card tabindex\$="[[tabIndex]]" wide\$="[[wide]]" class="card" community="[[community]]" on-mouseover="cardMouseOver" on-mouseout="cardMouseOut"></yp-community-card>
      </template>
    </iron-list>
`,

  is: 'yp-community-grid',

  behaviors: [
    ypLanguageBehavior,
    ypIronListBehavior,
    ypCardMouseBehavior
  ],

  properties: {
    featuredCommunities: Array,
    archivedCommunities: Array,
    activeCommunities: Array,
    hideAdd: {
      type: Boolean,
      value: false
    }
  },

  _newCommunity: function () {
    this.fire('add-new-community');
  }
});
