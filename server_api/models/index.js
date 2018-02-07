"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var _ = require('lodash');

var sequelize;
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    },
    logging: false
  });
} else {
  var config = require(__dirname + '/../config/config.json')[env];
  sequelize = new Sequelize(config.database, config.username, config.password, _.merge(config, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    },
    logging: true
  }));
}

var db        = {};

// Read from local folder
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

// Read from active citizen,
// TODO Load from npm module if not found locally

var acDirname = __dirname+'/../active-citizen/models';
fs
  .readdirSync(acDirname)
  .filter(function(file) {
     return (file.indexOf(".") !== 0);
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(acDirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

if (process.env.NODE_ENV === 'development') {
  sequelize.sync().done(function() {
    db.Post.addFullTextIndex();
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
