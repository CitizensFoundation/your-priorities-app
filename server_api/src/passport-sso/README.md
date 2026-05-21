# passport-sso
Multi-domain single signon functionality using [passport](https://www.npmjs.com/package/passport).
This module is **still in development**, but is at a stage where is can be effective.

This module is **not** to be used for authentication. Instead, it is to be used **by**
an authentication module/project to initialize all providers/strategies used by passport.
For example, say I have a project that has many [passport](https://www.npmjs.com/package/passport)
strategies stored in a database and I want passport to use them for authentication.
I would gather all of those strategy records and send them to PassportSSO.init(). Passport will
then have access to those strategies by each record's 'name' property. (see below for an example)

I have created  project that implements this for [Sails.js](http://sailsjs.org/).
See [sails-hook-sso](https://github.com/mattmccarty/sails-hook-sso) for more information.

### Getting started

1. ) Install PassportSSO and Passport in the consuming app
```npm install passport-sso passport```

Passport is a peer dependency. The consuming app must provide a single shared
`passport` installation so `passport-sso` and the app use the same strategy
registry and session integration.

2.) Install the passport-local package
```npm install passport-local --save```

3.) Install the passport-http-bearer package
```npm install passport-http-bearer --save```

4.) Install the passport-google-oauth package
```npm install passport-google-oauth --save```

5.) Initialize SSO with hosts that your app supports and login provider details
```javascript
function bearerCallback(req, token) {
    return console.log('The user has tried to authenticate with a bearer token');
}
function localCallback(req, id, pw) {
    return console.log('The user has tried to authenticate with a local username and password');
}

var sso       = require('passport-sso'),
    hosts     = ['localhost', '127.0.0.1'],
    providers = [{
        name            : 'bearer-strategy-1',
        provider        : 'bearer',
        protocol        : 'bearer',
        strategyObject  : 'Strategy',
        strategyPackage : 'passport-http-bearer',
        clientID        : 'false',
        clientSecret    : 'false',
        scope           : [],
        fields          : null,
        urlCallback     : 'http://localhost/user/auth/bearer-strategy-1/callback'
    }, {
        name            : 'local-strategy-1',
        provider        : 'local',
        protocol        : 'local',
        strategyObject  : 'Strategy',
        strategyPackage : 'passport-local',
        clientID        : 'false',
        clientSecret    : 'false',
        scope           : [],
        fields          : null,
        urlCallback     : 'http://localhost/user/auth/local-strategy-1/callback'
    }, {
        name            : 'google-strategy-1',
        provider        : 'google',
        protocol        : 'oauth2',
        strategyObject  : 'Strategy',
        strategyPackage : 'passport-google-oauth',
        clientID        : 'YOUR-GOOGLE-CLIENT-ID',
        clientSecret    : 'YOUR-GOOGLE-CLIENT-SECRET',
        scope           : ['email', 'profile'],
        fields          : null,
        urlCallback     : 'http://localhost/user/auth/google-strategy-1/callback'
    }];

sso.init(hosts, providers, {
    authorize: bearerCallback,
    login    : localCallback
});
```

6.) Call PassportSSO.authenticate() in a controller to authenticate with one of the strategies
that you initialized in the previous step. PassportSSO is simply a wrapper function for passport's
native authenticate() method.
```javascript
module.exports.UserController = {
    auth: function(req, res) {
        sso.authenticate('local-strategy-1', {}, req, res, function(err, user) {
            console.log(user);
        });
    }
}
```


to be continued....
