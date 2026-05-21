module.exports = function (req, accessToken, refreshToken, profile, cb) {
    if (profile && accessToken) {
        var query = {
            protocol: 'oauth2',
            strategy: (req.params && req.params.strategy) ||
                      (req.body && req.body.strategy)   ||
                      (req.query && req.query.strategy),
            tokens  : { accessTokens: accessToken }
        };

        if (profile.id)           query.identifier  = profile.id;
        if (profile.provider)     query.provider    = profile.provider;
        if (accessToken)          query.accessToken = accessToken;
        if (profile.name)         query.nameFirst   = profile.givenName;
        if (profile.name)         query.nameLast    = profile.familyName;
        if (profile.displayName)  query.nameDisplay = profile.displayName;
        if (profile.emails)       query.email       = profile.emails[0].value;
        if (profile.image)        query.image       = profile.photos;
        if (profile.gender)       query.gender      = profile.gender;
        if (profile.language)     query.language    = profile.language;

        if (refreshToken) {
            query.tokens.refreshToken = refreshToken;
        }
    } else {
        var query = {};
    }

    return cb(false, query);
};
