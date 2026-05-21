const OpenIDConnectStrategy = require("passport-openidconnect").Strategy;
const crypto = require("crypto");
const base64url = require("base64url");
var MultiSessionStore = require("./multi-session");
const debugEnabled = ["1", "true", "yes", "on"].includes(
  String(process.env.DEBUG_PASSPORT_SSO || "").toLowerCase()
);
const console = Object.create(global.console);

console.log = (...args) => {
  if (debugEnabled) {
    global.console.log(...args);
  }
};

console.warn = (...args) => {
  if (debugEnabled) {
    global.console.warn(...args);
  }
};

class AudkenniStrategy extends OpenIDConnectStrategy {
  constructor(options, verify) {
    super(options, verify);
    this.name = options.name || "audkenni";
    this._pkceMethod = options.pkce || "S256";
    this._options = options;
    this._req = null; // Store the req object
    console.log(
      `AudkenniStrategy initialized with options:`,
      JSON.stringify(options, null, 2)
    );
  }

  authenticate(req, options) {
    this._req = req;
    options = options || {};

    if (!req || !req.redisClient) {
      console.error(
        "AudkenniStrategy.authenticate - WARNING: req or req.redisClient is not defined!"
      );
      return this.error(new Error("Missing Redis client"));
    }

    console.log(
      "AudkenniStrategy.authenticate called with options:",
      JSON.stringify(options, null, 2)
    );

    if (this._options && this._options.relatedParty) {
      const scope = options.scope || this._options.scope || "";
      options.scope = `${scope} RELATEDPARTY:${this._options.relatedParty}`;
    }

    if (!req.query || !req.query.code) {
      // Authorization phase
      console.log("AudkenniStrategy: Entering authorization phase");
      // We don't await this as it's synchronous
      //const params = this.authorizationParams(options);
      //options = { ...options, ...params };
    } else {
      // Token phase
      console.log("AudkenniStrategy1: Entering token phase");
      console.log(
        `AudkenniStrategy: req.query ${JSON.stringify(req.query, null, 2)}`
      );
      console.log(
        `AudkenniStrategy: req.authInfo ${JSON.stringify(
          req.authInfo,
          null,
          2
        )}`
      );
      const state = req.query.state || (req.authInfo && req.authInfo.state);
      this.getVerifierFromRedis(req, `pkceCodeVerifier:${state}`)
        .then((codeVerifier) => {
          console.log(
            `AudkenniStrategy: Retrieved codeVerifier from Redis: ${codeVerifier}`
          );
          if (codeVerifier) {
            options.code_verifier = codeVerifier;
            this.clearVerifierFromRedis(req, `pkceCodeVerifier:${state}`)
              .then(() => {
                console.log(
                  "AudkenniStrategy: Code verifier retrieved from Redis and cleared",
                  options.code_verifier
                );
              })
              .catch((err) => {
                console.error(
                  "AudkenniStrategy: Error clearing verifier from Redis:",
                  err
                );
              });
          } else {
            console.error("AudkenniStrategy: Missing pkceCodeVerifier in Redis");
          }

          this.proceedWithAuthentication(req, options);
        })
        .catch((error) => {
          console.error(
            "AudkenniStrategy: Error retrieving code verifier:",
            error
          );
          this.proceedWithAuthentication(req, options);
        });
      return;
    }

    this.proceedWithAuthentication(req, options);
  }

 /* proceedWithAuthentication(req, options) {
    console.log(
      "AudkenniStrategy: Final options before calling super.authenticate:",
      JSON.stringify(options, null, 2)
    );

    // Override the OAuth2 getOAuthAccessToken method to include code_verifier
    const originalGetOAuthAccessToken = this._oauth2.getOAuthAccessToken;
    this._oauth2.getOAuthAccessToken = (code, params, callback) => {
      if (options.code_verifier) {
        params.code_verifier = options.code_verifier;
      }
      originalGetOAuthAccessToken.call(this._oauth2, code, params, callback);
    };

    super.authenticate(req, options);
  }*/

  proceedWithAuthentication(req, options) {
    const oauth2 = this._oauth2;
    const originalGetOAuthAccessToken = oauth2.getOAuthAccessToken;

    oauth2.getOAuthAccessToken = (code, params, callback) => {
      if (options.code_verifier) {
        params.code_verifier = options.code_verifier;
      }
      originalGetOAuthAccessToken.call(oauth2, code, params, (err, ...rest) => {
        oauth2.getOAuthAccessToken = originalGetOAuthAccessToken;
        callback(err, ...rest);
      });
    };

    super.authenticate(req, options);
  }


  authorizationParams(options) {
    const params = {};
    console.log(
      `--------------> AudkenniStrategy: Initial authorization params:`,
      JSON.stringify(options, null, 2)
    );

    console.log(
      `AudkenniStrategy 1: this._options.state ${this._options.state} options.state ${options.state}`
    );

    console.log(
      `AudkenniStrategy 1b: this._options.state ${JSON.stringify(
        this._options,
        null,
        2
      )}`
    );

    const state =
      options.state || // a caller can set it in `passport.authenticate('oidc', { state })`
      base64url(crypto.randomBytes(16));

    // 2)  Tell Passport/OpenIDConnect to use this exact state
    params.state = state;
    options.state = state;

    console.log(
      `AudkenniStrategy 2: this._options.state ${this._options.state} options.state ${options.state}`
    );

    if (this._options && this._options.acrValues && !params.acr_values) {
      params.acr_values = this._options.acrValues;
    }

    var verifier, challenge;
    if (this._pkceMethod) {
      verifier = base64url(crypto.pseudoRandomBytes(32));
      console.log(`AudkenniStrategy: Generated PKCE verifier: ${verifier}`);

      switch (this._pkceMethod) {
        case "plain":
          challenge = verifier;
          break;
        case "S256":
          challenge = base64url(
            crypto.createHash("sha256").update(verifier).digest()
          );
          break;
        default:
          console.error(
            `AudkenniStrategy: Unsupported PKCE method: ${this._pkceMethod}`
          );
          throw new Error(
            "Unsupported code verifier transformation method: " +
              this._pkceMethod
          );
      }

      params.code_challenge = challenge;
      params.code_challenge_method = this._pkceMethod;

      console.log(`AudkenniStrategy: PKCE challenge and method:`, {
        verifier,
        challenge,
        method: this._pkceMethod,
      });

      this.storeVerifierInRedis(
        this._req,
        `pkceCodeVerifier:${state}`,
        verifier
      )
        .then(() =>
          console.log(
            `AudkenniStrategy: PKCE verifier stored for state ${state}.`
          )
        )
        .catch((err) =>
          console.error("AudkenniStrategy: PKCE Redis error:", err)
        );
    }

    console.log(
      "AudkenniStrategy: Final authorization params:",
      JSON.stringify(params, null, 2)
    );

    return params;
  }

  async storeVerifierInRedis(req, key, value) {
    const redisKey = this.generateRedisKey(req, key);
    try {
      await req.redisClient.set(redisKey, value, { EX: 900 }); // EX: 900 sets an expiration time of 15 minutes
    } catch (err) {
      console.error(
        `AudkenniStrategy: Error storing verifier in Redis: ${err}`
      );
      return;
    }

    console.log(
      `AudkenniStrategy: Stored verifier in Redis with key: ${redisKey}`
    );
  }

  async getVerifierFromRedis(req, key) {
    const redisKey = this.generateRedisKey(req, key);
    try {
      const value = await req.redisClient.get(redisKey);
      console.log(
        `AudkenniStrategy: Retrieved verifier from Redis with key: ${redisKey}`
      );
      return value;
    } catch (err) {
      console.error(
        `AudkenniStrategy: Error retrieving verifier from Redis: ${err}`
      );
      return null;
    }
  }

  async clearVerifierFromRedis(req, key) {
    const redisKey = this.generateRedisKey(req, key);
    try {
      await req.redisClient.del(redisKey);
      console.log(
        `AudkenniStrategy: Cleared verifier in Redis with key: ${redisKey}`
      );
    } catch (err) {
      console.error(
        `AudkenniStrategy: Error clearing verifier in Redis: ${err}`
      );
    }
  }

  generateRedisKey(req, key) {
    // Generate a unique Redis key based on session ID, user ID, or any unique identifier
    // For example: use a combination of user id and the key name
    const sessionId = req.sessionID || "unknown-session"; // Replace with actual session ID or user ID
    console.log(`AudkenniStrategy: Generated Redis key: ${sessionId}:${key}`);
    return `${sessionId}:${key}`;
  }
}

module.exports = function () {
  "use strict";

  /**
   * PassportSSO namespace.
   * @type {Object}
   */
  var PassportSSO = {};

  /**
   * Passport NPM package
   * @type {Object}
   */
  var Passport = require("passport");

  /**
   * An array of objects containing supported hostnames and their settings
   * @type {Array}
   */
  var Hosts = [];

  /**
   * Passport providers and their configurations
   * @type {Array}
   */
  var Providers = [];

  /**
   * Initialize PassportSSO
   * @param  {Array}    hosts     - An array of objects containing supported hosts
   * @param  {Array}    providers - An array of provider configuration objects
   * @param  {Object}   callbacks - An object containing a authorize and login callback
   * @return void
   */
  PassportSSO.init = function (hosts, providers, callbacks) {
    if (!Array.isArray(hosts)) return;
    if (!Array.isArray(providers)) return;
    if (typeof callbacks !== "object") return;

    Hosts = hosts;
    this.loadStrategies(providers, callbacks.authorize, callbacks.login);
  };

  PassportSSO.logout = function (strategy, options, req, res, cb) {
    console.log(
      `AudkenniStrategy: PassportSSO.logout  -------------------> ${JSON.stringify(
        options,
        null,
        2
      )} strategy ${strategy}`
    );


    let provider = this.getProvider(strategy);

    console.log(
      `AudkenniStrategy: PassportSSO.logout  -------------------> ${JSON.stringify(
        provider,
        null,
        2
      )} strategy ${strategy}`
    );

    if (!provider) {
      strategy = "audkenni";
      provider = this.getProvider(strategy);
    }

    console.log(
      `AudkenniStrategy: PassportSSO.logout  -------------------> ${JSON.stringify(
        provider,
        null,
        2
      )} strategy ${strategy}`
    );

    if (!provider || !provider.endSessionURL) {
      return cb && cb("passportsso.error.logout", false);
    }

    const redirectUri =
      options && options.postLogoutRedirectUri
        ? options.postLogoutRedirectUri
        : "/";

    let url = provider.endSessionURL;
    if (redirectUri) {
      const sep = url.indexOf("?") === -1 ? "?" : "&";
      url += `${sep}post_logout_redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
    }

    res.redirect(url);
    if (cb) cb(null, true);
  };

  /**
   * Load all stratgies from an array of provider objects
   * @param  {Array} providers - An array of provider configuration objects
   * @return void
   */
  PassportSSO.loadStrategies = function (providers, authorize, login) {
    Passport.protocols = require("./protocols");

    for (var i = 0; i < providers.length; i++) {
      var providerOpts = providers[i],
        strategyPackage = null,
        strategyObject = null,
        strategy = null;

      if (
        !providerOpts.provider ||
        !providerOpts.strategyPackage ||
        !providerOpts.strategyObject
      ) {
        continue;
      }

      var passportOpts;

      if (providerOpts.provider == "saml") {
        passportOpts = this.getPassportSamlOptions(providerOpts);
      } else if (
        providerOpts.provider == "oidc" ||
        providerOpts.provider == "audkenni"
      ) {
        passportOpts = this.getPassportOidcOptions(providerOpts);
      } else {
        passportOpts = this.getPassportOAuthOptions(providerOpts);
      }

      console.log(
        `AudkenniStrategy: getPassportOidcOptions-------------------> ${JSON.stringify(
          passportOpts,
          null,
          2
        )}`
      );

      switch (passportOpts.provider) {
        case "bearer":
          if (typeof authorize === "function") {
            Providers[passportOpts.name] = providerOpts;
            Passport.use(
              passportOpts.name,
              new passportOpts.strategy(authorize)
            );
          }
          continue;
        case "local":
          if (typeof login === "function") {
            Providers[passportOpts.name] = providerOpts;
            passportOpts.usernameField = "identifier";
            passportOpts.passReqToCallback = true;
            Passport.use(
              passportOpts.name,
              new passportOpts.strategy(passportOpts, login)
            );
          }
          continue;
        case "saml":
          passportOpts.option = providerOpts.options;
          Providers[passportOpts.name] = providerOpts;
          Passport.use(
            passportOpts.name,
            new passportOpts.strategy(
              passportOpts.options,
              Passport.protocols[passportOpts.protocol]
            )
          );
          continue;
        case "oidc":
        case "audkenni":
          const strategyOptions = {
            issuer: providerOpts.issuer,
            authorizationURL: providerOpts.authorizationURL,
            tokenURL: providerOpts.tokenURL,
            userInfoURL: providerOpts.userInfoURL,
            clientID: providerOpts.clientID,
            clientSecret: providerOpts.clientSecret,
            callbackURL: providerOpts.callbackUrl,
            endSessionURL: providerOpts.endSessionURL,
            scope: "profile signature",
            pkce: "S256",
            //acrValues: providerOpts.acrValues || "sim",
            relatedParty: providerOpts.clientID, // or another identifier if needed
            passReqToCallback: true,
            state: true,
            // Use a dedicated state store that supports multiple concurrent sessions
            store: new MultiSessionStore({
              key: `openidconnect:${providerOpts.issuer || providerOpts.name}`,
            }),
          };

          console.log(
            `AudkenniStrategy: getPassportOidcOptions 3-------------------> ${JSON.stringify(
              strategyOptions,
              null,
              2
            )}`
          );

          Passport.use(
            passportOpts.name,
            new AudkenniStrategy(
              strategyOptions,
              Passport.protocols[passportOpts.protocol]
            )
          );

          console.log(
            `AudkenniStrategy OIDC Strategy created for ${passportOpts.name}`
          );
          continue;
        default:
          Providers[passportOpts.name] = providerOpts;
          if (passportOpts.protocol === "openid") {
            passportOpts.realm = baseUrl;
            passportOpts.profile = true;
          }

          Passport.use(
            passportOpts.name,
            new passportOpts.strategy(
              passportOpts.options,
              Passport.protocols[passportOpts.protocol]
            )
          );
          break;
      }
    }
  };

  /**
   * Build passport provider/strategy object from a oauth provider's configuration object
   * @param  {Object} providerOpts - Configuration options from a provider
   * @return void
   */
  PassportSSO.getPassportOAuthOptions = function (providerOpts) {
    var passportOpts = {
      provider: providerOpts.provider,
      name: providerOpts.name,
      protocol: providerOpts.protocol,
      strategy: require(providerOpts.strategyPackage)[
        providerOpts.strategyObject
      ],
      options: {
        clientID: providerOpts.clientID || "false",
        clientSecret: providerOpts.clientSecret || "false",
        scope: providerOpts.scope || [],
        profileFields: providerOpts.fields || null,
        callbackURL: providerOpts.urlCallback || "false",
      },
    };

    if (passportOpts.options) {
      if (passportOpts.options.passReqToCallback === undefined) {
        passportOpts.options.passReqToCallback = true;
      } else {
        passportOpts.options.passReqToCallback =
          providerOpts.options.passReqToCallback;
      }

      if (passportOpts.options.callbackURL.toLowerCase() === "postmessage") {
        passportOpts.options.autoResolveCallback = false;
      }
    }

    return passportOpts;
  };

  /**
   * Build passport provider/strategy object from a oauth provider's configuration object
   * @param  {Object} providerOpts - Configuration options from a provider
   * @return void
   */
  PassportSSO.getPassportSamlOptions = function (providerOpts) {
    var passportOpts = {
      provider: providerOpts.provider,
      name: providerOpts.name,
      protocol: providerOpts.protocol,
      strategy: require(providerOpts.strategyPackage)[
        providerOpts.strategyObject
      ],
      options: {
        entryPoint: providerOpts.entryPoint || null,
        callbackUrl: providerOpts.callbackUrl || null,
        cert: providerOpts.cert || null,
        idpCert: providerOpts.idpCert || providerOpts.cert || null,
        audience: providerOpts.audience || null,
        issuer: providerOpts.issuer || null,
        identifierFormat: providerOpts.identifierFormat || null,
        certInPemFormat: true,
        signatureAlgorithm: providerOpts.signatureAlgorithm || "sha256",
      },
    };

    return passportOpts;
  };

  /**
   * Return a provider object by searching all providers by the providerName
   * @param  {String} providerName - Name of the provider to search for
   *                                 this is found in the Providers[x].name object
   * @return {Object} || null
   */
  PassportSSO.getProvider = function (providerName) {
    if (typeof providerName !== "string" || Providers.length <= 0) {
      return null;
    }

    for (var provider in Providers) {
      if (provider.name && provider.name === providerName) {
        return provider;
      }
    }

    return null;
  };

  /**
   * Redirect the user to a strategy's (i.e: google) login page
   * @param  {String}   strategy - The strategy name. This would have been specified
   *                               in the strategy's configuration that was passed to
   *                               PassportSSO.init()
   * @param  {Object}   options  - Passport authentication options
   * @param  {Object}   req      - The request object
   * @param  {Object}   res      - The response object
   * @param  {Function} cb       - A callback function -> cb(err, results)
   * @return void
   */
  PassportSSO.authenticate = function (strategy, options, req, res, cb) {
    console.log(
      `AudkenniStrategy: PassportSSO.authenticate  -------------------> ${JSON.stringify(
        options,
        null,
        2
      )} strategy ${strategy}`
    );
    Passport.authenticate(strategy, options)(req, res, cb);
  };

  /**
   * Verify that auth credentials which have been passed are authentic.
   * @param  {String}   strategy - The strategy name. This would have been specified
   *                               in the strategy's configuration that was passed to
   *                               PassportSSO.init()
   * @param  {String}   token    - (Optional) Access token if user has been authenticated in the UI already
   * @param  {Object}   options  - Parameters passed from request
   * @param  {Object}   req      - The request object
   * @param  {Object}   res      - The response object
   * @param  {Function} cb       - A callback function -> cb(err, user, info)
   * @return void
   */
  PassportSSO.callback = function (strategy, token, options, req, res, cb) {
    console.log(
      `AudkenniStrategy: PassportSSO.callback  -------------------> ${strategy}`
    );
    if (typeof token === "string" && token.length > 0) {
      return this.profile(strategy, token, req, cb);
    }

    Passport.authenticate(strategy, options, function (err, user) {
      if (err) {
        return cb(err, false, false);
      }
      if (!user) {
        return cb("passportsso.error.user", false);
      }

      return cb(false, user);
    })(req, res, cb);
  };

  PassportSSO.getPassportOidcOptions = function (providerOpts) {
    console.log(
      `AudkenniStrategy: getPassportOidcOptions 2-------------------> ${JSON.stringify(
        providerOpts,
        null,
        2
      )}`
    );
    var passportOpts = {
      provider: providerOpts.provider,
      name: providerOpts.name,
      protocol: providerOpts.protocol,
      strategy: require(providerOpts.strategyPackage)[
        providerOpts.strategyObject
      ],
      options: {
        issuer: providerOpts.issuer,
        profileFields: ["name", "nationalRegisterId", "displayName"],
        authorizationURL: providerOpts.authorizationURL,
        tokenURL: providerOpts.tokenURL,
        userInfoURL: providerOpts.userInfoURL,
        clientID: providerOpts.clientID,
        clientSecret: providerOpts.clientSecret,
        callbackURL: providerOpts.callbackUrl,
        scope: providerOpts.scope || ["openid", "profile", "signature"],
      },
    };

    if (passportOpts.options) {
      passportOpts.options.passReqToCallback = true;
    }

    console.log(
      `AudkenniStrategy: getPassportOidcOptions 3-------------------> ${JSON.stringify(
        passportOpts,
        null,
        2
      )}`
    );

    return passportOpts;
  };

  /**
   * Get user profile using an access token
   * @param  {String}   strategy - The strategy name. This would have been specified
   *                               in the strategy's configuration that was passed to
   *                               PassportSSO.init()
   * @param  {String}   token    - Access token provided by auth vendor
   * @param  {Object}   req      - The request object
   * @param  {Function} cb       - A callback function -> cb(err, user, info)
   * @return void
   */
  PassportSSO.profile = function (strategy, token, req, cb) {
    strategy = Passport._strategies[strategy];
    if (!strategy) {
      return cb("passportsso.error.strategy", false);
    }

    var skipProfile = strategy._skipUserProfile;
    if (
      skipProfile ||
      strategy.userProfile == undefined ||
      typeof strategy.userProfile !== "function"
    ) {
      return cb("passportsso.error.profile", false);
    }

    strategy.userProfile(token, function (err, profile) {
      if (err) {
        return cb(err);
      }

      if (strategy._passReqToCallback) {
        return strategy._verify(req, token, null, profile, cb);
      }

      return strategy._verify(token, null, profile, cb);
    });
  };

  return PassportSSO;
};
