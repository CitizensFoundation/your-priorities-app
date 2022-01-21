import '@polymer/polymer/polymer-legacy.js';

/** @polymerBehavior Polymer.ypCardMouseBehavior */
export const ypCardMouseBehavior = {

  cardMouseOver: function (event) {
    event.currentTarget.elevation = 5;
  },

  cardMouseOut: function (event) {
    event.currentTarget.elevation = 1;
  }
};
