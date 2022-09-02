const models = require('../models');

const updateParametersFromCampaign = async (utmContent, parameters) => {
  return await new Promise(async (resolve, reject) => {
    try {
      const campaign = await models.Campaign.findOne({
        where: {
          id: utmContent,
          collectionType: collectionType,
          collectionId: collectionId
        },
        attributes: ['id','configuration']
      });

      if (campaign &&
          campaign.configuration.shareImage) {
        parameters.image = campaign.configuration.shareImage;
      }

      if (campaign &&
        campaign.configuration.shareImage) {
        parameters.description = campaign.configuration.shareText;
      }

      resolve(parameters);
    } catch (error) {
      reject(error);
    }
  });
}

const getSharingParameters = async (req, collection, url, imageUrl) => {
  return await new Promise(async (resolve, reject) => {
    let parameters = {
      title: collection.title,
      description: collection.description || collection.objectives,
      url: url,
      image: imageUrl
    }
    try {
      if (req.query.utm_content && !isNaN(req.query.utm_content))  {
        parameters = await updateParametersFromCampaign(req.query.utm_content, parameters)
      }
      resolve(parameters);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getSharingParameters
};
