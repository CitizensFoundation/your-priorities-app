const models = require('../../models/index.cjs');
models.sequelize.sync({}).then(() => {
    setTimeout(() => {
        models.Post.addFullTextIndex();
        setTimeout(() => {
            console.log("Time has passed");
            process.exit();
        }, 15000);
    }, 1000);
}).catch(error => {
    console.error(error);
    process.exit();
});
export {};
