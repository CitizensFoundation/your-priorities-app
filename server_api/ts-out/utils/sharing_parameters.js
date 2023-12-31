"use strict";
const models = require("../models");
const url = require("url");
const updateParametersFromCampaign = async (utmContent, collectionType, collectionId, parameters) => {
    return await new Promise(async (resolve, reject) => {
        let where = {
            id: utmContent
        };
        switch (collectionType) {
            case "domain":
                where = { ...where, ...{ domain_id: collectionId } };
                break;
            case "community":
                where = { ...where, ...{ community_id: collectionId } };
                break;
            case "group":
                where = { ...where, ...{ group_id: collectionId } };
                break;
            case "post":
                where = { ...where, ...{ post_id: collectionId } };
                break;
            case "user":
                where = { ...where, ...{ user_id: collectionId } };
                break;
            default:
                reject("Can't find a valid collection type for campaign");
        }
        try {
            const campaign = await models.Campaign.findOne({
                where: where,
                attributes: ["id", "configuration"],
            });
            if (campaign && campaign.configuration.shareImageUrl) {
                parameters.imageUrl = campaign.configuration.shareImageUrl;
            }
            if (campaign && campaign.configuration.shareDescriptionText) {
                parameters.description = campaign.configuration.shareDescriptionText;
            }
            resolve(parameters);
        }
        catch (error) {
            reject(error);
        }
    });
};
const getSharingParameters = async (req, collection, url, imageUrl) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let description = collection.description || collection.objectives || "";
            if (description) {
                description = description.replace(/"/g, "'");
            }
            let name = collection.name;
            const collectionType = collection.constructor.name.toLowerCase();
            if (collectionType === "domain" && url.indexOf("betrireykjavik.is") > -1) {
                name = `Betri Reykjavík - ${name}`;
            }
            let parameters = {
                title: name,
                description: description,
                url: url || "",
                imageUrl: imageUrl || "",
                locale: collection.language || "",
            };
            if (req.query.utm_content && !isNaN(req.query.utm_content)) {
                parameters = await updateParametersFromCampaign(req.query.utm_content, collectionType, collection.id, parameters);
            }
            resolve(parameters);
        }
        catch (error) {
            reject(error);
        }
    });
};
const getFullUrl = (req) => {
    var replacedUrl = req.originalUrl;
    if (replacedUrl.startsWith("/?_escaped_fragment_=")) {
        replacedUrl = req.originalUrl.replace(/[?]_escaped_fragment_=/g, "");
        replacedUrl = replacedUrl.replace("//", "/");
    }
    var formattedUrl = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: replacedUrl,
    });
    return formattedUrl;
};
const getSplitUrl = (req) => {
    let url = req.url;
    let splitPath = 1;
    if (url.startsWith("/?_escaped_fragment_=")) {
        url = req.url.replace(/%2F/g, "/");
        splitPath = 2;
    }
    let splitUrl = url.split("/");
    let id = splitUrl[splitPath + 1];
    if (id) {
        id = id.split("?")[0];
    }
    return {
        splitUrl,
        splitPath,
        id,
        url,
    };
};
module.exports = {
    getSharingParameters,
    getFullUrl,
    getSplitUrl,
};
