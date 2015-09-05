"use strict";

var Community = require('./community');
// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Domain = sequelize.define("Domain", {
    name: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    underscored: true,

    tableName: 'domains',

    classMethods: {

      setYpDomain: function (req,res,next) {
        var domainName = Domain.extractDomain(req.headers.host);
        Domain.findOrCreate({where: {domain_name: domainName}, defaults: {}})
            .spread(function(domain, created) {
              req.ypDomain = domain;
              next();
            }.bind(this)).catch(function(error) {
              res.sendStatus(500);
            });
      },

      setYpHostname: function (req,res,next) {
        var hostname = Domain.extractHost(req.headers.host);
        if (hostname && hostname!="www") {
          Community.find({
            where: {hostname: hostname}
          }).then(function(community) {
            req.ypCommunity = community;
            next();
          }).catch(function(error) {
            res.sendStatus(500);
          });
        }
      },

      extractDomain: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if ((domain.match(/./g) || []).length>1) {
          dot = domain.indexOf('.');
          domain = domain.substring(dot+1,domain.length);
        }
        return domain;
      },

      extractHost: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if ((domain.match(/./g) || []).length>1) {
          domain = url.split(':')[0];
          dot = domain.indexOf('.');
          host = domain.substring(0,dot);
          return host;
        } else {
          return null;
        }
      },

      associate: function(models) {
        Domain.hasMany(models.Community, { foreignKey: "domain_id" });
      }
    }
  });

  return Domain;
};
