"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = __importDefault(require("pg"));
const colors_1 = __importDefault(require("colors"));
const sequelize_2 = __importDefault(require("pgvector/sequelize"));
sequelize_2.default.registerType(sequelize_1.Sequelize);
const logQuery = (query, options) => {
    console.log(colors_1.default.bgGreen(new Date().toLocaleString()));
    console.log(colors_1.default.bgYellow(options.bind));
    console.log(colors_1.default.bgBlue(query));
    return options;
};
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, // DB name
process.env.DB_USER, // username
process.env.DB_PASS, // password
{
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 5432),
    dialect: 'postgres',
    dialectModule: pg_1.default,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: process.env.NODE_ENV !== 'production' ? logQuery : false,
});
exports.models = {
    sequelize
};
