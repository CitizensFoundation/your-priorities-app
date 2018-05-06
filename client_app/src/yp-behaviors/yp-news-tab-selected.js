import '../../../../@polymer/polymer/polymer.js';

export const YpNewsTabSelected = {

  properties: {

    newsTabSelected: {
      value: Boolean,
      computed: '_newsTabSelected(selectedTab)'
    }
  },

  _newsTabSelected: function (tab) {
    return tab=='news';
  }
};
