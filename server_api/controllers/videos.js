const express = require('express');
const router = express.Router();
const models = require("../models");
const multer  = require('multer');
const multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
const auth = require('../authorization');
const log = require('../utils/logger');
const toJson = require('../utils/to_json');
const exec = require('child_process').exec;
const async = require('async');
const fs = require('fs');

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send('Unauthorized');
};

const padNum = function(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
};

router.post('/get_preview', function(req, res) {
  const frames = req.body;
  const outFile = "/tmp/outFile.mp4";
  const frameManifestFile = "/tmp/frameManifest.ffcat";
  const inFolder = "/tmp/";
  let file = null;

  async.series([
    function (callback) {
      let index = 0;
      async.forEach(frames, function (frame, innerCallback) {
        frame.index = index+=1;
        const base64Data = frame.image.replace(/^data:image\/png;base64,/, "");
        const fileName = inFolder+`frame_image_${padNum(frame.index,3)}_${frame.duration}.png`;
        fs.writeFile(fileName, base64Data, {encoding: 'base64'}, function(err) {
          if (err) log.error(err);
          innerCallback();
        });
      }, function (error) {
        callback(error);
      });
    },
    function (callback) {
      let manifestText = "ffconcat version 1.0\n";
      let lastFile = null;
      let totalDuration = 0;
      fs.readdir(inFolder, (err, files) => {
        files.forEach(file => {
          if (file.indexOf('frame_image') > -1) {
            manifestText += "file "+file + '\n';
            const duration = file.split(".png")[0].split('_')[3];
            totalDuration+=parseInt(duration);
            manifestText += "duration 00:00:00."+padNum(duration,3)+'\n';
            lastFile = file;
          }
        });
        manifestText += "file "+lastFile + '\n';
        var a = totalDuration;
        fs.writeFile(frameManifestFile, manifestText, function(error) {
          callback(error);
        });
      });
    },
    function (callback) {
      exec(`cd /tmp;ffmpeg -i ${frameManifestFile} -c:v libx264 -pix_fmt yuv420p -vf fps=25 ${outFile}`,
        function(error, stdout, stderr) {
          callback(error);
        }
      );
    },
  ], function (error) {
    if (error) {
      log.error(error);
      res.sendStatus(500);
    } else {
      req.sendFile(outFile);
    }
  });
});

module.exports = router;
