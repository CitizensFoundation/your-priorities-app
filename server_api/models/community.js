"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: DataTypes.STRING,
    hostname: DataTypes.STRING,
    description: DataTypes.TEXT,
    access: DataTypes.INTEGER,
    website: DataTypes.TEXT
  }, {
    underscored: true,
    tableName: 'communities',
    classMethods: {

      setYpCommunity: function (req,res,next) {
        var hostname = Community.extractHost(req.headers.host);
        if (hostname && hostname!="www") {
          Community.find({
            where: { hostname: hostname }
          }).then(function(community) {
            req.ypCommunity = community;
            next();
          }.bind(this));
        }
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

      convertAccessFromCheckboxes: function(body) {
        var access = 0;
        if (body.public) {
          access = 2;
        } else if (body.closed) {
          access = 1;
        } else if (body.secret) {
          access = 0;
        }
        return access;
      },

      associate: function(models) {
        Community.hasMany(models.Group, { foreignKey: "community_id" });
        Community.belongsTo(models.Domain, {foreignKey: "domain_id"});
        Community.belongsToMany(models.User, { through: 'CommunityUser' });
      }
    }
  });

  return Community;
};
