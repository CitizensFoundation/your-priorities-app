import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";

import "@material/web/icon/icon.js";

@customElement("yp-collection-stats")
export class YpCollectionStats extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  collectionType: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        .stats {
          padding-top: 16px;
          padding-bottom: 0;
          opacity: 0.5;
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

  override render() {
    return this.collection
      ? html`
          <div class="stats layout horizontal end-justified">
            <div class="layout horizontal">
              <md-icon
                ?hidden="${this.collectionType === "group"}"
                title="${this.t("stats.posts")}"
                class="stats-icon bulb"
                >lightbulb_outline</md-icon
              >
              <div
                title="${this.t("stats.posts")}"
                class="stats-text"
                ?hidden="${this.collectionType === "group"}"
              >
                ${YpFormattingHelpers.number(this.collection.counter_posts)}
              </div>

              ${this.collectionType === "community"
                ? html`
                    <md-icon
                      hidden
                      title="${this.t("stats.groups")}"
                      class="stats-icon"
                      >groups</md-icon
                    >
                    <div
                      hidden
                      title="${this.t("stats.groups")}"
                      class="stats-text"
                    >
                      ${YpFormattingHelpers.number(
                        this.collection.counter_groups
                      )}
                    </div>
                  `
                : nothing}
              ${this.collectionType === "domain"
                ? html`
                    <md-icon hidden
                      title="${this.t("stats.communities")}"
                      class="stats-icon"
                      >groups</md-icon
                    >
                    <div hidden
                      title="${this.t("stats.communities")}"
                      class="stats-text"
                    >
                      ${YpFormattingHelpers.number(
                        this.collection.counter_communities
                      )}
                    </div>
                  `
                : nothing}

              <md-icon
                ?hidden="${this.collectionType === "community"}"
                title="${this.t("statsPoints")}"
                icon="people"
                class="stats-icon"
                >comment</md-icon
              >
              <div
                ?hidden="${this.collectionType === "community"}"
                title="${this.t("statsPoints")}"
                class="stats-text"
              >
                ${YpFormattingHelpers.number(this.collection.counter_points)}
              </div>

              <md-icon
                title="${this.t("stats.users")}"
                icon="face"
                class="stats-icon"
                >person</md-icon
              >
              <div title="${this.t("stats.users")}" class="stats-text">
                ${YpFormattingHelpers.number(this.collection.counter_users)}
              </div>
            </div>
          </div>
        `
      : nothing;
  }
}
