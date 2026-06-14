import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';

@customElement('ac-notification-list-general-item')
export class AcNotificationListGenaralItem extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: String })
  icon: string | undefined;

  @property({ type: String })
  shortText: string | undefined;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('notification')) {
      this._notificationChanged();
    }
  }

  static override get styles() {
    return [
      super.styles,
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
          background: var(--md-sys-color-surface-container-lowest);
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
          background: var(--md-sys-color-surface-container-low);
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

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
          font-size: 19px;
        }

        .name {
          overflow: hidden;
          min-width: 0;
          padding-top: 1px;
          padding-bottom: 0;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.28;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .shortText {
          display: -webkit-box;
          overflow: hidden;
          padding-right: 8px;
          padding-bottom: 4px;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 13px;
          line-height: 1.3;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .notificationBody {
          min-width: 0;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  override render() {
    const targetUrl = this.targetUrl;
    return html`
      ${targetUrl
        ? html`
            <a
              class="notificationRow pointerCursor"
              href="${targetUrl}"
              @click="${this._goTo}"
              aria-label="${this.nameTruncated}"
            >
              ${this.renderContent()}
            </a>
          `
        : html`<div class="notificationRow">${this.renderContent()}</div>`}
    `;
  }

  renderContent() {
    return html`
        <div class="iconRail">
          <yp-user-image small .user="${this.user!}"></yp-user-image>
          <md-icon class="icon">${this.icon}</md-icon>
        </div>
        <div class="notificationBody">
          <div class="name">${this.nameTruncated}</div>
          <div ?hidden="${!this.shortText}" class="shortText">
            ${this.shortTextTruncated}
          </div>
        </div>
    `;
  }

  get targetUrl() {
    if (this.post) {
      return this.postUrl;
    } else if (this.notification) {
      if (
        this.notification.AcActivities[0].Group &&
        this.notification.AcActivities[0].Group.name !=
          'hidden_public_group_for_domain_level_points'
      ) {
        return YpNavHelpers.withForAgentBundle(
          '/group/' +
            this.notification.AcActivities[0].Group.id +
            '/news/' +
            this.notification.AcActivities[0].id
        );
      } else if (this.notification.AcActivities[0].Community) {
        return YpNavHelpers.withForAgentBundle(
          '/community/' +
            this.notification.AcActivities[0].Community.id +
            '/news/' +
            this.notification.AcActivities[0].id
        );
      } else if (this.notification.AcActivities[0].Domain) {
        return YpNavHelpers.withForAgentBundle(
          '/domain/' +
            this.notification.AcActivities[0].Domain.id +
            '/news/' +
            this.notification.AcActivities[0].id
        );
      }
    }
    return undefined;
  }

  _goTo(event?: Event) {
    if (!this.shouldHandleAnchorClick(event)) return;

    if (this.post) {
      this.goToPost();
    } else if (this.targetUrl) {
      YpNavHelpers.redirectTo(this.targetUrl);
    }
  }

  get nameTruncated() {
    const notification = this.notification!;
    if (notification.AcActivities[0].Post) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Post.name,
        42
      );
    } else if (
      notification.AcActivities[0].Group &&
      notification.AcActivities[0].Group.name !=
        'hidden_public_group_for_domain_level_points'
    ) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Group.name,
        42
      );
    } else if (notification.AcActivities[0].Community) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Community.name,
        42
      );
    } else if (notification.AcActivities[0].Domain) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Domain.name,
        42
      );
    } else {
      return '';
    }
  }

  get shortTextTruncated() {
    if (this.shortText) {
      return YpFormattingHelpers.truncate(this.shortText, 60);
    } else {
      return '';
    }
  }

  goToPost() {
    if (this.post) {
      const postUrl = this.postUrl;
      window.appGlobals.activity('open', 'post', postUrl);
      setTimeout(() => {
        YpNavHelpers.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  get postUrl() {
    return this.post
      ? YpNavHelpers.withForAgentBundle('/post/' + this.post.id + '/news')
      : '#';
  }

  _notificationChanged() {
    if (this.notification) {
      this.post = this.notification.AcActivities[0].Post;
      this.user = this.notification.AcActivities[0].User;
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
