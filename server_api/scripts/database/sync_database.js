const models = require('../../models');


models.sequelize.query('CREATE DATABASE yrpri_dev', (err, res) => {
  console.log(err, res);
  models.sequelize.sync({}).then(() => {
    setTimeout(()=>{
      models.Post.addFullTextIndex();
      setTimeout(()=>{
        console.log("Time has passed");
        process.exit();
      }, 15000)
    }, 1000)
  }).catch( error=>{
    console.error(error);
    process.exit();
  });
});

