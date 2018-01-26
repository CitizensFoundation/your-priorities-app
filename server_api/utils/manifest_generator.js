var models = require("../models");
var _ = require("lodash");
var async = require('async');
var icons = [];
var manifest = {
  "display": "standalone",
  "start_url": "/?utm_source=homescreen",
  "theme_color": "#103458",
  "background_color": "#cfd8dc"
};

var setupIconsFromDefault = function(callback) {
  icons = [
    {
      "src": "/images/manifest_yp/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/manifest_yp/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ];
  callback();
};

var setupIconsFromImage = function (imageId, callback) {

  models.Image.find({
    where: {
      id: imageId
    }
  }).then(function (image) {
    if (!image) {
      callback("generateManifest: Can't find image from imageId")
    } else {
      var formats = JSON.parse(image.formats);
      [192,180,152,144,96,48].forEach(function (size, index) {
        var stringSize = size.toString();
        icons.push({
          "src": formats[index],
          "type": "image/png",
          "sizes": stringSize+"x"+stringSize
        });
      });
      callback();
    }
  }).catch(function (error) {
    callback(error);
  });
};

var generateManifest = function(req, res) {
  var shortName, name;

  var domainId = req.ypDomain.id;

  async.series([
    function (seriesCallback) {
      if (req.ypCommunity && req.ypCommunity.configuration &&
        req.ypCommunity.configuration.appHomeScreenIconImageId) {
        setupIconsFromImage(req.ypCommunity.configuration.appHomeScreenIconImageId, seriesCallback);
      } else if (req.ypDomain && req.ypDomain.configuration &&
        req.ypDomain.configuration.appHomeScreenIconImageId) {
        setupIconsFromImage(req.ypDomain.configuration.appHomeScreenIconImageId, seriesCallback);
      } else {
        setupIconsFromDefault(seriesCallback)
      }
    }
  ], function (error) {
    if (error) {
      log.error("Error from generating manifest data", { err: error });
      res.status(500).end();
    } else {
      manifest["icons"] = icons;
      if (req.ypCommunity.id && req.ypCommunity.configuration &&
        req.ypCommunity.configuration.appHomeScreenShortName) {
        manifest['short_name'] = req.ypCommunity.configuration.appHomeScreenShortName;
      } else if (req.ypDomain && req.ypDomain.configuration &&
        req.ypDomain.configuration.appHomeScreenShortName) {
        manifest['short_name'] = req.ypDomain.configuration.appHomeScreenShortName;
      } else if (req.ypCommunity.id) {
        manifest['short_name'] = req.ypCommunity.name;
      } else {
        manifest['short_name'] = req.ypDomain.name;
      }

      if (req.ypCommunity.id) {
        manifest["name"] = req.ypCommunity.name;
      } else {
        manifest["name"] = req.ypDomain.name;
      }

      res.header('Content-Type', 'application/json');
      res.send( manifest );
    }
  });
};

module.exports = generateManifest;
