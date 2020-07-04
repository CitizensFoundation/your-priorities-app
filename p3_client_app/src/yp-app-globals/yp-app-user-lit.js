import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toast/paper-toast.js';
import '../yp-session/yp-session.js';
import '../yp-ajax/yp-ajax.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpAppUserLit extends YpBaseElement {
  static get properties() {
    return {
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

      loginForRatingsParams: {
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

      ratingPostsIndex: {
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
      pollingStartedAt: Date,

      hasIssuedLogout: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      paper-toast {
        z-index: 9999;
      }

      yp-ajax {
        margin-top: 10px;
        margin-right: 4px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-session id="session"></yp-session>

    <div class="layout horizontal center-center">
      <yp-ajax id="pollForLoginAjax" url="/api/users/loggedInUser/isloggedin" @response="${this._pollForLoginResponse}"></yp-ajax>
      <yp-ajax id="isLoggedInAjax" .method="GET" url="/api/users/loggedInUser/isloggedin" @response="${this._isLoggedInResponse}"></yp-ajax>
      <yp-ajax id="adminRightsAjax" .method="GET" url="/api/users/loggedInUser/adminRights" @response="${this._adminRightsResponse}"></yp-ajax>
      <yp-ajax id="membershipsAjax" .method="GET" url="/api/users/loggedInUser/memberships" @response="${this._membershipsResponse}"></yp-ajax>
      <yp-ajax id="logoutAjax" .method="POST" url="/api/users/logout" @response="${this._logoutResponse}"></yp-ajax>
      <yp-ajax id="setLocaleAjax" .method="PUT" url="/api/users/loggedInUser/setLocale"></yp-ajax>
    </div>

    <paper-toast id="loginToast" .text="${this.toastLoginTextCombined}"></paper-toast>
    <paper-toast id="logoutToast" .text="${this.toastLogoutTextCombined}"></paper-toast>
`
  }

/*
  behaviors: [
    AccessHelpers
  ],

  listeners: {
    'yp-forgot-password': '_forgotPassword',
    'yp-reset-password': '_resetPassword'
  },
*/

  loginForAcceptInvite(editDialog, token, email, collectionConfiguration) {
    this.loginForAcceptInviteParams = { editDialog: editDialog, token: token };
    this.openUserlogin(email, collectionConfiguration);
  }

  loginForEdit(editDialog,newOrUpdate,params,refreshFunction) {
    this.loginForEditParams = { editDialog: editDialog, newOrUpdate: newOrUpdate,
                                params: params, refreshFunction: refreshFunction };
    this.openUserlogin();
  }

  loginForNewPoint(postPointsElement, params) {
    this.loginForNewPointParams = { postPointsElement: postPointsElement, params: params };
    this.openUserlogin();
  }

  loginForEndorse(postActionElement, params) {
    this.loginForEndorseParams = { postActionElement: postActionElement, params: params };
    this.openUserlogin();
  }

  loginForRatings(postActionElement) {
    this.loginForRatingsParams = { postActionElement: postActionElement };
    this.openUserlogin();
  }

  loginForPointQuality(pointActionElement, params) {
    this.loginForPointQualityParams = { pointActionElement: pointActionElement, params: params };
    this.openUserlogin();
  }

  loginForMembership(membershipActionElement, params) {
    this.loginForMembershipParams = { membershipActionElement: membershipActionElement, params: params };
    this.openUserlogin();
  }

  loginFor401(refreshFunction) {
    this.set('loginFor401refreshFunction', refreshFunction);
    this.openUserlogin();
  }

  loginForNotificationSettings() {
    this.set('loginForNotificationSettingsParams', true);
    this.openUserlogin();
  }

  openUserlogin(email, collectionConfiguration) {
    dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
      dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
      dialog.open(null, email, collectionConfiguration);
    }.bind(this));
  }

  autoAnonymousLogin() {
    console.log("In autoAnonymousLogin 1");
    this.async(function () {
      console.log("In autoAnonymousLogin 2");
      if (this.user==null) {
        dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
          dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
          dialog.anonymousLogin();
        }.bind(this));
      } else {
        console.log("Not doing auto anon login as user already exists")
      }
    }, 1);
  }

  _closeUserLogin() {
    dom(document).querySelector('yp-app').closeDialog("userLogin");
  }

  _setUserLoginSpinner() {
    dom(document).querySelector('yp-app').getDialogAsync("userLogin", function (dialog) {
      dialog.userSpinner = false;
    });
  }

  _handleLogin(user) {
    this._closeUserLogin();
    this.setLoggedInUser(user);
    if (user.profile_data && user.profile_data.isAnonymousUser) {
      console.debug("Do not fetch admin or memberships for anonymous users");
    } else {
      this.$$("#adminRightsAjax").generateRequest();
      this.$$("#membershipsAjax").generateRequest();
      this.toastLoginTextCombined = this.t("user.loginCompleteFor")+ " " + this.user.name;
      this.$$("#loginToast").show();
    }
    this.fire("login");
    this._checkLoginForParameters();

    // Redirect to another local service after login, for example the analytics app
    this.async(function () {
      if (window.appGlobals.originalQueryParameters && window.appGlobals.originalQueryParameters['raLogin']) {
        window.location = window.appGlobals.originalQueryParameters['raLogin'];
      }
    });
  }

  _checkLoginForParameters() {
    if (this.loginForEditParams) {
      const loginParams = this.loginForEditParams;
      dom(document).querySelector('yp-app').getDialogAsync(loginParams.editDialog, function (dialog) {
        dialog.setup(null, true, loginParams.refreshFunction);
        dialog.open('new', loginParams.params);
        this.loginForEditParams = null;
      }.bind(this));
    } else if (this.loginForNewPointParams) {
      const newPointParams = this.loginForNewPointParams;
      newPointParams.postPointsElement.addPoint(newPointParams.params.content, newPointParams.params.value);
      this.loginForNewPointParams = null;
    } else if (this.loginForEndorseParams) {
      const endorseParams = this.loginForEndorseParams;
      endorseParams.postActionElement.generateEndorsementFromLogin(endorseParams.params.value);
      this.loginForEndorseParams = null;
    } else if (this.loginForRatingsParams) {
      var ratingsParams = this.loginForRatingsParams;
      ratingsParams.postActionElement.openRatingsDialog();
      this.loginForRatingsParams = null;
    } else if (this.loginForPointQualityParams) {
      const pointQualityParams = this.loginForPointQualityParams;
      pointQualityParams.pointActionElement.generatePointQualityFromLogin(pointQualityParams.params.value);
      this.loginForPointQualityParams = null;
    } else if (this.loginForMembershipParams) {
      const membershipParams = this.loginForMembershipParams;
      membershipParams.membershipActionElement.generateMembershipFromLogin(membershipParams.params.value);
      this.loginForMembershipParams = null;
    } else if (this.loginForAcceptInviteParams) {
      const acceptInviteParams = this.loginForAcceptInviteParams;
      dom(document).querySelector('yp-app').getDialogAsync("acceptInvite", function (dialog) {
        dialog.reOpen(acceptInviteParams.token);
        dialog.afterLogin(acceptInviteParams.token);
        this.loginForAcceptInviteParams = null;
      }.bind(this));
    } else if (this.loginFor401refreshFunction) {
      this.loginFor401refreshFunction();
    } else if (this.loginForNotificationSettingsParams) {
      this.openNotificationSettings();
    }
  }

  openNotificationSettings() {
    dom(document).querySelector('yp-app').getDialogAsync("userEdit", function (dialog) {
      dialog.setup(window.appUser.user, false, null, true);
      dialog.open('edit', { userId: window.appUser.user.id });
    }.bind(this));
  }

  _forgotPassword(event, detail) {
    dom(document).querySelector('yp-app').getDialogAsync("forgotPassword", function (dialog) {
      dialog.open(detail);
    }.bind(this));
  }

  _resetPassword(event, detail) {
    dom(document).querySelector('yp-app').getDialogAsync("resetPassword", function (dialog) {
      dialog.open(detail);
    });
  }

  getUser() {
    return this.$$("#session").get('user');
  }

  setLoggedInUser(user) {
    this.$$("#session").set('user', user);
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
  }

  removeAnonymousUser() {
    console.log("Remove anon user");
    this.removeUserSession();
  }

  removeUserSession() {
    this.$$("#session").unset('user');
    this.set('user', null);
    window.appGlobals.setAnonymousUser(null);
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'logged-in', data: null }
      })
    );
  }

  loggedIn() {
    const isCorrectLoginProviderAndAgency = true;
    if (window.appGlobals.currentForceSaml) {
      if (!this.checkGroupAccess(window.appGlobals.currentGroup)) {
        if (this.user) {
          if (this.user.loginProvider !== "saml")
            isCorrectLoginProviderAndAgency = false;

          if (window.appGlobals.currentGroup &&
              window.appGlobals.currentGroup.configuration &&
              window.appGlobals.currentGroup.configuration.forceSecureSamlEmployeeLogin) {
            if (!this.user.isSamlEmployee) {
              isCorrectLoginProviderAndAgency = false;
            }
          }
        } else {
          isCorrectLoginProviderAndAgency = false;
        }
      }
    }
    return this.user != null && isCorrectLoginProviderAndAgency;
  }

  logout() {
    this.hasIssuedLogout = true;
    this.$$("#logoutAjax").body = {};
    this.$$("#logoutAjax").generateRequest();
  }

  setLocale(locale) {
    this.$$("#setLocaleAjax").body = { locale: locale };
    this.$$("#setLocaleAjax").generateRequest();
  }

  connectedCallback() {
    super.connectedCallback();
    window.appUser = this;
    if (!window.location.pathname.startsWith("/survey/")) {
      this.checkLogin();
    } else {
      console.log("Not checking login in survey mode");
    }
  }

  cancelLoginPolling() {
    this.pollingStartedAt = null;
    console.log("Cancel polling");
  }

  _closeAllPopups() {
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
  }

  _pollForLoginResponse(event, detail) {
    console.log("Got polling for login response");
    if (this.pollingStartedAt) {
      const user = detail.response;
      if (user && user.notLoggedIn===true && this.pollingStartedAt) {
        let timeSpent = (new Date() - this.pollingStartedAt);
        if (timeSpent<5*60*1000) {
          this.async(function () {
            this.$$("#pollForLoginAjax").generateRequest();
          }.bind(this), 1200)
        } else {
          this.pollingStartedAt = null;
          console.error("Timeout in login polling");
        }
      } else if (user.name) {
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
  }

  startPollingForLogin() {
    this.pollingStartedAt = Date.now();
    this.async(function () {
      this.$$("#pollForLoginAjax").generateRequest();
    }, 1000);
  }

  loginFromFacebook() {
    this.cancelLoginPolling();
    this.set('lastLoginMethod', 'Facebook');
    this._completeExternalLogin(this.t('user.loggedInWithFacebook'));
  }

  loginFromSaml() {
    this.cancelLoginPolling();
    this.set('lastLoginMethod', 'Saml2');
    this._completeExternalLogin(this.t('user.loggedInWithSaml'));
  }

  _completeExternalLogin(fromString) {
    this.checkLogin();
    this._setUserLoginSpinner();
    this.set('completeExternalLoginText', fromString);
  }

  checkLogin() {
    this.$$("#isLoggedInAjax").url = "/api/users/loggedInUser/isloggedin" + "?" + (new Date()).getTime();
    this.$$("#isLoggedInAjax").generateRequest();
    this.$$("#adminRightsAjax").url = "/api/users/loggedInUser/adminRights" + "?" + (new Date()).getTime();
    this.$$("#adminRightsAjax").generateRequest();
    this.$$("#membershipsAjax").url = "/api/users/loggedInUser/memberships" + "?" + (new Date()).getTime();
    this.$$("#membershipsAjax").generateRequest();
  }

  recheckAdminRights() {
    this.$$("#adminRightsAjax").generateRequest();
  }

  updateEndorsementForPost(postId, newEndorsement) {
    if (!this.user.Endorsements) {
      this.user.Endorsements = [];
    }
    var hasChanged = false;
    for(var i=0; i<this.user.Endorsements.length; i++) {
      if (this.user.Endorsements[i].post_id===postId) {
        if (newEndorsement) {
          this.user.Endorsements[i] = newEndorsement;
        } else {
          this.user.Endorsements.splice(i, 1);
        }
        hasChanged = true;
        break;
      }
    }
    if (!hasChanged && newEndorsement)
      this.user.Endorsements.push(newEndorsement);
    this._updateEndorsementPostsIndex(this.user);
  }

  _updateEndorsementPostsIndex(user) {
    if (user && user.Endorsements && user.Endorsements.length>0) {
      this.endorsementPostsIndex = {};
      for(let i=0; i<user.Endorsements.length; i++){
        this.endorsementPostsIndex[ user.Endorsements[i].post_id ] = user.Endorsements[i];
      }
    } else {
      this.endorsementPostsIndex = {}
    }
  }

  _updateRatingPostsIndex(user) {
    if (user && user.Ratings && user.Ratings.length>0) {
      this.ratingPostsIndex = {};
      for(var i=0; i<user.Ratings.length; i++){
        if (!this.ratingPostsIndex[ user.Ratings[i].post_id ])
          this.ratingPostsIndex[ user.Ratings[i].post_id ] = {};
        this.ratingPostsIndex[ user.Ratings[i].post_id ][user.Ratings[i].type_index] = user.Ratings[i];
      }
    } else {
      this.ratingPostsIndex = {}
    }
  }

  updateRatingForPost(postId, typeIndex, newRating) {
    if (!this.user.Ratings) {
      this.user.Ratings = [];
    }

    var hasChanged = false;
    for(var i=0; i<this.user.Ratings.length; i++) {
      if (this.user.Ratings[i].post_id===postId && this.user.Ratings[i].type_index===typeIndex) {
        if (newRating) {
          this.user.Ratings[i] = newRating;
        } else {
          this.user.Ratings.splice(i, 1);
        }
        hasChanged = true;
        break;
      }
    }
    if (!hasChanged && newRating)
      this.user.Ratings.push(newRating);
    this._updateRatingPostsIndex(this.user);
  }

  updatePointQualityForPost(pointId, newPointQuality) {
    if (this.user.PointQualities) {
      let hasChanged = false;
      for(let i=0; i<this.user.PointQualities.length; i++) {
        if (this.user.PointQualities[i].point_id===pointId) {
          if (newPointQuality) {
            this.user.PointQualities[i] = newPointQuality;
          } else {
            this.user.PointQualities.splice(i, 1);
          }
          hasChanged = true;
          break;
        }
      }
      if (hasChanged)
        this._updateEndorsementPostsIndex(this.user);
    }
  }

  _updatePointQualitiesIndex(user) {
    if (user && user.PointQualities && user.PointQualities.length>0) {
      this.pointQualitiesIndex = {};
      for(let i=0; i<user.PointQualities.length; i++){
        this.pointQualitiesIndex[ user.PointQualities[i].point_id ] = user.PointQualities[i];
      }
    } else {
      this.pointQualitiesIndex = {}
    }
  }

  _onUserChanged(user) {
    this.fire("user-changed", user);
    if (user) {
      this._updateEndorsementPostsIndex(user);
      this._updatePointQualitiesIndex(user);
      this._updateRatingPostsIndex(user);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'got-endorsements-and-qualities' }
        })
      );
    }
  }

  _logoutResponse(event, detail) {
    this.toastLogoutTextCombined = this.t("user.logoutCompleteFor")+ " " + this.user.name;
    this.$$("#logoutToast").show();
    this.fire('yp-close-right-drawer');
    this.removeUserSession();
    this.recheckAdminRights();
  }

  _isLoggedInResponse(event, detail) {
    const user = detail.response;

    if (user && user.notLoggedIn===true) {
      console.info("Remove user session");
      this.removeUserSession();
    } else if (user && user.name && user.profile_data && user.profile_data.isAnonymousUser) {
      console.info("Logging in anon user");
      this.async(function () {
        console.info("Logging in anon user 2");
        if (window.appGlobals.currentAnonymousGroup) {
          this.setLoggedInUser(user);
        } else {
          window.appGlobals.setAnonymousUser(user);
        }
      }, 500);
    } else if (user && user.name) {
      this.setLoggedInUser(user);
    }

    if (user && user.missingEmail) {
      dom(document).querySelector('yp-app').getDialogAsync("missingEmail", function (dialog) {
        dialog.open(user.loginProvider);
      }.bind(this));
    } else if (user && user.profile_data &&
               user.profile_data.saml_show_confirm_email_completed===false) {
      dom(document).querySelector('yp-app').getDialogAsync("missingEmail", function (dialog) {
        dialog.open(user.loginProvider, true, user.email);
      }.bind(this));
    }

    if (user) {
      if (user.customSamlDeniedMessage) {
        window.appGlobals.currentSamlDeniedMessage = user.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (user.customSamlLoginMessage) {
        window.appGlobals.currentSamlLoginMessage = user.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }

      if (user.forceSecureSamlLogin) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
    }

    if (this.completeExternalLoginText) {
      window.appGlobals.notifyUserViaToast(this.completeExternalLoginText);
      this._closeUserLogin();
      this.set('completeExternalLoginText', null);
      this._checkLoginForParameters();
    }
  }

  _adminRightsResponse(event, detail) {
    console.debug("_adminRightsResponse 1");
    if (detail.response && detail.response!=0) {
      console.debug("_adminRightsResponse 2");
      this.set('adminRights', detail.response);
      const randomChangeSignal = Math.floor(Math.random() * 10) + 1;
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
  }

  _updateMembershipsIndex(memberships) {
    if (memberships) {
      let i;
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
  }

  _membershipsResponse(event, detail) {
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
}

window.customElements.define('yp-app-user-lit', YpAppUserLit)
