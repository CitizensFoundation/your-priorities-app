import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import { ypCardMouseBehavior } from '../yp-behaviors/yp-card-mouse-behavior.js';
import './yp-group-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpGroupGridLit extends YpBaseElement {
  static get properties() {
    return {
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
          },

      scrollOffset: {
            type: Number,
            computed: '_scrollOffset(wide, featuredGroups, activeGroups)'
      }
    }
  }

  static get styles() {
    return [
      css`

      .groupCard {
      padding: 0;
      padding-top: 16px;
    }

    .groupCard[wide-padding] {
      padding: 16px !important;
    }

    iron-list {
      height: 100vh;
    }

    [hidden] {
      display: none !important;
    }

    :focus {
    }

    @media (max-width: 1199px) {
      .groupCard {
      }
    }

    a {
        text-decoration: none;
        width: 100%;
    }
    `, YpFlexLayout]
  }
  render() {
    return html`
      <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

      <div class="layout horizontal center-center">
        <iron-list id="ironList" selection-enabled="" .scrollOffset="${this.scrollOffset}" @selected-item-changed="${this._selectedItemChanged}" .items="${this.activeGroups}" as="group" scroll-target="document" role="list" ?grid="${this.wide}">
          <template>
            <div class="groupCard layout vertical center-center" ?widePadding="${this.wide}" tabindex="${this.tabIndex}" role="listitem" aria-level="2" aria-label="${this.group.name}">
              <a href="${this._getGroupUrl(group)}" id="groupCardHref${this.group.id}" class="layout vertical center-center"><yp-group-card wide-padding="${this.wide}" group="${this.group}" @mouseover="${this.cardMouseOver}" @mouseout="${this.cardMouseOut}"></yp-group-card></a>
            </div>
          </template>
        </iron-list>
      </div>
    `
  }

  /*
  behaviors: [
    ypIronListBehavior,
    ypCardMouseBehavior
  ],
*/

  _selectedItemChanged(event, detail) {
    if (detail && detail.value) {
      var selectedCard = this.$$("#groupCardHref"+detail.value.id);
      if (selectedCard) {
        selectedCard.click();
      }
    }
  }

  _getGroupUrl (group) {
    if (group && group.configuration && group.configuration.actAsLinkToCommunityId) {
      return "/community/"+group.configuration.actAsLinkToCommunityId;
    } else {
    return "/group/"+group.id;
    }
  }

  _scrollOffset(wide, featuredGroups) {
    const list = this.$$("#ironList");
    if (list) {
      let offset = list.offsetTop;
      offset -= 75;
      if (list.offsetTop>0 && offset>0) {
        console.info("Group list scroll offset: "+offset);
        return offset;
      } else {
        if (wide)
          offset = 390;
        else
          offset = 450;
        console.info("Group list (manual) scroll offset: "+offset);
        return offset;
      }
    } else {
      console.warn("No group list for scroll offset");
      return null;
    }
  }

  scrollToItem(item) {
    console.log("Group grid scrolling to item");
    this.$$("#ironList").scrollToItem(item);
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
      })
    )
  }

  _newGroup() {
    this.fire('add-new-group');
  }
}

window.customElement.define('yp-group-grid-lit', YpGroupGridLit)
