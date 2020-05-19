import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypCardMouseBehavior } from '../yp-behaviors/yp-card-mouse-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import './yp-community-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { styles } from 'chalk';

class YpCommunityGridLit extends YpBaseElement {
  static get properties() {
    return {
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
    }
  }

  static get styles() {
    return [
      css`

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

      `, YpFlexLayout]
  }

  render() {
    return html`
        <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

          <iron-list id="ironList" .scrollOffset="${this.scrollOffset}" .items="${this.activeCommunities}" as="community" .scrollTarget="document" grid="${this.wide}">
            <template>
              <div class="card layout vertical center-center" .tabIndex="${this.tabIndex}" .widePadding="${this.wide}">
                <yp-community-card .wide="${this.wide}" .community="${this.community}" @mouseover="${this.cardMouseOver}" @mouseout="${this.cardMouseOut}"></yp-community-card>
              </div>
            </template>
          </iron-list>
`
  }

/*
  behaviors: [
    ypIronListBehavior,
    ypCardMouseBehavior
  ],
*/

  _newCommunity() {
    this.fire('add-new-community');
  }

  _scrollOffset(wide, communityGrid) {
    const list = this.$$("#ironList");
    if (list) {
      let offset = list.offsetTop;
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
  }

  scrollToItem(item) {
    console.log("Community grid scrolling to item");
    this.$$("#ironList").scrollToItem(item);
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
      })
    )
  }
}

window.customElement.define('yp-community-grid-lit', YpCommunityGridLit)