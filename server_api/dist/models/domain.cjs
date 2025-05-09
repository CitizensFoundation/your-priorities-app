"use strict";
const async = require("async");
const log = require("../utils/logger.cjs");
const toJson = require("../utils/to_json.cjs");
const parseDomain = require("../utils/parse_domain.cjs");
var queue = require("../services/workers/queue.cjs");
const Community = require("./community.cjs");
const checkValidKeys = (keys) => {
    return (keys.client_id &&
        keys.client_id != "" &&
        keys.client_id.length > 6 &&
        keys.client_secret &&
        keys.client_secret != "");
};
module.exports = (sequelize, DataTypes) => {
    const Domain = sequelize.define("Domain", {
        name: { type: DataTypes.STRING, allowNull: false },
        domain_name: { type: DataTypes.STRING, allowNull: false },
        access: { type: DataTypes.INTEGER, allowNull: false },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        default_locale: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "en",
        },
        description: DataTypes.TEXT,
        message_to_users: DataTypes.STRING,
        message_for_new_idea: DataTypes.STRING,
        ip_address: { type: DataTypes.STRING, allowNull: false },
        user_agent: { type: DataTypes.TEXT, allowNull: false },
        google_analytics_code: { type: DataTypes.STRING, allowNull: true },
        counter_communities: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_groups: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_organizations: { type: DataTypes.INTEGER, defaultValue: 0 },
        only_admins_can_create_communities: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        theme_id: { type: DataTypes.INTEGER, defaultValue: null },
        other_social_media_info: DataTypes.JSONB,
        secret_api_keys: DataTypes.JSONB,
        public_api_keys: DataTypes.JSONB,
        info_texts: DataTypes.JSONB,
        configuration: DataTypes.JSONB,
        language: { type: DataTypes.STRING, allowNull: true },
        data: DataTypes.JSONB,
    }, {
        underscored: true,
        tableName: "domains",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                fields: ["id", "deleted"],
            },
            {
                name: "domains_idx_deleted_domain_name",
                fields: ["deleted", "domain_name"],
            },
        ],
        instanceMethods: {},
    });
    Domain.associate = (models) => {
        Domain.hasMany(models.Community, { foreignKey: "domain_id" });
        Domain.belongsToMany(models.Video, {
            as: "DomainLogoVideos",
            through: "DomainLogoVideo",
        });
        Domain.belongsToMany(models.Image, {
            as: "DomainLogoImages",
            through: "DomainLogoImage",
        });
        Domain.belongsToMany(models.Image, {
            as: "DomainHeaderImages",
            through: "DomainHeaderImage",
        });
        Domain.belongsToMany(models.User, { through: "DomainUser" });
        Domain.belongsToMany(models.User, {
            as: "DomainUsers",
            through: "DomainUser",
        });
        Domain.belongsToMany(models.User, {
            as: "DomainAdmins",
            through: "DomainAdmin",
        });
    };
    Domain.ACCESS_PUBLIC = 0;
    Domain.ACCESS_CLOSED = 1;
    Domain.ACCESS_SECRET = 2;
    Domain.defaultAttributesPublic = [
        "id",
        "name",
        "domain_name",
        "access",
        "deleted",
        "description",
        "default_locale",
        "message_to_users",
        "message_for_new_idea",
        "google_analytics_code",
        "counter_communities",
        "counter_users",
        "counter_groups",
        "counter_points",
        "counter_posts",
        "counter_organizations",
        "only_admins_can_create_communities",
        "theme_id",
        "other_social_media_info",
        "public_api_keys",
        "info_texts",
        "configuration",
    ];
    Domain.getLoginProviders = (req, domainIn, callback) => {
        const providers = [];
        console.log(`-------------------> getLoginProviders Checking local keys for domain ${domainIn.id}`);
        providers.push({
            name: "local-strategy",
            provider: "local",
            protocol: "local",
            strategyObject: "Strategy",
            strategyPackage: "passport-local",
            clientID: "false",
            clientSecret: "false",
            scope: [],
            fields: null,
            urlCallback: "http://localhost/callback/users/auth/local-strategy-1/callback",
        });
        async.eachSeries([domainIn], (domain, seriesCallback) => {
            console.log(`================> Processing domain ${domain.id} ${process.env.STAGING_SETUP ? "staging" : "production"}`);
            let callbackDomainName;
            if (process.env.STAGING_SETUP) {
                if (domain.domain_name === "betrireykjavik.is") {
                    callbackDomainName = "betri." + domain.domain_name;
                }
                else if (domain.domain_name === "betraisland.is") {
                    callbackDomainName = "betra." + domain.domain_name;
                }
                else if (domain.domain_name === "yrpri.org") {
                    callbackDomainName = "beta." + domain.domain_name;
                }
                else {
                    callbackDomainName = domain.domain_name;
                }
            }
            else {
                if (domain.domain_name === "forbrukerradet.no") {
                    callbackDomainName = "mineideer." + domain.domain_name;
                }
                else if (domain.domain_name === "parliament.scot") {
                    callbackDomainName = "engage." + domain.domain_name;
                }
                else if (domain.domain_name === "engage-southampton.ac.uk") {
                    callbackDomainName = "scca-online." + domain.domain_name;
                }
                else if (domain.domain_name === "boliden.com") {
                    callbackDomainName = "sidtjarn." + domain.domain_name;
                }
                else if (domain.domain_name === "multicitychallenge.org" &&
                    process.env.US_CLUSTER != null) {
                    callbackDomainName = "ideas." + domain.domain_name;
                }
                else if (domain.domain_name === "multicitychallenge.org") {
                    callbackDomainName = "yp." + domain.domain_name;
                }
                else if (domain.domain_name === "mycitychallenge.org") {
                    callbackDomainName = "ideas." + domain.domain_name;
                }
                else if (domain.domain_name === "engagebritain.org") {
                    callbackDomainName = "socialcare." + domain.domain_name;
                }
                else if (process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME) {
                    console.log("Using custom login back name", {
                        custom: process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME,
                    });
                    callbackDomainName =
                        process.env.LOGIN_CALLBACK_CUSTOM_HOSTNAME +
                            "." +
                            domain.domain_name;
                }
                else {
                    if (domain.domain_name === "betrireykjavik.is") {
                        callbackDomainName = domain.domain_name;
                    }
                    else if (domain.domain_name === "betraisland.is") {
                        callbackDomainName = domain.domain_name;
                    }
                    else {
                        callbackDomainName = "login." + domain.domain_name;
                    }
                }
            }
            console.log(`Checking facebook keys for domain ${domain.id}`);
            if (domain.secret_api_keys &&
                domain.secret_api_keys.facebook &&
                checkValidKeys(domain.secret_api_keys.facebook)) {
                providers.push({
                    name: "facebook-strategy-" + domain.id,
                    provider: "facebook",
                    protocol: "oauth2",
                    strategyObject: "Strategy",
                    strategyPackage: "passport-facebook",
                    clientID: domain.secret_api_keys.facebook.client_id,
                    clientSecret: domain.secret_api_keys.facebook.client_secret,
                    scope: ["email"],
                    fields: ["id", "displayName", "email"],
                    // urlCallback     : 'http://fbtest.betrireykjavik.is:4242/api/users/auth/facebook/callback'
                    urlCallback: "https://" +
                        callbackDomainName +
                        "/api/users/auth/facebook/callback",
                });
            }
            console.log(`Checking oidc keys for domain ${domain.id}`);
            //console.log(JSON.stringify(domain.secret_api_keys, null, 2));
            //callbackDomainName = "betrireykjavik.is";
            if (domain.secret_api_keys &&
                domain.secret_api_keys.oidc &&
                checkValidKeys(domain.secret_api_keys.oidc)) {
                console.log(`---------------------> OIDC keys found for domain ${domain.id}`);
                providers.push({
                    name: "oidc-strategy-" + domain.id,
                    provider: "oidc",
                    protocol: "oidc",
                    strategyObject: "Strategy",
                    strategyPackage: "passport-openidconnect",
                    clientID: domain.secret_api_keys.oidc.client_id,
                    clientSecret: domain.secret_api_keys.oidc.client_secret,
                    issuer: domain.secret_api_keys.oidc.issuer,
                    authorizationURL: domain.secret_api_keys.oidc.authorizationURL,
                    tokenURL: domain.secret_api_keys.oidc.tokenURL,
                    userInfoURL: domain.secret_api_keys.oidc.userInfoURL,
                    callbackUrl: "https://" +
                        callbackDomainName +
                        "/api/users/auth/audkenni/callback",
                    scope: ["openid"],
                    urlCallback: "https://" +
                        callbackDomainName +
                        "/api/users/auth/audkenni/callback",
                });
            }
            if (domain.secret_api_keys &&
                domain.secret_api_keys.saml &&
                domain.secret_api_keys.saml.entryPoint &&
                domain.secret_api_keys.saml.entryPoint !== "" &&
                domain.secret_api_keys.saml.entryPoint.length > 6) {
                providers.push({
                    name: "saml-strategy-" + domain.id,
                    provider: "saml",
                    protocol: "saml",
                    strategyObject: "Strategy",
                    strategyPackage: "passport-saml",
                    certInPemFormat: true,
                    audience: req.hostname,
                    issuer: domain.secret_api_keys.saml.issuer
                        ? domain.secret_api_keys.saml.issuer
                        : null,
                    entryPoint: domain.secret_api_keys.saml.entryPoint,
                    identifierFormat: domain.secret_api_keys.saml.identifierFormat
                        ? domain.secret_api_keys.saml.identifierFormat
                        : undefined,
                    cert: domain.secret_api_keys.saml.cert
                        ? domain.secret_api_keys.saml.cert
                        : null,
                    callbackUrl: domain.secret_api_keys.saml.callbackUrl &&
                        domain.secret_api_keys.saml.callbackUrl !== ""
                        ? domain.secret_api_keys.saml.callbackUrl
                        : null,
                });
            }
            seriesCallback();
        }, (error) => {
            callback(error, providers);
        });
    };
    Domain.getLoginHosts = (domainIn, callback) => {
        const hosts = [];
        hosts.push("127.0.0.1");
        hosts.push("localhost");
        async.eachSeries([domainIn], (domain, seriesCallback) => {
            hosts.push(domain.domain_name);
            seriesCallback();
        }, (error) => {
            callback(error, hosts);
        });
    };
    Domain.setYpDomain = (req, res, next) => {
        let domainName;
        const parsedDomain = parseDomain(req.headers.host);
        if (parsedDomain && parsedDomain.domain) {
            if (parsedDomain.subdomain.indexOf(".") > -1) {
                let subdomain = parsedDomain.subdomain.split(".")[parsedDomain.subdomain.split(".").length - 1];
                domainName =
                    subdomain + "." + parsedDomain.domain + "." + parsedDomain.tld;
            }
            else {
                domainName = parsedDomain.domain + "." + parsedDomain.tld;
            }
        }
        else if (parsedDomain) {
            domainName = parsedDomain.tld;
        }
        else {
            domainName = "localhost";
        }
        if (process.env.CREATE_NEW_DOMAINS_ON_DEMAND) {
            sequelize.models.Domain.findOrCreate({
                where: { domain_name: domainName },
                defaults: {
                    access: sequelize.models.Domain.ACCESS_PUBLIC,
                    default_locale: "en",
                    name: "New Domain",
                    configuration: {},
                    user_agent: req.useragent.source,
                    ip_address: req.clientIp,
                },
            })
                .then((results) => {
                const [domain, created] = results;
                if (created) {
                    log.info("Domain Created", {
                        domain: toJson(domain.simple()),
                        context: "create",
                    });
                    queue.add("process-similarities", { type: "update-collection", domainId: domain.id }, "low");
                }
                else {
                    //log.info('Domain Loaded', { domain: toJson(domain.simple()), context: 'create' });
                }
                req.ypDomain = domain;
                if (req.url.indexOf("/auth") > -1 ||
                    req.url.indexOf("/login") > -1 ||
                    req.url.indexOf("saml_assertion") > -1) {
                    sequelize.models.Domain.getLoginProviders(req, domain, (error, providers) => {
                        req.ypDomain.loginProviders = providers;
                        sequelize.models.Domain.getLoginHosts(domain, (error, hosts) => {
                            req.ypDomain.loginHosts = hosts;
                            next();
                        });
                    });
                }
                else {
                    next();
                }
            })
                .catch((error) => {
                next(error);
            });
        }
        else {
            sequelize.models.Domain.findOne({
                where: { domain_name: domainName },
            })
                .then((domain) => {
                if (domain) {
                    req.ypDomain = domain;
                    if (req.url.indexOf("/auth") > -1 ||
                        req.url.indexOf("/login") > -1 ||
                        req.url.indexOf("saml_assertion") > -1) {
                        sequelize.models.Domain.getLoginProviders(req, domain, (error, providers) => {
                            req.ypDomain.loginProviders = providers;
                            sequelize.models.Domain.getLoginHosts(domain, (error, hosts) => {
                                req.ypDomain.loginHosts = hosts;
                                next();
                            });
                        });
                    }
                    else {
                        next();
                    }
                }
                else {
                    next(`Domain ${domainName} not found`);
                }
            })
                .catch((error) => {
                next(error);
            });
        }
    };
    Domain.extractDomain = (url) => {
        let domain, host, dot;
        domain = url.split(":")[0];
        if (!Domain.isIpAddress(domain)) {
            if ((domain.match(/./g) || []).length > 1) {
                dot = domain.indexOf(".");
                domain = domain.substring(dot + 1, domain.length);
            }
        }
        return domain;
    };
    Domain.extractHost = (url) => {
        let domain, host, dot;
        domain = url.split(":")[0];
        if (!Domain.isIpAddress(domain)) {
            if ((domain.match(/./g) || []).length > 1) {
                domain = url.split(":")[0];
                dot = domain.indexOf(".");
                host = domain.substring(0, dot);
                return host;
            }
        }
        return null;
    };
    Domain.isIpAddress = (domain) => {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(domain)) {
            return true;
        }
        else {
            return false;
        }
    };
    Domain.prototype.simple = function () {
        return { id: this.id, name: this.name, domain_name: this.domain_name };
    };
    Domain.prototype.ensureApiKeySetup = function () {
        if (!this.secret_api_keys) {
            this.secret_api_keys = {
                facebook: {},
                google: {},
                github: {},
                twitter: {},
            };
        }
    };
    Domain.prototype.setupLogoImage = function (body, done) {
        if (body.uploadedLogoImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedLogoImageId },
            }).then((image) => {
                if (image)
                    this.addDomainLogoImage(image);
                done();
            });
        }
        else
            done();
    };
    Domain.prototype.setupHeaderImage = function (body, done) {
        if (body.uploadedHeaderImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedHeaderImageId },
            }).then((image) => {
                if (image)
                    this.addDomainHeaderImage(image);
                done();
            });
        }
        else
            done();
    };
    Domain.prototype.getImageFormatUrl = function (formatId) {
        if (this.DomainLogoImages && this.DomainLogoImages.length > 0) {
            const formats = JSON.parse(this.DomainLogoImages[this.DomainLogoImages.length - 1].formats);
            if (formats && formats.length > 0)
                return formats[formatId];
        }
        else {
            return "";
        }
    };
    Domain.prototype.setupImages = function (body, done) {
        async.parallel([
            (callback) => {
                this.setupLogoImage(body, (err) => {
                    callback(err);
                });
            },
            (callback) => {
                this.setupHeaderImage(body, (err) => {
                    callback(err);
                });
            },
        ], (err) => {
            done(err);
        });
    };
    return Domain;
};
