import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import "@material/web/icon/icon.js";

import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import {
  getNotificationLongTime,
  getNotificationShortTime,
  notificationTimeStyles,
} from './NotificationTimeHelpers.js';

@customElement('ac-notification-list-point')
export class AcNotificationListPoint extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: String })
  helpfulsText: string | undefined;

  @property({ type: String })
  unhelpfulsText: string | undefined;

  @property({ type: Boolean })
  newPointMode: boolean | undefined;

  @property({ type: Boolean })
  qualityMode: boolean | undefined;

  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: String })
  pointContent: string | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: String })
  postName: string | undefined;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('notification')) {
      this._notificationChanged();
    }
  }

  static override get styles() {
    return [
      super.styles,
      notificationTimeStyles,
      css`
        :host {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }

        .pointerCursor {
          cursor: pointer;
        }

        a.pointerCursor {
          color: inherit;
          display: block;
          text-decoration: none;
        }

        .notificationRow,
        a.notificationRow {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 10px;
          box-sizing: border-box;
          width: 100%;
          padding: 10px 12px;
          border: 1px solid
            color-mix(in srgb, var(--md-sys-color-outline) 18%, transparent);
          border-radius: 8px;
          background: color-mix(
            in srgb,
            var(--md-sys-color-surface-container-lowest) 86%,
            var(--md-sys-color-secondary-container)
          );
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition:
            background-color 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .notificationRow:hover {
          border-color: color-mix(
            in srgb,
            var(--md-sys-color-primary) 34%,
            transparent
          );
          background: var(--md-sys-color-surface-container-lowest);
          transform: translateY(-1px);
        }

        .iconRail {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding-top: 1px;
        }

        yp-user-image {
          width: 32px;
          height: 32px;
        }

        .actionIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
          border-radius: 50%;
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          font-size: 21px;
          line-height: 32px;
          overflow: visible;
        }

        .actionIcon[quality-up] {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .actionIcon[quality-down] {
          background: var(--md-sys-color-error-container);
          color: var(--md-sys-color-on-error-container);
        }

        .postName {
          overflow: hidden;
          padding-top: 5px;
          padding-bottom: 0;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 13px;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pointContent {
          display: -webkit-box;
          overflow: hidden;
          padding-bottom: 4px;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.28;
          word-break: break-word;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .notificationBody {
          min-width: 0;
        }

        .metaRow {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 6px;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 13px;
          line-height: 1.25;
        }

        .metaText {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .metaLabel {
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 700;
        }

        .metaLabel[quality-up] {
          color: var(--md-sys-color-primary);
        }

        .metaLabel[quality-down] {
          color: var(--md-sys-color-error);
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  override render() {
    return html`
      <a
        href="${this.pointUrl}"
        class="notificationRow pointerCursor"
        @click="${this.goToPost}"
        aria-label="${this.postNameTruncated}"
        ?hidden="${!this.post}">
          <div class="iconRail">
            ${this.user
              ? html`
                  <yp-user-image small .user="${this.user}"></yp-user-image>
                `
              : nothing}
            <md-icon
              class="actionIcon"
              ?quality-up="${this.qualityActionState === 'helpful'}"
              ?quality-down="${this.qualityActionState === 'unhelpful'}"
              >${this.pointNotificationIcon}</md-icon
            >
          </div>
          <div class="notificationBody">
            <div class="notificationHeaderLine">
              <div class="notificationHeaderMain">
                <div
                  .pointValueUp="${this.pointValueUp}"
                  class="pointContent">
                  ${this.pointContent}
                </div>
              </div>
              ${this.renderTimestamp()}
            </div>
            <div class="metaRow" ?hidden="${!this.helpfulsText}">
              <span class="metaLabel" quality-up
                >${this.t("point.helpful")}</span
              >
              <div class="metaText endorsers">${this.helpfulsText}</div>
            </div>
            <div class="metaRow" ?hidden="${!this.unhelpfulsText}">
              <span class="metaLabel" quality-down
                >${this.t("point.not_helpful")}</span
              >
              <div class="metaText opposers">${this.unhelpfulsText}</div>
            </div>
            <div class="postName">${this.postNameTruncated}</div>
          </div>
      </a>
    `;
  }

  renderTimestamp() {
    const shortTime = getNotificationShortTime(this.notification);
    const longTime = getNotificationLongTime(this.notification);
    return shortTime
      ? html`
          <div
            class="notificationTimeChip"
            title="${longTime}"
            aria-label="${longTime}"
          >
            <md-icon>schedule</md-icon>
            <span>${shortTime}</span>
          </div>
        `
      : nothing;
  }

  get postNameTruncated() {
    if (this.postName) {
      return YpFormattingHelpers.truncate(this.postName, 42);
    } else {
      return '';
    }
  }

  get pointValueUp() {
    return !!(this.point && this.point.value > 0);
  }

  get pointNotificationIcon() {
    if (this.qualityMode) {
      if (this.qualityActionState === "helpful") {
        return "thumb_up";
      } else if (this.qualityActionState === "unhelpful") {
        return "thumb_down";
      } else {
        return "thumbs_up_down";
      }
    } else {
      return "chat_bubble_outline";
    }
  }

  get qualityActionState(): "helpful" | "unhelpful" | "mixed" | undefined {
    if (!this.qualityMode || !this.notification) {
      return undefined;
    }

    const hasHelpful = this.notification.AcActivities.some(
      activity => activity.type === "activity.point.helpful.new"
    );
    const hasUnhelpful = this.notification.AcActivities.some(
      activity => activity.type === "activity.point.unhelpful.new"
    );

    if (hasHelpful && hasUnhelpful) {
      return "mixed";
    } else if (hasHelpful) {
      return "helpful";
    } else if (hasUnhelpful) {
      return "unhelpful";
    } else {
      return undefined;
    }
  }

  get pointUrl() {
    if (this.post) {
      let postUrl = "/post/" + this.post.id;
      if (this.point) {
        postUrl += "/" + this.point.id;
      }
      return YpNavHelpers.withForAgentBundle(postUrl);
    } else {
      return "#";
    }
  }

  goToPost(event?: Event) {
    if (this.post && this.shouldHandleAnchorClick(event)) {
      const postUrl = this.pointUrl;
      window.appGlobals.activity('open', 'post', postUrl);
      setTimeout(() => {
        YpNavHelpers.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged() {
    this.helpfulsText = undefined;
    this.unhelpfulsText = undefined;
    this.newPointMode = undefined;
    this.qualityMode = undefined;

    if (this.notification) {
      this.point = this.notification.AcActivities[0].Point;
      this.post = this.notification.AcActivities[0].Post;
      this.user = this.notification.AcActivities[0].User;

      if (this.point) {
        this.pointContent = YpFormattingHelpers.truncate(
          this.point.content,
          72
        );
      }
      if (this.notification.type == 'notification.point.new') {
        this.newPointMode = true;
      } else if (this.notification.type == 'notification.point.quality') {
        this.qualityMode = true;
        this._createQualityStrings();
      }
    }
  }

  _createQualityStrings() {
    let helpfuls = '';
    let unhelpfuls = '';

    this.notification!.AcActivities.forEach(activity => {
      if (activity.type == 'activity.point.helpful.new') {
        if (!helpfuls) {
          helpfuls = '';
        }
        helpfuls = this._addWithComma(helpfuls, activity.User.name);
      } else if (activity.type == 'activity.point.unhelpful.new') {
        if (!unhelpfuls) {
          unhelpfuls = '';
        }
        unhelpfuls = this._addWithComma(unhelpfuls, activity.User.name);
      }
    });

    if (helpfuls && helpfuls != '') {
      this.helpfulsText = truncateNameList(helpfuls);
    }

    if (unhelpfuls && unhelpfuls != '') {
      this.unhelpfulsText = truncateNameList(unhelpfuls);
    }
  }

  _addWithComma(text: string, toAdd: string) {
    let returnText = '';
    if (text != '') {
      returnText += text + ',';
    }
    return returnText + toAdd;
  }
}
