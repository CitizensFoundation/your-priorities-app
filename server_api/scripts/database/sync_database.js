const models = require('../../models');

models.sequelize.sync({force: true}).then(() => {
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
