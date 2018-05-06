import '../../../../@polymer/polymer/polymer.js';

export const ypNumberFormatBehavior = {

  formatNumber: function (value) {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0";
    }
  }
};
