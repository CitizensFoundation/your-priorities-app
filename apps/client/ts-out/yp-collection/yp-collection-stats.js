var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import '@material/web/icon/icon.js';
let YpCollectionStats = class YpCollectionStats extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
          width: 100%;
        }

        .stats {
          padding-top: 8px;
          padding-bottom: 0;
          opacity: 0.7;
        }

        .stats-text {
          font-size: 18px;
          text-align: right;
          vertical-align: bottom;
          margin-right: 8px;
        }

        .stats-icon {
          margin-left: 8px;
          margin-bottom: 8px;
          margin-right: 8px;
        }
      `,
        ];
    }
    render() {
        return this.collection
            ? html `
          <div class="stats layout horizontal end-justified">
            <div class="layout horizontal">
              <md-icon title="${this.t('stats.posts')}" class="stats-icon bulb"
                >lightbulb_outline</md-icon
              >
              <div title="${this.t('stats.posts')}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_posts)}
              </div>

              ${this.collectionType === 'community'
                ? html `
                    <md-icon
                      title="${this.t('stats.groups')}"
                      class="stats-icon"
                      >groups</md-icon
                    >
                    <div title="${this.t('stats.groups')}" class="stats-text">
                      ${YpFormattingHelpers.number(this.collection.counter_groups)}
                    </div>
                  `
                : nothing}
              ${this.collectionType === 'domain'
                ? html `
                    <md-icon
                      title="${this.t('stats.communities')}"
                      class="stats-icon"
                      >groups</md-icon
                    >
                    <div
                      title="${this.t('stats.communities')}"
                      class="stats-text">
                      ${YpFormattingHelpers.number(this.collection.counter_communities)}
                    </div>
                  `
                : nothing}

              <md-icon
                title="${this.t('statsPoints')}"
                icon="people"
                class="stats-icon"
                >comment</md-icon
              >
              <div title="${this.t('statsPoints')}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_points)}
              </div>

              <md-icon
                title="${this.t('stats.users')}"
                icon="face"
                class="stats-icon"
                >person</md-icon
              >
              <div title="${this.t('stats.users')}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_users)}
              </div>
            </div>
          </div>
        `
            : nothing;
    }
};
__decorate([
    property({ type: Object })
], YpCollectionStats.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpCollectionStats.prototype, "collectionType", void 0);
YpCollectionStats = __decorate([
    customElement('yp-collection-stats')
], YpCollectionStats);
export { YpCollectionStats };
//# sourceMappingURL=yp-collection-stats.js.map