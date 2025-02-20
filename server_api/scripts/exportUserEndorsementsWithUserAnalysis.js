const models = require('../models/index.cjs');
const async = require('async');
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
    attributes: ['id','value','created_at','user_id','ip_address','user_agent'],
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
            attributes: ['id','name'],
            required: false
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
        if (registrationQuestions[i].type!=="segment" && registrationQuestions[i].type!=="textDescription") {
          outFileContent+=","+registrationQuestions[i].text;
        }
      }
    }

    outFileContent += ",IP Address,User Agent"
    outFileContent += "\n";

    let notValidCounter = 0;
    let notValidUserCounter = 0;
    let nullValueCounter = 0;
    const notValidUsers = {};
    const validUsers = {};
    let validUsersCount = 0;

    async.eachSeries(endorsements, (endorsement, seriesCallback) => {
      if (endorsement.User.private_profile_data && endorsement.User.private_profile_data.registration_answers ) {
        if (endorsement.value!==0) {
          outFileContent += endorsement.Post.id;
          outFileContent += ',"'+endorsement.Post.name+'"';
          outFileContent += ','+endorsement.value;
          outFileContent += ','+(endorsement.Post.Category ? endorsement.Post.Category.id : '')
          outFileContent += ',"'+(endorsement.Post.Category ? endorsement.Post.Category.name : '')+'"'
          outFileContent +=  ','+endorsement.user_id;

          const answers = endorsement.User.private_profile_data.registration_answers;
          for (let i=0;i<registrationQuestions.length;i++) {
            if (registrationQuestions[i].type!=="segment" && registrationQuestions[i].type!=="textDescription") {
              outFileContent+=","+getAnswerFor(registrationQuestions[i].text, answers);
            }
          }
          outFileContent += ','+endorsement.ip_address;
          outFileContent += ',"'+endorsement.user_agent+'"';
          outFileContent += '\n';
        } else {
          nullValueCounter += 1;
        }
        if (!validUsers[endorsement.user_id]) {
          validUsersCount += 1;
          validUsers[endorsement.user_id] = true;
        }

      } else {
        notValidCounter += 1;
        if (!notValidUsers[endorsement.user_id]) {
          notValidUserCounter += 1;
          notValidUsers[endorsement.user_id] = true;
        }
      }
      seriesCallback();
    }, function (error) {
      fs.writeFile(outFile, outFileContent, function(err) {
        if(err) {
          console.log(err);
        }
        console.log("The file was saved!");
        console.log(`${notValidCounter} not valid entries ${notValidUserCounter} not valid users ${nullValueCounter} 0 values`)
        console.log(`${validUsersCount} valid users`)
        process.exit();
      });
    });
  });
}).catch( error=>{
  console.error(error);
  process.exit();
})

