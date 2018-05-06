import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import { ypCardMouseBehavior } from '../yp-behaviors/yp-card-mouse-behavior.js';
import './yp-group-card.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

      .groupCard {
        padding: 0;
        padding-top: 16px;
      }

      .groupCard[wide-padding] {
        padding: 16px !important;
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

    <div class="layout vertical center-center">
      <iron-list id="ironList" scroll-offset="350" items="[[activeGroups]]" as="group" scroll-target="document" grid="">
        <template>
          <div class="groupCard" tabindex\$="[[tabIndex]]" wide-padding\$="[[wide]]">
            <yp-group-card wide-padding\$="[[wide]]" group="[[group]]" on-mouseover="cardMouseOver" on-mouseout="cardMouseOut"></yp-group-card>
          </div>
        </template>
      </iron-list>
    </div>
`,

  is: 'yp-group-grid',

  behaviors: [
    ypLanguageBehavior,
    ypIronListBehavior,
    ypCardMouseBehavior
  ],

  properties: {
    featuredGroups: Array,
    archivedGroups: Array,
    activeGroups: Array,
    hideAdd: {
      type: Boolean,
      value: false
    },
    wide: {
      type: Boolean,
      value: false
    }
  },

  _newGroup: function () {
    this.fire('add-new-group');
  }
});
