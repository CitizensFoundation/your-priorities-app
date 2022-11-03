const models = require('../../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const cloneTranslationForConfig = require('../../active-citizen/utils/translation_cloning').cloneTranslationForConfig;

const userId = process.argv[2];
const urlToConfig = process.argv[3];
const urlToAddAddFront = process.argv[4];

let config;
let finalOutput = '';
let user;

async.series([
  seriesCallback => {
    if (userId && urlToConfig && urlToAddAddFront) {
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
        const toCommunityId = splitLine[0].trim();
        const adminEmail = splitLine[1].trim();

        let toCommunity,adminUserToAdd;

        async.series([
          innerSeriesCallback => {
            models.Community.findOne({
              where: {
                id: toCommunityId
              },
              attributes: ['id','name','configuration'],
              include: [
                {
                  model: models.Group,
                  attributes: ['id','name']
                }
              ]
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
            models.User.findOne({
              where: {
                email: adminEmail
              },
              attributes: ['id','email']
            }).then((user=> {
              if (user) {
                adminUserToAdd = user;
                innerSeriesCallback();
              } else {
                innerSeriesCallback("Could not find user for admin email");
              }
            })).catch( error => {
              innerSeriesCallback(error);
            })
          },
          innerSeriesCallback => {
            toCommunity.addCommunityAdmins(adminUserToAdd).then((results=> {
              if (results) {
                console.log(`Have added ${adminUserToAdd.email} to community ${toCommunity.name}`);
                finalOutput+=urlToAddAddFront+"community/"+toCommunity.id+"\n";
                innerSeriesCallback();
              } else {
                innerSeriesCallback("Could not add admin user to community");
              }
            })).catch( error => {
              innerSeriesCallback(error);
            })
          },
          innerSeriesCallback => {
            async.forEachSeries(toCommunity.Groups, (group, forEachCallback) => {
              group.addGroupAdmins(adminUserToAdd).then(results=> {
                console.log(`Have added ${adminUserToAdd.email} to group ${group.name}`)
                forEachCallback();
              })
            }, innerSeriesCallback)
          },
        ], error => {
          forEachCallback(error);
        })
      }
    }, error => {
      seriesCallback(error)
    });
  },
], error => {
  if (error)
    console.error(error);
  console.log("All done copying admins to communities");
  console.log(finalOutput);
  process.exit();
});


