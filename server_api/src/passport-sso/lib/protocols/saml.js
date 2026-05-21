module.exports = function (user, cb) {
   user.provider = 'saml';
   return cb(null, user);
};
