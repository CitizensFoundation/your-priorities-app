const models = require('../../models/index.cjs');
const async = require('async');

const domainId = process.argv[2];
const clientId = process.argv[3];
const clientSecret = process.argv[4];
const issuer = process.argv[5];
const authorizationURL = process.argv[6];
const tokenURL = process.argv[7];
const userInfoURL = process.argv[8];
const endSessionURL = process.argv[9];

log.info(`Updating OIDC keys for domain ${domainId}`);

async.series([
  function(callback) {
    models.Domain.findOne({
      where: {
        id: domainId
      }
    }).then(function (domain) {
      if (domain) {
        log.info(`Found domain: ${domain.name}`);

        // Initialize secret_api_keys if it doesn't exist
        if (!domain.secret_api_keys) {
          domain.secret_api_keys = {};
        }

        // Initialize or update oidc keys
        domain.secret_api_keys.oidc = {
          client_id: clientId,
          client_secret: clientSecret,
          issuer: issuer,
          authorizationURL: authorizationURL,
          tokenURL: tokenURL,
          userInfoURL: userInfoURL,
          endSessionURL: endSessionURL
        };

        log.info("Updated secret_api_keys:", JSON.stringify(domain.secret_api_keys, null, 2));

        domain.changed('secret_api_keys', true);
        domain.save({ fields: ['secret_api_keys'] }).then(() => {
          log.info("OIDC keys updated successfully");
          callback();
        }).catch((error) => {
          log.error("Error saving domain:", error);
          callback(error);
        });
      } else {
        log.info("Can't find domain");
        callback("Can't find domain");
      }
    }).catch((error) => {
      log.error("Error finding domain:", error);
      callback(error);
    });
  }
], function (error) {
  if (error) {
    log.error("An error occurred:", error);
  } else {
    log.info("Finished successfully");
  }
  process.exit();
});