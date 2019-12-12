"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const env       = process.env.NODE_ENV || "development";
const _ = require('lodash');

let sequelize;

const Op = Sequelize.Op;
const operatorsAliases = {
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $in: Op.in,
  $and: Op.and,
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $is: Op.is,
  $not: Op.not,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $like: Op.like,
  $contains: Op.contains,
  $any: Op.any
};

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    },
    minifyAliases: true,
    logging: false,
    operatorsAliases: operatorsAliases
  });
} else {
  const config = require(__dirname + '/../config/config.json')[env];
  sequelize = new Sequelize(config.database, config.username, config.password, _.merge(config, {
    dialect: 'postgres',
    minifyAliases: true,
    dialectOptions: {
      ssl: true
    },
    logging: process.env.DISABLE_DEV_DB_LOGGING ? false : true,
    operatorsAliases: operatorsAliases
  }));
}

const db = {};

// Read from local folder
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

// Read from active citizen,
// TODO Load from npm module if not found locally

const acDirname = __dirname+'/../active-citizen/models';
fs
  .readdirSync(acDirname)
  .filter((file) => {
     return (file.indexOf(".") !== 0);
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(acDirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

if (process.env.FORCE_DB_SYNC || process.env.NODE_ENV === 'development') {
  sequelize.sync().done(() => {
    db.Post.addFullTextIndex();
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
