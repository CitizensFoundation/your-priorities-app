const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');

const groupId = process.argv[2];
const outFile = process.argv[3];

let registrationQuestions;

const getAnswerFor = (text, answers) => {
  for (let i=0;i<answers.length;i++) {
    if (Object.keys(answers[i])[0]==text) return Object.values(answers[i])[0];
  }

  return '';
}

models.Group.findOne({
  where: {
    id: groupId
  }
}).then( group => {
  if (group.configuration.registrationQuestionsJson) {
    registrationQuestions = group.configuration.registrationQuestionsJson;
  }
  models.Endorsement.findAll({
    order: [
      ['created_at', 'asc']
    ],
    attributes: ['id','value','created_at','user_id'],
    include: [
      {
        model: models.User,
        attributes: ['id','email','private_profile_data']
      },
      {
        model: models.Post,
        attributes: ['id','name'],
        include: [
          {
            model: models.Category,
            attributes: ['id','name']
          },
          {
            model: models.Group,
            attributes:['id'],
            where: {
              id: groupId
            }
          }
        ]
      }
    ]
  }).then(function (endorsements) {
    var outFileContent = "";
    console.log(endorsements.length);
    outFileContent += "Post endorsements for Group Id: "+groupId+"\n";
    outFileContent += "Post Id,Post Name,Value,Category Id,Category Name,User Id";

    if (registrationQuestions) {
      for (let i=0;i<registrationQuestions.length;i++) {
        outFileContent+=","+registrationQuestions[i].text;
      }
    }

    outFileContent += "\n";

    async.eachSeries(endorsements, (endorsement, seriesCallback) => {
      outFileContent += endorsement.Post.id;
      outFileContent += ',"'+endorsement.Post.name+'"';
      outFileContent += ','+endorsement.value;
      outFileContent += ','+(endorsement.Post.Category ? endorsement.Post.Category.id : '')
      outFileContent += ',"'+(endorsement.Post.Category ? endorsement.Post.Category.name : '')+'"'
      outFileContent +=  ','+endorsement.user_id;

      if (endorsement.User.private_profile_data && endorsement.User.private_profile_data.registration_answers ) {
        const answers = endorsement.User.private_profile_data.registration_answers;
        for (let i=0;i<registrationQuestions.length;i++) {
          outFileContent+=","+getAnswerFor(registrationQuestions[i].text, answers);
        }
      }
      outFileContent += '\n';
      seriesCallback();
    }, function (error) {
      fs.writeFile(outFile, outFileContent, function(err) {
        if(err) {
          console.log(err);
        }
        console.log("The file was saved!");
        process.exit();
      });
    });
  });
}).catch( error=>{
  console.erro(error);
  process.exit();
})

