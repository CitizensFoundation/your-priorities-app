module.exports = {
    "production": {
        "use_env_variable":"DB_CONNECTION_STRING",
        "dialect":"postgres",
        "ssl":true,
        "dialectOptions":{
            "ssl":{
                "require":true
            }
        }
    }
}
