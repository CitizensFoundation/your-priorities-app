import '../../../../@polymer/polymer/polymer.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
/* From https://raw.githubusercontent.com/x-element/app-session/ */
Polymer({
  _template: `

`,

  is: 'yp-session',

  properties: {
    prefix: {
      type: String,
      value: 'session_',
      readOnly: true
    },
    storage: {
      type: Object,
      value: function () {
        return window.localStorage;
      }
    }
  },

  has: function (key) {
    var prefixed_key = this.prefix + key;
    var value = this.storage.getItem(prefixed_key);
    return value !== null;
  },

  get: function (key) {
    var prefixed_key = this.prefix + key;
    var value = this.storage.getItem(prefixed_key);
    var parsed;
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      parsed = null;
    }
    return parsed;
  },

  set: function (key, value) {
    var prefixed_key = this.prefix + key;
    var stringfied = JSON.stringify(value);
    this.storage.setItem(prefixed_key, stringfied);
  },

  unset: function (key) {
    var prefixed_key = this.prefix + key;
    this.storage.removeItem(prefixed_key);
  },

  clear: function () {
    this.storage.clear();
  }
});
