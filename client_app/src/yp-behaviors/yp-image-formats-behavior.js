import '../../../../@polymer/polymer/polymer.js';

export const ypImageFormatsBehavior = {
  getImageFormatUrl: function(images, formatId) {
    if (images && images.length>0) {
      var formats = JSON.parse(images[images.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  }
};
