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

console.log(`Updating OIDC keys for domain ${domainId}`);

async.series([
  function(callback) {
    models.Domain.findOne({
      where: {
        id: domainId
      }
    }).then(function (domain) {
      if (domain) {
        console.log(`Found domain: ${domain.name}`);

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

        console.log("Updated secret_api_keys:", JSON.stringify(domain.secret_api_keys, null, 2));

        domain.changed('secret_api_keys', true);
        domain.save({ fields: ['secret_api_keys'] }).then(() => {
          console.log("OIDC keys updated successfully");
          callback();
        }).catch((error) => {
          console.error("Error saving domain:", error);
          callback(error);
        });
      } else {
        console.log("Can't find domain");
        callback("Can't find domain");
      }
    }).catch((error) => {
      console.error("Error finding domain:", error);
      callback(error);
    });
  }
], function (error) {
  if (error) {
    console.error("An error occurred:", error);
  } else {
    console.log("Finished successfully");
  }
  process.exit();
});