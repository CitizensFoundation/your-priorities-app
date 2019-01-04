let express = require('express');
let router = express.Router();
let log = require('../utils/logger');
let toJson = require('../utils/to_json');
let path = require('path');
let fs = require('fs');

let replaceForBetterReykjavik = function (data) {
  data = data.replace(/XappNameX/g, "Betri Reykjavík");
  return data.replace(/XdescriptionX/g, "Betri Reykjavík er samráðsverkefni Reykjavíkurborgar, Íbúa ses og Reykvíkinga.");
};

let replaceForBetterIceland = function (data) {
  data = data.replace(/XappNameX/g, "Betra Ísland");
  return data.replace(/XdescriptionX/g, "Betra Ísland er samráðsvefur fyrir alla Íslendinga");
};

let replaceForYrpri = function (data) {
  data = data.replace(/XappNameX/g, "Your Priorities");
  return data.replace(/XdescriptionX/g, "Citizen participation application");
};

let replaceFromEnv = function (data) {
  data = data.replace(/XappNameX/g, process.env.YP_INDEX_APP_NAME ? process.env.YP_INDEX_APP_NAME : "Your Priorities");
  return data.replace(/XdescriptionX/g, process.env.YP_INDEX_DESCRIPTION ? process.env.YP_INDEX_DESCRIPTION : "Citizen participation application");
};

let sendIndex = function (req, res) {
  let indexFilePath;
  log.info('Index Viewed', { context: 'view', user: req.user ? toJson(req.user) : null });

  if (FORCE_PRODUCTION || process.env.NODE_ENV == 'production') {
    indexFilePath = path.resolve(__dirname, '../../client_app/build/bundled/index.html');
  } else {
    indexFilePath = path.resolve(__dirname, '../../client_app/index.html');
  }

  fs.readFile(indexFilePath, 'utf8', function(err, indexFileData) {
    if (err) {
      console.error("Cant read index file");
      throw err;
    } else {
      if (req.hostname.indexOf('betrireykjavik.is') > -1) {
        res.send(replaceForBetterReykjavik(indexFileData));
      } else if (req.hostname.indexOf('betraisland.is') > -1) {
        res.send(replaceForBetterIceland(indexFileData));
      } else if (req.hostname.indexOf('yrpri.org') > -1) {
        res.send(replaceForYrpri(indexFileData));
      } else {
        res.send(replaceFromEnv(indexFileData));
      }
    }
  });
};

router.get('/', function(req, res) {
  sendIndex(req, res);
});

router.get('/domain*', function(req, res) {
  sendIndex(req, res);
});

router.get('/community*', function(req, res) {
  sendIndex(req, res);
});

router.get('/group*', function(req, res) {
  sendIndex(req, res);
});

router.get('/post*', function(req, res) {
  sendIndex(req, res);
});

router.get('/user*', function(req, res) {
  sendIndex(req, res);
});

module.exports = router;
