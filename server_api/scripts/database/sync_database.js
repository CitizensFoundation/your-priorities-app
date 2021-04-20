const models = require('../../models');

models.sequelize.sync().then(() => {
  models.Post.addFullTextIndex();
  setTimeout(()=>{
    console.log("Time has passed");
    process.exit();
  }, 15000)
}).catch( error=>{
  console.error(error);
  process.exit();
});
