import '../../../../@polymer/polymer/polymer.js';

export const LargeCardBehaviors = {

  properties: {
    editMenuAlign: {
      type: String,
      computed: '_getEditMenuAlignment(narrowScreen)'
    },

    narrowScreen: Boolean
  },

  _getEditMenuAlignment: function (narrow) {
    if (narrow) {
      return 'right';
    } else {
      return 'left'
    }
  },

  lowerCardLater: function () {
    this.async(function () {
      this.setElevation(3);
    }, 2500);
  },

  setElevation: function (value) {
    var card = this.$$('#card');
    if (card)
      card.elevation = value;
  },

  ready: function () {
    this.lowerCardLater();
  }
};
