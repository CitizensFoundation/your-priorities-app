const models = require('../../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const cloneTranslationForConfig = require('../../services/utils/translation_cloning').cloneTranslationForConfig;

const userId = process.argv[2];
const type = process.argv[3];
const urlToConfig = process.argv[4];
const urlToAddAddFront = process.argv[5];

/*const userId = "89244" //process.argv[3];
const type = "onlyThemeColors";
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/copyConfigCommunities7421.csv";
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/";*/

// node server_api/scripts/cloneWBFromUrlScriptAndCreateLinks.js 3 84397 https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CF_clone_WB_140221.csv https://kyrgyz-aris.yrpri.org/

let config;
let finalOutput = '';
let user;

async.series([
  seriesCallback => {
    if (userId && type && urlToConfig && urlToAddAddFront) {
      seriesCallback();
    } else {
      seriesCallback("Not all values set")
    }
  },
  (seriesCallback) => {
    const options = {
      url: urlToConfig,
    };

    request.get(options, (error, content) => {
      if (content && content.statusCode!=200) {
        seriesCallback(content.statusCode);
      } else if (content) {
        config = content.body;
        seriesCallback();
      } else {
        seriesCallback("No content");
      }
    });
  },
  seriesCallback => {
    models.User.findOne({
      where: {
        id: userId
      }
    }).then( userIn => {
      if (userIn) {
        user = userIn;
        seriesCallback();
      } else {
        seriesCallback("User not found")
      }

    }).catch( error => {
      seriesCallback(error);
    })
  },
  (seriesCallback) => {
    let index = 0;
    async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
      const splitLine = configLine.split(",");
      process.stdout.write(".");

      if (index==0 || !configLine || configLine.length<3 || !splitLine || splitLine.length!==2) {
        index+=1;
        forEachCallback();
      } else {
        const fromCommunityId = splitLine[0];
        const toCommunityId = splitLine[1];

        if (fromCommunityId===toCommunityId) {
          forEachCallback();
        } else {
          let fromCommunity;
          let toCommunity;

          async.series([
            innerSeriesCallback => {
              models.Community.findOne({
                where: {
                  id: fromCommunityId
                },
                attributes: ['id','name','configuration']
              }).then( communityIn => {
                if (communityIn) {
                  fromCommunity = communityIn;
                  innerSeriesCallback();
                } else {
                  innerSeriesCallback("from community not found");
                }
              }).catch( error => {
                innerSeriesCallback(error)
              })
            },
            innerSeriesCallback => {
              models.Community.findOne({
                where: {
                  id: toCommunityId
                },
                attributes: ['id','name','configuration']
              }).then( communityIn => {
                if (communityIn) {
                  toCommunity = communityIn;
                  innerSeriesCallback();
                } else {
                  innerSeriesCallback("to community not found");
                }
              }).catch( error => {
                innerSeriesCallback(error)
              })
            },
            innerSeriesCallback => {
              fromCommunity.hasCommunityAdmins(user).then((results=> {
                if (results) {
                  innerSeriesCallback();
                } else {
                  innerSeriesCallback("No access to fromCommunity: "+fromCommunity.id);
                }
              })).catch( error => {
                innerSeriesCallback(error);
              })
            },
            innerSeriesCallback => {
              toCommunity.hasCommunityAdmins(user).then((results=> {
                if (results) {
                  innerSeriesCallback();
                } else {
                  innerSeriesCallback("No access to toCommunity: "+toCommunity.id);
                }
              })).catch( error => {
                innerSeriesCallback(error);
              })
            },
            innerSeriesCallback => {
              if (type==="onlyThemeColors") {
                toCommunity.set('configuration.themeOverrideColorPrimary', fromCommunity.configuration.themeOverrideColorPrimary);
                toCommunity.set('configuration.themeOverrideColorAccent', fromCommunity.configuration.themeOverrideColorAccent);
                toCommunity.set('configuration.themeOverrideBackgroundColor', fromCommunity.configuration.themeOverrideBackgroundColor);
                toCommunity.save().then(()=>{
                  finalOutput+=urlToAddAddFront+"community/"+toCommunity.id+"\n";
                  innerSeriesCallback();
                }).catch( error => {
                  innerSeriesCallback(error);
                })
              } else {
                innerSeriesCallback();
              }
            }
          ], error => {
            forEachCallback(error);
          })
        }
      }
    }, error => {
      seriesCallback(error)
    });
  },
], error => {
  if (error)
    console.error(error);
  console.log("All done copying config to communities");
  console.log(finalOutput);
  process.exit();
});


