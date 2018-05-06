import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/paper-toast/paper-toast.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-session/yp-session.js';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      paper-toast {
        z-index: 9999;
      }
    </style>

    <yp-session id="session"></yp-session>

    <div class="layout horizontal center-center">
      <yp-ajax id="pollForLoginAjax" url="/api/users/loggedInUser/isloggedin" on-response="_pollForLoginResponse"></yp-ajax>
      <yp-ajax id="isLoggedInAjax" method="GET" url="/api/users/loggedInUser/isloggedin" on-response="_isLoggedInResponse"></yp-ajax>
      <yp-ajax id="adminRightsAjax" method="GET" url="/api/users/loggedInUser/adminRights" on-response="_adminRightsResponse"></yp-ajax>
      <yp-ajax id="membershipsAjax" method="GET" url="/api/users/loggedInUser/memberships" on-response="_membershipsResponse"></yp-ajax>
      <yp-ajax id="logoutAjax" method="POST" url="/api/users/logout" on-response="_logoutResponse"></yp-ajax>
      <yp-ajax id="setLocaleAjax" method="PUT" url="/api/users/loggedInUser/setLocale"></yp-ajax>
    </div>

    <paper-toast id="loginToast" text="[[toastLoginTextCombined]]"></paper-toast>
    <paper-toast id="logoutToast" text="[[toastLogoutTextCombined]]"></paper-toast>
`,

  is: 'yp-app-user',

  behaviors: [
    ypLanguageBehavior
  ],

  listeners: {
    'yp-forgot-password': '_forgotPassword',
    'yp-reset-password': '_resetPassword'
  },

  properties: {

    loginForAcceptInviteParams: Object,

    loginForEditParams: {
      type: Object
    },

    loginForNewPointParams: {
      type: Object
    },

    loginForEndorseParams: {
      type: Object
    },

    loginForPointQualityParams: {
      type: Object
    },

    loginForMembershipParams: {
      type: Object
    },

    loginFor401refreshFunction: {
      type: Function,
      value: null
    },

    loginForNotificationSettingsParams: {
      type: Boolean,
      value: false
    },

    toastLoginTextCombined: {
      type: String
    },

    toastLogoutTextCombined: {
      type: String
    },

    user: {
      type: Object,
      observer: "_onUserChanged"
    },

    endorsementPostsIndex: {
      type: Object
    },

    membershipsIndex: {
      type: Object
    },

    pointQualitiesIndex: {
      type: Object
    },

    adminRights: {
      type: Object
    },

    memberships: {
      type: Object
    },

    completeExternalLoginText: {
      type: String,
      value: null
    },

    isPollingForLogin: {
      type: Boolean,
      value: false
    },

    lastLoginMethod: String,
    facebookPopupWindow: Object,
    samlPopupWindow: Object,
    pollingStartedAt: Date
  },

  loginForAcceptInvite: function(editDialog, token, email) {
    this.loginForAcceptInviteParams = { editDialog: editDialog, token: token };
    this.openUserlogin(email);
  },

  loginForEdit: function(editDialog,newOrUpdate,params,refreshFunction) {
    this.loginForEditParams = { editDialog: editDialog, newOrUpdate: newOrUpdate,
                                params: params, refreshFunction: refreshFunction };
    this.openUserlogin();
  },

  loginForNewPoint: function(postPointsElement, params) {
    this.loginForNewPointParams = { postPointsElement: postPointsElement, params: params };
    this.openUserlogin();
  },

  loginForEndorse: function(postActionElement, params) {
    this.loginForEndorseParams = { postActionElement: postActionElement, params: params };
    this.openUserlogin();
  },

  loginForPointQuality: function(pointActionElement, params) {
    this.loginForPointQualityParams = { pointActionElement: pointActionElement, params: params };
    this.openUserlogin();
  },

  loginForMembership: function(membershipActionElement, params) {
    this.loginForMembershipParams = { membershipActionElement: membershipActionElement, params: params };
    this.openUserlogin();
  },

  loginFor401: function (refreshFunction) {
    this.set('loginFor401refreshFunction', refreshFunction);
    this.openUserlogin();
  },

  loginForNotificationSettings: function () {
    this.set('loginForNotificationSettingsParams', true);
    this.openUserlogin();
  },

  openUserlogin: function (email) {
    dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
      dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
      dialog.open(null, email);
    }.bind(this));
  },

  autoAnonymousLogin: function () {
    dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
      dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
      dialog.anonymousLogin();
    }.bind(this));
  },

  _closeUserLogin: function () {
    dom(document).querySelector('yp-app').closeDialog("userLogin");
  },

  _setUserLoginSpinner: function () {
    dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
      dialog.userSpinner = false;
    });
  },

  _handleLogin: function (user) {
    this._closeUserLogin();
    this.setLoggedInUser(user);
    if (user.profile_data && user.profile_data.isAnonymousUser) {
      console.debug("Do not fetch admin or memberships for anonymous users");
    } else {
      this.$.adminRightsAjax.generateRequest();
      this.$.membershipsAjax.generateRequest();
      this.toastLoginTextCombined = this.t("user.loginCompleteFor")+ " " + this.user.name;
      this.$.loginToast.show();
    }
    this.fire("login");
    this._checkLoginForParameters();
  },

  _checkLoginForParameters: function () {
    if (this.loginForEditParams) {
      var loginParams = this.loginForEditParams;
      dom(document).querySelector('yp-app').getDialogAsync(loginParams.editDialog, function (dialog) {
        dialog.setup(null, true, loginParams.refreshFunction);
        dialog.open('new', loginParams.params);
        this.loginForEditParams = null;
      }.bind(this));
    } else if (this.loginForNewPointParams) {
      var newPointParams = this.loginForNewPointParams;
      newPointParams.postPointsElement.addPoint(newPointParams.params.content, newPointParams.params.value);
      this.loginForNewPointParams = null;
    } else if (this.loginForEndorseParams) {
      var endorseParams = this.loginForEndorseParams;
      endorseParams.postActionElement.generateEndorsementFromLogin(endorseParams.params.value);
      this.loginForEndorseParams = null;
    } else if (this.loginForPointQualityParams) {
      var pointQualityParams = this.loginForPointQualityParams;
      pointQualityParams.pointActionElement.generatePointQualityFromLogin(pointQualityParams.params.value);
      this.loginForPointQualityParams = null;
    } else if (this.loginForMembershipParams) {
      var membershipParams = this.loginForMembershipParams;
      membershipParams.membershipActionElement.generateMembershipFromLogin(membershipParams.params.value);
      this.loginForMembershipParams = null;
    } else if (this.loginForAcceptInviteParams) {
      var acceptInviteParams = this.loginForAcceptInviteParams;
      dom(document).querySelector('yp-app').getDialogAsync("acceptInvite", function (dialog) {
        dialog.open(acceptInviteParams.token);
        dialog.afterLogin(acceptInviteParams.token);
        this.loginForAcceptInviteParams = null;
      }.bind(this));
    } else if (this.loginFor401refreshFunction) {
      this.loginFor401refreshFunction();
    } else if (this.loginForNotificationSettingsParams) {
      this.openNotificationSettings();
    }
  },

  openNotificationSettings: function () {
    dom(document).querySelector('yp-app').getDialogAsync("userEdit", function (dialog) {
      dialog.setup(window.appUser.user, false, null, true);
      dialog.open('edit', { userId: window.appUser.user.id });
    }.bind(this));
  },

  _forgotPassword: function (event, detail) {
    dom(document).querySelector('yp-app').getDialogAsync("forgotPassword", function (dialog) {
      dialog.open(detail);
    }.bind(this));
  },

  _resetPassword: function (event, detail) {
    dom(document).querySelector('yp-app').getDialogAsync("resetPassword", function (dialog) {
      dialog.open(detail);
    });
  },

  getUser: function () {
    return this.$.session.get('user');
  },

  setLoggedInUser: function (user) {
    this.$.session.set('user', user);
    this.set('user', user);

    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'logged-in', data: this.user }
      })
    );

    // TODO: Look at this. Fire another signal a bit later in case some components had not set up their listeners
    this.async(function () {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: {name: 'logged-in', data: this.user }
        })
      );
    }, 1000);

    window.appGlobals.sendLoginAndSignupToAnalytics(user.id, "Login Success", this.lastLoginMethod ? this.lastLoginMethod : 'Email');
    this.set('lastLoginMethod', null);
    if (user && user.profile_data && user.profile_data.isAnonymousUser) {
      window.appGlobals.setAnonymousUser(user);
    } else {
      window.appGlobals.setAnonymousUser(null);
    }
  },

  removeAnonymousUser: function () {
    this.removeUserSession();
  },

  removeUserSession: function () {
    this.$.session.unset('user');
    this.set('user', null);
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'logged-in', data: null }
      })
    );
  },

  loggedIn: function () {
    return this.user!=null;
  },

  logout: function () {
    this.$.logoutAjax.body = {};
    this.$.logoutAjax.generateRequest();
  },

  setLocale: function (locale) {
    this.$.setLocaleAjax.body = { locale: locale };
    this.$.setLocaleAjax.generateRequest();
  },

  ready: function () {
    window.appUser = this;
    this.checkLogin();
  },

  cancelLoginPolling: function () {
    this.pollingStartedAt = null;
    console.log("Cancel polling");
  },

  _closeAllPopups: function () {
    if (this.facebookPopupWindow) {
      try {
        this.facebookPopupWindow.close();
      } catch (error) {
        console.error(error);
      }
      this.facebookPopupWindow = null;
    }
    if (this.samlPopupWindow) {
      try {
        this.samlPopupWindow.close();
      } catch (error) {
        console.error(error);
      }
      this.samlPopupWindow = null;
    }
  },

  _pollForLoginResponse: function (event, detail) {
    console.log("Got polling for login response");
    if (this.pollingStartedAt) {
      if (detail.response===0 && this.pollingStartedAt) {
        var timeSpent = (new Date() - this.pollingStartedAt);
        if (timeSpent<1*60*1000) {
          this.async(function () {
            this.$.pollForLoginAjax.generateRequest();
          }.bind(this), 1500)
        } else {
          this.pollingStartedAt = null;
          console.error("Timeout in login polling");
        }
      } else if (detail.response.name) {
        this.cancelLoginPolling();
        if (this.facebookPopupWindow) {
          this.loginFromFacebook();
        } else if (this.samlPopupWindow) {
          this.loginFromSaml();
        }
        this._closeAllPopups();
      }
    } else {
      console.error("Unkown state in polling...");
      this._closeAllPopups();
      this.cancelLoginPolling();
    }
  },

  startPollingForLogin: function () {
    this.pollingStartedAt = Date.now();
    this.async(function () {
      this.$.pollForLoginAjax.generateRequest();
    }, 1000);
  },

  loginFromFacebook: function () {
    this.cancelLoginPolling();
    this.set('lastLoginMethod', 'Facebook');
    this._completeExternalLogin(this.t('user.loggedInWithFacebook'));
  },

  loginFromSaml: function () {
    this.cancelLoginPolling();
    this.set('lastLoginMethod', 'Saml2');
    this._completeExternalLogin(this.t('user.loggedInWithSaml'));
  },

  _completeExternalLogin: function (fromString) {
    this.checkLogin();
    this._setUserLoginSpinner();
    this.set('completeExternalLoginText', fromString);
  },

  checkLogin: function () {
    this.$.isLoggedInAjax.url = "/api/users/loggedInUser/isloggedin" + "?" + (new Date()).getTime();
    this.$.isLoggedInAjax.generateRequest();
    this.$.adminRightsAjax.url = "/api/users/loggedInUser/adminRights" + "?" + (new Date()).getTime();
    this.$.adminRightsAjax.generateRequest();
    this.$.membershipsAjax.url = "/api/users/loggedInUser/memberships" + "?" + (new Date()).getTime();
    this.$.membershipsAjax.generateRequest();
  },

  recheckAdminRights: function () {
    this.$.adminRightsAjax.generateRequest();
  },

  updateEndorsementForPost: function (postId, newEndorsement) {
    if (this.user.Endorsements) {
      var hasChanged = false;
      for(var i=0; i<this.user.Endorsements.length; i++) {
        if (this.user.Endorsements[i].post_id===postId) {
          if (newEndorsement) {
            this.user.Endorsements[i] = newEndorsement;
          } else {
            this.user.Endorsements[i].splice(i, 1);
          }
          hasChanged = true;
          break;
        }
      }
      if (hasChanged)
        this._updateEndorsementPostsIndex(this.user);
    }
  },

  _updateEndorsementPostsIndex: function (user) {
    if (user && user.Endorsements && user.Endorsements.length>0) {
      this.endorsementPostsIndex = {};
      for(var i=0; i<user.Endorsements.length; i++){
        this.endorsementPostsIndex[ user.Endorsements[i].post_id ] = user.Endorsements[i];
      }
    } else {
      this.endorsementPostsIndex = {}
    }
  },

  updatePointQualityForPost: function (pointId, newPointQuality) {
    if (this.user.PointQualities) {
      var hasChanged = false;
      for(var i=0; i<this.user.PointQualities.length; i++) {
        if (this.user.PointQualities[i].point_id===pointId) {
          if (newPointQuality) {
            this.user.PointQualities[i] = newPointQuality;
          } else {
            this.user.PointQualities[i].splice(i, 1);
          }
          hasChanged = true;
          break;
        }
      }
      if (hasChanged)
        this._updateEndorsementPostsIndex(this.user);
    }
  },

  _updatePointQualitiesIndex: function (user) {
    if (user && user.PointQualities && user.PointQualities.length>0) {
      this.pointQualitiesIndex = {};
      for(var i=0; i<user.PointQualities.length; i++){
        this.pointQualitiesIndex[ user.PointQualities[i].point_id ] = user.PointQualities[i];
      }
    } else {
      this.pointQualitiesIndex = {}
    }
  },

  _onUserChanged: function (newValue, oldValue) {
    this.fire("user-changed", newValue);
    if (newValue) {
      this._updateEndorsementPostsIndex(newValue);
      this._updatePointQualitiesIndex(newValue);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-endorsements-and-qualities' }
        })
      );
    }
  },

  _logoutResponse: function (event, detail) {
    this.toastLogoutTextCombined = this.t("user.logoutCompleteFor")+ " " + this.user.name;
    this.$.logoutToast.show();
    this.fire('yp-close-right-drawer');
    this.removeUserSession();
  },

  _isLoggedInResponse: function(event, detail) {
    var user = detail.response;
    if (user===0) {
      this.removeUserSession();
    } else if (user.name && user.profile_data && user.profile_data.isAnonymousUser) {
      this.async(function () {
        if (window.appGlobals.currentAnonymousGroup) {
          this.setLoggedInUser(user);
        } else {
          window.appGlobals.setAnonymousUser(user);
        }
      }, 300);
    } else if (user.name) {
      this.setLoggedInUser(user);
    }
    if (user.missingEmail) {
      dom(document).querySelector('yp-app').getDialogAsync("missingEmail", function (dialog) {
        dialog.open(user.loginProvider);
      }.bind(this));
    }

    if (this.completeExternalLoginText) {
      window.appGlobals.notifyUserViaToast(this.completeExternalLoginText);
      this._closeUserLogin();
      this.set('completeExternalLoginText', null);
      this._checkLoginForParameters();
    }
  },

  _adminRightsResponse: function (event, detail) {
    console.debug("_adminRightsResponse 1");
    if (detail.response && detail.response!=0) {
      console.debug("_adminRightsResponse 2");
      this.set('adminRights', detail.response);
      var randomChangeSignal = Math.floor(Math.random() * 10) + 1;
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-admin-rights', data: randomChangeSignal }
        })
      );

      // Fire another signal a bit later in case some components had not set up their listeners TODO: Find a better way
      this.async(function () {
        document.dispatchEvent(
          new CustomEvent("lite-signal", {
            bubbles: true,
            compose: true,
            detail: { name: 'got-admin-rights', data: randomChangeSignal }
          })
        )}, 1000);
    } else {
      this.set('adminRights', null);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-admin-rights', data: false }
        })
      );
    }
  },

  _updateMembershipsIndex: function (memberships) {
    if (memberships) {
      var i;
      this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
      for(i=0; i<memberships.GroupUsers.length; i++){
        this.membershipsIndex.groups[ memberships.GroupUsers[i].id ] = true;
      }
      for(i=0; i<memberships.CommunityUsers.length; i++){
        this.membershipsIndex.communities[memberships.CommunityUsers[i].id] = true;
      }
      for(i=0; i<memberships.DomainUsers.length; i++){
        this.membershipsIndex.domains[ memberships.DomainUsers[i].id ] = true;
      }
    } else {
      this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
    }
  },

  _membershipsResponse: function (event, detail) {
    if (detail.response && detail.response!=0) {
      this.set('memberships', detail.response);
      this._updateMembershipsIndex(this.memberships);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-memberships' }
        })
      );
    } else {
      this.set('memberships', null);
      this._updateMembershipsIndex(this.memberships);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-memberships' }
        })
      );
    }
  }
});
