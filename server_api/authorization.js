var auth = require('authorized');
var models = require("./models");
var log = require('./utils/logger');
var toJson = require('./utils/to_json');

// COMMON

auth.authNeedsGroupForCreate = function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ['id','access']
      }
    ]
  }).then(function (group) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    } else if (group.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
    }
  });
};

auth.hasCommunityAccess = function (community, req, done) {
  community.hasCommunityUsers(req.user).then(function (result) {
    if (result) {
      done(null, true);
    } else {
      community.hasCommunityAdmins(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
};

auth.authNeedsGroupAdminForCreate = function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ['id','access']
      }
    ]
  }).then(function (group) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasGroupAdmins(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else if (group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY) {
          group.Community.hasCommunityAdmins(req.user).then(function (result) {
            if (result) {
              done(null, true);
            } else {
              done(null, false);
            }
          });
        } else {
          done(null, false);
        }
      });
    }
  });
};

auth.authNeedsCommunnityAdminForCreate = function (community, req, done) {
  models.Community.findOne({
    where: { id: community.id }
  }).then(function (community) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.user_id === req.user.id) {
      done(null, true);
    } else {
      community.hasCommunityAdmins(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
};

auth.hasDomainAdmin = function (domainId, req, done) {
  models.Domain.findOne({
    where: { id: domainId }
  }).then(function (domain) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (domain.user_id === req.user.id) {
      done(null, true);
    } else {
      domain.hasDomainAdmins(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
};

auth.isGroupMemberOrOpenToCommunityMember = function (group, req, done) {
  if (group) {
    group.hasGroupUsers(req.user).then(function (result) {
      if (result) {
        done(null, true);
      } else if (group.Community && group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY) {
        group.Community.hasCommunityUsers(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            group.Community.hasCommunityAdmins(req.user).then(function (result) {
              if (result) {
                done(null, true);
              } else {
                done(null, false);
              }
            });
          }
        });
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    }).catch(function (error) {
      done(error, false);
    });
  } else {
    done(null, false);
  }
};

auth.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    log.info('User is Logged in', { context: 'isLoggedInAuth', user: toJson(req.user) });
    return next();
  } else {
    log.info('User is Not Logged in', { context: 'isLoggedInAuth', user: toJson(req.user), errorStatus: 401});
    res.status(401);
  }
};

// ADMIN AND VIEW

// User admin
auth.role('user.admin', function (user, req, done) {
  if (!req.isAuthenticated()) {
    done(null, false);
  } else {
    models.User.findOne({
      where: { id: user.id },
      attributes: ['id']
    }).then(function (user) {
      if (user.id === req.user.id) {
        done(null, true);
      } else {
        done(null, false);
      }
    });
  }
});

auth.entity('user', function(req, done) {
  var match = req.originalUrl.match(/users\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /users/:userId'));
  } else {
    var user = { id: match[1] };
    done(null, user)
  }
});

// Domain admin and view
auth.role('domain.admin', function (domain, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Domain.findOne({
      where: { id: domain.id }
    }).then(function (domain) {
      if (domain.user_id === req.user.id) {
        done(null, true);
      } else {
        domain.hasDomainAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('domain.viewUser', function (domain, req, done) {
  models.Domain.findOne({
    where: { id: domain.id }
  }).then(function (domain) {
    if (domain.access === models.Domain.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (domain.user_id === req.user.id) {
      done(null, true);
    } else {
      domain.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.entity('domain', function(req, done) {
  var match = req.originalUrl.match(/domains\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /domains/:domainId'));
  } else {
    var domain = { id: match[1] };
    done(null, domain)
  }
});

// Organization admin and view
auth.role('organization.admin', function (organization, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Organization.findOne({
      where: { id: organization.id }
    }).then(function (organization) {
      if (organization.user_id === req.user.id) {
        done(null, true);
      }  else {
        organization.hasOrganizationAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('organization.viewUser', function (organization, req, done) {
  models.Organization.findOne({
    where: { id: organization.id }
  }).then(function (organization) {
    if (organization.access === models.Organization.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (organization.user_id === req.user.id) {
      done(null, true);
    } else {
      organization.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.entity('organization', function(req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /organizations/:organizationId'));
  } else {
    var organization = { id: match[1] };
    done(null, organization);
  }
});

// Bulk Status Updates Admin
auth.role('bulkStatusUpdates.admin', function (community, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Community.findOne({
      where: { id: community.id }
    }).then(function (community) {
      if (community.user_id === req.user.id) {
        done(null, true);
      } else {
        community.hasCommunityAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.entity('bulkStatusUpdates', function(req, done) {
  var match = req.originalUrl.match(/bulk_status_updates\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /bulk_status_updates/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Community admin and view
auth.role('community.admin', function (community, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Community.findOne({
      where: { id: community.id }
    }).then(function (community) {
      if (community.user_id === req.user.id) {
        done(null, true);
      } else {
        community.hasCommunityAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('community.viewUser', function (community, req, done) {
  models.Community.findOne({
    where: { id: community.id }
  }).then(function (community) {
    if (!community) {
      done(null, false);
    } else if (community.access === models.Community.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.hasCommunityAccess(community, req, done);
    }
  });
});

auth.entity('community', function(req, done) {
  var match = req.originalUrl.match(/communities\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /communities/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Group admin and view
auth.role('group.admin', function (group, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Group.findOne({
      where: { id: group.id }
    }).then(function (group) {
      if (group.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('group.viewUser', function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ['id','access']
      }
    ]
  }).then(function (group) {
    if (group.access === models.Group.ACCESS_PUBLIC &&
        group.Community.access === models.Community.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
    }
  });
});

auth.entity('group', function(req, done) {
  var match = req.originalUrl.match(/groups\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /groups/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Post admin and view

auth.role('post.admin', function (post, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Post.findOne({
      where: { id: post.id },
      include: [
        models.Group
      ]
    }).then(function (post) {
      var group = post.Group;
      if (!req.isAuthenticated()) {
        done(null, false);
      } else if (post.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('post.statusChange', function (post, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Post.findOne({
      where: { id: post.id },
      include: [
        models.Group
      ]
    }).then(function (post) {
      var group = post.Group;
      if (!req.isAuthenticated()) {
        done(null, false);
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('post.viewUser', function (post, req, done) {
  //TODO: Profile this function for that second level Community include
  models.Post.findOne({
    where: { id: post.id },
    include: [
      {
        model: models.Group,
        required: true,
        attributes: ['id','access'],
        include: [
          {
            model: models.Community,
            required: true,
            attributes: ['id','access']
          }
        ]
      }
    ]
  }).then(function (post) {
    var group = post.Group;
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (post.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
    }
  });
});

auth.role('post.vote', function (post, req, done) {
  models.Post.findOne({
    where: { id: post.id },
    include: [
      {
        model: models.Group,
        include: [
          {
            model: models.Community,
            required: true,
            attributes: ['id','access']
          }
        ]
      }
    ]
  }).then(function (post) {
    var group = post.Group;
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    } else if (post.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
    }
  });
});

auth.entity('post', function(req, done) {
  var match = req.originalUrl.match(/posts\/(\w+)/);
  if (!match) {
    match = req.originalUrl.match(/images\/(\w+)/);
    if (!match)
      done(new Error('Expected url like /posts/:postId or /images/:postId'));
  }
  if (match) {
    var post = { id: match[1] };
    done(null, post)
  }
});

// Post admin and view

auth.role('point.delete', function (point, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } models.Point.findOne({
    where: { id: point.id },
    include: [
      {
        model: models.Post,
        include: [
          {
            model: models.Group,
            required: false
          }
        ],
        required: false
      },
      {
        model: models.Group,
        required: false
      }
    ]
  }).then(function (point) {
    var group;

    if (point && point.Post) {
      group = point.Post.Group;
    } else {
      group = point.Group;
    }

    if (point && group) {
      if (point.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    }
  })
});

auth.role('point.admin', function (point, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } models.Point.findOne({
    where: { id: point.id }
  }).then(function (point) {
    if (point.user_id === req.user.id) {
      done(null, true);
    } else {
      done(null, false);
    }
  })
});

auth.role('point.viewUser', function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    include: [
      {
        model: models.Post,
        include: [
          {
            model: models.Group,
            required: false,
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ['id','access']
              }
            ]
          }
        ],
        required: false
      },
      {
        model: models.Group,
        required: false
      }
    ]
  }).then(function (point) {
    var group;

    if (point && point.Post) {
      group = point.Post.Group;
    } else {
      group = point.Group;
    }

    if (point && group) {
      if (group.access === models.Group.ACCESS_PUBLIC) {
        done(null, true);
      } else if (!req.isAuthenticated()) {
        done(null, false);
      } else if (point.user_id === req.user.id) {
        done(null, true);
      } else if (group.Community) {
        auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  });
});

//TODO: Use this pattern of activities everywhere here for optimization
auth.role('image.viewUser', function (image, req, done) {
  models.Image.findOne({
    where: { id: image.id },
    attributes: ['id', 'user_id' ],
    include: [
      {
        model: models.Post,
        as: 'PostUserImages',
        attributes: ['id'],
        include: [
          {
            model: models.Group,
            attributes: ['id', 'access'],
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ['id','access']
              }
            ]
          }
        ]
      }
    ]
  }).then(function (image) {
    var group;
    if (image && image.PostUserImages && image.PostUserImages.length>0) {
      group = image.PostUserImages[0].Group;
    }
    if (group) {
      if (group.access === models.Group.ACCESS_PUBLIC) {
        done(null, true);
      }  else if (!req.isAuthenticated()) {
        done(null, false);
      } else if (group.user_id === req.user.id) {
        done(null, true);
      } else if (group.Community) {
        auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  });
});

auth.role('point.vote', function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    include: [
      {
        model: models.Post,
        include: [
          {
            model: models.Group,
            attributes: ['id', 'access'],
            required: false,
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ['id','access']
              }
            ]
          }
        ],
        required: false
      },
      {
        model: models.Group,
        required: false
      }
    ]
  }).then(function (point) {
    var group;

    if (point.Post) {
      group = point.Post.Group;
    } else {
      group = point.Group;
    }

    if (group) {
      if (!req.isAuthenticated()) {
        done(null, false);
      } else if (group.access === models.Group.ACCESS_PUBLIC) {
        done(null, true);
      } else if (point.user_id === req.user.id) {
        done(null, true);
      } else if (group.Community) {
        auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  });
});

auth.entity('point', function(req, done) {
  var match = req.originalUrl.match(/points\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /points/:pointId'));
  } else {
    var point = { id: match[1] };
    done(null, point)
  }
});

auth.entity('image', function(req, done) {
  var match = req.originalUrl.match(/images\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /images/:imageId'));
  } else {
    var image = { id: match[1] };
    done(null, image)
  }
});

// Category admin and view

auth.role('category.admin', function (category, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Category.findOne({
      where: { id: category.id }
    }).then(function (category) {
      var group = category.Group;
      if (!req.isAuthenticated()) {
        done(null, false);
      } else if (category.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
      }
    });
  }
});

auth.role('category.viewUser', function (category, req, done) {
  models.Category.findOne({
    where: { id: category.id },
    include: [
      {
        model: models.Group,
        attributes: ['id', 'access'],
        required: false,
        include: [
          {
            model: models.Community,
            required: false,
            attributes: ['id','access']
          }
        ]
      }
    ]
  }).then(function (category) {
    var group = category.Group;
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (category.user_id === req.user.id) {
      done(null, true);
    } else if (group.Community) {
      auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
    } else {
      done(null, false);
    }
  });
});

auth.entity('category', function(req, done) {
  var match = req.originalUrl.match(/categories\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /categories/:categoryId'));
  } else {
    var category = { id: match[1] };
    done(null, category)
  }
});

// CREATE

// Create bulkStatusUpdate

auth.role('createCommunityBulkStatusUpdate.createBulkStatusUpdate', function (community, req, done) {
  auth.authNeedsCommunnityAdminForCreate(community, req, done);
});

auth.entity('createCommunityBulkStatusUpdate', function(req, done) {
  var match = req.originalUrl.match(/bulk_status_updates\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /bulk_status_update/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Create category

auth.role('createGroupCategory.createCategory', function (group, req, done) {
  auth.authNeedsGroupAdminForCreate(group, req, done);
});

auth.entity('createGroupCategory', function(req, done) {
  var match = req.originalUrl.match(/categories\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /categories/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Create post

auth.role('createGroupPost.createPost', function (group, req, done) {
  auth.authNeedsGroupForCreate(group, req, done);
});

auth.entity('createGroupPost', function(req, done) {
  var match = req.originalUrl.match(/posts\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /posts/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Create point

auth.role('createGroupPoint.createPoint', function (group, req, done) {
  auth.authNeedsGroupForCreate(group, req, done);
});

auth.entity('createGroupPoint', function(req, done) {
  var match = req.originalUrl.match(/points\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /points/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Create group

auth.role('createCommunityGroup.createGroup', function (community, req, done) {
  models.Community.findOne({
    where: { id: community.id }
  }).then(function (community) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.access === models.Community.ACCESS_PUBLIC) {
      done(null, true);
    } else if (community.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.hasCommunityAccess(community, req, done);
    }
  });
});

auth.entity('createCommunityGroup', function(req, done) {
  var match = req.originalUrl.match(/groups\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /groups/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Create community

auth.role('createDomainCommunity.createCommunity', function (domain, req, done) {
  models.Domain.findOne({
    where: { id: domain.id }
  }).then(function (domain) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (domain.access === models.Domain.ACCESS_PUBLIC) {
      done(null, true);
    } else if (domain.user_id === req.user.id) {
      done(null, true);
    } else {
      domain.hasDomainUsers(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.entity('createDomainCommunity', function(req, done) {
  var match = req.originalUrl.match(/communities\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /communities/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Create organization

auth.role('createDomainOrganization.createDomainOrganization', function (domain, req, done) {
  models.Domain.findOne({
    where: { id: domain.id }
  }).then(function (domain) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (domain.access === models.Domain.ACCESS_PUBLIC) {
      done(null, true);
    } else if (domain.user_id === req.user.id) {
      done(null, true);
    } else {
      domain.hasDomainUsers(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.role('createCommunityOrganization.createCommunityOrganization', function (domain, req, done) {
  models.Community.findOne({
    where: { id: community.id }
  }).then(function (community) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.access === models.Domain.ACCESS_PUBLIC) {
      done(null, true);
    } else if (community.user_id === req.user.id) {
      done(null, true);
    } else {
      auth.hasCommunityAccess(community, req, done);
    }
  });
});

auth.entity('createDomainOrganization', function(req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /organizations/:domainId'));
  } else {
    var domain = { id: match[1] };
    done(null, domain)
  }
});

auth.entity('createCommunityOrganization', function(req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /organizations/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

auth.action('edit domain', ['domain.admin']);
auth.action('edit organization', ['organization.admin']);
auth.action('edit community', ['community.admin']);
auth.action('edit group', ['group.admin']);
auth.action('edit post', ['post.admin']);
auth.action('send status change', ['post.statusChange']);
auth.action('edit user', ['user.admin']);
auth.action('edit category', ['category.admin']);
auth.action('edit point', ['point.admin']);
auth.action('delete point', ['point.delete']);
auth.action('edit bulkStatusUpdate', ['bulkStatusUpdates.admin']);

auth.action('view organization', ['organization.viewUser']);
auth.action('view domain', ['domain.viewUser']);
auth.action('view community', ['community.viewUser']);
auth.action('view group', ['group.viewUser']);
auth.action('view post', ['post.viewUser']);
auth.action('view category', ['category.viewUser']);
auth.action('view point', ['point.viewUser']);

auth.action('view image', ['image.viewUser']);

auth.action('vote on post', ['post.vote']);
auth.action('vote on point', ['point.vote']);

auth.action('add post user images', ['post.vote']);

auth.action('create domainOrganization', ['createDomainOrganization.createDomainOrganization']);
auth.action('create communityOrganization', ['createCommunityOrganization.createCommunityOrganization']);
auth.action('create community', ['createDomainCommunity.createCommunity']);
auth.action('create group', ['createCommunityGroup.createGroup']);
auth.action('create post', ['createGroupPost.createPost']);
auth.action('create category', ['createGroupCategory.createCategory']);
auth.action('create point', ['createGroupPoint.createPoint']);
auth.action('create bulkStatusUpdate', ['createCommunityBulkStatusUpdate.createBulkStatusUpdate']);

module.exports = auth;