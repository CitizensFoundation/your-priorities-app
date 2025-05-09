const models = require('../../models/index.cjs');
const _ = require('lodash');
const https = require("https");
const fs = require("fs");
const moment = require("moment");
const domainIdToKeep = 1338; //process.argv[2];
const minioDataPath = "/home/robert/Scratch/minio_data"; //process.argv[2];
const minioBaseUrlPath = "https://www.junges.wien"

let communityIdsToKeep = [];
let groupIdsToKeep = [];
let categoryIdsToKeep = [];
let pageIdsToKeep = [];
let postIdsToKeep = [];
let endorsementIdsToKeep = [];
let pointIdsToKeep = [];
let pointRevisionIdsToKeep = [];
let qualityIdsToKeep = [];
let imageIdsToKeep = [];
let videoIdsToKeep = [];
let audioIdsToKeep = [];
let activityIdsToKeep = [];
let userIdsToKeep = [];

const addUsers = (users) => {
  const userIds = users.map(u => u.id);
  userIdsToKeep = userIdsToKeep.concat(userIds);
  userIdsToKeep = _.uniq(userIdsToKeep);
  //console.log(userIdsToKeep.length);
}

const addUsersIds = (userIds) => {
  if (userIds.indexOf(56884) > -1) {
    console.log("adding 56884");
  }
  userIdsToKeep = userIdsToKeep.concat(userIds);
  userIdsToKeep = _.uniq(userIdsToKeep);
  //console.log(userIdsToKeep.length);
}

const addImages = (images) => {
  const imageIds = images.map(i => i.id);
  imageIdsToKeep = imageIdsToKeep.concat(imageIds);
  imageIdsToKeep = _.uniq(imageIdsToKeep);
}

const addVideos = (videos) => {
  const videosIds = videos.map(v => v.id);
  videoIdsToKeep = videoIdsToKeep.concat(videosIds);
  videoIdsToKeep = _.uniq(videoIdsToKeep);
}

const addAudios = (audios) => {
  const audiosIds = audios.map(a => a.id);
  audioIdsToKeep = audioIdsToKeep.concat(audiosIds);
  audioIdsToKeep = _.uniq(audioIdsToKeep);
}

async function getDomain() {
  return await new Promise(async (resolve, reject) => {
    const domain = await models.Domain.findOne({
      where: {
        id: domainIdToKeep
      },
      attributes: ['id'],
      include: [
        {
          model: models.User,
          as: 'DomainUsers',
          attributes: ['id'],
          required: false
        },
        {
          model: models.User,
          as: 'DomainAdmins',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'DomainLogoImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'DomainHeaderImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Video,
          as: 'DomainLogoVideos',
          attributes: ['id'],
          required: false
        },
      ]
    });
    resolve(domain);
  })
}

async function getCommunities() {
  return await new Promise(async (resolve, reject) => {
    const communities = await models.Community.findAll({
      where: {
        domain_id: domainIdToKeep
      },
      attributes: ['id','user_id'],
      include: [
        {
          model: models.User,
          as: 'CommunityUsers',
          attributes: ['id'],
          required: false
        },
        {
          model: models.User,
          as: 'CommunityAdmins',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'CommunityLogoImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'CommunityHeaderImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Video,
          as: 'CommunityLogoVideos',
          attributes: ['id'],
          required: false
        },
      ]
    });
    resolve(communities);
  })
}

async function getGroups() {
  return await new Promise(async (resolve, reject) => {
    const groups = await models.Group.findAll({
      where: {
        community_id: {
          $in: communityIdsToKeep
        }
      },
      attributes: ['id'],
      include: [
        {
          model: models.User,
          as: 'GroupUsers',
          attributes: ['id'],
          required: false
        },
        {
          model: models.User,
          as: 'GroupAdmins',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'GroupLogoImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'GroupHeaderImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Video,
          as: 'GroupLogoVideos',
          attributes: ['id'],
          required: false
        }
      ]
    });
    resolve(groups);
  })
}

async function getPosts() {
  return await new Promise(async (resolve, reject) => {
    const posts = await models.Post.unscoped().findAll({
      where: {
        group_id: {
          $in: groupIdsToKeep
        }
      },
      attributes: ['id','user_id'],
      include: [
        {
          model: models.Image,
          as: 'PostImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'PostHeaderImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'PostImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Video,
          as: 'PostVideos',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Audio,
          as: 'PostAudios',
          attributes: ['id'],
          required: false
        }
      ]
    });
    resolve(posts);
  })
}

async function getEndorsements() {
  return await new Promise(async (resolve, reject) => {
    const endorsement = await models.Endorsement.unscoped().findAll({
      where: {
        post_id: {
          $in: postIdsToKeep
        }
      },
      attributes: ['id','user_id']
    });
    resolve(endorsement);
  })
}

async function getQualities() {
  return await new Promise(async (resolve, reject) => {
    const qualities = await models.PointQuality.findAll({
      where: {
        point_id: {
          $in: pointIdsToKeep
        }
      },
      attributes: ['id','user_id']
    });
    resolve(qualities);
  })
}

async function getPointRevisions() {
  return await new Promise(async (resolve, reject) => {
    const revisions = await models.PointRevision.findAll({
      where: {
        point_id: {
          $in: pointIdsToKeep
        }
      },
      attributes: ['id','user_id']
    });
    resolve(revisions);
  })
}

async function getCategories() {
  return await new Promise(async (resolve, reject) => {
    const categories = await models.Category.findAll({
      where: {
        group_id: {
          $in: groupIdsToKeep
        }
      },
      attributes: ['id']
    });
    resolve(categories);
  })
}

async function getPages() {
  return await new Promise(async (resolve, reject) => {
    const pages = await models.Page.findAll({
      where: {
        group_id: {
          $in: groupIdsToKeep
        }
      },
      attributes: ['id']
    });
    resolve(pages);
  })
}

async function getPoints() {
  return await new Promise(async (resolve, reject) => {
    const points = await models.Point.unscoped().findAll({
      where: {
        post_id: {
          $in: postIdsToKeep
        }
      },
      attributes: ['id','user_id'],
      include: [
        {
          model: models.Video,
          as: 'PointVideos',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Audio,
          as: 'PointAudios',
          attributes: ['id'],
          required: false
        }
      ]
    });
    resolve(points);
  })
}

async function getUsers() {
  return await new Promise(async (resolve, reject) => {
    const users = await models.User.unscoped().findAll({
      where: {
        id: {
          $in: userIdsToKeep
        }
      },
      attributes: ['id'],
      include: [
        {
          model: models.Image,
          as: 'UserHeaderImages',
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'UserProfileImages',
          attributes: ['id'],
          required: false
        }
      ]
    });
    resolve(users);
  })
}

async function getVideos() {
  return await new Promise(async (resolve, reject) => {
    const videos = await models.Video.unscoped().findAll({
      where: {
        id: {
          $in: videoIdsToKeep
        }
      },
      attributes: ['id'],
      include: [
        {
          model: models.Image,
          as: 'VideoImages',
          attributes: ['id'],
          required: false
        }
      ]
    });
    resolve(videos);
  })
}

async function getActivities() {
  return await new Promise(async (resolve, reject) => {
    const activities = await models.AcActivity.findAll({
      where: {
        $or: [
          {
            community_id : {
              $in: communityIdsToKeep
            }
          },
          {
            group_id : {
              $in: groupIdsToKeep
            }
          },
          {
            domain_id: domainIdToKeep,
          },
          {
            post_id : {
              $in: postIdsToKeep
            }
          },
          {
            point_id : {
              $in: pointIdsToKeep
            }
          },
          {
            user_id : {
              $in: pointIdsToKeep
            }
          },
        ]
      },
      attributes: ['id','user_id','domain_id','community_id','group_id','post_id','point_id'],
    });
    resolve(activities);
  })
}

async function setupIdsToKeep() {
  return await new Promise(async (resolve, reject) => {
    try {
      console.log("Setup domain");
      const domain = await getDomain();

      addUsers(domain.DomainUsers);
      addUsers(domain.DomainAdmins);
      addImages(domain.DomainLogoImages);
      addImages(domain.DomainHeaderImages);
      addVideos(domain.DomainLogoVideos);

      console.log("Setup community");

      const communities = await getCommunities();
      communityIdsToKeep = communities.map(c => c.id);

      for (let i=0;i<communities.length;i++) {
        //addUsersIds([communities[i].user_id]);
        addUsers(communities[i].CommunityUsers);
        addUsers(communities[i].CommunityAdmins);
        addImages(communities[i].CommunityLogoImages);
        addImages(communities[i].CommunityHeaderImages);
        addVideos(communities[i].CommunityLogoVideos);
      }

      console.log("Setup group");

      const groups = await getGroups();
      groupIdsToKeep = groups.map(c => c.id);

      for (let i=0;i<groups.length;i++) {
        //addUsersIds([groups[i].user_id]);
        addUsers(groups[i].GroupUsers);
        addUsers(groups[i].GroupAdmins);
        addImages(groups[i].GroupLogoImages);
        addImages(groups[i].GroupHeaderImages);
        addVideos(groups[i].GroupLogoVideos);
      }

      const categories = await getCategories();

      categoryIdsToKeep = categories.map(c => c.id);

      const pages = await getPages();

      pageIdsToKeep = pages.map(p => p.id);

      console.log("Setup posts");

      const posts = await getPosts();
      postIdsToKeep = posts.map(p => p.id);

      for (let i=0;i<posts.length;i++) {
        if (posts[i].user_id==null) {
          console.error(`User id null for ${posts[i].id}`)
        } else {
          addUsersIds([posts[i].user_id]);
          addImages(posts[i].PostImages);
          addImages(posts[i].PostHeaderImages);
          addVideos(posts[i].PostVideos);
          addAudios(posts[i].PostAudios);
        }
      }

      console.log("Setup points");

      const points = await getPoints();
      pointIdsToKeep =  points.map(p => p.id);

      for (let i=0;i<points.length;i++) {
        addUsersIds([points[i].user_id]);
        addVideos(points[i].PointVideos);
        addAudios(points[i].PointAudios);
      }

      const endorsements = await getEndorsements();

      endorsementIdsToKeep =  endorsements.map(p => p.id);

      for (let i=0;i<endorsements.length;i++) {
        addUsersIds([endorsements[i].user_id]);
      }

      const qualities = await getQualities();

      qualityIdsToKeep = qualities.map(p => p.id);

      for (let i=0;i<qualities.length;i++) {
        addUsersIds([qualities[i].user_id]);
      }

      const pointRevisions = await getPointRevisions();

      pointRevisionIdsToKeep = pointRevisions.map(p => p.id);

      console.log("Setup activities");

      const activities = await getActivities();

      activityIdsToKeep =  activities.map(a => a.id);

      for (let i=0;i<activities.length;i++) {
        if (activities[i].user_id)
          addUsersIds([activities[i].user_id]);
        else
          console.warn(`No user_id for activity ${activities[i].id}`)
      }

      const users = await getUsers();

      for (let i=0;i<users.length;i++) {
        addImages(users[i].UserProfileImages);
        addImages(users[i].UserHeaderImages);
      }

      const videos = await getVideos();

      for (let i=0;i<videos.length;i++) {
        addVideos(videos[i].VideoImages);
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteVideos() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying videos images")
    const videos = await models.Video.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: videoIdsToKeep
          }
        }});

    for (let i=0;i<videos.length;i++) {
      await videos[i].setVideoImages([]);
    }

    console.log("Destroying videos")
    await models.Video.unscoped().destroy({ where: {
        id: {
          [models.Sequelize.Op.notIn]: videoIdsToKeep
        }
      }});
    resolve();
  })
}

async function deletePointAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying PointAssociations ")
    const points = await models.Point.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: pointIdsToKeep
          }
        }});

    for (let i=0;i<points.length;i++) {
      await points[i].setPointVideos([]);
      await points[i].setPointAudios([]);
    }

    resolve();
  })
}

async function deletePostAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying PostAssociations ")
    const posts = await models.Post.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: postIdsToKeep
          }
        }});

    for (let i=0;i<posts.length;i++) {
      await posts[i].setPostVideos([]);
      await posts[i].setPostAudios([]);
      await posts[i].setPostImages([]);
      await posts[i].setPostHeaderImages([]);
    }

    resolve();
  })
}

async function deleteUserAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying UserAssociations ")
    const users = await models.User.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: userIdsToKeep
          }
        }});

    for (let i=0;i<users.length;i++) {
      await users[i].setUserProfileImages([]);
      await users[i].setUserHeaderImages([]);
      await users[i].setGroupUsers([]);
      await users[i].setCommunityUsers([]);
      await users[i].setDomainUsers([]);
      await users[i].setDomainAdmins([]);
      await users[i].setCommunityAdmins([]);
      await users[i].setGroupAdmins([]);
      await users[i].setOrganizationAdmins([]);
    }

    resolve();
  })
}

async function deleteGroupAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying GroupAssociations ")
    const groups = await models.Group.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: groupIdsToKeep
          }
        }});

    for (let i=0;i<groups.length;i++) {
      await groups[i].setGroupLogoVideos([]);
      await groups[i].setGroupLogoImages([]);
      await groups[i].setGroupHeaderImages([]);
      await groups[i].setGroupUsers([]);
      await groups[i].setGroupAdmins([]);
    }

    resolve();
  })
}

async function deleteCommunityAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying CommunityAssociations ")
    const communities = await models.Community.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: communityIdsToKeep
          }
        }});

    for (let i=0;i<communities.length;i++) {
      await communities[i].setCommunityLogoVideos([]);
      await communities[i].setCommunityLogoImages([]);
      await communities[i].setCommunityHeaderImages([]);
      await communities[i].setCommunityUsers([]);
      await communities[i].setCommunityAdmins([]);
    }

    resolve();
  })
}

async function deleteDomainAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying DomainAssociations ")
    const domains = await models.Domain.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: [domainIdToKeep]
          }
        }});

    for (let i=0;i<domains.length;i++) {
      await domains[i].setDomainLogoVideos([]);
      await domains[i].setDomainLogoImages([]);
      await domains[i].setDomainHeaderImages([]);
      await domains[i].setDomainUsers([]);
      await domains[i].setDomainAdmins([]);
    }

    resolve();
  })
}

async function deleteActivityAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying ActivitiesAssociations ")
    const activities = await models.AcActivity.unscoped().findAll({
      attributes: ['id']
    });

    for (let i=activities.length-1;i>1000000;i--) {
      await activities[i].setUsers([]);
      await activities[i].setAcActivities([]);
    }

    resolve();
  })
}


async function deleteNotificationAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying NoitficationAssociations ")
    const notifications = await models.AcNotification.unscoped().findAll(
      {
        attributes: ['id'],
      });

    for (let i=0;i<notifications.length;i++) {
      await notifications[i].setUsers([]);
      await notifications[i].setAcActivities([]);
      await notifications[i].setAcDelayedNotifications([]);
    }

    resolve();
  })
}

async function deleteImageAssociations() {
  return await new Promise(async (resolve, reject) => {
    console.log("Destroying ImageAssociations ")
    const images = await models.Image.unscoped().findAll(
      {
        attributes: ['id'],
        where: {
          id: {
            [models.Sequelize.Op.notIn]: imageIdsToKeep
          }
        },
    });

    for (let i=0;i<images.length;i++) {
      await images[i].setVideoImages([]);
    }

    resolve();
  })
}
async function deleteInChunks(model, where) {
  return await new Promise(async (resolve, reject) => {
    try {
      let haveItemsToDelete = true;
      let offset = 0;
      while (haveItemsToDelete) {
        const items = await model.unscoped().findAll({
          where,
          attributes: ['id'],
          order: ['id'],
          offset: offset,
          limit: 2500
        });

        if (items.length > 0) {
          const modelIds = items.map(n=>{ return n.id});
          offset += 2500;
          console.log(`offset: ${offset}`)
          const destroyResults = await model.unscoped().destroy({
            where: {
              id: {
                [models.Sequelize.Op.in]: modelIds
              }
            }
          });
          const a = destroyResults;
        } else {
          haveItemsToDelete = false;
        }
      }
      resolve();
    } catch (error) {
      reject(error)
    }
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteAll() {
  return await new Promise(async (resolve, reject) => {
    try {
      //Only needs to run once
      //await deletePointAssociations();
      //await deletePostAssociations();
      //await deleteUserAssociations();
      //await deleteGroupAssociations();
      //await deleteCommunityAssociations();
      //await deleteDomainAssociations();
      //await deleteActivityAssociations();
      //await deleteNotificationAssociations();
      //await deleteImageAssociations();

      console.log("Destroying points")

      await deleteInChunks(models.Point.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: pointIdsToKeep
        }
      });

      console.log("Destroying point qualities")

      await deleteInChunks(models.PointQuality.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: qualityIdsToKeep
        }
      });

      console.log("Destroying point revision")

      await deleteInChunks(models.PointRevision.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: pointRevisionIdsToKeep
        }
      });

      console.log("Destroying post revision")

      await deleteInChunks(models.PostRevision.unscoped(), {
        post_id: null
      });

      console.log("Destroying temp data and not used 1")
      //await models.AcNewsFeedItem.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 2")
      //await models.AcNewsFeedProcessedRange.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 3")
      //await models.AcDelayedNotification.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 4")
      // You will need to temporarily disable some foreign key constraints
      //await models.AcNotification.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 5")
      // You will need to temporarily disable some foreign key constraints
      //await models.AcActivity.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 6")
      //await models.AcBackgroundJob.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 7")
      //await models.AcClientActivity.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 8")
      //await models.AcTranslationCache.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 9")
      //await models.GeneralDataStore.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 10")
      await deleteInChunks(models.Invite.unscoped(), {
      });
      console.log("Destroying temp data and not used 11")
      await deleteInChunks(models.PostStatusChange.unscoped(), {
      });
      await deleteInChunks(models.BulkStatusUpdate.unscoped(), {
      });
      console.log("Destroying temp data and not used 12")
      //await deleteInChunks(models.PostRevision.unscoped(), {
      //});
      console.log("Destroying temp data and not used 13")
      //await models.Rating.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 14")
      await models.UserLegacyPassword.unscoped().destroy({ truncate: true });
      console.log("Destroying temp data and not used 15")

      console.log("Destroying posts")
      await deleteInChunks(models.Post.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: postIdsToKeep
        }
      });

      console.log("Destroying endorsements")
      await deleteInChunks(models.Endorsement.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: endorsementIdsToKeep
        }
      });

      console.log("Destroying pages")
      await deleteInChunks(models.Page.unscoped(), {
          id: {
            [models.Sequelize.Op.notIn]: pageIdsToKeep
          }
        });

      console.log("Destroying categories")
      await deleteInChunks(models.Category.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: categoryIdsToKeep
        }
      });

      console.log("Destroying groups")
      await deleteInChunks(models.Group.unscoped(), {
          id: {
            [models.Sequelize.Op.notIn]: groupIdsToKeep
          }
        });

      console.log("Destroying communities")
      await deleteInChunks(models.Community.unscoped(), {
          id: {
            [models.Sequelize.Op.notIn]: communityIdsToKeep
          }
        });

      console.log("Destroying domains")
      await deleteInChunks(models.Domain.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: [domainIdToKeep]
        }
      });

      await deleteVideos();

      console.log("Destroying audios")
      await deleteInChunks(models.Audio.unscoped(), {
          id: {
            [models.Sequelize.Op.notIn]: audioIdsToKeep
          }
        });

      console.log("Destroying images")
      await deleteInChunks(models.Image.unscoped(), {
        id: {
          [models.Sequelize.Op.notIn]: imageIdsToKeep
        }
      });

      console.log("Destroying users")
      let haveItemsToDelete = true;
      let offset = 0;
      let deletedItems=0;
      while (haveItemsToDelete) {
        const allUsers = await models.User.unscoped().findAll({
          attributes: ['id'],
          limit: 2500,
          offset: offset
        });

        const allUserIds = allUsers.map(u=>u.id);

        const userIdsToDelete = allUserIds.filter(uid=>{
          return userIdsToKeep.indexOf(uid) === -1;
        });

        if (userIdsToDelete.indexOf(56884) > -1) {
          console.log("DELETING 56884");
        }

        if (userIdsToDelete.length>0) {
          deletedItems+=userIdsToDelete.length;
          await models.User.unscoped().destroy({
            where: {
              id: {
                [models.Sequelize.Op.in]: userIdsToDelete
              }
            }
          });
          offset+=2500;
          console.log(offset);
        } else {
          haveItemsToDelete=false;
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  })
}

// .minio.sys/buckets/minio.yrpri.production/034dc9ad-1503-455f-9fcc-50549d373212-small.png/fs.json
// minio.yrpri.production/034dc9ad-1503-455f-9fcc-50549d373212-small.png

async function copyVideosToMinio() {
  return await new Promise(async (resolve, reject) => {
    try {
      const videos = await models.Video.unscoped().findAll(
        {
          attributes: ['id','formats'],
        });

      for (let i=0;i<videos.length;i++) {
        const formats = videos[i].formats;
        for (let f=0;f<formats.length;f++) {
          const newUrl = await copyFileFromS3ToMinio("minio-video-public", formats[f]);
          formats[f] = newUrl;
          console.log(newUrl);
        }
        videos[i].formats = formats;
        videos[i].changed('formats', true);
        await videos[i].save();
      }

      resolve();
    } catch (error) {
      reject(error)
    }
  })
}

async function copyImagesToMinio() {
  return await new Promise(async (resolve, reject) => {
    try {
      const images = await models.Image.unscoped().findAll(
        {
          attributes: ['id','formats'],
          });

      for (let i=0;i<images.length;i++) {
        const formats = JSON.parse(images[i].formats);
        for (let f=0;f<formats.length;f++) {
          const newUrl = await copyFileFromS3ToMinio("minio.yrpri.production", formats[f]);
          formats[f] = newUrl;
        }
        images[i].formats = JSON.stringify(formats);
        await images[i].save();
      }
      resolve();
    } catch (error) {
      reject(error)
    }
  })
}

async function copyAudiosToMinio() {
  return await new Promise(async (resolve, reject) => {
    try {
      const audios = await models.Audio.unscoped().findAll(
        {
          attributes: ['id','formats'],
          });

      for (let i=0;i<audios.length;i++) {
        const formats = audios[i].formats;
        for (let f=0;f<formats.length;f++) {
          const newUrl = await copyFileFromS3ToMinio("minio-audio-public", formats[f]);
          formats[f] = newUrl;
          console.log(`New ${newUrl}`)
        }
        audios[i].formats = formats;
        audios[i].changed('formats', true);
        await audios[i].save();
      }
      resolve();
    } catch (error) {
      reject(error)
    }
  })
}

async function copyAllToMinio() {
  return await new Promise(async (resolve, reject) => {
    try {
      await copyImagesToMinio();
      await copyVideosToMinio();
      await copyAudiosToMinio();
      resolve();
    } catch (error) {
      reject(error)
    }
  })
}

async function copyFileFromS3ToMinio(bucket, url) {
  return await new Promise(async (resolve, reject) => {
    try {
      const filename = url.substring(url.lastIndexOf('/')+1);
      const filetype = filename.substring(filename.lastIndexOf('.')+1).toLowerCase();
      const minioFilePath = `${minioDataPath}/${bucket}/${filename}`;
      const minioMetaDataFolderPath = `${minioDataPath}/.minio.sys/buckets/${bucket}/${filename}`;
      const fsContentType = ["png","jpeg","jpg"].indexOf(filetype) > -1 ? `image/${filetype}` : `application/octet-stream`
      const fsFileContent = `{"version":"1.0.2","checksum":{"algorithm":"","blocksize":0,"hashes":null},"meta":{"content-type":"${fsContentType}","etag":"3df11831a2ace04090b85676183f778a"}}`;

      https.get(url, response => {
        if (response.statusCode === 200) {
          const stream = fs.createWriteStream(minioFilePath)
          response.pipe(stream)
          stream.on('finish', function() {
            stream.close(()=>{
              fs.mkdirSync(minioMetaDataFolderPath, { recursive: true });
              fs.writeFileSync(`${minioMetaDataFolderPath}/fs.json`,fsFileContent);
              console.log(`Copy completed for ${url}`);
              const newUrlPath = `${minioBaseUrlPath}/${bucket}/${filename}`;
              resolve(newUrlPath);
            });
          });
        } else {
          reject("Can't find url to download");
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

(async () => {
  console.log("Setup ids to keep");
  await setupIdsToKeep();
  //await deleteAll();
  await copyAllToMinio();
  console.log(`Destroying all except domain id ${domainIdToKeep} completed`)
  process.exit();
})();
