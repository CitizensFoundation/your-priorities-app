import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import "@material/web/icon/icon.js";

import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import {
  getNotificationLongTime,
  getNotificationShortTime,
  notificationTimeStyles,
} from './NotificationTimeHelpers.js';

@customElement('ac-notification-list-post')
export class AcNotificationListPost extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: String })
  endorsementsText: string | undefined;

  @property({ type: String })
  oppositionsText: string | undefined;

  @property({ type: Boolean })
  newPostMode: boolean | undefined;

  @property({ type: Boolean })
  endorseMode: boolean | undefined;

  @property({ type: String })
  userName: string | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

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
            var(--md-sys-color-primary-container)
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
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          font-size: 21px;
          line-height: 32px;
          overflow: visible;
        }

        .actionIcon[new-post] {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
        }

        .actionIcon[endorsement] {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .actionIcon[opposition] {
          background: var(--md-sys-color-error-container);
          color: var(--md-sys-color-on-error-container);
        }

        .notificationBody {
          min-width: 0;
        }

        .postName {
          min-width: 0;
          padding-top: 4px;
          padding-bottom: 0;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.28;
          word-break: break-word;
        }

        .userName {
          overflow: hidden;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        .metaLabel[endorsement] {
          color: var(--md-sys-color-primary);
        }

        .metaLabel[opposition] {
          color: var(--md-sys-color-error);
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  override render() {
    return this.post
      ? html`
          <a
            href="${this.postUrl}"
            class="notificationRow pointerCursor"
            @click="${this._goToPost}"
            aria-label="${this.post.name}"
            ?hidden="${!this.post}">
              <div class="iconRail">
                ${this.user
                  ? html`
                      <yp-user-image small .user="${this.user}"></yp-user-image>
                    `
                  : nothing}
                <md-icon
                  ?new-post="${this.newPostMode}"
                  ?endorsement="${this.showEndorsementIcon}"
                  ?opposition="${this.showOppositionIcon}"
                  class="actionIcon"
                  >${this.postNotificationIcon}</md-icon
                >
              </div>
              <div class="notificationBody">
                <div class="notificationHeaderLine">
                  <div class="notificationHeaderMain">
                    <div ?hidden="${!this.endorsementsText}">
                      <div class="metaRow">
                        <span class="metaLabel" endorsement
                          >${this.t("pointForShort")}</span
                        >
                        <div class="metaText endorsers">${this.endorsementsText}</div>
                      </div>
                    </div>
                    <div ?hidden="${!this.oppositionsText}">
                      <div class="metaRow">
                        <span class="metaLabel" opposition
                          >${this.t("pointAgainstShort")}</span
                        >
                        <div class="metaText opposers">${this.oppositionsText}</div>
                      </div>
                    </div>
                    <div class="postName">
                      <yp-magic-text
                        class="postName"
                        textOnly
                        textType="postName"
                        .contentLanguage="${this.post.language}"
                        .content="${this.post.name}"
                        .contentId="${this.post.id}">
                      </yp-magic-text>
                    </div>
                    <div ?hidden="${!this.newPostMode}" class="userName">
                      ${this.userName}
                    </div>
                  </div>
                  ${this.renderTimestamp()}
                </div>
              </div>
          </a>
        `
      : nothing;
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

  get postUrl() {
    return this.post
      ? YpNavHelpers.withForAgentBundle(`/post/${this.post.id}`)
      : "#";
  }

  get showEndorsementIcon() {
    return !!(!this.newPostMode && this.endorsementsText);
  }

  get showOppositionIcon() {
    return !!(!this.newPostMode && !this.endorsementsText && this.oppositionsText);
  }

  get postNotificationIcon() {
    if (this.newPostMode) {
      return "lightbulb_outline";
    } else if (this.showOppositionIcon) {
      return "do_not_disturb";
    } else if (this.showEndorsementIcon) {
      return "favorite";
    } else {
      return "lightbulb_outline";
    }
  }

  _goToPost(event?: Event) {
    if (this.post && this.shouldHandleAnchorClick(event)) {
      const postUrl = this.postUrl;
      window.appGlobals.activity('open', 'post', postUrl);
      setTimeout(() => {
        YpNavHelpers.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged() {
    if (this.notification) {
      this.post = this.notification.AcActivities[0].Post;
      this.userName = this.notification.AcActivities[0].User.name;
      this.user = this.notification.AcActivities[0].User;
      if (this.notification.type == 'notification.post.new') {
        this.newPostMode = true;
      } else if (this.notification.type == 'notification.post.endorsement') {
        this.endorseMode = true;
        this.newPostMode = false;
        this._createEndorsementStrings();
      }
    } else {
      this.endorsementsText = undefined;
      this.oppositionsText = undefined;
      this.newPostMode = undefined;
      this.endorseMode = undefined;
      this.userName = undefined;
      this.user = undefined;
    }
  }

  _createEndorsementStrings() {
    let endorsements = '';
    let oppositions = '';

    this.notification!.AcActivities.forEach(activity => {
      if (activity.type == 'activity.post.endorsement.new') {
        if (!endorsements) {
          endorsements = '';
        }
        endorsements = this._addWithComma(endorsements, activity.User.name);
      } else if (activity.type == 'activity.post.opposition.new') {
        if (!oppositions) {
          oppositions = '';
        }
        oppositions = this._addWithComma(oppositions, activity.User.name);
      }
    });

    if (endorsements && endorsements != '') {
      this.endorsementsText = truncateNameList(endorsements);
    }

    if (oppositions && oppositions != '') {
      this.oppositionsText = truncateNameList(oppositions);
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
