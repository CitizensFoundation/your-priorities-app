import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
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
      outline: none;
    }

    @media (max-width: 1199px) {
      .groupCard {
      }
    }
    `, YpFlexLayout]
  }
  render() {
    return html`
      <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

      <div class="layout horizontal center-center">
        <iron-list id="ironList" .scrollOffset="${this.scrollOffset}" .items="${this.activeGroups}" as="group" .scrollTarget="document" .grid="${this.wide}">
          <template>
            <div class="groupCard layout vertical center-center" .tabIndex="${this.tabIndex}" wide-padding="${this.wide}">
              <yp-group-card-lit wide-padding="${this.wide}" .group="${this.group}" @mouseover="${this.cardMouseOver}" @mouseout="${this.cardMouseOut}"></yp-group-card-lit>
            </div>
          </template>
        </iron-list>
      </div>
    `
  }

  _scrollOffset(wide, featuredGroups) {
    var list = this.$.ironList;
    if (list) {
      var offset = list.offsetTop;
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
    this.$.ironList.scrollToItem(item);
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
