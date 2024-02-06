var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');

var domainId = process.argv[2];
var outFolderPath = process.argv[3];

var skipEmail = false;

var getPostUrl = function (post) {
  if (urlPrefix) {
    return urlPrefix+'/post/'+post.id;
  } else {
    return "https://yrpri.org/post/"+post.id;
  }
};

var getUserEmail = function (post) {
  if (skipEmail) {
    return "hidden";
  } else {
    return post.User.email;
  }
};

var clean = function (text) {
  if (text) {
    //console.log("Before: "+ text);
    var newText = text.replace('"',"'").replace('\n','').replace('\r','').replace(/(\r\n|\n|\r)/gm,"").replace(/"/gm,"'").replace(/,/,';').trim();
    //console.log("After:" + newText);
    return newText.replace(/´/g,'');
  } else {
    return "";
  }
};

var getLocation = function (post) {
  if (post.location && post.location.latitude && post.location.longitude &&
    post.location.latitude!="" && post.location.longitude!="") {
    return post.location.latitude+','+post.location.longitude;
  } else {
    return '"",""'
  }
};

var getPoints = function (points) {
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

var getPointsUpOrDown = function (post, value) {
  var pointsText = '';
  var points = _.filter(post.Points, function (point) {
    if (value>0) {
      return point.value > 0;
    } else {
      return point.value < 0;
    }
  });
  pointsText += getPoints(points) + '';
  if (pointsText.startsWith(",")) {
    pointsText = pointsText.substr(1);
  }
  console.log("PointText: "+pointsText);
  return pointsText;
};

var getPointsUp = function (post) {
  return getPointsUpOrDown(post, 1);
};

var getPointsDown = function (post) {
  return getPointsUpOrDown(post, -1);
};

var getNewFromUsers = function (post) {
  return "";
};

var getImageFormatUrl = function(image, formatId) {
    var formats = JSON.parse(image.formats);
    if (formats && formats.length>0)
      return formats[formatId];
    else
      return ""
};

var getImages = function (post) {
  var imagesText = "";

  if (post.PostHeaderImages && post.PostHeaderImages.length>0) {
    imagesText += _.map(post.PostHeaderImages, function (image) {
      return ""+getImageFormatUrl(image, 0)+" ";
    });
  }

  if (post.PostHeaderImages && post.PostUserImages.length>0) {
    imagesText += _.map(post.PostUserImages, function (image) {
      return ""+getImageFormatUrl(image, 0)+" ";
    });
  }

  return imagesText;
};

var getCategory = function (post) {
  if (post.Category) {
    return post.Category.name;
  } else {
    return ""
  }
};

models.Post.unscoped().findAll({
  order: [
    ['created_at', 'asc' ]
  ],
  include: [
    {
      model: models.Category,
      required: false
    },
    {
      model: models.PostRevision,
      required: false
    },
    {
      model: models.Group,
      attributes: ['id'],
      include: [
        {
          model: models.Community,
          attributes: ['id'],
          where: {
            access: models.Community.ACCESS_PUBLIC
          },
          include: [
            {
              model: models.Domain,
              where: {
                id: domainId
              },
              attributes: ['id']
            }
          ]
        }
      ]
    },
    {
      model: models.Point,
      attributes: ['id','content','value'],
      required: false
    },
    { model: models.Image,
      as: 'PostHeaderImages',
      required: false
    },
    {
      model: models.User,
      required: true
    },
    {
      model: models.Image,
      as: 'PostUserImages',
      required: false,
      where: {
        deleted: false
      }
    }
  ]
}).then(function (posts) {
  var outFilePostContent = "";
  var outFilePointForContent = "";
  var outFilePointAgainstContent = "";
  console.log(posts.length);
  var postCounter = 0;
  async.eachSeries(posts, function (post, seriesCallback) {
    if (!post.deleted) {
      outFilePostContent+= "Name: "+clean(post.name)+"\n"+clean(post.description)+"\n\n";
      outFilePointForContent += getPointsUp(post);
      outFilePointAgainstContent += getPointsDown(post);
      async.series([
       (innerSeriesCallback) => {
        var outFileName = outFolderPath+"/posts/"+post.id+"_post_"+(post.language ? post.language : "??")+".txt";
        fs.writeFile(outFileName, "Name: "+clean(post.name)+"\n\n"+clean(post.description), function(err) {
          if(err) {
            console.log(err);
          }
          innerSeriesCallback();
        });
       },
       (innerSeriesCallback) => {
        fs.writeFile(outFolderPath+"/points_for/"+post.id+"_post_points_for_"+(post.language ? post.language : "??")+".txt", getPointsUp(post), function(err) {
          if(err) {
            console.log(err);
          }
          innerSeriesCallback();
        });
      },
      (innerSeriesCallback) => {
        fs.writeFile(outFolderPath+"/points_against/"+post.id+"_post_points_against_"+(post.language ? post.language : "??")+".txt", getPointsDown(post), function(err) {
          if(err) {
            console.log(err);
          }
          innerSeriesCallback();
        });
      }
      ], () => {
        seriesCallback();
      })
    } else {
      seriesCallback();
    }

  }, function (error) {
    async.series([
      (innerSeriesCallback) => {
       fs.writeFile(outFolderPath+"/all/all_posts.txt", outFilePostContent, function(err) {
         if(err) {
           console.log(err);
         }
         innerSeriesCallback();
       });
      },
      (innerSeriesCallback) => {
       fs.writeFile(outFolderPath+"/all/all_post_points_for.txt", outFilePointForContent, function(err) {
         if(err) {
           console.log(err);
         }
         innerSeriesCallback();
       });
     },
     (innerSeriesCallback) => {
       fs.writeFile(outFolderPath+"/all/all_post_points_against.txt", outFilePointAgainstContent, function(err) {
         if(err) {
           console.log(err);
         }
         innerSeriesCallback();
       });
     }
     ], () => {
      console.log("Done");
      process.exit();
     })
  });
});
