import '../../../../@polymer/polymer/polymer.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../../../../@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import '../yp-user/yp-user-info.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import './ac-notification-list-post.js';
import './ac-notification-list-point.js';
import './ac-notification-list-general-item.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        margin: 0;
        height: 100vh;
      }

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
        outline: none;
      }
    </style>
      <iron-scroll-threshold lower-threshold="300" on-lower-threshold="_loadMoreData" id="threshold">
        <template is="dom-if" if="[[opened]]">
          <div elevation="2" id="material">
            <template is="dom-if" if="[[user]]">
              <yp-user-info on-open-user-edit="_openEdit" user="{{user}}"></yp-user-info>
              <div class="notificationHeader layout horizontal center-center">
                [[t('notifications')]]
              </div>
              <div hidden\$="[[!unViewedCount]]" class="unViewedCount layout vertical center-center">
                <div>[[unViewedCount]] [[t('unviewed')]]</div>
                <paper-button on-tap="_markAllAsViewed">[[t('notificationMarkAllViewed')]]</paper-button>
              </div>

              <iron-list id="list" items="[[notifications]]" scroll-offset="300" as="notification" scroll-target="threshold">
                <template>
                  <div tabindex\$="[[tabIndex]]" class="layout vertical">
                    <template is="dom-if" if="[[_notificationType(notification, 'postNotification')]]">
                      <ac-notification-list-post class="notificationItem" notification="[[notification]]"></ac-notification-list-post>
                    </template>
                    <template is="dom-if" if="[[_notificationType(notification, 'pointNotification')]]">
                      <ac-notification-list-point class="notificationItem" notification="[[notification]]"></ac-notification-list-point>
                    </template>
                    <template is="dom-if" if="[[_notificationType(notification, 'notification.post.status.change')]]">
                      <ac-notification-list-general-item icon="language" notification="[[notification]]"></ac-notification-list-general-item>
                    </template>
                    <template is="dom-if" if="[[_notificationType(notification, 'notification.point.newsStory')]]">
                      <ac-notification-list-general-item icon="face" notification="[[notification]]" short-text="[[notification.AcActivities.0.Point.content]]">
                      </ac-notification-list-general-item>
                    </template>
                    <template is="dom-if" if="[[_notificationType(notification, 'notification.point.comment')]]">
                      <ac-notification-list-general-item icon="chat-bubble-outline" notification="[[notification]]" short-text="[[notification.AcActivities.0.Point.content]]"></ac-notification-list-general-item>
                    </template>
                  </div>
                </template>
              </iron-list>
            </template>
          </div>
        </template>
      </iron-scroll-threshold>

    <div class="layout horizontal center-center" hidden="">
      <yp-ajax id="loadNotificationsAjax" on-response="_loadNotificationsResponse"></yp-ajax>
      <yp-ajax id="loadNewNotificationsAjax" dispatch-error="" on-error="_newNotificationsError" on-response="_loadNewNotificationsResponse"></yp-ajax>
      <yp-ajax id="setAsViewedAjax" method="PUT" url="/api/notifications/setIdsViewed" on-response="_setAsViewedResponse"></yp-ajax>
      <yp-ajax id="markAllAsViewedAjax" method="PUT" url="/api/notifications/markAllViewed" on-response="_setAsMarkAllViewedResponse"></yp-ajax>
    </div>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
    <lite-signal on-lite-signal-yp-refresh-activities-scroll-threshold="_clearScrollThreshold"></lite-signal>
`,

  is: 'ac-notification-list',

  behaviors: [
    ypLanguageBehavior,
    ypLoggedInUserBehavior,
    ypTruncateBehavior
  ],

  properties: {

    notifications: Array,

    notificationGetTTL: {
      type: Number,
      value: 15000
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
  },

  _openedChanged: function (open) {
    if (open) {
      this.async(function () {
        this.markCurrentAsViewed();
      }.bind(this), 25);
    }
  },

  _openEdit: function () {
    dom(document).querySelector('yp-app').getDialogAsync("userEdit", function (dialog) {
      dialog.setup(this.user, false, null);
      dialog.open('edit', {userId: this.user.id});
    }.bind(this));
  },

  _clearScrollThreshold: function () {
    this.$$("#threshold").clearTriggers();
    console.info("Clearing scrolling triggers for notifications");
  },

  _markAllAsViewed: function () {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('notificationConfirmMarkAllViewed'), this._reallyMarkAllAsViewed.bind(this));
    }.bind(this));
  },

  _reallyMarkAllAsViewed: function () {
    this.$.markAllAsViewedAjax.body = {};
    this.$.markAllAsViewedAjax.generateRequest();
  },

  _handleUnViewedCount: function (unViewedCount) {
    this.set('unViewedCount', unViewedCount);
    this.fire('yp-set-number-of-un-viewed-notifications', { count: unViewedCount })
  },

  markCurrentAsViewed: function () {
    this._markAsViewed(this.notifications);
  },

  _markAsViewed: function (notifications) {
    var marked = [];
    if (notifications) {
      notifications.forEach(function (notification) {
        if (!notification.viewed) {
          marked.push(notification.id);
        }
      });
    }
    if (marked.length>0) {
      this.$.setAsViewedAjax.body = { viewedIds: marked };
      this.$.setAsViewedAjax.generateRequest();
    }
  },

  _setAsViewedResponse: function (event, detail) {
    this._handleUnViewedCount(detail.response.unViewedCount);
    var viewedIds =  detail.response.viewedIds;
    if (this.notifications) {
      this.notifications.forEach(function (notification, index, theArray) {
        if (viewedIds.indexOf(notification.id) > -1) {
          theArray[index].viewed = true;
        }
      });
    }
  },

  _setAsMarkAllViewedResponse: function (event, detail) {
    this._handleUnViewedCount(0);
    this._setAllLocalCurrentAsViewed();
  },

  _setAllLocalCurrentAsViewed: function () {
    if (this.notifications) {
      this.notifications.forEach(function (notification, index, theArray) {
        theArray[index].viewed = true;
      });
    }
  },

  _newNotificationsError: function (event, detail) {
    console.error("Error in getting new notifications");
    this.cancelTimer();

    if (detail && detail.status && detail.status==401) {
      window.appUser.checkLogin();
    }
  },

  _userChanged: function (user) {
    if (user) {
      if (user.profile_data && user.profile_data.isAnonymousUser) {
        this.cancelTimer();
      } else {
        this.$.loadNotificationsAjax.url = this.url;
        this.$.loadNotificationsAjax.generateRequest();
      }
    } else {
      this.cancelTimer();
    }
  },

  _loggedInUserChanged: function (user) {
    if (!user) {
      this.cancelTimer();
    }
  },

  cancelTimer: function () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.set('timer', null);
    }
  },

  _notificationType: function (notification, type) {
    if (notification.type==type) {
      return true;
    } else if (type=='postNotification') {
      return (['notification.post.new', 'notification.post.endorsement'].indexOf(notification.type) > -1)
    } else if (type=='pointNotification') {
      return (['notification.point.new', 'notification.point.quality'].indexOf(notification.type) > -1)
    } else if (type=='system') {
      return false;
    }
  },

  _loadNotificationsResponse: function (event, detail) {
    var notifications = detail.response.notifications;

    if (detail.response.oldestProcessedNotificationAt) {
      this.set('oldestProcessedNotificationAt', detail.response.oldestProcessedNotificationAt);
    }

    if (!this.notifications) {
      this.set('notifications', notifications);
    } else {
      notifications.forEach(function (notification) {
        this.push('notifications', notification);
      }.bind(this));
    }

    this._finalizeAfterResponse(notifications);

    if (this.firstReponse) {
      this.set('firstReponse', false);
      this.loadNewData();
    } else {
      if (this.opened) {
        this._markAsViewed(notifications);
      }
    }

    this._handleUnViewedCount(detail.response.unViewedCount);
  },

  _startTimer: function () {
    this.cancelTimer();
    if (this.user) {
      this.timer = this.async(function () {
        this.loadNewData();
      }.bind(this), this.notificationGetTTL)
      console.log("notifications: have started timer with delay");
    }
  },

  _sendReloadPointsEvents: function (notifications) {
    notifications.forEach(function (notification) {
      if (notification.type=='notification.point.new') {
        var activityUser = notification.AcActivities[0].User;
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
  },

  _loadNewNotificationsResponse: function (event, detail) {
    var notifications = detail.response.notifications;

    console.log("Found "+notifications.length+" new notifications");

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
  },

  _removeOldIfExists: function (notification) {
    this.notifications.forEach(function (oldNotification, index) {
      if (oldNotification.id==notification.id) {
        this.splice('notifications', index, 1);
      }
    }.bind(this));
  },

  _getNotificationText: function (notification) {
    var ideaName;
    if (notification.AcActivities[0].Post) {
      ideaName = this.truncate(notification.AcActivities[0].Post.name, 30) + ": ";
    }
    if (notification.type=='notification.post.new') {
      return ideaName+this.t('post.new');
    } else if (notification.type=='notification.post.endorsement') {
      if (notification.AcActivities[0].type=='activity.post.endorsement.new') {
        return ideaName+this.t('endorsedYourPost');
      } else {
        return ideaName+this.t('opposedYourPost');
      }
    } else if (notification.type=='notification.point.new') {
      if (notification.AcActivities[0].Point.value>0) {
        return ideaName+this.t('point.forAdded');
      } else {
        return ideaName+this.t('point.againstAdded');
      }
    } else if (notification.type=='notification.point.quality') {
      if (notification.AcActivities[0].type=='activity.point.helpful.new') {
        return ideaName+this.t('upVotedPoint');
      } else {
        return ideaName+this.t('downVotedPoint');
      }
    }
  },

  _displayToast: function (notifications) {
    var notMyNotifications = __.reject(notifications, function (notification) {
      var activityUser = notification.AcActivities[0].User;
      return !(window.appUser.user && activityUser && window.appUser.user.id != activityUser.id);
    });

    if (notMyNotifications.length>0) {
      var activityUser = notMyNotifications[0].AcActivities[0].User;
      dom(document).querySelector('yp-app').getDialogAsync("notificationToast", function (dialog) {
        dialog.open(activityUser, this._getNotificationText(notMyNotifications[0]));
      }.bind(this));
    }
  },

  _finalizeAfterResponse: function (notifications) {
    if (notifications.length>0) {
      if (!this.latestProcessedNotificationAt || this.latestProcessedNotificationAt < notifications[0].updated_at) {
        this.set('latestProcessedNotificationAt', notifications[0].updated_at);
      }
      this.set('moreToLoad', true);
    }

    this.async(function () {
      if (this.$$("#list")) {
        this.$$("#list").fire('iron-resize');
      }
    }, 100);
  },

  _loadMoreData: function () {
    this._clearScrollThreshold();
    if (this.oldestProcessedNotificationAt) {
      this.set('moreToLoad', false);
      this.$.loadNotificationsAjax.url = this.url + '?beforeDate='+this.oldestProcessedNotificationAt;
      this.$.loadNotificationsAjax.generateRequest();
    }
  },

  loadNewData: function () {
    if (this.latestProcessedNotificationAt) {
      this.$.loadNewNotificationsAjax.url = this.url + '?afterDate='+this.latestProcessedNotificationAt;
      this.$.loadNewNotificationsAjax.generateRequest();
    } else if (!this.latestProcessedNotificationAt) {
      this.$.loadNewNotificationsAjax.url = this.url;
      this.$.loadNewNotificationsAjax.generateRequest();
    }
  }
});
