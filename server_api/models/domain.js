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
            });
      },

      extractDomain: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if (!Domain.isIpAddress(domain)) {
          if ((domain.match(/./g) || []).length>1) {
            dot = domain.indexOf('.');
            domain = domain.substring(dot+1,domain.length);
          }
        }
        return domain;
      },

      extractHost: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if (!Domain.isIpAddress(domain)) {
          if ((domain.match(/./g) || []).length>1) {
            domain = url.split(':')[0];
            dot = domain.indexOf('.');
            host = domain.substring(0,dot);
            return host;
          }
        }
        return null;
      },

      isIpAddress: function (domain)
      {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(domain)) {
          return true;
        } else {
          return false;
        }
      },

      associate: function(models) {
        Domain.hasMany(models.Community, { foreignKey: "domain_id" });
      }
    }
  });

  return Domain;
};
