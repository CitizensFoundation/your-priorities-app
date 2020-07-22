import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';

import '@material/mwc-icon';

@customElement('yp-collection-stats')
export class YpCollectionStats extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  collectionType: string | undefined;

  static get styles() {
    return [
      super.styles,
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
          text-align: right;
          vertical-align: bottom;
          padding-right: 8px;
          color: var(--main-stats-color-on-white);
        }

        .stats-icon {
          padding-left: 8px;
          margin-right: 4px;
        }
      `,
    ];
  }

  render() {
    return this.collection
      ? html`
          <div class="stats layout horizontal end-justified">
            <div class="layout horizontal">
              <mwc-icon
                .title="${this.t('stats.posts')}"
                icon="lightbulb-outline"
                class="stats-icon bulb"></mwc-icon>
              <div title="${this.t('stats.posts')}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_posts)}
              </div>

              ${this.collectionType === 'community'
                ? html`
                    <mwc-icon
                      .title="${this.t('stats.groups')}"
                      icon="people"
                      class="stats-icon"></mwc-icon>
                    <div title="${this.t('stats.groups')}" class="stats-text">
                      ${YpFormattingHelpers.number(
                        this.collection.counter_groups
                      )}
                    </div>
                  `
                : nothing}
              ${this.collectionType === 'group'
                ? html`
                    <mwc-icon
                      .title="${this.t('stats.points')}"
                      icon="people"
                      class="stats-icon"></mwc-icon>
                    <div title="${this.t('stats.points')}" class="stats-text">
                      ${YpFormattingHelpers.number(
                        this.collection.counter_points
                      )}
                    </div>
                  `
                : nothing}

              <mwc-icon
                .title="${this.t('stats.users')}"
                icon="face"
                class="stats-icon"></mwc-icon>
              <div title="${this.t('stats.users')}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_users)}
              </div>
            </div>
          </div>
        `
      : nothing;
  }
}
