var auth = require('authorized');

// ADMIN AND VIEW

// User admin

auth.role('user.admin', function (user, req, done) {
  if (!req.isAuthenticated()) {
    done(null, false);
  } else {
    User.findOne({
      where: { id: user.id }
    }).then(function (user) {
      if (user.user_id === req.user.id) {
        done(null, true);
      } else {
        done(null, false);
      }
    });
  }
});

auth.entity('user', function(req, done) {
  var match = req.url.match(/^\/users\/(\w+)/);
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
    Domain.findOne({
      where: { id: domain.id }
    }).then(function (domain) {
      if (domain.user_id === req.user.id) {
        done(null, true);
      } else {
        domain.hasAdminUser(req.user).then(function (result) {
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
  Domain.findOne({
    where: { id: domain.id }
  }).then(function (domain) {
    if (domain.access === Domain.ACCESS_PUBLIC) {
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
  var match = req.url.match(/^\/domains\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /domains/:domainId'));
  } else {
    var domain = { id: match[1] };
    done(null, domain)
  }
});

// Group admin and view

auth.role('group.admin', function (group, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    Group.findOne({
      where: { id: group.id }
    }).then(function (group) {
      if (group.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasAdminUser(req.user).then(function (result) {
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
  Group.findOne({
    where: { id: group.id }
  }).then(function (group) {
    if (group.access === Group.ACCESS_PUBLIC) {
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
  var match = req.url.match(/^\/groups\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /groups/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Idea admin and view

auth.role('idea.admin', function (idea, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    Idea.findOne({
      where: { id: idea.id }
    }).then(function (idea) {
      var group = Idea.Group;
      if (group.access === Group.ACCESS_PUBLIC) {
        done(null, true);
      }  else if (!req.isAuthenticated()) {
        done(null, false);
      } else if (idea.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasAdminUser(req.user).then(function (result) {
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

auth.role('idea.viewUser', function (idea, req, done) {
  Idea.findOne({
    where: { id: idea.id },
    include: [
      models.Group
    ]
  }).then(function (idea) {
    var group = idea.Group;
    if (group.access === Group.ACCESS_PUBLIC) {
      done(null, true);
    }  else if (!req.isAuthenticated()) {
      done(null, false);
    } else if (idea.user_id === req.user.id) {
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

auth.entity('idea', function(req, done) {
  var match = req.url.match(/^\/ideas\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /ideas/:ideaId'));
  } else {
    var idea = { id: match[1] };
    done(null, idea)
  }
});

// Category admin and view

auth.role('category.admin', function (category, req, done) {
  if (!req.isAuthenticated()) {
    done();
  } else {
    Category.findOne({
      where: { id: category.id }
    }).then(function (category) {
      var group = category.Group;
      if (group.access === Group.ACCESS_PUBLIC) {
        done(null, true);
      }  else if (!req.isAuthenticated()) {
        done(null, false);
      } else if (category.user_id === req.user.id) {
        done(null, true);
      } else {
        group.hasAdminUser(req.user).then(function (result) {
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
  Category.findOne({
    where: { id: category.id },
    include: [
      models.Group
    ]
  }).then(function (category) {
    var group = category.Group;
    if (group.access === Group.ACCESS_PUBLIC) {
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
  var match = req.url.match(/^\/categories\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /categories/:categoryId'));
  } else {
    var category = { id: match[1] };
    done(null, idea)
  }
});

// CREATE

// Create category

auth.role('createGroupCategory.createCategory', function (group, req, done) {
  Group.findOne({
    where: { id: group.id }
  }).then(function (group) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.access === Group.ACCESS_PUBLIC) {
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
});

auth.entity('createGroupCategory', function(req, done) {
  var match = req.url.match(/^\/categories\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /categories/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Create idea

auth.role('createGroupIdea.createIdea', function (group, req, done) {
  Group.findOne({
    where: { id: group.id }
  }).then(function (group) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (group.access === Group.ACCESS_PUBLIC) {
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
});

auth.entity('createGroupIdea', function(req, done) {
  var match = req.url.match(/^\/ideas\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /ideas/:groupId'));
  } else {
    var group = { id: match[1] };
    done(null, group)
  }
});

// Create group

auth.role('createCommunityGroup.createGroup', function (community, req, done) {
  Community.findOne({
    where: { id: community.id }
  }).then(function (community) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (community.access === Community.ACCESS_PUBLIC) {
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
  var match = req.url.match(/^\/groups\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /groups/:communityId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

// Create community

auth.role('createDomainCommunity.createCommunity', function (domain, req, done) {
  Domain.findOne({
    where: { id: domain.id }
  }).then(function (domain) {
    if (!req.isAuthenticated()) {
      done(null, false);
    } else if (domain.access === Domain.ACCESS_PUBLIC) {
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
  var match = req.url.match(/^\/communities\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /communities/:domainId'));
  } else {
    var community = { id: match[1] };
    done(null, community)
  }
});

auth.action('edit domain', ['domain.admin']);
auth.action('edit community', ['community.admin']);
auth.action('edit group', ['group.admin']);
auth.action('edit idea', ['idea.admin']);
auth.action('edit user', ['user.admin']);
auth.action('edit category', ['category.admin']);

auth.action('view domain', ['domain.viewUser']);
auth.action('view community', ['community.viewUser']);
auth.action('view group', ['group.viewUser']);
auth.action('view idea', ['idea.viewUser']);
auth.action('view category', ['category.viewUser']);

auth.action('create community', ['createDomainCommunity.createCommunity']);
auth.action('create group', ['createCommunityGroup.createGroup']);
auth.action('create idea', ['createGroupIdea.createIdea']);
auth.action('create category', ['createGroupCategory.createCategory']);

module.exports = auth;