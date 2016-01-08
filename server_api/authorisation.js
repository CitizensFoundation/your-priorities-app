var auth = require('authorized');

auth.role('domain.admin', function (domain, req, done) {
  if (!req.user) {
    done();
  } else {
    Domain.findOne({
      where: { id: domain.id }
    }).then(function (domain) {
      if (domain.user_id===req.user.id) {
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

auth.role('domain.viewUser', function (org, req, done) {
  if (!req.user) {
    done();
  } else {
    Domain.findOne({
      where: { id: domain.id }
    }).then(function (domain) {
      if (domain.user_id===req.user.id) {
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

auth.entity('domain', function(req, done) {
  var match = req.url.match(/^\/domains\/(\w+)/);
  if (!match) {
    done(new Error('Expected url like /domains/:domainId'));
    return;
  } else {
    var domain = { id: match[1] };
    done(null, domain)
  }
});

auth.action('administer domain', ['domain.admin']);
auth.action('administer community', ['community.admin']);
auth.action('administer group', ['group.admin']);

module.exports = auth;