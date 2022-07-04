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

let replaceForEngageBritain = function (data) {
  data = data.replace(/XappNameX/g, "Engage Britain");
  data = data.replace(/XdescriptionX/g, "Engage Britain is a fully independent charity that brings people together to tackle our country’s biggest challenges.");
  return data.replace(/XmanifestPathX/g, "manifest_eb");
};

let replaceForMyCityChallenge = function (data) {
  data = data.replace(/XappNameX/g, "My City Challenge");
  data = data.replace(/XdescriptionX/g, "My City Challenge");
  return data.replace(/XmanifestPathX/g, "manifest_my_city_challenge");
};

let replaceForTarsalgo = function (data) {
  data = data.replace(/XappNameX/g, "társalgó");
  data = data.replace(/XdescriptionX/g, "tarsalgo.net");
  return data.replace(/XmanifestPathX/g, "manifest_tarsalgo");
};

let replaceForParlScot = function (data) {
  data = data.replace(/XappNameX/g, "Engage - Scottish Parliament");
  data = data.replace(/XdescriptionX/g, "Engage with the Scottish Parliament");
  return data.replace(/XmanifestPathX/g, "manifest_parlscott");
};

let replaceForJungesWien = function (data) {
  data = data.replace(/XappNameX/g, "Junges Wien");
  data = data.replace(/XdescriptionX/g, "Die Junges Wien - Plattform dient der Stadt Wien zur Ideen-Einreichung und zur Projektabstimmung für die erste partizipative Wiener Kinder- und Jugendmillion. #jungeswien");
  return data.replace(/XmanifestPathX/g, "manifest_junges_wien");
};

let replaceForSmarterNJ = function (data) {
  data = data.replace(/XappNameX/g, "SmarterNJ");
  data = data.replace(/XdescriptionX/g, "SmarterNJ is an open government initiative that uses new and innovative technology to meaningfully engage New Jerseyans. Your participation in SmarterNJ will allow us to create policies, programs and services that are more effective, more efficient, and more impactful for all New Jerseyans.");
  return data.replace(/XmanifestPathX/g, "manifest_smarternj");
};

let replaceFromEnv = function (data) {
  data = data.replace(/XappNameX/g, process.env.YP_INDEX_APP_NAME ? process.env.YP_INDEX_APP_NAME : "Your Priorities");
  data = data.replace(/XdescriptionX/g, process.env.YP_INDEX_DESCRIPTION ? process.env.YP_INDEX_DESCRIPTION : "Citizen participation application");
  return data.replace(/XmanifestPathX/g, process.env.YP_INDEX_MANIFEST_PATH ? process.env.YP_INDEX_MANIFEST_PATH : "manifest_yp");
};

const plausibleCode = `
  <script defer data-domain="DATADOMAIN" src="https://plausible.io/js/plausible.js"></script>
  <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
`;

const getPlausibleCode = (dataDomain) => {
  return plausibleCode.replace("DATADOMAIN", dataDomain);
}

const ziggeoHeaders = (ziggeoApplicationToken) => { return `
  <link rel="stylesheet" href="https://assets.ziggeo.com/v2-stable/ziggeo.css" />
  <script src="https://assets.ziggeo.com/v2-stable/ziggeo.js"></script>
  <script>
    var ziggeoApp = new ZiggeoApi.V2.Application({
      token:"${ziggeoApplicationToken}",
      webrtc_streaming_if_necessary: true,
      webrtc_on_mobile: true,
      debug: true
    });
  </script>
` };

let sendIndex = function (req, res) {
  let indexFilePath;
  log.info('Index Viewed', { userId: req.user ? req.user.id : null });

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
      var userAgent = req.headers['user-agent'];
      var ie11 = /Trident/.test(userAgent);
      if (!ie11) {
        indexFileData = indexFileData.replace('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE11">','');
      }

      if (process.env.ZIGGEO_ENABLED && req.ypDomain.configuration.ziggeoApplicationToken) {
        indexFileData = indexFileData.replace('<head>',`<head>${ziggeoHeaders(req.ypDomain.configuration.ziggeoApplicationToken)}`);
      }

      if (req.ypDomain &&
          req.ypDomain.configuration &&
          req.ypDomain.configuration.plausibleDataDomains &&
          req.ypDomain.configuration.plausibleDataDomains.length>5) {
        indexFileData = indexFileData.replace('XplcX',getPlausibleCode(req.ypDomain.configuration.plausibleDataDomains));
      } else {
        indexFileData = indexFileData.replace('XplcX', '');
      }

        if (req.hostname) {
        if (req.hostname.indexOf('betrireykjavik.is') > -1) {
          res.send(replaceForBetterReykjavik(indexFileData));
        } else if (req.hostname.indexOf('betraisland.is') > -1) {
          res.send(replaceForBetterIceland(indexFileData));
        } else if (req.hostname.indexOf('smarter.nj.gov') > -1) {
          res.send(replaceForSmarterNJ(indexFileData));
        } else if (req.hostname.indexOf('parliament.scot') > -1) {
          res.send(replaceForParlScot(indexFileData));
        } else if (req.hostname.indexOf('ypus.org') > -1) {
          res.send(replaceForYrpri(indexFileData));
        } else if (req.hostname.indexOf('mycitychallenge.org') > -1) {
          res.send(replaceForMyCityChallenge(indexFileData));
        } else if (req.hostname.indexOf('engagebritain.org') > -1) {
          res.send(replaceForEngageBritain(indexFileData));
        } else if (req.hostname.indexOf('tarsalgo.net') > -1) {
          res.send(replaceForTarsalgo(indexFileData));
        } else if (req.hostname.indexOf('junges.wien') > -1) {
          res.send(replaceForJungesWien(indexFileData));
        } else if (req.hostname.indexOf('yrpri.org') > -1) {
          res.send(replaceForYrpri(indexFileData));
        } else {
          res.send(replaceFromEnv(indexFileData));
        }
      } else {
        log.warn("No req.hostname");
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
