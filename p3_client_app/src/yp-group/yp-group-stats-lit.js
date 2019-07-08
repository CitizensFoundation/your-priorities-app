import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { html, css } from 'lit-element';
import { YpFlexLayout } from '../yp-flex-layout.js';

  class YpGroupStatsLit extends YpBaseElement {
    static get properties() {
      return {
        group: {
          type: Object
        }
      }
    }
  

  static get styles() {
    return [
      css`
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
      `, YpFlexLayout]
  }
    
  render() {
    return html`
      ${this.group ? html`
    <div class="stats layout horizontal end-justified">
      <iron-icon title="${this.t('stats.posts')}" icon="lightbulb-outline" class="stats-icon"></iron-icon>
      <div title="${this.t('stats.posts')}" class="stats-text" style="">${this.formatNumber(this.group.counter_posts)}</div>

      <iron-icon title="${this.t('stats.discussions')}" icon="chat-bubble-outline" class="stats-icon"></iron-icon>
      <div title="${this.t('stats.discussions')}" class="stats-text">${this.formatNumber(this.group.counter_points)}</div>

      <iron-icon title="${this.t('stats.users')}" icon="face" class="stats-icon"></iron-icon>
      <div title="${this.t('stats.users')}" class="stats-text">${this.formatNumber(this.group.counter_users)}</div>
    </div>  
    ` : html``
  }
  `
  
  
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

window.customElement.define('yp-group-stats-lit', YpCommunityStatsLit);