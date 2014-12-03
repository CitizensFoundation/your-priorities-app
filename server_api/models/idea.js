"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("Idea", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    counter_endorsements_up: DataTypes.INTEGER,
    counter_endorsements_down: DataTypes.INTEGER,
    counter_points: DataTypes.INTEGER,
    counter_comments: DataTypes.INTEGER,
    counter_all_activities: DataTypes.INTEGER,
    counter_main_activities: DataTypes.INTEGER,
    impressions_count: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'ideas',
    classMethods: {
      associate: function(models) {
        Idea.hasMany(models.Point);
        Idea.hasMany(models.Endorsement);
        Idea.hasMany(models.IdeaRevision);
        Idea.belongsTo(models.Category);
        Idea.belongsTo(models.User);
        Idea.belongsTo(models.Group, {foreignKey: "sub_instance_id"});
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
            .success(function() {
              return sequelize
                  .query('UPDATE "' + Idea.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
                  .error(console.log);
            }).success(function() {
              return sequelize
                  .query('CREATE INDEX post_search_idx ON "' + Idea.tableName + '" USING gin("' + vectorName + '");')
                  .error(console.log);
            }).success(function() {
              return sequelize
                  .query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + Idea.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
                  .error(console.log);
            }).error(console.log);

      },

      search: function(query) {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Idea = this;

        query = sequelize.getQueryInterface().escape(query);
        console.log(query);

        return sequelize
            .query('SELECT * FROM "' + Idea.tableName + '" WHERE "' + Idea.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ')', Idea);
      }
    }
  });

  return Idea;
};
