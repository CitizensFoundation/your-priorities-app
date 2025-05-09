const models = require('../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');

var communityId = 1017;// process.argv[2];
var outFile = process.argv[3];
let outFileContent = "";

const clean = (text) => {
  //console.log("Before: "+ text);
  var newText = text.replace('"',"'").replace('\n','').replace('\r','').replace(/(\r\n|\n|\r)/gm,"").replace(/"/gm,"'").replace(/,/,';').trim();
  //console.log("After:" + newText);
  return newText.replace(/´/g,'');
};

const getPoints = (points) => {
  var totalContent = "";
  _.each(points, function (point) {
    var content = clean(point.content)+"\n\n";
    if (content.startsWith(",")) {
      content = content.substr(1);
    }
    console.log("content: "+content);
    totalContent += content;
  });
  return totalContent;
};

const getPointsUpOrDown = (post, value) => {
  var pointsText = '"';
  var points = _.filter(post.Points, function (point) {
    if (value>0) {
      return point.value > 0;
    } else {
      return point.value < 0;
    }
  });
  pointsText += getPoints(points) + '"';
  if (pointsText.startsWith(",")) {
    pointsText = pointsText.substr(1);
  }
  console.log("PointText: "+pointsText);
  return pointsText;
};

const getToxicityScore = (model) => {
  if (model.data && model.data.moderation && model.data.moderation.toxicityScore) {
    return model.data.moderation.toxicityScore
  } else {
    return "";
  }
};

const getPointsUp = (post) => {
  return getPointsUpOrDown(post, 1);
};

const getPointsDown = (post) => {
  return getPointsUpOrDown(post, -1);
};

const addCrowdsourcingRow = (contentType, category, subject, content, forAgainstValue, upVotes, downVotes,id, toxicityScore, englishTranslation) => {
  outFileContent += 'Crowdsourcing,'+contentType+',"'+category+'"'+',"'+subject+'","'+clean(content)+'","'+forAgainstValue+'","'+
    upVotes+'",'+'"'+downVotes+'",'+'"'+id+'",'+'"'+toxicityScore+'",'+'"'+clean(englishTranslation)+'",'+'\n';
};

models.Post.findAll({
  attributes: ['id','name','description','counter_endorsements_up','counter_endorsements_down','data'],
  order: [
    ['created_at', 'asc' ]
  ],
  include: [
    {
      model: models.Group,
      required: true,
      attributes: ['id','name'],
      include: [
        {
          model: models.Community,
          required: true,
          where: { id: communityId }
        }
      ]
    }
  ]
}).then(function (posts) {
  async.eachSeries(posts, function (post, seriesCallback) {
    let req = {
      query: {
        textType: 'postContent',
        targetLanguage: 'en'
      }
    };
    models.AcTranslationCache.getTranslation(req, post, (error, translation) => {
      let englishTranslation="no translation";
      if (!error && translation) {
        englishTranslation = translation.content;
      } else {
        console.error(error);
      }
      addCrowdsourcingRow('post', post.Group.name, post.name, post.description, 0, post.counter_endorsements_up, post.counter_endorsements_down, post.id, getToxicityScore(post), englishTranslation);
      models.Point.findAll({
        attributes: ['id', 'content', 'counter_quality_up', 'counter_quality_down', 'value','data'],
        where: {post_id: post.id},
        order: [
          ['value', 'asc']
        ],
        include: [{
          model: models.PointRevision,
          attributes: ['id', 'content']
        }]
      }).then(function (points) {
        async.eachSeries(points, function (point, pointsCallback) {
          let pointTextContent;
          if (point.PointRevisions.length > 0) {
            pointTextContent = point.PointRevisions[point.PointRevisions.length - 1].content;
          } else {
            pointTextContent = point.content;
          }

          console.log(pointTextContent);

          let req = {
            query: {
              textType: 'pointContent',
              targetLanguage: 'en'
            }
          };

          models.AcTranslationCache.getTranslation(req, point, (error, translation) => {
            let englishTranslation = "no translation";
            if (!error && translation) {
              englishTranslation = translation.content;
            } else {
              console.error(error);
            }
            addCrowdsourcingRow('point', post.Group.name, post.name, pointTextContent, point.value, point.counter_quality_up, point.counter_quality_down, point.id, getToxicityScore(point), englishTranslation);
            pointsCallback();
          });
        }, seriesCallback);
      });
    })
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
