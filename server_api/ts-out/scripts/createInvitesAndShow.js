const models = require('../models/index.cjs');
const _ = require('lodash');
const toJson = require('../utils/to_json.cjs');
var crypto = require("crypto");
const communityId = process.argv[2];
const senderUserId = process.argv[3];
const numberOfInvites = process.argv[4];
const masterCampaignName = process.argv[5];
const createOneInvite = async (campaignName, inviteEmail) => {
    let community, invite, registeredUser, senderUser, token, inviteUrl;
    try {
        token = (await crypto.randomBytes(20)).toString('hex');
        community = await models.Community.findOne({
            where: { id: communityId },
            attributes: ['id', 'domain_id', 'hostname'],
            include: [{ model: models.Domain, attributes: ['id', 'domain_name'] }]
        });
        senderUser = await models.User.findOne({
            where: { id: senderUserId },
            attributes: ['id', 'email', 'name']
        });
        if (inviteEmail) {
            registeredUser = await models.User.findOne({
                where: { email: inviteEmail },
                attributes: ['id', 'email']
            });
        }
        invite = await models.Invite.create({
            token: token,
            expires_at: Date.now() + (3600000 * 24 * 30),
            type: models.Invite.INVITE_TO_COMMUNITY,
            community_id: communityId,
            user_id: registeredUser ? registeredUser.id : null,
            from_user_id: senderUser.id,
            metadata: { toEmail: inviteEmail, campaignName: campaignName }
        });
        if (inviteEmail && community) {
            await models.AcActivity.inviteCreated({
                email: inviteEmail,
                user_id: registeredUser ? registeredUser.id : null,
                sender_user_id: senderUser.id,
                community_id: communityId,
                sender_name: senderUser.name,
                domain_id: community.domain_id,
                invite_id: invite.id,
                token: token
            });
        }
        inviteUrl = 'https://' + community.hostname + '.' + community.Domain.domain_name + '/user/accept/invite/' + token;
        return inviteUrl;
    }
    catch (error) {
        throw error;
    }
};
const generateInvites = async () => {
    let urls = [];
    for (let i = 0; i < numberOfInvites; i++) {
        try {
            const inviteUrl = await createOneInvite(masterCampaignName, null);
            if (inviteUrl) {
                urls.push(inviteUrl);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    urls.forEach((url) => {
        console.log(url);
    });
    process.exit();
};
generateInvites();
export {};
