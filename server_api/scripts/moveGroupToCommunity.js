const models = require('../models/index.cjs');
const async = require('async');
const ip = require('ip');

const groupId = process.argv[2];
const communityId = process.argv[3];

models.Group.findOne({
  where: {
    id: groupId
  },
  attributes: ['id','community_id']
}).then(group => {
  group.community_id=communityId;
  group.save().then(()=>{
    console.log(`Done changing group ${group.id} to community ${group.community_id}`);
    process.exit();
  }).catch(error=>{
    console.error(error);
    process.exit();
  })
}).catch(error => {
  console.error(error);
  process.exit();
});
