"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("Idea", {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    counter_endorsements_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_endorsements_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_all_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_main_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    impressions_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    cover_media_type: DataTypes.STRING
  }, {
    underscored: true,

    timestamps: true,

    tableName: 'ideas',

    classMethods: {
      associate: function(models) {
        Idea.hasMany(models.Point);
        Idea.hasMany(models.Endorsement);
        Idea.hasMany(models.IdeaRevision);
        Idea.belongsTo(models.Category);
        Idea.belongsTo(models.User);
        Idea.belongsTo(models.Group, {foreignKey: "group_id"});
        Idea.belongsToMany(models.Image, { through: 'IdeaImage' });
      },

      getSearchVector: function() {
        return 'IdeaText';
      },

      addFullTextIndex: function() {

        if(sequelize.options.dialect !== 'postgres') {
          console.log('Not creating search index, must be using POSTGRES to do this');
          return;
        }

        console.log("Adding full text index");

        var searchFields = ['name', 'description'];
        var Idea = this;

        var vectorName = Idea.getSearchVector();
        sequelize
            .query('ALTER TABLE "' + Idea.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
            .then(function() {
              return sequelize
                  .query('UPDATE "' + Idea.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
                  .error(console.log);
            }).then(function() {
              return sequelize
                  .query('CREATE INDEX post_search_idx ON "' + Idea.tableName + '" USING gin("' + vectorName + '");')
                  .error(console.log);
            }).then(function() {
              return sequelize
                  .query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + Idea.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
                  .error(console.log);
            }).error(console.log);

      },

      search: function(query, groupId, modelCategory) {
        console.log("In search for " + query);

        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Idea = this;

        query = sequelize.getQueryInterface().escape(query);
        console.log(query);

        var where = '"'+Idea.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ')';

        return Idea.findAll({
          order: "created_at DESC",
          where: [where, []],
          limit: 100,
          include: [ modelCategory ]
        });
      }
    },

    instanceMethods: {
      setupAfterSave: function(req, res, idea) {
        var ideaRevision = sequelize.models.IdeaRevision.build({
          name: idea.name,
          description: idea.description,
          group_id: idea.groupId,
          user_id: req.user.id,
          idea_id: idea.id
        });
        ideaRevision.save().then(function() {
          var point = sequelize.models.Point.build({
            group_id: idea.groupId,
            idea_id: idea.id,
            content: req.body.pointFor,
            value: 1,
            user_id: req.user.id
          });
          point.save().then(function() {
            var pointRevision = sequelize.models.PointRevision.build({
              group_id: point.groupId,
              idea_id: idea.id,
              content: point.content,
              user_id: req.user.id,
              point_id: point.id
            });
            pointRevision.save().then(function() {
              res.send(idea);
            });
          });
        });
      }
    }
  });

  return Idea;
};
