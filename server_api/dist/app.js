import express from "express";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import { RedisStore } from "connect-redis";
import useragent from "express-useragent";
import requestIp from "request-ip";
import compression from "compression";
import { isbot } from "isbot";
import rateLimit from "express-rate-limit";
import passport from "passport";
import models from "./models/index.cjs";
if (process.env.NEW_RELIC_APP_NAME) {
    import("newrelic")
        .then((newrelic) => {
        console.log("New Relic imported", newrelic);
    })
        .catch((err) => {
        console.error("Failed to import New Relic", err);
    });
}
import auth from "./authorization.cjs";
import index from "./controllers/index.cjs";
import news_feeds from "./services/controllers/news_feeds.cjs";
import activities from "./services/controllers/activities.cjs";
import notifications from "./services/controllers/notifications.cjs";
import recommendations from "./services/controllers/recommendations.cjs";
import posts from "./controllers/posts.cjs";
import groups from "./controllers/groups.cjs";
import communities from "./controllers/communities.cjs";
import domains from "./controllers/domains.cjs";
import organizations from "./controllers/organizations.cjs";
import points from "./controllers/points.cjs";
import users from "./controllers/users.cjs";
import categories from "./controllers/categories.cjs";
import images from "./controllers/images.cjs";
import externalIds from "./controllers/externalIds.cjs";
import ratings from "./controllers/ratings.cjs";
import bulkStatusUpdates from "./controllers/bulkStatusUpdates.cjs";
import videos from "./controllers/videos.cjs";
import audios from "./controllers/audios.cjs";
import legacyPosts from "./controllers/legacyPosts.cjs";
import legacyUsers from "./controllers/legacyUsers.cjs";
import legacyPages from "./controllers/legacyPages.cjs";
import nonSPArouter from "./controllers/nonSpa.cjs";
import generateSitemap from "./utils/sitemap_generator.cjs";
import generateManifest from "./utils/manifest_generator.cjs";
import toJson from "./utils/to_json.cjs";
//@ts-ignore
import sso from "passport-sso";
import cors from "cors";
import log from "./utils/loggerTs.js";
import { createClient } from "redis";
import { Notifier } from "@airbrake/node";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let airbrake;
if (process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_API_KEY) {
    airbrake = new Notifier({
        projectId: parseInt(process.env.AIRBRAKE_PROJECT_ID),
        projectKey: process.env.AIRBRAKE_API_KEY,
        performanceStats: false,
    });
}
process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    log.error("There was an uncaught error", err);
    if (err.stack) {
        console.error(err.stack);
        log.error(err.stack);
    }
    if (airbrake) {
        airbrake.notify(err).then((airbrakeErr) => {
            if (airbrakeErr.error) {
                log.error("AirBrake Error Internal", {
                    context: "airbrake",
                    err: airbrakeErr.error,
                    errorStatus: 500,
                });
            }
        });
    }
    //TODO: What else do we want to do here? We need to exit but can we restart it right away?
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    log.error("Unhandled Rejection at:", promise, "reason:", reason);
    if (reason.stack) {
        console.error(reason.stack);
        log.error("Unhandled Rejection at:", promise, "reason:", reason);
    }
    if (airbrake) {
        airbrake.notify(reason).then((airbrakeErr) => {
            if (airbrakeErr.error) {
                log.error("AirBrake Error", {
                    context: "airbrake",
                    err: airbrakeErr.error,
                    errorStatus: 500,
                });
            }
        });
    }
    //TODO: Look if this is safe to do in production, should be
    if (process.env.NODE_ENV !== "production") {
        process.exit(1);
    }
});
import { botsWithJavascript, isBadBot, } from "./bot_control.js";
import { Op } from "sequelize";
import { WebSocketsManager } from "./webSockets.js";
export class YourPrioritiesApi {
    constructor(port = undefined) {
        this.determineVersion = (req) => {
            // Check query parameter first
            if (req.query.useNewVersion === "true")
                return true;
            if (req.query.useNewVersion === "false")
                return false;
            // Then check session
            if (req.session.useNewVersion === true)
                return true;
            if (req.session.useNewVersion === false)
                return false;
            // Finally, check domain configuration
            if (req.ypDomain?.configuration?.useNewVersion === true)
                return true;
            // Default to false (old version)
            return false;
        };
        this.bearerCallback = function () {
            return console.log("The user has tried to authenticate with a bearer token");
        };
        this.completeRegisterUserLogin = (user, // Replace 'any' with the actual user type
        loginType, req, // Replace 'any' with 'YpRequest' if it's the correct type
        done) => {
            user.last_login_at = new Date().getTime(); // Assuming your database expects a timestamp
            user
                .save()
                .then(() => {
                models.AcActivity.createActivity({
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
                    access: models.AcActivity.PRIVATE,
                }, (error) => {
                    if (error) {
                        log.error("Error creating activity for user login", { error });
                    }
                    done();
                });
            })
                .catch((error) => {
                log.error("Error saving user for login registration", { error });
                done();
            });
        };
        this.registerUserLogin = (user, userId, loginProvider, req, done) => {
            if (user && user.private_profile_data) {
                this.completeRegisterUserLogin(user, loginProvider, req, done);
            }
            else {
                models.User.findOne({
                    where: { id: userId },
                    attributes: ["id", "private_profile_data", "last_login_at"],
                })
                    .then((user) => {
                    if (user) {
                        this.completeRegisterUserLogin(user, loginProvider, req, done);
                    }
                    else {
                        log.error("Did not find user for login registration", { userId });
                        done();
                    }
                })
                    .catch((error) => {
                    log.error("Error saving user for login registration", { error });
                    done();
                });
            }
        };
        this.app = express();
        this.port = port || (process.env.PORT ? parseInt(process.env.PORT) : 4242);
        this.wsClients = new Map();
        this.initializeRedis();
        this.addRedisToRequest();
        this.addDirnameToRequest();
        this.forceHttps();
        this.initializeMiddlewares();
        this.setupNewWebAppVersionHandling();
        this.handleShortenedRedirects();
        this.initializeRateLimiting();
        this.setupDomainAndCommunity();
        this.setupSitemapRoute();
        this.initializePassportStrategies();
        this.addInviteAsAnonMiddleWare();
        this.setupStaticFileServing();
        this.checkAuthForSsoInit();
        this.initializeRoutes();
        this.initializeEsControllers();
    }
    async initialize() {
        await this.initializeRedis();
        this.addRedisToRequest();
        this.addDirnameToRequest();
        this.forceHttps();
        this.initializeMiddlewares();
        this.setupNewWebAppVersionHandling();
        this.handleShortenedRedirects();
        this.initializeRateLimiting();
        this.setupDomainAndCommunity();
        this.setupSitemapRoute();
        this.initializePassportStrategies();
        this.addInviteAsAnonMiddleWare();
        this.setupStaticFileServing();
        this.checkAuthForSsoInit();
        this.initializeRoutes();
        this.initializeEsControllers();
    }
    setupNewWebAppVersionHandling() {
        this.app.use((req, res, next) => {
            req.useNewVersion = this.determineVersion(req);
            if (req.session) {
                req.session.useNewVersion = req.useNewVersion;
            }
            else {
                console.error("Session not found in request");
            }
            next();
        });
    }
    async initializeRedis() {
        if (process.env.REDIS_URL) {
            let redisUrl = process.env.REDIS_URL;
            if (redisUrl.startsWith("redis://h:")) {
                redisUrl = redisUrl.replace("redis://h:", "redis://:");
            }
            this.redisClient = createClient({
                legacyMode: false,
                url: redisUrl,
                pingInterval: 10000,
                socket: {
                    tls: redisUrl.startsWith("rediss://"),
                    rejectUnauthorized: false,
                },
            });
        }
        else {
            this.redisClient = createClient({ legacyMode: false });
        }
        this.redisClient.on("error", (err) => {
            console.error("App Redis client error", err);
        });
        this.redisClient.on("connect", () => {
            console.log("App Redis client is connected");
        });
        this.redisClient.on("reconnecting", () => {
            console.log("App Redis client is reconnecting");
        });
        this.redisClient.on("ready", () => {
            console.log("App Redis client is ready");
        });
        try {
            await this.redisClient.connect();
        }
        catch (err) {
            console.error("App Failed to connect Redis client", err);
        }
    }
    addRedisToRequest() {
        this.app.use((req, res, next) => {
            if (this.redisClient && typeof this.redisClient.get === "function") {
                req.redisClient = this.redisClient;
            }
            else {
                log.error("Redis client get method not found or client not initialized");
            }
            next();
        });
    }
    addDirnameToRequest() {
        this.app.use((req, res, next) => {
            req.dirName = __dirname;
            next();
        });
    }
    addInviteAsAnonMiddleWare() {
        this.app.use(async (req, res, next) => {
            if (req.query.anonInvite && req.query.token) {
                const token = req.query.token;
                try {
                    //TODO: Fix this "as any" in all places
                    const invite = await models.Invite.findOne({
                        where: {
                            token,
                            joined_at: null,
                            type: models.Invite
                                .INVITE_TO_COMMUNITY_AND_GROUP_AS_ANON,
                            deleted: false,
                            [Op.or]: [
                                { expires_at: null },
                                { expires_at: { [Op.gt]: new Date() } },
                            ],
                        },
                    });
                    if (invite) {
                        const anonEmail = req.sessionID + "_v3anonymous@citizens.is";
                        let user;
                        if (req.user) {
                            user = req.user;
                        }
                        else {
                            user = await models.User.findOne({
                                where: { email: anonEmail },
                            });
                        }
                        if (!user) {
                            user = await models.User.create({
                                email: anonEmail,
                                name: "Invited User",
                                notifications_settings: models.AcNotification
                                    .anonymousNotificationSettings,
                                status: "active",
                                //TODO: Having this blocks security for the cloned groups, find a better solution
                                //profile_data: { isAnonymousUser: true },
                            });
                        }
                        // Associate user with community
                        if (invite.community_id) {
                            const community = await models.Community.findByPk(invite.community_id);
                            if (community) {
                                await community.addCommunityUsers(user);
                            }
                        }
                        // Associate user with group
                        if (invite.group_id) {
                            const group = await models.Group.findByPk(invite.group_id);
                            if (group) {
                                await group.addGroupUsers(user);
                            }
                        }
                        // Mark invite as used
                        invite.joined_at = new Date();
                        await invite.save();
                        console.log("Invite joined at", invite.joined_at);
                        await new Promise((resolve, reject) => {
                            req.logIn(user, (error) => (error ? reject(error) : resolve()));
                        });
                        console.log("User logged in for anon invite");
                        return next();
                    }
                    else {
                        console.error("Invite not found");
                        return next();
                    }
                }
                catch (err) {
                    log.error("Error in anonInvite middleware", { err });
                }
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
    handleServiceWorker(req, res) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.setHeader("Last-Modified", new Date().toUTCString());
        const filePath = req.path.includes("/sw.js")
            ? path.join(__dirname, "../webAppsDist/client/dist/sw.js")
            : path.join(__dirname, "../webAppsDist/old/client/build/bundled/service-worker.js");
        res.sendFile(filePath);
    }
    setupDomainAndCommunity() {
        this.app.use((req, res, next) => {
            models.Domain.setYpDomain(req, res, () => {
                log.info("Domain", {
                    id: req.ypDomain ? req.ypDomain.id : "-1",
                    n: req.ypDomain ? req.ypDomain.domain_name : "?",
                });
                models.Community.setYpCommunity(req, res, () => {
                    log.info("Community", {
                        id: req.ypCommunity ? req.ypCommunity.id : null,
                        n: req.ypCommunity ? req.ypCommunity.hostname : null,
                    });
                    next();
                });
            });
        });
    }
    async initializeRateLimiting() {
        const botRateLimiter = rateLimit({
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
                const isBotBad = isBadBot(ua.toLowerCase());
                if (!req.headers["x-api-key"] &&
                    !botsWithJavascript(ua) &&
                    (isbot(ua) || isBadBot(ua))) {
                    if (isBotBad) {
                        botRateLimiter(req, res, () => {
                            nonSPArouter(req, res, next);
                        });
                    }
                    else {
                        nonSPArouter(req, res, next);
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
                if (sitemap) {
                    res.header("Content-Type", "application/xml");
                    res.send(sitemap);
                }
                else {
                    generateSitemap(req, res);
                }
            }
            catch (error) {
                log.error("Error getting sitemap from redis", { error });
                generateSitemap(req, res);
            }
        });
    }
    checkAuthForSsoInit() {
        this.app.use((req, res, next) => {
            if (req.url.indexOf("/auth") > -1 ||
                req.url.indexOf("/login") > -1 ||
                req.url.indexOf("/logout") > -1 ||
                req.url.indexOf("saml_assertion") > -1) {
                sso.init(req.ypDomain?.loginHosts, req.ypDomain?.loginProviders, {
                    authorize: this.bearerCallback,
                    login: models.User.localCallback,
                });
                req.sso = sso;
            }
            next();
        });
    }
    initializeMiddlewares() {
        this.app.use(morgan("combined"));
        this.app.use(useragent.express());
        this.app.use(requestIp.mw());
        this.app.use(bodyParser.json({ limit: "100mb", strict: false }));
        this.app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
        if (process.env.ALLOWED_ORIGINS) {
            this.app.use(cors({
                origin: process.env.ALLOWED_ORIGINS.split(","),
                credentials: true,
            }));
        }
        else {
            this.app.use(cors());
        }
        this.app.use(compression());
        this.app.set("views", __dirname + "/views");
        this.app.set("view engine", "pug");
        const store = new RedisStore({ client: this.redisClient, ttl: 86400 });
        if (!process.env.SESSION_SECRET) {
            throw new Error("SESSION_SECRET is not set");
        }
        let cookieValues = {
            autoSubDomain: true,
        };
        if (process.env.ALLOWED_ORIGINS) {
            cookieValues.sameSite = "none";
        }
        const sessionConfig = {
            store: store,
            name: "yrpri.sid",
            secret: process.env.SESSION_SECRET,
            resave: false,
            proxy: process.env.USING_NGINX_PROXY ? true : undefined,
            cookie: cookieValues,
            saveUninitialized: false,
        };
        if (this.app.get("env") === "production") {
            this.app.set("trust proxy", 3); // Trust three proxies
            //@ts-ignore
            sessionConfig.cookie.secure = true; // serve secure cookies
        }
        //@ts-ignore
        this.app.use(session(sessionConfig));
    }
    async initializeEsControllers() {
        console.log("Initializing ES controllers");
        const { AllOurIdeasController } = await import("./controllers/allOurIdeas.js");
        console.log("Initializing ES controllers 2 " + this.wsClients);
        const aoiController = new AllOurIdeasController(this.wsClients);
        console.log(`Controller path: ${aoiController.path} ${aoiController.router}`);
        this.app.use(aoiController.path, aoiController.router);
        const { PolicySynthAgentsController } = await import("./agents/controllers/policySynthAgents.js");
        const policySynthAgentsController = new PolicySynthAgentsController(this.wsClients);
        this.app.use(policySynthAgentsController.path, policySynthAgentsController.router);
        const { AssistantController } = await import("./agents/controllers/assistantsController.js");
        const assistantController = new AssistantController(this.wsClients);
        this.app.use(assistantController.path, assistantController.router);
        // Setup those here so they wont override the ES controllers
        this.setupErrorHandler();
    }
    setupStaticFileServing() {
        const baseDir = path.join(__dirname, "../webAppsDist");
        this.app.use((req, res, next) => {
            if (req.path.endsWith(".js")) {
                res.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=86400, stale-while-revalidate=86400"); // 1 year cache, 1 day revalidate
            }
            else if (req.path.match(/\.(png|jpg|jpeg|gif)$/)) {
                res.setHeader("Cache-Control", "public, max-age=2592000, s-maxage=86400, stale-while-revalidate=86400"); // 1 month cache, 1 day revalidate
            }
            else if (req.path.endsWith(".json")) {
                res.setHeader("Cache-Control", "public, max-age=43200, s-maxage=60, stale-while-revalidate=60"); // 12 hour cache, 5 minutes revalidate
            }
            next();
        });
        this.app.get("/sw.js", this.handleServiceWorker);
        this.app.get("/service-worker.js", this.handleServiceWorker);
        // Promotion app
        const promotionAppPath = path.join(baseDir, "old/promotion_app/dist");
        this.app.use("/promotion", express.static(promotionAppPath));
        this.app.use("/promotion/domain/*splat", express.static(promotionAppPath));
        this.app.use("/promotion/organization/*splat", express.static(promotionAppPath));
        this.app.use("/promotion/community/*splat", express.static(promotionAppPath));
        this.app.use("/promotion/group/*splat", express.static(promotionAppPath));
        this.app.use("/promotion/post/*splat", express.static(promotionAppPath));
        this.app.use("/promotion/locales/en/*splat", express.static(path.join(promotionAppPath, "locales/en")));
        this.app.use("/promotion/locales/is/*splat", express.static(path.join(promotionAppPath, "locales/is")));
        // Land use game
        const landUseGamePath = path.join(baseDir, "land_use_game/dist");
        this.app.use("/land_use", express.static(landUseGamePath));
        this.app.use("/land_use/*splat", express.static(landUseGamePath));
        this.app.use("/land_use/locales/en/*splat", express.static(path.join(landUseGamePath, "locales/en")));
        this.app.use("/land_use/locales/is/*splat", express.static(path.join(landUseGamePath, "locales/is")));
        this.app.use("/Assets", express.static(path.join(landUseGamePath, "Assets")));
        this.app.use("/ThirdParty", express.static(path.join(landUseGamePath, "ThirdParty")));
        this.app.use("/Widgets", express.static(path.join(landUseGamePath, "Widgets")));
        this.app.use("/Workers", express.static(path.join(landUseGamePath, "Workers")));
        // Middleware to set paths based on query parameters
        this.app.use((req, res, next) => {
            const baseDir = path.join(__dirname, "../webAppsDist");
            const useNewVersion = req.useNewVersion;
            // Set the paths depending on the version
            req.adminAppPath = useNewVersion
                ? path.join(baseDir, "client/dist")
                : path.join(baseDir, "old/translationApp/dist");
            req.clientAppPath = useNewVersion
                ? path.join(baseDir, "client/dist")
                : path.join(baseDir, "old/client/build/bundled");
            const staticPath = req.path.startsWith("/admin")
                ? req.adminAppPath
                : req.clientAppPath;
            //console.log("Static path", staticPath);
            // Check if the request is for index.html
            if (req.path === "/" || req.path === "/index.html") {
                index(req, res, next); // Use your dynamic handler
            }
            else {
                express.static(staticPath)(req, res, next);
            }
        });
    }
    initializeRoutes() {
        this.app.use("/", index);
        this.app.use("/index.html", index);
        this.app.use("/domain", index);
        this.app.use("/community", index);
        this.app.use("/organization", index);
        this.app.use("/agent_bundle/*splat", index);
        this.app.use("/group", index);
        this.app.use("/post", index);
        this.app.use("/user", index);
        this.app.use("/admin", index);
        this.app.use('/survey*splat', index);
        this.app.use("/api/domains", domains);
        this.app.use("/api/organizations", organizations);
        this.app.use("/api/communities", communities);
        this.app.use("/api/groups", groups);
        this.app.use("/api/posts", posts);
        this.app.use("/api/points", points);
        this.app.use("/api/images", images);
        this.app.use("/api/videos", videos);
        this.app.use("/api/audios", audios);
        this.app.use("/api/categories", categories);
        this.app.use("/api/externalIds", externalIds);
        this.app.use("/api/users", users);
        this.app.use("/api/news_feeds", news_feeds);
        this.app.use("/api/activities", activities);
        this.app.use("/api/notifications", notifications);
        this.app.use("/api/bulk_status_updates", bulkStatusUpdates);
        this.app.use("/api/recommendations", recommendations);
        this.app.use("/api/ratings", ratings);
        this.app.use("/ideas", legacyPosts);
        this.app.use("/users", legacyUsers);
        this.app.use("/pages", legacyPages);
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
            generateManifest(req, res);
        });
    }
    initializePassportStrategies() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser((req, profile, done) => {
            log.info("----> User Serialized", { loginProvider: profile.provider });
            if (profile.provider === "facebook") {
                models.User.serializeFacebookUser(profile, req.ypDomain, (error, user) => {
                    if (error) {
                        log.error("Error in User Serialized from Facebook", {
                            err: error,
                        });
                        done(error);
                    }
                    else {
                        log.info("User Serialized", {
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
                models.User.serializeSamlUser(profile, req, (error, user) => {
                    if (error) {
                        log.error("Error in User Serialized from SAML", { err: error });
                        done(error);
                    }
                    else {
                        log.info("User Serialized", {
                            context: "loginFromSaml",
                            userId: user.id,
                        });
                        this.registerUserLogin(user, user.id, "saml", req, () => {
                            done(null, { userId: user.id, loginProvider: "saml" });
                        });
                    }
                });
            }
            else if (profile.provider === "oidc") {
                models.User.serializeOidcUser(profile, req, (error, user) => {
                    if (error) {
                        log.error("Error in User Serialized from OIDC", { err: error });
                        done(error);
                    }
                    else {
                        log.info("User Serialized", {
                            context: "loginFromOidc",
                            userId: user.id,
                        });
                        this.registerUserLogin(user, user.id, "oidc", req, () => {
                            done(null, { userId: user.id, loginProvider: "saml" });
                        });
                    }
                });
            }
            else {
                log.info("User Serialized", {
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
        passport.deserializeUser((sessionUser, done) => {
            models.User.findOne({
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
                        model: models.Image,
                        as: "UserProfileImages",
                        required: false,
                    },
                    {
                        model: models.Image,
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
                        log.info("SAML isSamlEmployee is true");
                    }
                    done(null, user);
                }
                else {
                    log.error("User Deserialized Not found", {
                        context: "deserializeUser",
                    });
                    if (airbrake) {
                        airbrake
                            .notify("User Deserialized Not found")
                            .then((airbrakeErr) => {
                            if (airbrakeErr.error) {
                                log.error("AirBrake Error", {
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
                log.error("User Deserialize Error", {
                    context: "deserializeUser",
                    err: error,
                    errorStatus: 500,
                });
                if (airbrake) {
                    airbrake.notify(error).then((airbrakeErr) => {
                        if (airbrakeErr.error) {
                            log.error("AirBrake Error", {
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
    setupErrorHandler() {
        this.app.use((err, req, res, next) => {
            if (err instanceof auth.UnauthorizedError) {
                log.info("Anon debug UnauthorizedError", { user: req.user });
                log.error("User Unauthorized", {
                    context: "unauthorizedError",
                    user: toJson(req.user),
                    err: "Unauthorized",
                    errorStatus: 401,
                });
                res.sendStatus(401);
            }
            else {
                next(err);
            }
        });
        this.app.use((req, res, next) => {
            const err = new Error("Not Found");
            err.status = 404;
            log.warn("Not Found", {
                context: "notFound",
                user: toJson(req.user),
                err: "Not Found",
                errorStatus: 404,
            });
            next(err);
        });
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
                log.error("General Error: Body JSON parsing error", {
                    err: bodyError,
                });
            }
            if (status >= 500) {
                log.error("General Error", {
                    context: "generalError",
                    user: req.user ? toJson(req.user) : null,
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
                if (airbrake) {
                    airbrake.notify(err).then((airbrakeErr) => {
                        if (airbrakeErr.error) {
                            log.error("AirBrake Error", {
                                context: "airbrake",
                                user: toJson(req.user),
                                err: airbrakeErr.error,
                                errorStatus: 500,
                            });
                        }
                    });
                }
            }
            else {
                log.warn("Client Error", {
                    context: "clientError",
                    user: req.user ? toJson(req.user) : null,
                    err: err.message || err,
                    protocol: req.protocol,
                    host: req.get("host"),
                    originalUrl: req.originalUrl,
                    body,
                    errorStatus: status,
                });
            }
            res.sendStatus(status);
        });
    }
    async listen() {
        const server = await this.setupHttpsServer();
        this.webSocketsManager = new WebSocketsManager(this.wsClients, this.redisClient, server);
        await this.webSocketsManager.listen();
    }
    setupHttpsServer() {
        let server;
        const portNumber = process.env.PORT ? parseInt(process.env.PORT) : 4242;
        if (process.env.YOUR_PRIORITIES_LISTEN_HOST) {
            server = this.app.listen(portNumber, process.env.YOUR_PRIORITIES_LISTEN_HOST, () => {
                log.info(`Your Priorities Platform API Server listening on port ${process.env.YOUR_PRIORITIES_LISTEN_HOST}:${this.app.get("port")} on ${process.env.NODE_ENV}`);
            });
        }
        else {
            server = this.app.listen(portNumber, function () {
                log.info("Your Priorities Platform API Server listening on port " +
                    server.address().port +
                    ` on ${process.env.NODE_ENV}`);
            });
        }
        return server;
    }
}
