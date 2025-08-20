var auth = require("authorized");
var models = require("./models/index.cjs");
var log = require("./utils/logger.cjs");
var toJson = require("./utils/to_json.cjs");

var isAuthenticatedAndCorrectLoginProvider = function (req, group, done) {
  var isCorrectLoginProviderAndAgency = true;
  if (group) {
    if (
      (group.configuration && group.configuration.forceSecureSamlLogin) ||
      (group.Community &&
        group.Community.configuration &&
        group.Community.configuration.forceSecureSamlLogin)
    ) {
      if (req.user) {
        group.hasGroupAdmins(req.user).then(function (result) {
          if (!result) {
            if (req.user.loginProvider !== "saml")
              isCorrectLoginProviderAndAgency = false;

            if (
              group.configuration.forceSecureSamlEmployeeLogin &&
              (!req.user.private_profile_data ||
                !req.user.private_profile_data.saml_agency)
            ) {
              isCorrectLoginProviderAndAgency = false;
            }

            if (
              group.Community.configuration &&
              group.Community.configuration.ssnLoginListDataId &&
              req.user.ssn
            ) {
              models.GeneralDataStore.findOne({
                where: {
                  id: group.Community.configuration.ssnLoginListDataId,
                  "data.ssns::jsonb": {
                    $contains: '["' + req.user.ssn + '"]',
                  },
                },
                attributes: ["id"],
              })
                .then((item) => {
                  if (item) {
                    isCorrectLoginProviderAndAgency = true;
                  } else {
                    isCorrectLoginProviderAndAgency = false;
                  }
                  done(
                    auth.isAuthenticated(req, group) &&
                      isCorrectLoginProviderAndAgency
                  );
                })
                .catch((error) => {
                  log.error("Error in isAuthenticatedAndCorrectLoginProvider", {
                    error,
                  });
                  done(auth.isAuthenticated(req, group) && false);
                });
            } else {
              done(
                auth.isAuthenticated(req, group) &&
                  isCorrectLoginProviderAndAgency
              );
            }
          } else {
            done(
              auth.isAuthenticated(req, group) &&
                isCorrectLoginProviderAndAgency
            );
          }
        });
      } else {
        isCorrectLoginProviderAndAgency = false;
        done(
          auth.isAuthenticated(req, group) && isCorrectLoginProviderAndAgency
        );
      }
    } else {
      done(auth.isAuthenticated(req, group) && isCorrectLoginProviderAndAgency);
    }
  } else {
    log.error("Error no group for isAuthenticatedAndCorrectLoginProvider");
    done(false);
  }
};

auth.isAuthenticated = function (req, group) {
  if (group) {
    if (group.configuration) {
      if (
        group.configuration.allowAnonymousUsers ||
        group.configuration.allowOneTimeLoginWithName
      ) {
        log.info("isAuthenticated: Group allows anonymous users");
      } else {
        log.info("isAuthenticated: Group does not allow anonymous users");
      }
    } else {
      log.info("isAuthenticated: No group config");
    }
  } else {
    log.info("isAuthenticated: No group");
  }

  if (req.user) {
    if (
      req.user &&
      req.user.profile_data &&
      req.user.profile_data.isAnonymousUser
    ) {
      log.info("isAuthenticated: Is anonymous user");
    } else {
      log.info("isAuthenticated: Is regular user");
    }
  } else if (
    false &&
    process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY &&
    req.headers["x-api-key"] === process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
  ) {
    log.info("isAuthenticated: Is API key user");
    return true;
  } else {
    log.info("isAuthenticated: No user");
  }

  if (
    req.user &&
    req.user.profile_data &&
    req.user.profile_data.isAnonymousUser === true
  ) {
    return (
      group &&
      group.configuration &&
      (group.configuration.allowAnonymousUsers ||
        group.configuration.allowOneTimeLoginWithName)
    );
  } else {
    return req.isAuthenticated();
  }
};

auth.isAuthenticatedNoAnonymousCheck = function (req) {
  return req.isAuthenticated();
};

auth.authNeedsGroupForCreate = function (group, req, done) {
  if (
    process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY &&
    req.headers["x-api-key"] === process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
  ) {
    done(null, true);
  } else {
    models.Group.findOne({
      where: { id: group.id },
      attributes: ["id", "access", "user_id", "configuration"],
      include: [
        {
          model: models.Community,
          required: true,
          attributes: ["id", "access", "user_id", "configuration"],
        },
      ],
    })
      .then(function (group) {
        isAuthenticatedAndCorrectLoginProvider(req, group, function (results) {
          if (!results) {
            done(null, false);
          } else {
            if (group.access === models.Group.ACCESS_PUBLIC) {
              done(null, true);
            } else if (req.user && group.user_id === req.user.id) {
              done(null, true);
            } else {
              auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
            }
          }
        });
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
};

auth.hasCommunitySsnLoginListAccess = function (community, req, done) {
  if (
    community.configuration &&
    community.configuration.ssnLoginListDataId &&
    req.user.ssn
  ) {
    models.GeneralDataStore.findOne({
      where: {
        id: community.configuration.ssnLoginListDataId,
        "data.ssns::jsonb": {
          $contains: '["' + req.user.ssn + '"]',
        },
      },
      attributes: ["id"],
    })
      .then((item) => {
        if (item) {
          done(null, true);
        } else {
          done(null, false);
        }
      })
      .catch((error) => {
        done(error, false);
      });
  } else {
    done(null, false);
  }
};

auth.hasCommunityAccess = function (community, req, done) {
  community
    .hasCommunityUsers(req.user)
    .then(function (result) {
      if (result) {
        done(null, true);
      } else {
        community.hasCommunityAdmins(req.user).then(function (result) {
          if (result) {
            done(null, true);
          } else {
            auth.hasCommunitySsnLoginListAccess(community, req, done);
          }
        });
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
};

auth.authNeedsGroupAdminForCreate = function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    attributes: ["id", "access", "user_id"],
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ["id", "access", "user_id", "configuration"],
      },
    ],
  })
    .then(function (group) {
      if (!auth.isAuthenticated(req, group)) {
        done(null, false);
      } else if (group.user_id === req.user.id) {
        done(null, true);
      } else {
        group
          .hasGroupAdmins(req.user)
          .then(function (result) {
            if (result) {
              done(null, true);
            } else if (group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY) {
              group.Community.hasCommunityAdmins(req.user).then(function (
                result
              ) {
                if (result) {
                  done(null, true);
                } else {
                  done(null, false);
                }
              });
            } else {
              done(null, false);
            }
          })
          .catch(function (error) {
            log.error("Error in authentication", { error });
            done(null, false);
          });
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
};

auth.authNeedsCommunityAdminForCreate = function (community, req, done) {
  models.Community.findOne({
    where: { id: community.id },
    attributes: ["id", "access", "user_id", "configuration"],
  })
    .then(function (community) {
      if (!auth.isAuthenticated(req)) {
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
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
};

auth.hasDomainAdmin = function (domainId, req, done) {
  models.Domain.findOne({
    where: { id: domainId },
    attributes: ["id", "access"],
  })
    .then(function (domain) {
      if (!auth.isAuthenticated(req)) {
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
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
};

auth.isGroupMemberOrOpenToCommunityMember = function (group, req, done) {
  if (group) {
    if (
      group.Community &&
      group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY &&
      group.Community.access === models.Community.ACCESS_PUBLIC
    ) {
      done(null, true);
    } else if (
      !auth.isAuthenticated(req) &&
      //TODO: Come up with a better way to handle this than a master API key
      !process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
    ) {
      done(null, false);
    } else if (
      !auth.isAuthenticated(req) &&
      process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
    ) {
      if (
        req.headers["x-api-key"] ===
        process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
      ) {
        done(null, true);
      } else {
        done(null, false);
      }
    } else {
      group
        .hasGroupUsers(req.user)
        .then(function (result) {
          if (result) {
            done(null, true);
          } else if (
            group.Community &&
            (group.access === models.Group.ACCESS_OPEN_TO_COMMUNITY ||
              group.access === models.Group.ACCESS_PUBLIC)
          ) {
            if (group.Community.access === models.Community.ACCESS_PUBLIC) {
              done(null, true);
            } else {
              group.Community.hasCommunityUsers(req.user).then(function (
                result
              ) {
                if (result) {
                  done(null, true);
                } else {
                  group.Community.hasCommunityAdmins(req.user).then(function (
                    result
                  ) {
                    if (result) {
                      done(null, true);
                    } else {
                      auth.hasCommunitySsnLoginListAccess(
                        group.Community,
                        req,
                        done
                      );
                    }
                  });
                }
              });
            }
          } else {
            group.hasGroupAdmins(req.user).then(function (result) {
              if (result) {
                done(null, true);
              } else {
                done(null, false);
              }
            });
          }
        })
        .catch(function (error) {
          done(error, false);
        });
    }
  } else {
    done(null, false);
  }
};

auth.isLoggedIn = function (req, res, next) {
  if (auth.isAuthenticated(req)) {
    log.info("Logged in", {
      context: "isLoggedInAuth",
      userId: req.user ? req.user.id : -1,
    });
    return next();
  } else {
    log.info("Not Logged in", { context: "isLoggedInAuth", errorStatus: 401 });
    next({ status: 401, error: "Not authorized" });
  }
};

auth.isLoggedInNoAnonymousCheck = function (req, res, next) {
  if (auth.isAuthenticatedNoAnonymousCheck(req)) {
    log.info("User is Logged in", {
      context: "isLoggedInNoAnonymousCheck",
      userId: req.user ? req.user.id : -1,
    });
    return next();
  } else {
    log.info("Not Logged in", {
      context: "isLoggedInNoAnonymousCheck",
      errorStatus: 401,
    });
    next({ status: 401, error: "Not authorized" });
  }
};

// ADMIN AND VIEW

// User admin
auth.role("user.admin", function (user, req, done) {
  if (!auth.isAuthenticatedNoAnonymousCheck(req)) {
    done(null, false);
  } else {
    models.User.findOne({
      where: { id: user.id },
      attributes: ["id"],
    })
      .then(function (user) {
        if (user.id === req.user.id) {
          done(null, true);
        } else {
          done(null, false);
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.entity("user", function (req, done) {
  var match = req.originalUrl.match(/users\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /users/:userId"));
  } else {
    var user = { id: match[1] };
    done(null, user);
  }
});

// Domain admin and view
auth.role("domain.admin", function (domain, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Domain.findOne({
      where: { id: domain.id },
      attributes: ["id", "access"],
    })
      .then(function (domain) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("domain.viewUser", function (domain, req, done) {
  if (domain) {
    models.Domain.findOne({
      where: { id: domain.id },
      attributes: ["id", "access"],
    })
      .then(function (domain) {
        if (domain) {
          if (domain.access === models.Domain.ACCESS_PUBLIC) {
            done(null, true);
          } else if (!auth.isAuthenticated(req)) {
            done(null, false);
          } else if (domain.user_id === req.user.id) {
            done(null, true);
          } else {
            domain.hasDomainUsers(req.user).then(function (result) {
              if (result) {
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
        } else {
          done(null, false);
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  } else {
    done(null, false);
  }
});

auth.entity("domain", function (req, done) {
  var match = req.originalUrl.match(/domains\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/communities\/(\w+)/);
  if (!match) match = req.originalUrl.match(/groups\/(\w+)/);
  if (!match) match = req.originalUrl.match(/images\/(\w+)/);
  if (!match) match = req.originalUrl.match(/allOurIdeas\/(\w+)/);
  if (!match) match = req.originalUrl.match(/assistants\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /domains/:domainId"));
  } else {
    var domain = { id: match[1] };
    done(null, domain);
  }
});

// Organization admin and view
auth.role("organization.admin", function (organization, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Organization.findOne({
      where: { id: organization.id },
      attributes: ["id", "access", "user_id"],
    })
      .then(function (organization) {
        if (organization.user_id === req.user.id) {
          done(null, true);
        } else {
          organization.hasOrganizationAdmins(req.user).then(function (result) {
            if (result) {
              done(null, true);
            } else {
              done(null, false);
            }
          });
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("organization.viewUser", function (organization, req, done) {
  models.Organization.findOne({
    where: { id: organization.id },
    attributes: ["id", "access", "user_id"],
  })
    .then(function (organization) {
      if (organization.access === models.Organization.ACCESS_PUBLIC) {
        done(null, true);
      } else if (!auth.isAuthenticated(req)) {
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
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("organization", function (req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /organizations/:organizationId"));
  } else {
    var organization = { id: match[1] };
    done(null, organization);
  }
});

// Bulk Status Updates Admin
auth.role("bulkStatusUpdates.admin", function (community, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Community.findOne({
      where: { id: community.id },
      attributes: ["id", "access", "user_id", "configuration"],
    })
      .then(function (community) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.entity("bulkStatusUpdates", function (req, done) {
  var match = req.originalUrl.match(/bulk_status_updates\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /bulk_status_updates/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

auth.role("community.marketing", async (community, req, done) => {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Community.findOne({
      where: { id: community.id },
      attributes: ["id", "access", "user_id", "configuration"],
    })
      .then(async (community) => {
        if (community.user_id === req.user.id) {
          done(null, true);
        } else {
          try {
            if (await community.hasCommunityAdmins(req.user)) done(null, true);
            else {
              if (await community.hasCommunityPromoters(req.user)) {
                done(null, true);
              } else {
                done(null, false);
              }
            }
          } catch (error) {
            log.error("Error in authentication", { error });
            done(null, false);
          }
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("group.marketing", async (group, req, done) => {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Group.findOne({
      where: { id: group.id },
      attributes: ["id", "access", "user_id", "configuration"],
    })
      .then(async (group) => {
        if (group.user_id === req.user.id) {
          done(null, true);
        } else {
          try {
            if (await group.hasGroupAdmins(req.user)) done(null, true);
            else {
              if (await group.hasGroupPromoters(req.user)) {
                done(null, true);
              } else {
                done(null, false);
              }
            }
          } catch (error) {
            log.error("Error in authentication", { error });
            done(null, false);
          }
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

// Community admin and view
auth.role("community.admin", function (community, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Community.findOne({
      where: { id: community.id },
      attributes: ["id", "access", "user_id", "configuration"],
    })
      .then(function (community) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("community.viewUser", function (community, req, done) {
  models.Community.findOne({
    where: { id: community.id },
    attributes: ["id", "access", "user_id", "configuration"],
  })
    .then(function (community) {
      if (!community) {
        done(null, false);
      } else if (community.access === models.Community.ACCESS_PUBLIC) {
        done(null, true);
      } else if (!auth.isAuthenticated(req)) {
        done(null, false);
      } else if (community.user_id === req.user.id) {
        done(null, true);
      } else {
        auth.hasCommunityAccess(community, req, done);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("community", function (req, done) {
  var match = req.originalUrl.match(/communities\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/images\/(\w+)/);

  if (!match) {
    done(new Error("Expected url like /communities/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

// Group admin and view
auth.role("group.admin", function (group, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Group.findOne({
      where: { id: group.id },
      attributes: ["id", "access", "user_id"],
    })
      .then(function (group) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("group.viewUser", function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    attributes: ["id", "access", "user_id", "configuration"],
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ["id", "access", "user_id", "configuration"],
      },
    ],
  })
    .then(function (group) {
      if (!group) {
        done(null, false);
      } else if (
        group.access === models.Group.ACCESS_PUBLIC &&
        group.Community.access === models.Community.ACCESS_PUBLIC
      ) {
        done(null, true);
      } else if (req.user && group.user_id === req.user.id) {
        done(null, true);
      } else {
        auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("group.addTo", function (group, req, done) {
  models.Group.findOne({
    where: { id: group.id },
    attributes: ["id", "access", "user_id", "configuration"],
    include: [
      {
        model: models.Community,
        required: true,
        attributes: ["id", "access", "user_id", "configuration"],
      },
    ],
  })
    .then(function (group) {
      isAuthenticatedAndCorrectLoginProvider(req, group, function (results) {
        if (!results) {
          done(null, false);
        } else {
          if (
            group.access === models.Group.ACCESS_PUBLIC &&
            group.Community.access === models.Community.ACCESS_PUBLIC
          ) {
            done(null, true);
          } else if (req.user && group.user_id === req.user.id) {
            done(null, true);
          } else {
            auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
          }
        }
      });
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("group", function (req, done) {
  var match = req.originalUrl.match(/groups\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/allOurIdeas\/(\w+)/);
  if (!match) match = req.originalUrl.match(/agents\/(\w+)/);
  if (!match) match = req.originalUrl.match(/pdf_processing\/(\w+)/);
  if (!match) match = req.originalUrl.match(/docx_processing\/(\w+)/);
  if (!match) match = req.originalUrl.match(/xls_processing\/(\w+)/);
  if (!match) match = req.originalUrl.match(/ppt_processing\/(\w+)/);
  if (!match) match = req.originalUrl.match(/feedback\/(\w+)/);
  if (!match) match = req.originalUrl.match(/assistants\/(\w+)/);
  if (!match) match = req.originalUrl.match(/ltp\/crt\/(\w+)/);
  if (!match) match = req.originalUrl.match(/images\/(\w+)/);

  if (!match) {
    done(new Error("Expected url like /groups/:groupId"));
  } else {
    var group = { id: match[1] };
    done(null, group);
  }
});

// Post admin and view

auth.role("post.admin", function (post, req, done) {
  models.Post.findOne({
    where: { id: post.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
      },
    ],
  })
    .then(function (post) {
      if (post) {
        var group = post.Group;
        if (!auth.isAuthenticated(req, group)) {
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
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("post.statusChange", function (post, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Post.findOne({
      where: { id: post.id },
      attributes: ["id", "user_id"],
      include: [
        {
          model: models.Group,
          attributes: ["id", "access", "user_id", "configuration"],
        },
      ],
    })
      .then(function (post) {
        var group = post.Group;
        if (!auth.isAuthenticated(req)) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("post.viewUser", function (post, req, done) {
  //TODO: Profile this function for that second level Community include
  models.Post.findOne({
    where: { id: post.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Group,
        required: true,
        attributes: ["id", "access", "user_id", "configuration"],
        include: [
          {
            model: models.Community,
            required: true,
            attributes: ["id", "access", "user_id", "configuration"],
          },
        ],
      },
    ],
  })
    .then(function (post) {
      if (post) {
        var group = post.Group;
        if (group.access === models.Group.ACCESS_PUBLIC) {
          done(null, true);
        } else if (req.user && post.user_id === req.user.id) {
          done(null, true);
        } else {
          auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
        }
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("post.vote", function (post, req, done) {
  log.info("In post.vote");
  models.Post.findOne({
    where: { id: post.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
        include: [
          {
            model: models.Community,
            required: true,
            attributes: ["id", "access", "user_id", "configuration"],
          },
        ],
      },
    ],
  })
    .then(function (post) {
      log.info("In post.vote found post");
      if (post) {
        if (
          process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY &&
          req.headers["x-api-key"] ===
            process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
        ) {
          done(null, true);
        } else {
          isAuthenticatedAndCorrectLoginProvider(
            req,
            post.Group,
            function (results) {
              if (!results) {
                done(null, false);
              } else {
                if (post.Group.access === models.Group.ACCESS_PUBLIC) {
                  done(null, true);
                } else if (req.user && post.user_id === req.user.id) {
                  done(null, true);
                } else {
                  auth.isGroupMemberOrOpenToCommunityMember(
                    post.Group,
                    req,
                    done
                  );
                }
              }
            }
          );
        }
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("post", function (req, done) {
  var match = req.originalUrl.match(/posts\/(\w+)/);
  if (!match) match = req.originalUrl.match(/images\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/ratings\/(\w+)/);
  if (!match) match = req.originalUrl.match(/agents\/(\w+)/);
  if (!match) match = req.originalUrl.match(/ltp\/crt\/(\w+)/);
  if (!match) match = req.originalUrl.match(/audios\/(\w+)/);
  if (!match)
    done(new Error("Expected url like /posts/:postId or /images/:postId"));
  if (match) {
    var post = { id: match[1] };
    done(null, post);
  }
});

// Post admin and view

auth.role("point.admin", function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Post,
        attributes: ["id", "user_id"],
        include: [
          {
            model: models.Group,
            attributes: ["id", "access", "user_id", "configuration"],
            required: false,
          },
        ],
        required: false,
      },
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
        required: false,
      },
    ],
  })
    .then(function (point) {
      var group;

      if (point) {
        if (point.Post) {
          group = point.Post.Group;
        } else {
          group = point.Group;
        }

        if (!auth.isAuthenticated(req, group)) {
          done(null, false);
        } else if (point && group) {
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
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("point.viewUser", function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Post,
        attributes: ["id", "user_id"],
        include: [
          {
            model: models.Group,
            attributes: ["id", "access", "user_id", "configuration"],
            required: false,
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ["id", "access", "user_id", "configuration"],
              },
            ],
          },
        ],
        required: false,
      },
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
        required: false,
        include: [
          {
            model: models.Community,
            required: false,
            attributes: ["id", "access", "user_id", "configuration"],
          },
        ],
      },
    ],
  })
    .then(function (point) {
      var group;

      if (point && point.Post) {
        group = point.Post.Group;
      } else if (point) {
        group = point.Group;
      }

      if (point && group) {
        if (group.access === models.Group.ACCESS_PUBLIC) {
          done(null, true);
        } else if (req.user && point.user_id === req.user.id) {
          done(null, true);
        } else if (group.Community) {
          auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("point.addTo", function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Post,
        attributes: ["id", "user_id"],
        include: [
          {
            model: models.Group,
            attributes: ["id", "access", "user_id", "configuration"],
            required: false,
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ["id", "access", "user_id", "configuration"],
              },
            ],
          },
        ],
        required: false,
      },
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
        required: false,
      },
    ],
  })
    .then(function (point) {
      var group;

      if (point && point.Post) {
        group = point.Post.Group;
      } else if (point) {
        group = point.Group;
      }

      if (point) {
        isAuthenticatedAndCorrectLoginProvider(req, group, function (results) {
          if (!results) {
            done(null, false);
          } else {
            if (group.access === models.Group.ACCESS_PUBLIC) {
              done(null, true);
            } else if (req.user && point.user_id === req.user.id) {
              done(null, true);
            } else if (group.Community) {
              auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
            } else {
              done(null, false);
            }
          }
        });
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

//TODO: Use this pattern of activities everywhere here for optimization
auth.role("image.viewUser", function (image, req, done) {
  models.Image.findOne({
    where: { id: image.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Post,
        as: "PostUserImages",
        attributes: ["id"],
        include: [
          {
            model: models.Group,
            attributes: ["id", "access", "user_id", "configuration"],
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ["id", "access", "user_id", "configuration"],
              },
            ],
          },
        ],
      },
    ],
  })
    .then(function (image) {
      var group;
      if (image && image.PostUserImages && image.PostUserImages.length > 0) {
        group = image.PostUserImages[0].Group;
      }
      if (group) {
        if (group.access === models.Group.ACCESS_PUBLIC) {
          done(null, true);
        } else if (req.user && group.user_id === req.user.id) {
          done(null, true);
        } else if (group.Community) {
          auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.role("point.vote", function (point, req, done) {
  models.Point.findOne({
    where: { id: point.id },
    attributes: ["id", "user_id"],
    include: [
      {
        model: models.Post,
        include: [
          {
            model: models.Group,
            attributes: ["id", "access", "user_id", "configuration"],
            required: false,
            include: [
              {
                model: models.Community,
                required: false,
                attributes: ["id", "access", "user_id", "configuration"],
              },
            ],
          },
        ],
        required: false,
      },
      {
        model: models.Group,
        attributes: ["id", "access", "user_id", "configuration"],
        required: false,
      },
    ],
  })
    .then(function (point) {
      var group;

      if (point) {
        if (point.Post) {
          group = point.Post.Group;
        } else {
          group = point.Group;
        }

        isAuthenticatedAndCorrectLoginProvider(req, group, function (results) {
          if (!results) {
            done(null, false);
          } else {
            if (group.access === models.Group.ACCESS_PUBLIC) {
              done(null, true);
            } else if (req.user && point.user_id === req.user.id) {
              done(null, true);
            } else if (group.Community) {
              auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
            } else {
              done(null, false);
            }
          }
        });
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("point", function (req, done) {
  var match = req.originalUrl.match(/points\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/audios\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /points/:pointId"));
  } else {
    var point = { id: match[1] };
    done(null, point);
  }
});

auth.entity("image", function (req, done) {
  var match = req.originalUrl.match(/images\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /images/:imageId"));
  } else {
    var image = { id: match[1] };
    done(null, image);
  }
});

// Category admin and view

auth.role("category.admin", function (category, req, done) {
  if (!auth.isAuthenticated(req)) {
    done();
  } else {
    models.Category.findOne({
      where: { id: category.id },
      include: [models.Group],
    })
      .then(function (category) {
        var group = category.Group;
        if (!auth.isAuthenticated(req)) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
});

auth.role("category.viewUser", function (category, req, done) {
  models.Category.findOne({
    where: { id: category.id },
    include: [
      {
        model: models.Group,
        attributes: ["id", "access", "user_id"],
        required: false,
        include: [
          {
            model: models.Community,
            required: false,
            attributes: ["id", "access", "user_id", "configuration"],
          },
        ],
      },
    ],
  })
    .then(function (category) {
      var group = category.Group;
      if (group.access === models.Group.ACCESS_PUBLIC) {
        done(null, true);
      } else if (req.user && category.user_id === req.user.id) {
        done(null, true);
      } else if (group.Community) {
        auth.isGroupMemberOrOpenToCommunityMember(group, req, done);
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("category", function (req, done) {
  var match = req.originalUrl.match(/categories\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /categories/:categoryId"));
  } else {
    var category = { id: match[1] };
    done(null, category);
  }
});

// CREATE

// Create bulkStatusUpdate

auth.role(
  "createCommunityBulkStatusUpdate.createBulkStatusUpdate",
  function (community, req, done) {
    auth.authNeedsCommunityAdminForCreate(community, req, done);
  }
);

auth.entity("createCommunityBulkStatusUpdate", function (req, done) {
  var match = req.originalUrl.match(/bulk_status_updates\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /bulk_status_update/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

// Create category

auth.role("createGroupCategory.createCategory", function (group, req, done) {
  auth.authNeedsGroupAdminForCreate(group, req, done);
});

auth.entity("createGroupCategory", function (req, done) {
  var match = req.originalUrl.match(/categories\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /categories/:groupId"));
  } else {
    var group = { id: match[1] };
    done(null, group);
  }
});

// Create post

auth.role("createGroupPost.createPost", function (group, req, done) {
  auth.authNeedsGroupForCreate(group, req, done);
});

auth.entity("createGroupPost", function (req, done) {
  var match = req.originalUrl.match(/posts\/(\w+)/);
  if (!match) match = req.originalUrl.match(/videos\/(\w+)/);
  if (!match) match = req.originalUrl.match(/audios\/(\w+)/);
  if (!match) match = req.originalUrl.match(/agents\/(\w+)/);
  if (!match) match = req.originalUrl.match(/ltp\/crt\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /posts/:groupId"));
  } else {
    var group = { id: match[1] };
    done(null, group);
  }
});

// Create point

auth.role("createGroupPoint.createPoint", function (group, req, done) {
  auth.authNeedsGroupForCreate(group, req, done);
});

auth.entity("createGroupPoint", function (req, done) {
  var match = req.originalUrl.match(/points\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /points/:groupId"));
  } else {
    var group = { id: match[1] };
    done(null, group);
  }
});

// Create group

auth.role("createCommunityGroup.createGroup", function (community, req, done) {
  log.error(`createCommunityGroup.createGroup`);
  models.Community.findOne({
    where: { id: community.id },
  })
    .then(function (community) {
      log.info(`community`, community);
      log.info(
        `XXX: ${auth.isAuthenticated(req)} ${
          process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
        }`
      );
      if (
        !auth.isAuthenticated(req) &&
        //TODO: Come up with a better way to handle this than a master API key
        !process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
      ) {
        done(null, false);
      } else if (
        !auth.isAuthenticated(req) &&
        process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
      ) {
        log.info(`XXXY: ${req.headers["x-api-key"]}`);
        if (
          req.headers["x-api-key"] ===
          process.env.PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY
        ) {
          done(null, true);
        } else {
          done(null, false);
        }
      } else if (community.access === models.Community.ACCESS_PUBLIC) {
        done(null, true);
      } else if (community.user_id === req.user.id) {
        done(null, true);
      } else {
        auth.hasCommunityAccess(community, req, done);
      }
    })
    .catch(function (error) {
      log.error("Error in authentication", { error });
      done(null, false);
    });
});

auth.entity("createCommunityGroup", function (req, done) {
  var match = req.originalUrl.match(/groups\/(\w+)/);
  if (!match) match = req.originalUrl.match(/allOurIdeas\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /groups/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

// Create community

auth.role(
  "createDomainCommunity.createCommunity",
  function (domain, req, done) {
    models.Domain.findOne({
      where: { id: domain.id },
    })
      .then(function (domain) {
        if (!domain || !auth.isAuthenticated(req)) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
);

auth.entity("createDomainCommunity", function (req, done) {
  let match =
    req.originalUrl.match(/communities\/(\w+)/) ||
    req.originalUrl.match(/groups\/(\w+)/) ||
    req.originalUrl.match(/allOurIdeas\/(\w+)/);

  if (!match) {
    done(new Error("Expected url like /communities/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

// Create organization

auth.role(
  "createDomainOrganization.createDomainOrganization",
  function (domain, req, done) {
    models.Domain.findOne({
      where: { id: domain.id },
    })
      .then(function (domain) {
        if (!auth.isAuthenticated(req)) {
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
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
);

auth.role(
  "createCommunityOrganization.createCommunityOrganization",
  function (community, req, done) {
    models.Community.findOne({
      where: { id: community.id },
    })
      .then(function (community) {
        if (!auth.isAuthenticated(req)) {
          done(null, false);
        } else if (community.access === models.Community.ACCESS_PUBLIC) {
          done(null, true);
        } else if (community.user_id === req.user.id) {
          done(null, true);
        } else {
          auth.hasCommunityAccess(community, req, done);
        }
      })
      .catch(function (error) {
        log.error("Error in authentication", { error });
        done(null, false);
      });
  }
);

auth.entity("createDomainOrganization", function (req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /organizations/:domainId"));
  } else {
    var domain = { id: match[1] };
    done(null, domain);
  }
});

auth.entity("createCommunityOrganization", function (req, done) {
  var match = req.originalUrl.match(/organizations\/(\w+)/);
  if (!match) {
    done(new Error("Expected url like /organizations/:communityId"));
  } else {
    var community = { id: match[1] };
    done(null, community);
  }
});

auth.action("edit domain", ["domain.admin"]);
auth.action("edit organization", ["organization.admin"]);
auth.action("edit community", ["community.admin"]);
auth.action("edit group", ["group.admin"]);
auth.action("edit post", ["post.admin"]);
auth.action("send status change", ["post.statusChange"]);
auth.action("edit user", ["user.admin"]);
auth.action("edit category", ["category.admin"]);
auth.action("edit point", ["point.admin"]);
auth.action("delete point", ["point.admin"]);
auth.action("edit bulkStatusUpdate", ["bulkStatusUpdates.admin"]);

auth.action("edit community marketing", ["community.marketing"]);
auth.action("edit group marketing", ["group.marketing"]);

auth.action("view organization", ["organization.viewUser"]);
auth.action("view domain", ["domain.viewUser"]);
auth.action("view community", ["community.viewUser"]);
auth.action("view group", ["group.viewUser"]);
auth.action("add to group", ["group.addTo"]);
auth.action("view post", ["post.viewUser"]);
auth.action("view category", ["category.viewUser"]);
auth.action("view point", ["point.viewUser"]);
auth.action("add to point", ["point.addTo"]);

auth.action("view image", ["image.viewUser"]);

auth.action("vote on post", ["post.vote"]);
auth.action("vote on point", ["point.vote"]);
auth.action("rate post", ["post.vote"]);

auth.action("add post user images", ["post.vote"]);

auth.action("create domainOrganization", [
  "createDomainOrganization.createDomainOrganization",
]);
auth.action("create communityOrganization", [
  "createCommunityOrganization.createCommunityOrganization",
]);
auth.action("create community", ["createDomainCommunity.createCommunity"]);
auth.action("create group", ["createCommunityGroup.createGroup"]);
auth.action("create post", ["createGroupPost.createPost"]);
auth.action("create media", ["createGroupPost.createPost"]);
auth.action("create category", ["createGroupCategory.createCategory"]);
auth.action("create point", ["createGroupPoint.createPoint"]);
auth.action("create bulkStatusUpdate", [
  "createCommunityBulkStatusUpdate.createBulkStatusUpdate",
]);

module.exports = auth;
