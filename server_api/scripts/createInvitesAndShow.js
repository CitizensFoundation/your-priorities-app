const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const toJson = require('../utils/to_json');
var crypto = require("crypto");

const communityId = process.argv[2];
const senderUserId = process.argv[3];
const numberOfInvites = process.argv[4];
const masterCampaignName = process.argv[5];

const createOneInvite = (campaignName, inviteEmail, callback) => {
  let community, invite, registeredUser, senderUser, token, inviteUrl;

  async.series([
    (seriesCallback) => {
      crypto.randomBytes(20, function(error, buf) {
        token = buf.toString('hex');
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      models.Community.find({
        where: {
          id: communityId
        },
        attributes: ['id', 'domain_id','hostname'],
        include: [
          {
            model: models.Domain,
            attributes: ['id','domain_name']
          }
        ]
      }).then((communityIn) => {
        community = communityIn;
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      })
    },
    (seriesCallback) => {
      models.User.find({
        where: { id: senderUserId },
        attributes: ['id','email']
      }).then(function (userIn) {
        if (userIn) {
          senderUser = userIn;
        }
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      if (inviteEmail) {
        models.User.find({
          where: { email: inviteEmail },
          attributes: ['id','email']
        }).then(function (userIn) {
          if (userIn) {
            registeredUser = userIn;
          }
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },
    (seriesCallback) => {
      models.Invite.create({
        token: token,
        expires_at: Date.now() + (3600000*24*30),
        type: models.Invite.INVITE_TO_COMMUNITY,
        community_id: communityId,
        user_id: registeredUser ? registeredUser.id : null,
        from_user_id: senderUser.id,
        metadata:  { toEmail: inviteEmail, campaignName: campaignName }
      }).then(function (inviteIn) {
        if (inviteIn) {
          invite = inviteIn;
          seriesCallback();
        } else {
          seriesCallback('Invite not found')
        }
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
     if (inviteEmail && community) {
       models.AcActivity.inviteCreated({
         email: inviteEmail,
         user_id: registeredUser ? registeredUser.id : null,
         sender_user_id: senderUser.id,
         community_id: communityId,
         sender_name: senderUser.name,
         domain_id: community.domain_id,
         invite_id: invite.id,
         token: token}, function (error) {
         seriesCallback(error);
       });
     } else {
       seriesCallback();
     }
    },
    (seriesCallback) => {
      inviteUrl = 'https://'+community.hostname+'.'+community.Domain.domain_name+'/user/accept/invite/'+token;
      seriesCallback();
    }
  ], (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null, inviteUrl);
    }
  });
};

let counter = 0;
let urls = [];
async.whilst(() => { return (counter+=1)<=numberOfInvites }, (whilstCallback) => {
  createOneInvite(masterCampaignName, null, (error, inviteUrl) => {
    if (inviteUrl) {
      urls.push(inviteUrl);
    }
    whilstCallback(error);
  })
}, (error) => {
  if (error)
    console.error(error);
  urls.forEach((url) => {
    console.log(url);
  });
  process.exit();
});
