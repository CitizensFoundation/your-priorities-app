"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
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

var acDirname = __dirname+'/../active_citizen/models';
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

sequelize.sync().done(function() {
  db.Post.addFullTextIndex();
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
