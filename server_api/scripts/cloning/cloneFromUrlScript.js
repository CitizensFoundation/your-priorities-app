const models = require('../../models/index.cjs');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const copyCommunityWithEverything = require('../../utils/copy_utils').copyCommunityWithEverything;

const communityId = process.argv[2];
const domainId = process.argv[3];
const urlToConfig =  process.argv[4];

let config;
let finalOutput = '';

async.series([
  (seriesCallback) => {
    const options = {
      url: urlToConfig,
    };

    request.get(options, (error, content) => {
      if (content && content.statusCode!=200) {
        seriesCallback(content.statusCode);
      } else  if (content) {
        config = content.body;
        seriesCallback();
      } else {
        seriesCallback("No content");
      }
    });
  },
  (seriesCallback) => {
    async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
      if (!configLine || configLine.length<3) {
        forEachCallback();u
      } else {
        copyCommunityWithEverything(communityId, domainId, {}, (error, community) => {
          if (error) {
            forEachCallback(error);
          }  else {
            community.name = "DEMO: No Planet B - "+configLine;
            community.hostname = "demo-no-planet-b-"+configLine.toLowerCase().replace(/ /g,'-');
            community.save().then( () => {
              console.log(community.hostname);
              finalOutput+='https://'+community.hostname+'.yrpri.org\n';
              forEachCallback();
            }).catch(error=>{
              forEachCallback(error);
            })
          }
        });
      }
    }, error => {
      seriesCallback(error)
    });
  },
], error => {
  if (error)
    console.error(error);
  console.log("All done");
  console.log(finalOutput);
  process.exit();
});
