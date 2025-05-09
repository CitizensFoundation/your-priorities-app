const models = require('../models/index.cjs');
const async = require('async');

const groupId = process.argv[2];

const processPointDependancies = (point, done) => {
  async.series([
    (seriesCallback) => {
      models.PointQuality.unscoped().findAll({
        where: {
          point_id: point.id
        },
        attributes: ['id','deleted']
      }).then(qualities => {
        async.forEachSeries(qualities, (quality, forEachCallback) => {
            quality.deleted = false;
            quality.save().then(() => {
              console.log(`Done undeleting quality ${point.id}`);
              forEachCallback();
            }).catch(error => {
              forEachCallback(error);
            })}, error => {
             seriesCallback(error);
          });
      }).catch(error => {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      models.PointRevision.unscoped().findAll({
        where: {
          point_id: point.id
        },
        attributes: ['id','deleted']
      }).then(revisions => {
        async.forEachSeries(revisions, (revision, forEachCallback) => {
          revision.deleted = false;
          revision.save().then(() => {
            console.log(`Done undeleting point revision ${point.id}`);
            forEachCallback();
          }).catch(error => {
            forEachCallback(error);
          })}, error => {
          seriesCallback(error);
        });
      }).catch(error => {
        seriesCallback(error);
      });
    }
  ], error=> {
    done(error)
  });
};

const processPostDependancies = (post, done) => {
  async.series([
    (seriesCallback) => {
      models.Endorsement.unscoped().findAll({
        where: {
          post_id: post.id
        },
        attributes: ['id','deleted']
      }).then(endorsements => {
        async.forEachSeries(endorsements, (endorsement, forEachCallback) => {
            endorsement.deleted = false;
            endorsement.save().then(() => {
              console.log(`Done undeleting endorsement model ${post.id}`);
              forEachCallback();
            }).catch(error => {
              forEachCallback(error);
            })},
          error => {
            seriesCallback(error);
          });
      }).catch(error => {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      models.Point.unscoped().findAll({
        where: {
          post_id: post.id
        },
        attributes: ['id','deleted']
      }).then(points => {
        async.forEachSeries(points, (point, forEachCallback) => {
            point.deleted = false;
            point.save().then(() => {
              console.log(`Done undeleting point model ${point.id}`);
              processPointDependancies(point, forEachCallback);
            }).catch(error => {
              forEachCallback(error);
            })},
          error => {
            seriesCallback(error);
          });
      }).catch(error => {
        seriesCallback(error);
      });
    }
  ], error=> {
    done(error)
  });
};

async.series([
  (seriesCallback) => {
    models.Group.unscoped().findOne({
      where: {
        id: groupId
      },
      attributes: ['id','deleted']
    }).then(group => {
      group.deleted=false;
      group.save().then(()=>{
        console.log(`Done undeleting group model ${group.id}`);
        seriesCallback();
      })
    }).catch(error => {
      seriesCallback(error);
    });
  },
  (seriesCallback) => {
    models.Post.unscoped().findAll({
      where: {
        group_id: groupId
      },
      attributes: ['id','deleted']
    }).then(posts => {
      async.forEachSeries(posts, (post, forEachCallback) => {
        post.deleted = false;
        post.save().then(() => {
          console.log(`Done undeleting post model ${post.id}`);
          processPostDependancies(post, forEachCallback);
        }).catch(error => {
          forEachCallback(error);
        })},
        error => {
          seriesCallback(error);
      });
    }).catch(error => {
      seriesCallback(error);
    });
  }
], error=> {
  if (error)
    console.error(`Error undeleting group ${groupId} - ${error}`);
  else
    console.log(`Done undeleting group ${groupId}`);
  process.exit();
});


//TODO: Seperate recount group from endorsements
