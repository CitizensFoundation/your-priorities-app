"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourPrioritiesApi = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const request_ip_1 = __importDefault(require("request-ip"));
const compression_1 = __importDefault(require("compression"));
const isbot_1 = __importDefault(require("isbot"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = __importDefault(require("passport"));
const models_1 = __importDefault(require("./models"));
const authorization_1 = __importDefault(require("./authorization"));
const index_1 = __importDefault(require("./controllers/index"));
const news_feeds_1 = __importDefault(require("./active-citizen/controllers/news_feeds"));
const activities_1 = __importDefault(require("./active-citizen/controllers/activities"));
const notifications_1 = __importDefault(require("./active-citizen/controllers/notifications"));
const recommendations_1 = __importDefault(require("./active-citizen/controllers/recommendations"));
const posts_1 = __importDefault(require("./controllers/posts"));
const groups_1 = __importDefault(require("./controllers/groups"));
const communities_1 = __importDefault(require("./controllers/communities"));
const domains_1 = __importDefault(require("./controllers/domains"));
const organizations_1 = __importDefault(require("./controllers/organizations"));
const points_1 = __importDefault(require("./controllers/points"));
const users_1 = __importDefault(require("./controllers/users"));
const categories_1 = __importDefault(require("./controllers/categories"));
const images_1 = __importDefault(require("./controllers/images"));
const externalIds_1 = __importDefault(require("./controllers/externalIds"));
const ratings_1 = __importDefault(require("./controllers/ratings"));
const bulkStatusUpdates_1 = __importDefault(require("./controllers/bulkStatusUpdates"));
const videos_1 = __importDefault(require("./controllers/videos"));
const audios_1 = __importDefault(require("./controllers/audios"));
const legacyPosts_1 = __importDefault(require("./controllers/legacyPosts"));
const legacyUsers_1 = __importDefault(require("./controllers/legacyUsers"));
const legacyPages_1 = __importDefault(require("./controllers/legacyPages"));
const nonSpa_1 = __importDefault(require("./controllers/nonSpa"));
const sitemap_generator_1 = __importDefault(require("./utils/sitemap_generator"));
const manifest_generator_1 = __importDefault(require("./utils/manifest_generator"));
const to_json_1 = __importDefault(require("./utils/to_json"));
//@ts-ignore
const passport_sso_1 = __importDefault(require("passport-sso"));
const cors_1 = __importDefault(require("cors"));
const loggerTs_js_1 = __importDefault(require("./utils/loggerTs.js"));
const redis_1 = require("redis");
const node_1 = require("@airbrake/node");
let airbrake;
if (process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_API_KEY) {
    airbrake = new node_1.Notifier({
        projectId: parseInt(process.env.AIRBRAKE_PROJECT_ID),
        projectKey: process.env.AIRBRAKE_API_KEY,
        performanceStats: false,
    });
}
const bot_control_1 = require("./bot_control");
const ws_1 = require("ws");
const uuid_1 = require("uuid");
let redisClient;
if (process.env.REDIS_URL) {
    let redisUrl = process.env.REDIS_URL;
    if (redisUrl.startsWith("redis://h:")) {
        redisUrl = redisUrl.replace("redis://h:", "redis://:");
    }
    if (redisUrl.includes("rediss://")) {
        redisClient = (0, redis_1.createClient)({
            legacyMode: true,
            url: redisUrl,
            socket: { tls: true, rejectUnauthorized: false },
        });
    }
    else {
        redisClient = (0, redis_1.createClient)({ legacyMode: false, url: redisUrl });
    }
}
else {
    redisClient = (0, redis_1.createClient)({ legacyMode: false });
}
redisClient.on("error", (err) => console.error("Redis client error", err));
redisClient.on("connect", () => console.log("Redis client is connect"));
redisClient.on("reconnecting", () => console.log("Redis client is reconnecting"));
redisClient.on("ready", () => console.log("Redis client is ready"));
redisClient.connect().catch(console.error);
class YourPrioritiesApi {
    app;
    port;
    httpServer;
    ws;
    redisClient;
    wsClients = new Map();
    constructor(port = undefined) {
        this.app = (0, express_1.default)();
        this.port = port || (process.env.PORT ? parseInt(process.env.PORT) : 4242);
        this.wsClients = new Map();
        this.redisClient = redisClient;
        this.addRedisToRequest();
        this.forceHttps();
        this.initializeMiddlewares();
        //this.handleShortenedRedirects();
        this.handleServiceWorkerRequests();
        this.setupStaticFileServing();
        //this.initializeRateLimiting();
        this.setupDomainAndCommunity();
        //this.setupSitemapRoute();
        this.initializePassportStrategies();
        this.checkAuthForSsoInit();
        this.initializeRoutes();
        this.initializeEsControllers();
        this.setupErrorHandler();
    }
    addRedisToRequest() {
        this.app.use((req, res, next) => {
            if (this.redisClient && typeof this.redisClient.get === "function") {
                req.redisClient = this.redisClient;
                loggerTs_js_1.default.info("Have connected redis client to request");
            }
            else {
                loggerTs_js_1.default.error("Redis client get method not found or client not initialized");
            }
            next();
        });
    }
    forceHttps() {
        if (this.app.get("env") !== "development" &&
            !process.env.DISABLE_FORCE_HTTPS) {
            this.app.use((req, res, next) => {
                if (!/https/.test(req.protocol)) {
                    res.redirect("https://" + req.headers.host + req.url);
                }
                else {
                    return next();
                }
            });
        }
    }
    handleShortenedRedirects() {
        this.app.use((req, res, next) => {
            if (req.path.startsWith("/s/")) {
                res.redirect(`${req.protocol}://${req.headers.host}${req.url.replace("/s/", "/survey/")}`);
            }
            else if (req.path.startsWith("/g/")) {
                res.redirect(`${req.protocol}://${req.headers.host}${req.url.replace("/g/", "/group/")}`);
            }
            else if (req.path.startsWith("/c/")) {
                res.redirect(`${req.protocol}://${req.headers.host}${req.url.replace("/c/", "/community/")}`);
            }
            else {
                return next();
            }
        });
    }
    handleServiceWorkerRequests() {
        this.app.get("/*", (req, res, next) => {
            if (req.url.indexOf("service-worker.js") > -1) {
                res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
                res.setHeader("Last-Modified", new Date(Date.now()).toUTCString());
            }
            next();
        });
    }
    setupDomainAndCommunity() {
        this.app.use((req, res, next) => {
            models_1.default.Domain.setYpDomain(req, res, () => {
                loggerTs_js_1.default.info("Domain", {
                    id: req.ypDomain ? req.ypDomain.id : "-1",
                    n: req.ypDomain ? req.ypDomain.domain_name : "?",
                });
                models_1.default.Community.setYpCommunity(req, res, () => {
                    loggerTs_js_1.default.info("Community", {
                        id: req.ypCommunity ? req.ypCommunity.id : null,
                        n: req.ypCommunity ? req.ypCommunity.hostname : null,
                    });
                    next();
                });
            });
        });
    }
    async initializeRateLimiting() {
        // Wait for one second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const botRateLimiter = (0, express_rate_limit_1.default)({
            windowMs: process.env.RATE_LIMITER_WINDOW_MS
                ? parseInt(process.env.RATE_LIMITER_WINDOW_MS, 10)
                : 15 * 60 * 1000, // 15 minutes
            max: process.env.RATE_LIMITER_MAX
                ? parseInt(process.env.RATE_LIMITER_MAX, 10)
                : 30,
        });
        this.app.use((req, res, next) => {
            let ua = req.headers["user-agent"] || "";
            if (req.headers["content-type"] !== "application/json" &&
                req.originalUrl &&
                !req.originalUrl.endsWith("/sitemap.xml")) {
                const isBotBad = (0, bot_control_1.isBadBot)(ua.toLowerCase());
                //TODO: CHECK THIS
                //@ts-ignore
                if (!(0, bot_control_1.botsWithJavascript)(ua) && ((0, isbot_1.default)(ua) || (0, bot_control_1.isBadBot)(ua))) {
                    if (isBotBad) {
                        botRateLimiter(req, res, () => {
                            (0, nonSpa_1.default)(req, res, next);
                        });
                    }
                    else {
                        (0, nonSpa_1.default)(req, res, next);
                    }
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
        });
    }
    setupSitemapRoute() {
        this.app.get("/sitemap.xml", async (req, res) => {
            try {
                const url = req.get("host") + req.originalUrl;
                const redisKey = "cache:sitemapv14:" + url;
                const sitemap = await req.redisClient.get(redisKey);
                loggerTs_js_1.default.debug("GOT SITEMAPS!!!!" + sitemap);
                if (sitemap) {
                    res.header("Content-Type", "application/xml");
                    res.send(sitemap);
                }
                else {
                    (0, sitemap_generator_1.default)(req, res);
                }
            }
            catch (error) {
                loggerTs_js_1.default.error("Error getting sitemap from redis", { error });
                (0, sitemap_generator_1.default)(req, res);
            }
        });
    }
    bearerCallback = function () {
        return console.log("The user has tried to authenticate with a bearer token");
    };
    checkAuthForSsoInit() {
        this.app.use((req, res, next) => {
            if (req.url.indexOf("/auth") > -1 ||
                req.url.indexOf("/login") > -1 ||
                req.url.indexOf("saml_assertion") > -1) {
                passport_sso_1.default.init(req.ypDomain?.loginHosts, req.ypDomain?.loginProviders, {
                    authorize: this.bearerCallback,
                    login: models_1.default.User.localCallback,
                });
                req.sso = passport_sso_1.default;
            }
            next();
        });
    }
    setupStaticFileServing() {
        const baseDir = path_1.default.join(__dirname, "../webApps");
        // Promotion app
        const promotionAppPath = path_1.default.join(baseDir, "promotion_app/dist");
        this.app.use("/promotion", express_1.default.static(promotionAppPath));
        this.app.use("/promotion/domain/*", express_1.default.static(promotionAppPath));
        this.app.use("/promotion/community/*", express_1.default.static(promotionAppPath));
        this.app.use("/promotion/group/*", express_1.default.static(promotionAppPath));
        this.app.use("/promotion/post/*", express_1.default.static(promotionAppPath));
        this.app.use("/promotion/locales/en/*", express_1.default.static(path_1.default.join(promotionAppPath, "locales/en")));
        this.app.use("/promotion/locales/is/*", express_1.default.static(path_1.default.join(promotionAppPath, "locales/is")));
        // Land use game
        const landUseGamePath = path_1.default.join(baseDir, "land_use_game/dist");
        this.app.use("/land_use", express_1.default.static(landUseGamePath));
        this.app.use("/land_use/*", express_1.default.static(landUseGamePath));
        this.app.use("/land_use/locales/en/*", express_1.default.static(path_1.default.join(landUseGamePath, "locales/en")));
        this.app.use("/land_use/locales/is/*", express_1.default.static(path_1.default.join(landUseGamePath, "locales/is")));
        this.app.use("/Assets", express_1.default.static(path_1.default.join(landUseGamePath, "Assets")));
        this.app.use("/ThirdParty", express_1.default.static(path_1.default.join(landUseGamePath, "ThirdParty")));
        this.app.use("/Widgets", express_1.default.static(path_1.default.join(landUseGamePath, "Widgets")));
        this.app.use("/Workers", express_1.default.static(path_1.default.join(landUseGamePath, "Workers")));
        // Analytics app
        const analyticsAppPath = path_1.default.join(baseDir, "analytics_app/dist");
        this.app.use("/analytics/", express_1.default.static(analyticsAppPath));
        this.app.use("/analytics/domain/*", express_1.default.static(analyticsAppPath));
        this.app.use("/analytics/community/*", express_1.default.static(analyticsAppPath));
        this.app.use("/analytics/group/*", express_1.default.static(analyticsAppPath));
        // Admin app
        const adminAppPath = path_1.default.join(baseDir, "admin_app/dist");
        this.app.use("/admin/", express_1.default.static(adminAppPath));
        this.app.use("/admin/domain/*", express_1.default.static(adminAppPath));
        this.app.use("/admin/community/*", express_1.default.static(adminAppPath));
        this.app.use("/admin/group/*", express_1.default.static(adminAppPath));
    }
    initializeMiddlewares() {
        this.app.use((0, morgan_1.default)("combined"));
        this.app.use(express_useragent_1.default.express());
        this.app.use(request_ip_1.default.mw());
        this.app.use(body_parser_1.default.json({ limit: "10mb", strict: false }));
        this.app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.set("views", __dirname + "/views");
        this.app.set("view engine", "pug");
        const store = new connect_redis_1.default({ client: this.redisClient, ttl: 86400 });
        const sessionConfig = {
            store: store,
            name: "yrpr.sid",
            secret: process.env.SESSION_SECRET || "not so secret... use env var.",
            resave: false,
            proxy: process.env.USING_NGINX_PROXY ? true : undefined,
            cookie: { autoSubDomain: true },
            saveUninitialized: false,
        };
        if (this.app.get("env") === "production") {
            this.app.set("trust proxy", 1); // trust first proxy
            //@ts-ignore
            sessionConfig.cookie.secure = true; // serve secure cookies
        }
        //@ts-ignore
        this.app.use((0, express_session_1.default)(sessionConfig));
    }
    initializeEsControllers() {
        console.log("Initializing ES controllers");
        this.app.use((err, req, res, next) => {
            if (err instanceof authorization_1.default.UnauthorizedError) {
                loggerTs_js_1.default.info("Anon debug UnauthorizedError", { user: req.user });
                loggerTs_js_1.default.error("User Unauthorized", {
                    context: "unauthorizedError",
                    user: (0, to_json_1.default)(req.user),
                    err: "Unauthorized",
                    errorStatus: 401,
                });
                res.sendStatus(401);
            }
            else {
                next(err);
            }
        });
    }
    initializeRoutes() {
        this.app.use("/", index_1.default);
        this.app.use("/domain", index_1.default);
        this.app.use("/community", index_1.default);
        this.app.use("/group", index_1.default);
        this.app.use("/post", index_1.default);
        this.app.use("/user", index_1.default);
        this.app.use("/survey*", index_1.default);
        this.app.use("/api/domains", domains_1.default);
        this.app.use("/api/organizations", organizations_1.default);
        this.app.use("/api/communities", communities_1.default);
        this.app.use("/api/groups", groups_1.default);
        this.app.use("/api/posts", posts_1.default);
        this.app.use("/api/points", points_1.default);
        this.app.use("/api/images", images_1.default);
        this.app.use("/api/videos", videos_1.default);
        this.app.use("/api/audios", audios_1.default);
        this.app.use("/api/categories", categories_1.default);
        this.app.use("/api/externalIds", externalIds_1.default);
        this.app.use("/api/users", users_1.default);
        this.app.use("/api/news_feeds", news_feeds_1.default);
        this.app.use("/api/activities", activities_1.default);
        this.app.use("/api/notifications", notifications_1.default);
        this.app.use("/api/bulk_status_updates", bulkStatusUpdates_1.default);
        this.app.use("/api/recommendations", recommendations_1.default);
        this.app.use("/api/ratings", ratings_1.default);
        this.app.use("/ideas", legacyPosts_1.default);
        this.app.use("/users", legacyUsers_1.default);
        this.app.use("/pages", legacyPages_1.default);
        // Additional routes for authentication and other functionalities
        this.app.post("/authenticate_from_island_is", (req, res) => {
            console.log("SAML SAML 1", { domainId: req.ypDomain.id });
            req.sso.authenticate(`saml-strategy-${req.ypDomain.id}`, {}, req, res, (error) => {
                console.log("SAML SAML 2", {
                    domainId: req.ypDomain.id,
                    err: error,
                });
                if (error) {
                    console.error("Error from SAML login", { err: error });
                    error.url = req.url;
                    res.sendStatus(401);
                }
                else {
                    if (req.user.DestinationSSN === "6012101260") {
                        console.log("SAML SAML 3", { domainId: req.ypDomain.id });
                        res.render("samlLoginComplete", {});
                    }
                    else {
                        console.error("Error from SAML login", {
                            err: "Failed DestinationSSN check",
                        });
                        res.sendStatus(401);
                    }
                }
            });
        });
        this.app.post("/saml_assertion", (req, res) => {
            console.log("SAML SAML 1 General", { domainId: req.ypDomain.id });
            req.sso.authenticate(`saml-strategy-${req.ypDomain.id}`, {}, req, res, (error, user) => {
                console.log("SAML SAML 2 General", {
                    domainId: req.ypDomain.id,
                    err: error,
                });
                if (error) {
                    console.error("Error from SAML General login", { err: error });
                    if (error === "customError") {
                        res.render("samlCustomError", {
                            customErrorHTML: req.ypDomain.configuration.customSAMLErrorHTML,
                            closeWindowText: "Close window",
                        });
                    }
                    else {
                        error.url = req.url;
                        console.error("Error from SAML General login", { err: error });
                        res.sendStatus(500);
                    }
                }
                else {
                    console.log("SAML SAML 3 General", { domainId: req.ypDomain.id });
                    res.render("samlLoginComplete", {});
                }
            });
        });
        this.app.get("/manifest.json", (req, res) => {
            (0, manifest_generator_1.default)(req, res);
        });
    }
    initializePassportStrategies() {
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        passport_1.default.serializeUser((req, profile, done) => {
            loggerTs_js_1.default.info("----> User Serialized", { loginProvider: profile.provider });
            if (profile.provider === "facebook") {
                models_1.default.User.serializeFacebookUser(profile, req.ypDomain, (error, user) => {
                    if (error) {
                        loggerTs_js_1.default.error("Error in User Serialized from Facebook", {
                            err: error,
                        });
                        done(error);
                    }
                    else {
                        loggerTs_js_1.default.info("User Serialized", {
                            context: "loginFromFacebook",
                            userId: user.id,
                        });
                        // Assuming registerUserLogin is defined elsewhere in your application
                        this.registerUserLogin(user, user.id, "facebook", req, () => {
                            done(null, { userId: user.id, loginProvider: "facebook" });
                        });
                    }
                });
            }
            else if (profile.provider === "saml") {
                models_1.default.User.serializeSamlUser(profile, req, (error, user) => {
                    if (error) {
                        loggerTs_js_1.default.error("Error in User Serialized from SAML", { err: error });
                        done(error);
                    }
                    else {
                        loggerTs_js_1.default.info("User Serialized", {
                            context: "loginFromSaml",
                            userId: user.id,
                        });
                        this.registerUserLogin(user, user.id, "saml", req, () => {
                            done(null, { userId: user.id, loginProvider: "saml" });
                        });
                    }
                });
            }
            else {
                loggerTs_js_1.default.info("User Serialized", {
                    context: "serializeUser",
                    userEmail: profile.email,
                    userId: profile.id,
                });
                this.registerUserLogin(null, parseInt(profile.id), "email", req, () => {
                    done(null, {
                        userId: parseInt(profile.id),
                        loginProvider: "email",
                    });
                });
            }
        });
        passport_1.default.deserializeUser((sessionUser, done) => {
            models_1.default.User.findOne({
                where: { id: sessionUser.userId },
                attributes: [
                    "id",
                    "name",
                    "email",
                    "default_locale",
                    "facebook_id",
                    "twitter_id",
                    "google_id",
                    "github_id",
                    "ssn",
                    "profile_data",
                    "private_profile_data",
                ],
                include: [
                    {
                        model: models_1.default.Image,
                        as: "UserProfileImages",
                        required: false,
                    },
                    {
                        model: models_1.default.Image,
                        as: "UserHeaderImages",
                        required: false,
                    },
                ],
            })
                .then((user) => {
                if (user) {
                    user.loginProvider = sessionUser.loginProvider;
                    if (user.private_profile_data?.saml_agency &&
                        sessionUser.loginProvider === "saml") {
                        user.isSamlEmployee = true;
                        loggerTs_js_1.default.info("SAML isSamlEmployee is true");
                    }
                    done(null, user);
                }
                else {
                    loggerTs_js_1.default.error("User Deserialized Not found", {
                        context: "deserializeUser",
                    });
                    if (airbrake) {
                        airbrake
                            .notify("User Deserialized Not found")
                            .then((airbrakeErr) => {
                            if (airbrakeErr.error) {
                                loggerTs_js_1.default.error("AirBrake Error", {
                                    context: "airbrake",
                                    err: airbrakeErr.error,
                                    errorStatus: 500,
                                });
                            }
                        });
                    }
                    done(null, false);
                }
            })
                .catch((error) => {
                loggerTs_js_1.default.error("User Deserialize Error", {
                    context: "deserializeUser",
                    err: error,
                    errorStatus: 500,
                });
                if (airbrake) {
                    airbrake.notify(error).then((airbrakeErr) => {
                        if (airbrakeErr.error) {
                            loggerTs_js_1.default.error("AirBrake Error", {
                                context: "airbrake",
                                err: airbrakeErr.error,
                                errorStatus: 500,
                            });
                        }
                    });
                }
                done(null, false);
            });
        });
    }
    completeRegisterUserLogin = (user, // Replace 'any' with the actual user type
    loginType, req, // Replace 'any' with 'YpRequest' if it's the correct type
    done) => {
        user.last_login_at = new Date().getTime(); // Assuming your database expects a timestamp
        user
            .save()
            .then(() => {
            models_1.default.AcActivity.createActivity({
                type: "activity.user.login",
                userId: user.id,
                domainId: req.ypDomain.id,
                communityId: req.ypCommunity ? req.ypCommunity.id : null,
                object: {
                    loginType: loginType,
                    userDepartment: user.private_profile_data
                        ? user.private_profile_data.saml_agency
                        : null,
                    samlProvider: user.private_profile_data
                        ? user.private_profile_data.saml_provider
                        : null,
                },
                access: models_1.default.AcActivity.PRIVATE,
            }, (error) => {
                if (error) {
                    loggerTs_js_1.default.error("Error creating activity for user login", { error });
                }
                done();
            });
        })
            .catch((error) => {
            loggerTs_js_1.default.error("Error saving user for login registration", { error });
            done();
        });
    };
    registerUserLogin = (user, userId, loginProvider, req, done) => {
        if (user && user.private_profile_data) {
            this.completeRegisterUserLogin(user, loginProvider, req, done);
        }
        else {
            models_1.default.User.findOne({
                where: { id: userId },
                attributes: ["id", "private_profile_data", "last_login_at"],
            })
                .then((user) => {
                if (user) {
                    this.completeRegisterUserLogin(user, loginProvider, req, done);
                }
                else {
                    loggerTs_js_1.default.error("Did not find user for login registration", { userId });
                    done();
                }
            })
                .catch((error) => {
                loggerTs_js_1.default.error("Error saving user for login registration", { error });
                done();
            });
        }
    };
    setupErrorHandler() {
        // Catch-all handler for 404 Not Found
        this.app.use((req, res, next) => {
            const err = new Error("Not Found");
            err.status = 404;
            loggerTs_js_1.default.warn("Not Found", {
                context: "notFound",
                user: (0, to_json_1.default)(req.user),
                err: "Not Found",
                errorStatus: 404,
            });
            next(err);
        });
        // General error handler
        this.app.use((err, req, res, next) => {
            let status = err.status || 500;
            if (err.message && err.message.includes("Expected url like")) {
                status = 404;
            }
            let body = null;
            try {
                if (req.body) {
                    body = JSON.stringify(req.body);
                }
            }
            catch (bodyError) {
                loggerTs_js_1.default.error("General Error: Body JSON parsing error", {
                    err: bodyError,
                });
            }
            loggerTs_js_1.default.error("General Error", {
                context: "generalError",
                user: req.user ? (0, to_json_1.default)(req.user) : null,
                err: err,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                body,
                errStack: err.stack,
                errorStatus: status,
            });
            err.url = req.url;
            err.params = req.params;
            if (status !== 404 && status !== 401) {
                // Optionally notify an error tracking service like Airbrake
                if (airbrake) {
                    airbrake.notify(err).then((airbrakeErr) => {
                        if (airbrakeErr.error) {
                            loggerTs_js_1.default.error("AirBrake Error", {
                                context: "airbrake",
                                user: (0, to_json_1.default)(req.user),
                                err: airbrakeErr.error,
                                errorStatus: 500,
                            });
                        }
                    });
                }
            }
            res.sendStatus(status);
        });
    }
    listen() {
        let server;
        if (process.env.YOUR_PRIORITIES_LISTEN_HOST) {
            server = this.app.listen(this.app.get("port"), process.env.YOUR_PRIORITIES_LISTEN_HOST, () => {
                loggerTs_js_1.default.info(`Your Priorities Platform API Server listening on port ${process.env.YOUR_PRIORITIES_LISTEN_HOST}:${this.app.get("port")} on ${process.env.NODE_ENV}`);
            });
        }
        else {
            server = this.app.listen(4242, function () {
                loggerTs_js_1.default.info("Your Priorities Platform API Server listening on port " +
                    server.address().port +
                    ` on ${process.env.NODE_ENV}`);
            });
        }
        this.ws = new ws_1.WebSocketServer({ server });
        this.ws.on("connection", (ws) => {
            const clientId = (0, uuid_1.v4)();
            this.wsClients.set(clientId, ws);
            ws.send(JSON.stringify({ clientId }));
            ws.on("message", (message) => {
                // Handle incoming messages
            });
            ws.on("close", () => {
                this.wsClients.delete(clientId);
            });
            ws.on("error", () => {
                this.wsClients.delete(clientId);
            });
        });
    }
}
exports.YourPrioritiesApi = YourPrioritiesApi;
