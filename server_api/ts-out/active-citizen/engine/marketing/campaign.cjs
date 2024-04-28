"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../../../models/index.cjs");
const async = require('async');
const sendSmsToUser = (twilioClient, listUser, campaign, configuration, done) => {
    /*const body = campaign.message + " "+ campaign.data.baseUrl+"?yu="+listUser.id+"&yc="+campaign.id;
    twilioClient.messages.create({
      from: configuration.twilioFromSmsNumber,
      to: listUser.sms,
      body: body
    }).then(message => {
      log.info("Sent SMS to user", { sms: listUser.sms, messageSid: message.sid, body });
      done();
    }).catch(error=>{
      done(error);
    });*/
};
const updateListUserSent = (listUser, campaign, done) => {
    listUser.set('data.sentCount', listUser.data.sentCount + 1);
    listUser.save().then(() => {
        done();
    }).catch(error => {
        done(error);
    });
};
const setJobAndError = (error, done) => {
    models.AcBackgroundJob.update({
        error: error
    }, {
        where: { id: workPackage.jobId }
    }).then(() => {
        done(error);
    }).catch((error) => {
        done(error);
    });
};
const sendCampaign = (workPackage, callback) => {
    models.AcCampaign.find({
        where: {
            id: workPackage.campaignId
        },
        include: [
            {
                model: models.AcList,
                include: [
                    {
                        model: models.Group,
                        attributes: ['id', 'configuration']
                    }
                ]
            }
        ]
    }).then(campaign => {
        const groupConfiguration = campaign.Group.configuration;
        const twilioClient = null; //require('twilio')(groupConfiguration.twilioAccountSid, groupConfiguration.twilioAuthToken, {});
        if (!twilioClient)
            return callback('Twilio client not initialized');
        models.AcListUser.find({
            where: {
                ac_list_id: campaign.AcList.id
            }
        }).then(listUsers => {
            const totalUserCount = listUsers.length;
            let sentCount = 0;
            async.eachSeries(listUsers, (listUser, seriesCallback) => {
                sendSmsToUser(twilioClient, listUser, campaign, groupConfiguration, (error) => {
                    if (error) {
                        seriesCallback(error);
                    }
                    else {
                        updateListUserSent(listUser, campaign, seriesCallback);
                    }
                });
            }, (error) => {
                if (error) {
                    setJobAndError(error, callback);
                }
                else {
                    callback();
                }
            });
        }).catch(error => {
            setJobAndError(error, callback);
        });
    }).catch(error => {
        setJobAndError(error, callback);
    });
};
module.exports = {
    sendCampaign
};
