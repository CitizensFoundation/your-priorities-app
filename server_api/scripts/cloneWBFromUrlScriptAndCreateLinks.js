const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const copyCommunityWithEverything = require('../utils/copy_utils').copyCommunityWithEverything;

const domainId = process.argv[2];
const userId = process.argv[3];
const urlToConfig = process.argv[4];
const urlToAddAddFront = process.argv[5];

/*
const domainId = "3"; //process.argv[2];
const userId = "850" //process.argv[3];
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CF_clone_WB_140221.csv";// process.argv[4];
//const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/";
const urlToAddAddFront = "http://localhost:4242/"; //process.argv[5];
*/

// node server_api/scripts/cloneWBFromUrlScriptAndCreateLinks.js 3 84397 https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CF_clone_WB_140221.csv https://kyrgyz-aris.yrpri.org/

let config;
let finalOutput = '';
let finalTargetOutput = '';

async.series([
  (seriesCallback) => {
    const options = {
      url: urlToConfig,
    };

    request.get(options, (error, content) => {
      if (content && content.statusCode!=200) {
        seriesCallback(content.statusCode);
      } else {
        config = content.body;
        seriesCallback();
      }
    });
  },
  (seriesCallback) => {
    async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
      const splitLine = configLine.split(",");

      if (!configLine || configLine.length<3 || !splitLine || splitLine.length!==2) {
        forEachCallback();
      } else {
        const fromCommunityId = splitLine[0];
        const linkToCommunityId = splitLine[1];
        copyCommunityWithEverything(fromCommunityId, domainId, (error, newCommunity) => {
          if (error) {
            forEachCallback(error);
          }  else {
            models.Community.findOne({
              where: {
                id: linkToCommunityId
              },
              attributes: ['id','name']
            }).then( linkCommunity => {
              newCommunity.hostname = newCommunity.hostname+"-"+newCommunity.id;
              newCommunity.save().then(() => {
                newCommunity.set('configuration.customBackURL', linkToCommunityId);
                newCommunity.set('configuration.customBackName', linkCommunity.name);
                newCommunity.save().then(() => {
                  console.log(newCommunity.id);
                  finalOutput+=urlToAddAddFront+"community/"+newCommunity.id+"\n";
                  finalTargetOutput+=urlToAddAddFront+"community/"+linkToCommunityId+"\n";

                  const linkModel = models.Group.build({
                    name: "Link for community - "+linkToCommunityId,
                    description: "",
                    access: models.Group.ACCESS_PUBLIC,
                    user_id: userId,
                    configuration: { actAsLinkToCommunityId: newCommunity.id },
                    community_id: linkToCommunityId
                  });
                  linkModel.save().then((model) => {
                    models.User.findOne({
                      where: {
                        id: userId
                      }
                    }).then(user=>{
                      linkModel.addGroupAdmin(user).then(function () {
                        forEachCallback();
                      }).catch((error)=>{
                        forEachCallback(error);
                      });
                    }).catch(error=>{
                      forEachCallback(error);
                    })
                  }).catch( error => {
                    forEachCallback(error);
                  });
                }).catch(error=>{
                  forEachCallback(error);
                })
              }).catch( error=>{
                forEachCallback(error);
              })
            }).catch( error => {
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
  console.log("All done clones");
  console.log(finalOutput);
  console.log("All done targets");
  console.log(finalTargetOutput);
  process.exit();
});
