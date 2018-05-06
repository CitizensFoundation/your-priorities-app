import '../../../../@polymer/polymer/polymer.js';

export const ypLoggedInUserBehavior = {

  properties: {
    loggedInUser: {
      type: Object,
      notify: true,
      value: null,
      observer: '_loggedInUserChanged'
    }
  },

  listeners: {
    'yp-user-is-logged-in': '_userLoggedIn'
  },

  _loggedInUserChanged: function () {},

  ready: function () {
    if (window.appUser && window.appUser.user) {
      this.set('loggedInUser', window.appUser.user);
    }
  },

  _userLoggedIn: function (event, detail) {
    this.set('loggedInUser', detail);
  }
};
