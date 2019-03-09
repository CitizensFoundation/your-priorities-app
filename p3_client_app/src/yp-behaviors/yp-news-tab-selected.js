import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.YpNewsTabSelected
 */
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
