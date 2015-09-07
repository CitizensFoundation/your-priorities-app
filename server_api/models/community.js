"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: DataTypes.STRING,
    hostname: DataTypes.STRING,
    description: DataTypes.TEXT,
    access: DataTypes.INTEGER,
    website: DataTypes.TEXT,
    counter_groups: DataTypes.INTEGER,
    counter_users: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'communities',
    classMethods: {

      setYpCommunity: function (req,res,next) {
        var hostname = sequelize.models.Domain.extractHost(req.headers.host);
        if (!hostname && req.params.communityHostname)
          hostname = req.params.communityHostname;
        if (hostname && hostname!="www" && hostname!="new") {
          Community.find({
            where: {hostname: hostname}
          }).then(function (community) {
            if (community) {
              req.ypCommunity = community;
              next();
            } else {
              res.sendStatus(404);
            }
          }.bind(this));
        } else {
          next();
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
