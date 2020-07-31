import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@material/mwc-button';
import '../yp-ajax/yp-ajax.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import '../yp-user/yp-user-info.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import './ac-notification-list-post.js';
import './ac-notification-list-point.js';
import './ac-notification-list-general-item.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcNotificationListLit extends YpBaseElement {
  static get properties() {
    return {
      notifications: Array,

      notificationsLength: {
        type: Number,
        computed: '_notificationsLength(notifications)'
      },

      notificationGetTTL: {
        type: Number,
        value: 5000
      },

      oldestProcessedNotificationAt: {
        type: Date
      },

      latestProcessedNotificationAt: {
        type: Date
      },

      url: {
        type: String,
        value: "/api/notifications"
      },

      user: {
        type: Object,
        observer: '_userChanged'
      },

      firstReponse: {
        type: Boolean,
        value: true
      },

      timer: Object,
      unViewedCount:  {
        type: Number,
        value: 0
      },

      moreToLoad: {
        type: Boolean,
        value: false,
        notify: true
      },

      opened: {
        type: Boolean,
        observer: '_openedChanged'
      },

      route: {
        type: String
      }
    }
  }

  static get styles() {
    return [
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
    `, YpFlexLayout]
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

  _notificationsLength(notifications) {
    if (notifications) {
      return notifications.length;
    } else {
      return 0;
    }
  }

  _openedChanged(open) {
    if (open) {
      this.async(function () {
        this.markCurrentAsViewed();
      }.bind(this), 25);
    }
  }

  _getNotificationTypeAndName(theType, name) {
    return theType ? this.t(theType)+' '+ (name ? name : '') : "";
  }

  _openEdit() {
    dom(document).querySelector('yp-app').getDialogAsync("userEdit", function (dialog) {
      dialog.setup(this.user, false, null);
      dialog.open('edit', {userId: this.user.id});
    }.bind(this));
  }

  _clearScrollThreshold() {
    this.$$("#threshold").clearTriggers();
  }

  _markAllAsViewed() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('notificationConfirmMarkAllViewed'), this._reallyMarkAllAsViewed.bind(this));
    }.bind(this));
  }

  _reallyMarkAllAsViewed() {
    this.$$("#markAllAsViewedAjax").body = {};
    this.$$("#markAllAsViewedAjax").generateRequest();
  }

  _handleUnViewedCount(unViewedCount) {
    this.unViewedCount = unViewedCount;
    this.fire('yp-set-number-of-un-viewed-notifications', { count: unViewedCount })
  }

  markCurrentAsViewed() {
    this._markAsViewed(this.notifications);
  }

  _markAsViewed(notifications) {
    const marked = [];
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

  _newNotificationsError(event, detail) {
    console.error("Error in getting new notifications");
    this.cancelTimer();

    if (detail && detail.status && detail.status==401) {
      window.appUser.checkLogin();
    }
  }

  _userChanged(user) {
    if (user) {
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

  _loadNotificationsResponse(event, detail) {
    const notifications = detail.response.notifications;

    if (detail.response.oldestProcessedNotificationAt) {
      this.oldestProcessedNotificationAt = detail.response.oldestProcessedNotificationAt;
    }

    if (!this.notifications) {
      this.notifications = notifications;
    } else {
      notifications.forEach(function (notification) {
        this.push('notifications', notification);
      }.bind(this));
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
      this.timer = this.async(function () {
        this.loadNewData();
        this.lastFetchStartedAt = Date.now();
      }.bind(this), this.notificationGetTTL);
    }
  }

  _sendReloadPointsEvents(notifications) {
    notifications.forEach(function (notification) {
      if (notification.type=='notification.point.new') {
        const activityUser = notification.AcActivities[0].User;
        if (window.appUser.user && activityUser && window.appUser.user.id != activityUser.id) {
          document.dispatchEvent(
            new CustomEvent("lite-signal", {
              bubbles: true,
              compose: true,
              detail: { name: 'yp-update-points-for-post', data: { postId: notification.AcActivities[0].Post.id } }
            })
          );
        }
      }
    }.bind(this));
  }

  _loadNewNotificationsResponse(event, detail) {
    const notifications = detail.response.notifications;

    notifications.forEach(function (notification) {
      this._removeOldIfExists(notification);
      if (notification.type=='notification.point.new') {

      }
    }.bind(this));

    notifications.forEach(function (notification) {
      this.unshift('notifications', notification);
    }.bind(this));

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
      var duration = Date.now() - this.lastFetchStartedAt;
      if (duration>1000) {
        console.warn("Setting notificationGetTTL = 60000");
        this.notificationGetTTL = 60000;
      } else if (duration>10000) {
        console.warn("Setting notificationGetTTL = 60000*5");
        this.notificationGetTTL = 60000*5;
      }
    }
  }

  _removeOldIfExists(notification) {
    this.notifications.forEach(function (oldNotification, index) {
      if (oldNotification.id==notification.id) {
        this.splice('notifications', index, 1);
      }
    }.bind(this));
  }

  _getNotificationText(notification) {
    let ideaName, object;
    if (notification.AcActivities[0].Post) {
      ideaName = this.truncate(notification.AcActivities[0].Post.name, 30) + ": ";
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
      if (notification.AcActivities[0].Point.value>0) {
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

  _displayToast(notifications) {
    const notMyNotifications = __.reject(notifications, function (notification) {
      const activityUser = notification.AcActivities[0].User;
      return !(window.appUser.user && activityUser && window.appUser.user.id != activityUser.id) &&
             !notification.type==='notification.generalUserNotification';
    });

    if (notMyNotifications.length>0) {
      const activityUser = notMyNotifications[0].AcActivities[0].User;
      dom(document).querySelector('yp-app').getDialogAsync("notificationToast", function (dialog) {
        dialog.open(activityUser, this._getNotificationText(notMyNotifications[0]), notMyNotifications[0].type==='notification.generalUserNotification');
      }.bind(this));
    }
  }

  _finalizeAfterResponse(notifications) {
    if (notifications.length>0) {
      if (!this.latestProcessedNotificationAt || this.latestProcessedNotificationAt < notifications[0].updated_at) {
        this.latestProcessedNotificationAt = notifications[0].updated_at;
      }
      this.moreToLoad = true;
    }

    this.async(function () {
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

window.customElements.define('ac-notification-list-lit', AcNotificationListLit)
