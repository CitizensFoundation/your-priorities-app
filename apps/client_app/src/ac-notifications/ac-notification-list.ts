import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';
import { YpBaseElementWithLogin } from '../@yrpri/yp-base-element-with-login.js';

@customElement('ac-notification-list')
export class AcNotificationList extends YpBaseElementWithLogin {
  @property({ type: Array })
  notifications: Array<AcNotificationData> | undefined;

  @property({ type: Number })
  notificationGetTTL = 5000

  @property({ type: Object })
  oldestProcessedNotificationAt: Date | undefined

  @property({ type: Object })
  latestProcessedNotificationAt: Date | undefined

  @property({ type: String })
  url = "/api/notifications"

  @property({ type: Object })
  user: YpUserData | undefined

  @property({ type: Boolean })
  firstReponse = false

  @property({ type: Object })
  timer: ReturnType<typeof setTimeout> | undefined

  @property({ type: Number })
  unViewedCount = 0

  @property({ type: Boolean })
  moreToLoad = false

  @property({ type: Boolean })
  opened = false

  @property({ type: String })
  route: string | undefined

  lastFetchStartedAt: number | undefined

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('user')) {
      this._userChanged();
    }

    if (changedProperties.has('open')) {
      this._openedChanged();
    }

    if (changedProperties.has('loggedInUser')) {
      this._loggedInUserChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`

      iron-list {
        flex: 1 1 auto;
      }

      p {
        text-align: left;
      }

      .notificationItem {
        margin-bottom: 8px;
        padding-bottom: 8px;
      }

      .unViewedCount {
        padding-top: 8px;
        color: #777;
        font-size: 14px;
      }

      [hidden] {
        display: none !important;
      }

      #material {
        z-index: 1000;
        margin: 0 !important;
        padding: 8px;
        height: 95vh;
      }

      .notificationHeader {
        font-size: 18px;
        color: var(--accent-color);
        padding-top: 8px;
      }

      #notificationsList {
        width: 100% !important;
        overflow: hidden;
      }

      :focus {
      }

      .overflowSettings {
        overflow-x: hidden; max-width: 255px !important;
      }

      .notificationHeader {
        margin-bottom: 2px;
      }
    `
    ]
  }



  render() {
    return html`
    <iron-scroll-threshold .lower-threshold="250" @lower-threshold="${this._loadMoreData}" id="threshold">
      <div .elevation="2" id="material" class="oversflowSettings">

        ${ this.user ? html`
        <yp-user-info @open-user-edit="${this._openEdit}" .user="${this.user}"></yp-user-info>
          <div class="notificationHeader layout horizontal center-center" ?hidden="${!this.notificationsLength}">
            ${this.t('notifications')}
          </div>
          <div ?hidden="${!this.unViewedCount}" class="unViewedCount layout vertical center-center">
            <div>${this.unViewedCount} ${this.t('unviewed')}</div>
            <mwc-button @click="${this._markAllAsViewed}" .label="${this.t('notificationMarkAllViewed')}" ></mwc-button>
          </div>

          <iron-list id="list" .items="${this.notifications}" .scrollOffset="300" as="notification" .scrollTarget="threshold">
            <template>
              <div tabindex="${this.tabIndex}" class="layout vertical overflowSettings">
                ${this._notificationType(notification, 'postNotification') ? html`
                  <ac-notification-list-post class="notificationItem" .notification="${this.notification}"></ac-notification-list-post>
                `: html``}

                ${this._notificationType(notification, 'pointNotification') ? html`
                  <ac-notification-list-point class="notificationItem" .notification="${this.notification}"></ac-notification-list-point>
                `: html``}

                ${this._notificationType(notification, 'notification.post.status.change') ? html`
                  <ac-notification-list-general-item .icon="language" .notification="${this.notification}"></ac-notification-list-general-item>
                `: html``}

                ${this._notificationType(notification, 'notification.point.newsStory') ? html`
                  <ac-notification-list-general-item .icon="face" .notification="${this.notification}" .shortText="${this.notification.AcActivities[0].Point.content}">
                  </ac-notification-list-general-item>
                `: html``}

                ${this._notificationType(notification, 'notification.point.comment') ? html`
                  <ac-notification-list-general-item .icon="chat-bubble-outline" .notification="${this.notification}" .shortText="${this.notification.AcActivities[0].Point.content}"></ac-notification-list-general-item>
                `: html``}

                ${this._notificationType(notification, 'notification.generalUserNotification') ? html`
                  <ac-notification-list-general-item icon="language" notification="${this.notification}" .shortText="${this._getNotificationTypeAndName(notification.AcActivities[0].object.type, notification.AcActivities[0].object.name)}"></ac-notification-list-general-item>
                `: html``}
              </div>
            </template>

          </iron-list>
        ` : html``}

      </div>
    </iron-scroll-threshold>

    <div class="layout horizontal center-center" ?hidden="">
      <yp-ajax id="loadNotificationsAjax" @response="${this._loadNotificationsResponse}"></yp-ajax>
      <yp-ajax id="loadNewNotificationsAjax" .dispatchError="" @error="${this._newNotificationsError}" @response="${this._loadNewNotificationsResponse}"></yp-ajax>
      <yp-ajax id="setAsViewedAjax" .method="PUT" url="/api/notifications/setIdsViewed" @response="${this._setAsViewedResponse}"></yp-ajax>
      <yp-ajax id="markAllAsViewedAjax" .method="PUT" url="/api/notifications/markAllViewed" @response="${this._setAsMarkAllViewedResponse}"></yp-ajax>
    </div>

    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
    <lite-signal @lite-signal-yp-refresh-activities-scroll-threshold="${this._clearScrollThreshold}"></lite-signal>
`
  }

/*
  behaviors: [
    ypLoggedInUserBehavior,
    ypTruncateBehavior
  ],
*/

  get notificationsLength() {
    if (this.notifications) {
      return this.notifications.length;
    } else {
      return 0;
    }
  }

  _openedChanged() {
    if (this.opened) {
      setTimeout( () => {
        this.markCurrentAsViewed();
      }, 25);
    }
  }

  _getNotificationTypeAndName(theType, name) {
    return theType ? this.t(theType)+' '+ (name ? name : '') : "";
  }

  _openEdit() {
    window.appDialogs.getDialogAsync("userEdit",  (dialog) => {
      dialog.setup(this.user, false, null);
      dialog.open('edit', {userId: this.user.id});
    });
  }

  _clearScrollThreshold() {
    this.$$("#threshold").clearTriggers();
  }

  _markAllAsViewed() {
    window.appDialogs.getDialogAsync("confirmationDialog",  (dialog) => {
      dialog.open(this.t('notificationConfirmMarkAllViewed'), this._reallyMarkAllAsViewed.bind(this));
    });
  }

  _reallyMarkAllAsViewed() {
    this.$$("#markAllAsViewedAjax").body = {};
    this.$$("#markAllAsViewedAjax").generateRequest();
  }

  _handleUnViewedCount(unViewedCount: number) {
    this.unViewedCount = unViewedCount;
    this.fire('yp-set-number-of-un-viewed-notifications', { count: unViewedCount })
  }

  markCurrentAsViewed() {
    this._markAsViewed(this.notifications!);
  }

  _markAsViewed(notifications: Array<AcNotificationData>) {
    const marked: Array<number> = [];
    if (notifications) {
      notifications.forEach(function (notification) {
        if (!notification.viewed) {
          marked.push(notification.id);
        }
      });
    }
    if (marked.length>0) {
      this.$$("#setAsViewedAjax").body = { viewedIds: marked };
      this.$$("#setAsViewedAjax").generateRequest();
    }
  }

  _setAsViewedResponse(event, detail) {
    this._handleUnViewedCount(detail.response.unViewedCount);
    const viewedIds =  detail.response.viewedIds;
    if (this.notifications) {
      this.notifications.forEach(function (notification, index, theArray) {
        if (viewedIds.indexOf(notification.id) > -1) {
          theArray[index].viewed = true;
        }
      });
    }
  }

  _setAsMarkAllViewedResponse(event, detail) {
    this._handleUnViewedCount(0);
    this._setAllLocalCurrentAsViewed();
  }

  _setAllLocalCurrentAsViewed() {
    if (this.notifications) {
      this.notifications.forEach(function (notification, index, theArray) {
        theArray[index].viewed = true;
      });
    }
  }

  _newNotificationsError(event: CustomEvent) {
    console.error("Error in getting new notifications");
    this.cancelTimer();

    if (event.detail && event.detail.status && event.detail.status==401) {
      window.appUser.checkLogin();
    }
  }

  _userChanged() {
    if (this.user) {
      this.$.loadNotificationsAjax.url = this.url;
      this.$.loadNotificationsAjax.generateRequest();
    } else {
      this.cancelTimer();
    }
  }

  _loggedInUserChanged(user) {
    if (!user) {
      this.cancelTimer();
    }
  }

  cancelTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  _notificationType(notification, type) {
    if (notification.type==type) {
      return true;
    } else if (type=='postNotification') {
      return (['notification.post.new', 'notification.post.endorsement'].indexOf(notification.type) > -1)
    } else if (type=='pointNotification') {
      return (['notification.point.new', 'notification.point.quality'].indexOf(notification.type) > -1)
    } else if (type=='system') {
      return false;
    }
  }

  _loadNotificationsResponse(event: CustomEvent) {
    const notifications = event.detail.response.notifications as Array<AcNotificationData>;

    if (event.detail.response.oldestProcessedNotificationAt) {
      this.oldestProcessedNotificationAt = event.detail.response.oldestProcessedNotificationAt;
    }

    if (!this.notifications) {
      this.notifications = notifications;
    } else {
      notifications.forEach( (notification) => {
        this.notifications?.push(notification);
      });
    }

    this._finalizeAfterResponse(notifications);

    if (this.firstReponse) {
      this.firstReponse = false;
      this.loadNewData();
    } else {
      if (this.opened) {
        this._markAsViewed(notifications);
      }
    }

    this._handleUnViewedCount(detail.response.unViewedCount);
  }

  _startTimer() {
    this.cancelTimer();
    if (this.user) {
      this.timer = setTimeout( () =>{
        this.loadNewData();
        this.lastFetchStartedAt = Date.now();
      }, this.notificationGetTTL);
    }
  }

  _sendReloadPointsEvents(notifications: Array<AcNotificationData>) {
    notifications.forEach( (notification) => {
      if (notification.type=='notification.point.new') {
        const activityUser = notification.AcActivities[0].User;
        if (window.appUser.user && activityUser && window.appUser.user.id != activityUser.id) {
          this.fireGlobal('yp-update-points-for-post', { postId: notification.AcActivities[0].Post!.id } )
        }
      }
    });
  }

  _loadNewNotificationsResponse(event, detail) {
    const notifications = detail.response.notifications;

    notifications.forEach( (notification) => {
      this._removeOldIfExists(notification);
      if (notification.type=='notification.point.new') {
        // ...
      }
    });

    notifications.forEach( (notification) => {
      this.notifications?.unshift(notification);
    });

    this._finalizeAfterResponse(notifications);

    this._startTimer();

    this._displayToast(notifications);
    this._sendReloadPointsEvents(notifications);

    if (this.opened) {
      this._markAsViewed(notifications);
    }

    this._handleUnViewedCount(detail.response.unViewedCount);
    if (this.$$("#list"))
      this.$$("#list").fire("iron-resize");

    if (this.lastFetchStartedAt) {
      const duration = Date.now() - this.lastFetchStartedAt;
      if (duration>1000) {
        console.warn("Setting notificationGetTTL = 60000");
        this.notificationGetTTL = 60000;
      } else if (duration>10000) {
        console.warn("Setting notificationGetTTL = 60000*5");
        this.notificationGetTTL = 60000*5;
      }
    }
  }

  _removeOldIfExists(notification: AcNotificationData) {
    this.notifications!.forEach( (oldNotification, index) => {
      if (oldNotification.id==notification.id) {
        this.notifications?.splice(index, 1);
      }
    });
  }

  _getNotificationText(notification: AcNotificationData) {
    let ideaName, object;
    if (notification.AcActivities[0].Post) {
      ideaName = YpFormattingHelpers.truncate(notification.AcActivities[0].Post.name, 30) + ": ";
    }
    if (notification.AcActivities[0].object) {
      object = notification.AcActivities[0].object;
    }
    if (notification.type==='notification.post.new') {
      return ideaName+this.t('post.new');
    } else if (notification.type==='notification.post.endorsement') {
      if (notification.AcActivities[0].type==='activity.post.endorsement.new') {
        return ideaName+this.t('endorsedYourPost');
      } else {
        return ideaName+this.t('opposedYourPost');
      }
    } else if (notification.type==='notification.point.new') {
      if (notification.AcActivities[0].Point!.value>0) {
        return ideaName+this.t('point.forAdded');
      } else {
        return ideaName+this.t('point.againstAdded');
      }
    } else if (notification.type==='notification.point.quality') {
      if (notification.AcActivities[0].type==='activity.point.helpful.new') {
        return ideaName+this.t('upVotedPoint');
      } else {
        return ideaName+this.t('downVotedPoint');
      }
    } else if (notification.type=='notification.generalUserNotification' && object) {
      return this.t(object.type)+" "+object.name;
    }
  }

  _displayToast(notifications: AcNotificationData) {
    const notMyNotifications = __.reject(notifications,  (notification) => {
      const activityUser = notification.AcActivities[0].User;
      return !(window.appUser.user && activityUser && window.appUser.user.id != activityUser.id) &&
             notification.type!=='notification.generalUserNotification';
    });

    if (notMyNotifications.length>0) {
      const activityUser = notMyNotifications[0].AcActivities[0].User;
      window.appDialogs.getDialogAsync("notificationToast",  (dialog) => {
        dialog.open(activityUser, this._getNotificationText(notMyNotifications[0]), notMyNotifications[0].type==='notification.generalUserNotification');
      });
    }
  }

  _finalizeAfterResponse(notifications: Array<AcNotificationData>) {
    if (notifications.length>0) {
      if (!this.latestProcessedNotificationAt || this.latestProcessedNotificationAt < notifications[0].updated_at) {
        this.latestProcessedNotificationAt = notifications[0].updated_at;
      }
      this.moreToLoad = true;
    }

    setTimeout( () => {
      if (this.$$("#list")) {
        this.$$("#list").fire('iron-resize');
      }
    }, 100);
  }

  _loadMoreData() {
    this._clearScrollThreshold();
    if (this.oldestProcessedNotificationAt) {
      this.moreToLoad = false;
      this.$$("#loadNotificationsAjax").url = this.url + '?beforeDate='+this.oldestProcessedNotificationAt;
      this.$$("#loadNotificationsAjax").generateRequest();
    }
  }

  loadNewData() {
    if (this.latestProcessedNotificationAt) {
      this.$$("#loadNewNotificationsAjax").url = this.url + '?afterDate='+this.latestProcessedNotificationAt;
      this.$$("#loadNewNotificationsAjax").generateRequest();
    } else if (!this.latestProcessedNotificationAt) {
      this.$$("#loadNewNotificationsAjax").url = this.url;
      this.$$("#loadNewNotificationsAjax").generateRequest();
    }
  }
}

