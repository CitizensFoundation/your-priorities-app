import { Sequelize } from 'sequelize';
import pg from 'pg';
import safe from 'colors';
import pgvector from 'pgvector/sequelize';
pgvector.registerType(Sequelize);
const logQuery = (query, options) => {
    console.log(safe.bgGreen(new Date().toLocaleString()));
    console.log(safe.bgYellow(options.bind));
    console.log(safe.bgBlue(query));
    return options;
};
const sequelize = new Sequelize(process.env.DB_NAME, // DB name
process.env.DB_USER, // username
process.env.DB_PASS, // password
{
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 5432),
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: process.env.NODE_ENV !== 'production' ? logQuery : false,
});
export const models = {
    sequelize
};
