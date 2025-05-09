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
  if (results && results.length>0) {
    results.forEach((item)=>{
      console.log(`${item.index_key} - ${item.content}`);
      console.log(`--------------------------------------`);
      console.log("");
    });
  } else {
    console.warn("No results found")
    process.exit();
  }
  process.exit();
}).catch((error)=>{
  console.error(error);
  process.exit();
});
