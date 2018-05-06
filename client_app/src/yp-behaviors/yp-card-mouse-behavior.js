import '../../../../@polymer/polymer/polymer.js';

export const ypCardMouseBehavior = {

  cardMouseOver: function (event) {
    event.currentTarget.elevation = 5;
  },

  cardMouseOut: function (event) {
    event.currentTarget.elevation = 1;
  }
};
