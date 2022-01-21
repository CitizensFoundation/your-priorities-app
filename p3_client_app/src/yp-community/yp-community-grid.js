import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypCardMouseBehavior } from '../yp-behaviors/yp-card-mouse-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import './yp-community-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .card[wide] {
        padding: 16px;
      }

      .card {
        padding: 0;
        padding-top: 16px;
      }

      .card[wide-padding] {
        padding: 16px !important;
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
        height: 100vh;
      }

      [hidden] {
        display: none !important;
      }

      :focus {
        outline: none;
      }

      @media (max-width: 960px) {
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(min-width: 1024px)" query-matches="{{wide}}"></iron-media-query>

    <iron-list id="ironList" scroll-offset="[[scrollOffset]]" items="[[activeCommunities]]" as="community" scroll-target="document" grid\$="[[wide]]">
      <template>
        <div class="card layout vertical center-center" tabindex\$="[[tabIndex]]" wide-padding\$="[[wide]]">
          <yp-community-card wide\$="[[wide]]" community="[[community]]" on-mouseover="cardMouseOver" on-mouseout="cardMouseOut"></yp-community-card>
        </div>
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
    },
    scrollOffset: {
      type: Number,
      computed: '_scrollOffset(wide, featuredGroups, activeCommunities)'
    }
  },

  _newCommunity: function () {
    this.fire('add-new-community');
  },

  _scrollOffset: function (wide, communityGrid) {
    var list = this.$.ironList;
    if (list) {
      var offset = list.offsetTop;
      offset -= 100;
      if (!this.wide)
        offset += 75;
      if (list.offsetTop>0 && offset>0) {
        console.info("Community list scroll offset: "+offset);
        return offset;
      } else {
        if (wide)
          offset = 390;
        else
          offset = 610;
        console.info("Community list (manual) scroll offset: "+offset);
        return offset;
      }
    } else {
      console.warn("No community list for scroll offset");
      return null;
    }
  },

  scrollToItem: function (item) {
    console.log("Community grid scrolling to item");
    this.$.ironList.scrollToItem(item);
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
      })
    );
  }
});
