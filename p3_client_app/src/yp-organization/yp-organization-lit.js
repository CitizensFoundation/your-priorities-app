import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import '../yp-post/yp-post-map.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import './yp-organization-large-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpOrganizationLit extends YpBaseElement {
  static get properties() {
    return {
      groups: {
        type: Array
      },

      organizationId: {
        type: Number,
        value: null,
        observer: "_organizationIdChanged"
      },

      organization: {
        type: Object
      },

      organizationEmpty: {
        type: Boolean,
        value: false
      },

      hideAdd: {
        type: Boolean,
        value: true
      },

      selected: {
        type: Number,
        value: 0,
        observer: '_selectedChanged'
      },

      tabName: {
        type: String,
        value: null,
        observer: '_tabNameChanged'
      },

      mapActive: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      .card-container {
        width: 100%;
      }

      .card {
        padding: 16px;
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }
  `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-page id="page" .createFabIcon="group" .createFabTitle="${this.t('group.add')}" @yp-create-fab-tap="_newGroup">

      <yp-organization-large-card id="organizationCard" .slot="largeCard" class="largeCard card" .organization="${this.organization}" @update-organization="${this._refresh}"></yp-organization-large-card>

      <paper-tabs id="paper_tabs" .slot="tabs" class="tabs" .selected="${this.selected}" focused="">
        <paper-tab class="tab"><span>${this.t('groups')}</span> &nbsp; (<span>${this.groups.length}</span>)</paper-tab>
        <paper-tab class="tab">${this.t('news')}</paper-tab>
        <paper-tab class="tab">${this.t('posts.map')}</paper-tab>
      </paper-tabs>

      <iron-pages class="tabPages" .slot="tabPages" .selected="${this.selected}" .entryAnimation="fade-in-animation" .exitAnimation="fade-out-animation">
        <section>
          <div class="layout horizontal center-center wrap">
          </div>
        </section>
        <section>

          ${ this.mapActive ? html`
            <yp-post-map .organizationId="${this.organization.id}"></yp-post-map>
          ` : html``}

        </section>
      </iron-pages>
    </yp-page>

    <yp-ajax id="ajax" url="/api/organizations" @response="${this._response}"></yp-ajax>
    `
  }

  /*
  behaviors: [
    ypThemeBehavior,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _tabNameChanged(newValue) {
    if (newValue) {
      if (newValue=='groups') {
        this.selected = 0;
      } else if (newValue=='news') {
        this.selected = 1;
      } else if (newValue=='map') {
        this.selected = 2;
      }
    }
  }

  _selectedChanged(newValue) {
    if (this.organization) {
      if (newValue == 0) {
        this.redirectTo("/organization/" + this.organization.id + '/groups');
      } else if (newValue == 1) {
        this.redirectTo("/organization/" + this.organization.id + '/news');
      } else if (newValue == 2) {
        this.redirectTo("/organization/" + this.organization.id + '/map');
      }
    }
  }

  _hideEdit() {
    if (!this.organization)
      return true;

    if (!window.appUser.loggedIn())
      return true;

    return (window.appUser.user.id!=this.organization.user_id);
  }

  _organizationHeaderUrl(organization) {
    return this.getImageFormatUrl(organization.OrganizationHeaderImages, 2);
  }

  _organizationIdChanged(newValue, oldValue) {
    if (newValue) {
      this.organization = null;
      this.groups = null;
      this.$$('#ajax').url = '/api/organizations/' + this.organizationId;
      this.$$('#ajax').generateRequest();
      this.hideAdd = true;
    }
  }

  _newGroup() {
    window.appGlobals.activity('open', 'newGroup');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {organizationId: this.organizationId});
    }.bind(this));
  }

  _response(event, detail, sender) {
    this.organization = detail.response;
    if (this.organization.OrganizationHeaderImages && this.organization.OrganizationHeaderImages.length>0) {
      this.$("#page").setupTopHeaderImage(this.organization.OrganizationHeaderImages);
    }

    const randomTheme = Math.floor(Math.random() * 3) + 1;
    //this.setTheme(randomTheme-1);

    const url = this._organizationHeaderUrl(this.organization);
    //headerPanel.style.background = "#f5f5f5 url('"+url+"') no-repeat center top";
    this.groups = this.organization.Groups);
    this.async(function() {
      const organizationCard = this.$$('#organizationCard');
      if (organizationCard) {
        organizationCard.setElevation(5);
        organizationCard.lowerCardLater();
      }
    },20);
    if (detail.response.Groups.length===0)
      this.organizationEmpty = true;
    else
      this.organizationEmpty = false;
    this.fire("change-header", { headerTitle: this.organization.Domain.name,
                                 headerDescription: this.organization.Domain.description,
                                 headerIcon: "group-work",
                                 backPath: "/domain/" + this.organization.domain_id });
    if (this.groups.length>0) {
      this.hideAdd = true;
    } else {
      this.hideAdd = false;
    }
  }

  defaultGroupFirst(items) {
    const filtered = [];
    let defaultGroup = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.short_name != 'default') {
        filtered.push(item);
      } else {
        defaultGroup = item;
      }
    }
    filtered.unshift(defaultGroup);
    return filtered;
  }

  noTestGroup(items) {
    const filtered = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.short_name != 'test' && item.short_name != 'ac-posts' && item.short_name != 'development' && item.short_name.indexOf('2012') == -1 && item.short_name.indexOf('2013') == -1) {
        filtered.push(item);
      }
    }
    return filtered;
  }

  _refresh() {
    this.$$('#ajax').generateRequest();
  }

  connectedCallback() {
    super.connectedCallback()
  }
}

window.customElements.define('yp-organization-lit', YpOrganizationLit)
