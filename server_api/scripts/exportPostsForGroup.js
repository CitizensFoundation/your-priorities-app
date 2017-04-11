var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');

var groupId = process.argv[2];
var urlPrefix = process.argv[3];
var outFile = process.argv[4];

var skipEmail = true;

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
  //console.log("Before: "+ text);
  var newText = text.replace('"',"'").replace('\n','').replace('\r','').replace(/(\r\n|\n|\r)/gm,"").replace(/"/gm,"'").replace(',',';').trim();
  //console.log("After:" + newText);
  return newText.replace(/´/g,'');
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
  return _.map(points, function (point) {
    return clean(point.content)+"\n\n"
  })
};

var getPointsUpOrDown = function (post, value) {
  var pointsText = '"';
  var pointsUp = _.filter(post.Points, function (point) {
    if (value>0) {
      return point.value > 0;
    } else {
      return point.value < 0;
    }
  });
  pointsText += getPoints(pointsUp) + '"';
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

models.Post.unscoped().findAll({
  where: {
    group_id: groupId
  },
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
  var outFileContent = "";
  console.log(posts.length);
  outFileContent += "Id, Post id,email,User Name,Post Name,Description,Url,Latitude,Longitude,Up Votes,Down Votes,Points Count,Points For,Points Against,Images\n";
  postCounter = 0;
  async.eachSeries(posts, function (post, seriesCallback) {
    postCounter += 1;
    if (!post.deleted) {
      outFileContent += postCounter+','+post.id+',"'+getUserEmail(post)+'","'+post.User.name+'","'+clean(post.name)+'","'+clean(post.description)+'",'+
        '"'+getPostUrl(post)+'",'+
        getLocation(post)+','+post.counter_endorsements_up+','+post.counter_endorsements_down+
        ','+post.counter_points+','+getPointsUp(post)+','+getPointsDown(post)+','+
        getImages(post)+'\n';
    } else {
      outFileContent += postCounter+','+post.id+',DELETED,,,,,,,,,,,\n';
    }
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
