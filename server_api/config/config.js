module.exports = {
    "production": {
        "use_env_variable": "DATABASE_URL",
        "dialect": "postgres",
        "ssl": process.env.DISABLE_PG_SSL !== "true",
        "dialectOptions": process.env.DISABLE_PG_SSL === "true" ? {} : {
            "ssl": {
                "require": true,
                "rejectUnauthorized": false
            }
        }
    }
}