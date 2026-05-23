const models = require('../../models/index.cjs');
const _ = require('lodash');
const textToSearch = process.argv[2];
models.AcTranslationCache.findAll({
    where: {
        content: {
            [models.Sequelize.Op.substring]: textToSearch
        }
    }
}).then((results) => {
    if (results && results.length > 0) {
        results.forEach((item) => {
            log.info(`${item.index_key} - ${item.content}`);
            log.info(`--------------------------------------`);
            log.info("");
        });
    }
    else {
        log.warn("No results found");
        process.exit();
    }
    process.exit();
}).catch((error) => {
    log.error(error);
    process.exit();
});
export {};
