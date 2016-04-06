var auth = require('authorized');
var models = require("./models");
var log = require('./utils/logger');

// COMMON

auth.authNeedsGroupForCreate = function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id }
  }).then(function (group) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    } else if (group.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
};

auth.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    log.info('User is Logged in', { context: 'isLoggedInAuth', user: req.user });
    return next();
  } else {
    log.info('User is Not Logged in', { context: 'isLoggedInAuth', user: req.user, errorStatus: 401});
    res.send(401, 'Unauthorized');
  }
};

// ADMIN AND VIEW

// User admin
auth.role('user.admin', function (user, req, done) {
  if (!req.isAuthenticated()) {
    done(null, false);
  } else {
    models.User.findOne({
      where: { id: user.id }
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
        // TODO: Remove hardcoded hack!
      } else if (req.user.email==='robert@citizens.is' || req.user.email==='gunnar@citizens.is') {
        done(null, true);
      } else {
        domain.hasDomainAdmin(req.user).then(function (result) {
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
    done(new Error('Expected url like /domsains/:domainId'));
  } else {
    var domain = { id: match[1] };
    done(null, domain)
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
        community.hasCommunityAdmin(req.user).then(function (result) {
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
    if (community.access === models.Community.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.user_id === req.user.id) {
      done(null, true);
    } else {
      community.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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
        group.hasGroupAdmin(req.user).then(function (result) {
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
    where: { id: group.id }
  }).then(function (group) {
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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
        group.hasGroupAdmin(req.user).then(function (result) {
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
  models.Post.findOne({
    where: { id: post.id },
    include: [
      models.Group
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
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.role('post.vote', function (post, req, done) {
  models.Post.findOne({
    where: { id: post.id },
    include: [
      models.Group
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
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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

auth.role('point.admin', function (point, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    models.Point.findOne({
      where: { id: post.id }
    }).then(function (point) {
      if (!req.isAuthenticated()) {
        done(null, false);
      } else if (point.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasGroupAdmin(req.user).then(function (result) {
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

auth.role('point.viewUser', function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    include: [
      {
        model: models.Post,
        include: [
          models.Group
        ]
      }
    ]
  }).then(function (point) {
    var group = point.Post.Group;
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (point.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
    }
  });
});

auth.role('image.viewUser', function (image, req, done) {
  models.Image.findOne({
    where: { id: image.id },
    include: [
      {
        model: models.Post,
        include: [
          models.Group
        ]
      }
    ]
  }).then(function (image) {
    var group = image.Post.Group;
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (point.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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
      } else {
        group.hasUser(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            done(null, false);
          }
        });
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
        group.hasGroupAdmin(req.user).then(function (result) {
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
      models.Group
    ]
  }).then(function (category) {
    var group = category.Group;
    if (group.access === models.Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (category.user_id === req.user.id) {
      done(null, true);
    } else {
      group.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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

// Create category

auth.role('createGroupCategory.createCategory', function (group, req, done) {
  auth.authNeedsGroupForCreate(group, req, done);
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
      community.hasUser(req.user).then(function (result) {
        if (result) {
          done(null, true);
        } else {
          done(null, false);
        }
      });
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

auth.entity('createDomainCommunity', function(req, done) {
  var match = req.originalUrl.match(/communities\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /communities/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

auth.action('edit domain', ['domain.admin']);
auth.action('edit community', ['community.admin']);
auth.action('edit group', ['group.admin']);
auth.action('edit post', ['post.admin']);
auth.action('edit user', ['user.admin']);
auth.action('edit category', ['category.admin']);
auth.action('edit point', ['point.admin']);

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

auth.action('create community', ['createDomainCommunity.createCommunity']);
auth.action('create group', ['createCommunityGroup.createGroup']);
auth.action('create post', ['createGroupPost.createPost']);
auth.action('create category', ['createGroupCategory.createCategory']);
auth.action('create point', ['createGroupPoint.createPoint']);

module.exports = auth;