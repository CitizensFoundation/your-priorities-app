const models = require('../models/index.cjs');

const communityId = process.argv[2];
const domainId = process.argv[3];

models.Community.findOne({
  where: {
    id: communityId
  },
  attributes: ['id','domain_id']
}).then(community => {
  community.domain_id=domainId;
  community.save().then(()=>{
    console.log(`Done changing community ${community.id} to domain ${community.domain_id}`);
    process.exit();
  }).catch(error=>{
    console.error(error);
    process.exit();
  })
}).catch(error => {
  console.error(error);
  process.exit();
});
