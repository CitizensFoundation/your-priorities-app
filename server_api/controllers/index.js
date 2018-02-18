let express = require('express');
let router = express.Router();
let log = require('../utils/logger');
let toJson = require('../utils/to_json');
let path = require('path');
let fs = require('fs');

let replaceForBetterReykjavik = function (data) {
  data = data.replace(/XappNameX/g, "Betri Reykjavík");
  data = data.replace(/XdescriptionX/g, "Betri Reykjavík er samráðsverkefni Reykjavíkurborgar, Íbúa ses og Reykvíkinga.");
  return data.replace(/XmanifestPathX/g, "manifest_br");
};

let replaceForBetterIceland = function (data) {
  data = data.replace(/XappNameX/g, "Betra Ísland");
  data = data.replace(/XdescriptionX/g, "Betra Ísland er samráðsvefur fyrir alla Íslendinga");
  return data.replace(/XmanifestPathX/g, "manifest_bi");
};

let replaceForYrpri = function (data) {
  data = data.replace(/XappNameX/g, "Your Priorities");
  data = data.replace(/XdescriptionX/g, "Citizen participation application");
  return data.replace(/XmanifestPathX/g, "manifest_yp");
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
      } else {
        res.send(replaceForYrpri(indexFileData));
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
