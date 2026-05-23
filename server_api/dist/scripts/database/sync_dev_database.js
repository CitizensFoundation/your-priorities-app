const models = require('../../models/index.cjs');
models.sequelize.query('CREATE DATABASE yrpri_dev', (err, res) => {
    log.info(err, res);
    models.sequelize.sync({}).then(() => {
        setTimeout(() => {
            models.Post.addFullTextIndex();
            setTimeout(() => {
                log.info("Time has passed");
                process.exit();
            }, 15000);
        }, 1000);
    }).catch(error => {
        log.error(error);
        process.exit();
    });
});
export {};
