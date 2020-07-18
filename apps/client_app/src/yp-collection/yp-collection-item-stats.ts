import '../yp-app-globals/yp-app-icons.js';
import { html, css } from 'lit-element';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpCommunityStatsLit extends YpBaseElement {
  static get properties() {
    return {
      community: {
        type: Object
      }
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
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
    `,  YpFlexLayout]
  }

  render() {
    return html`
      <div class="stats layout horizontal end-justified">
        <div class="layout horizontal">
          <iron-icon .title="${this.t('stats.posts')}" .icon="lightbulb-outline" class="stats-icon bulb"></iron-icon>
          <div .title="${this.t('stats.posts')}" class="stats-text">${this.formatNumber(this.community.counter_posts)}</div>

          <iron-icon .title="${this.t('stats.groups')}" .icon="people" class="stats-icon"></iron-icon>
          <div .title="${this.t('stats.groups')}" class="stats-text">${this.formatNumber(this.community.counter_groups)}</div>

          <iron-icon .title="${this.t('stats.users')}" .icon="face" class="stats-icon"></iron-icon>
          <div .title="${this.t('stats.users')}" class="stats-text">${this.formatNumber(this.community.counter_users)}</div>
        </div>
      </div>
    }
    `
}

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('community')) {
      let communityFolders=null;
      if (this.community && this.community.is_community_folder &&
          !this.community.Communities && this.community.CommunityFolders) {
        communityFolders = this.community.CommunityFolders;
      } else if (this.community && this.community.is_community_folder &&
                this.community.Communities)  {
        communityFolders = this.community.Communities;

      }
    if (communityFolders) {
      let counter_posts = 0, counter_groups = 0, counter_users = 0;
      communityFolders.forEach(function (subCommunity) {
        counter_posts += subCommunity.counter_posts;
        counter_groups += subCommunity.counter_groups;
        counter_users += subCommunity.counter_users;
      });

      let fudgeFactor = 1.0;
      if (communityFolders.length>9) {
        fudgeFactor = 0.7;
      } else if (communityFolders.length>1) {
        fudgeFactor = 0.8;
      }
      this.community.counter_posts = counter_posts;
      this.community.counter_groups = counter_groups;
      this.community.counter_users = Math.round(counter_users*fudgeFactor);
      this.community = [...this.community];
     }
    }
  }
}

window.customElements.define('yp-community-stats-lit', YpCommunityStatsLit);