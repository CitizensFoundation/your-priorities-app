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

        @media (max-width: 600px) {
          .stats {
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 8px;
          }

          .stats > .layout {
            flex-wrap: wrap;
            justify-content: center;
          }

          .stats-text {
            text-align: center;
            margin: 4px;
          }

          .stats-icon {
            margin: 4px;
          }
        }
      `,
    ];
  }

  override render() {
    const collection = this.collection;

    if (!collection) {
      return nothing;
    }

    const collectionType = this.collectionType;
    const isGroup = collectionType === "group";
    const isCommunity = collectionType === "community";
    const isDomain = collectionType === "domain";

    const postsCount = YpFormattingHelpers.number(collection.counter_posts);
    const groupsCount = YpFormattingHelpers.number(collection.counter_groups);
    const communitiesCount = YpFormattingHelpers.number(
      collection.counter_communities
    );
    const pointsCount = YpFormattingHelpers.number(collection.counter_points);
    const usersCount = YpFormattingHelpers.number(collection.counter_users);

    return html`
      <div class="stats layout horizontal end-justified">
        <div class="layout horizontal">
          <md-icon
            aria-hidden="true"
            ?hidden="${isGroup}"
            title="${this.t("stats.posts")}"
            class="stats-icon bulb"
            >lightbulb_outline</md-icon
          >
          <div
            title="${this.t("stats.posts")}"
            class="stats-text"
            ?hidden="${isGroup}"
            role="text"
            aria-label="${this.t("stats.posts")}: ${postsCount}"
          >
            <span aria-hidden="true">${postsCount}</span>
          </div>

          ${collectionType === "community"
            ? html`
                <md-icon
                  hidden
                  aria-hidden="true"
                  title="${this.t("stats.groups")}"
                  class="stats-icon"
                  >groups</md-icon
                >
                <div
                  hidden
                  title="${this.t("stats.groups")}"
                  class="stats-text"
                  role="text"
                  aria-label="${this.t("stats.groups")}: ${groupsCount}"
                >
                  <span aria-hidden="true">${groupsCount}</span>
                </div>
              `
            : nothing}
          ${isDomain
            ? html`
                <md-icon
                  hidden
                  aria-hidden="true"
                  title="${this.t("stats.communities")}"
                  class="stats-icon"
                  >groups</md-icon
                >
                <div
                  hidden
                  title="${this.t("stats.communities")}"
                  class="stats-text"
                  role="text"
                  aria-label="${this.t("stats.communities")}: ${communitiesCount}"
                >
                  <span aria-hidden="true">${communitiesCount}</span>
                </div>
              `
            : nothing}

          <md-icon
            aria-hidden="true"
            ?hidden="${isCommunity}"
            title="${this.t("statsPoints")}"
            icon="people"
            class="stats-icon"
            >comment</md-icon
          >
          <div
            ?hidden="${isCommunity}"
            title="${this.t("statsPoints")}"
            class="stats-text"
            role="text"
            aria-label="${this.t("statsPoints")}: ${pointsCount}"
          >
            <span aria-hidden="true">${pointsCount}</span>
          </div>

          <md-icon
            aria-hidden="true"
            title="${this.t("stats.users")}"
            icon="face"
            class="stats-icon"
            >person</md-icon
          >
          <div
            title="${this.t("stats.users")}"
            class="stats-text"
            role="text"
            aria-label="${this.t("stats.users")}: ${usersCount}"
          >
            <span aria-hidden="true">${usersCount}</span>
          </div>
        </div>
      </div>
    `;
  }
}
