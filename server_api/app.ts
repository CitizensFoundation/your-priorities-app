import express, { NextFunction } from "express";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";
import useragent from "express-useragent";
import requestIp from "request-ip";
import compression from "compression";
import * as isBot from "isbot";
import redis from "redis";
import rateLimit from "express-rate-limit";
import { RedisStore as RedisLimitStore } from "rate-limit-redis";
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
import news_feeds from "./active-citizen/controllers/news_feeds.cjs";
import activities from "./active-citizen/controllers/activities.cjs";
import notifications from "./active-citizen/controllers/notifications.cjs";
import recommendations from "./active-citizen/controllers/recommendations.cjs";
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
import RedisStore from "rate-limit-redis";
import log from "./utils/loggerTs.js";
import { createClient } from "redis";

import { Notifier } from "@airbrake/node";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let airbrake: any;

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
    airbrake.notify(err).then((airbrakeErr: any) => {
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

process.on("unhandledRejection", (reason: any, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  log.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (reason.stack) {
    console.error(reason.stack);
    log.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
  if (airbrake) {
    airbrake.notify(reason).then((airbrakeErr: any) => {
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

import {
  robotsTxt,
  botsWithJavascript,
  isBadBot,
  isCustomBot,
} from "./bot_control.js";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RedisClientType } from "@redis/client";

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
  clientAppPath?: string;
  adminAppPath?: string;
  dirName?: string;
}

export class YourPrioritiesApi {
  public app: express.Application;
  public port: number;
  public httpServer: any;
  public ws!: WebSocketServer;
  public redisClient!: RedisClientType;
  public wsClients: Map<string, WebSocket>;

  constructor(port: number | undefined = undefined) {
    this.app = express();
    this.port = port || (process.env.PORT ? parseInt(process.env.PORT) : 4242);
    this.wsClients = new Map();
    this.initializeRedis();
    this.addRedisToRequest();
    this.addDirnameToRequest();
    this.forceHttps();
    this.initializeMiddlewares();
    this.handleShortenedRedirects();
    this.initializeRateLimiting();
    this.setupDomainAndCommunity();
    this.setupStaticFileServing();
    this.setupSitemapRoute();
    this.initializePassportStrategies();
    this.checkAuthForSsoInit();
    this.initializeRoutes();
    this.initializeEsControllers();
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
    } else {
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
    } catch (err) {
      console.error("App Failed to connect Redis client", err);
    }
  }

  addRedisToRequest(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (this.redisClient && typeof this.redisClient.get === "function") {
          req.redisClient = this.redisClient;
        } else {
          log.error(
            "Redis client get method not found or client not initialized"
          );
        }
        next();
      }
    );
  }

  addDirnameToRequest(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        req.dirName = __dirname;
        next();
      }
    );
  }

  forceHttps(): void {
    if (
      this.app.get("env") !== "development" &&
      !process.env.DISABLE_FORCE_HTTPS
    ) {
      this.app.use(
        (req: YpRequest, res: express.Response, next: NextFunction) => {
          if (!/https/.test(req.protocol)) {
            res.redirect("https://" + req.headers.host + req.url);
          } else {
            return next();
          }
        }
      );
    }
  }

  handleShortenedRedirects(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (req.path.startsWith("/s/")) {
          res.redirect(
            `${req.protocol}://${req.headers.host}${req.url.replace(
              "/s/",
              "/survey/"
            )}`
          );
        } else if (req.path.startsWith("/g/")) {
          res.redirect(
            `${req.protocol}://${req.headers.host}${req.url.replace(
              "/g/",
              "/group/"
            )}`
          );
        } else if (req.path.startsWith("/c/")) {
          res.redirect(
            `${req.protocol}://${req.headers.host}${req.url.replace(
              "/c/",
              "/community/"
            )}`
          );
        } else {
          return next();
        }
      }
    );
  }

  handleServiceWorker(req: YpRequest, res: express.Response) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    res.setHeader("Last-Modified", new Date().toUTCString());

    const filePath = req.path.includes("/sw.js")
      ? path.join(__dirname, "../webAppsDist/client/dist/sw.js")
      : path.join(
          __dirname,
          "../webAppsDist/old/client/build/bundled/service-worker.js"
        );

    res.sendFile(filePath);
  }

  setupDomainAndCommunity(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        (models as any).Domain.setYpDomain(req, res, () => {
          log.info("Domain", {
            id: req.ypDomain ? req.ypDomain.id : "-1",
            n: req.ypDomain ? req.ypDomain.domain_name : "?",
          });
          (models as any).Community.setYpCommunity(req, res, () => {
            log.info("Community", {
              id: req.ypCommunity ? req.ypCommunity.id : null,
              n: req.ypCommunity ? req.ypCommunity.hostname : null,
            });
            next();
          });
        });
      }
    );
  }

  async initializeRateLimiting() {
    // Wait for one second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const botRateLimiter = rateLimit({
      windowMs: process.env.RATE_LIMITER_WINDOW_MS
        ? parseInt(process.env.RATE_LIMITER_WINDOW_MS, 10)
        : 15 * 60 * 1000, // 15 minutes
      max: process.env.RATE_LIMITER_MAX
        ? parseInt(process.env.RATE_LIMITER_MAX, 10)
        : 30,
    });

    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        let ua = req.headers["user-agent"] || "";
        if (
          req.headers["content-type"] !== "application/json" &&
          req.originalUrl &&
          !req.originalUrl.endsWith("/sitemap.xml")
        ) {
          const isBotBad = isBadBot(ua.toLowerCase());
          //TODO: CHECK THIS
          //@ts-ignore
          if (!botsWithJavascript(ua) && (isBot(ua) || isBadBot(ua))) {
            if (isBotBad) {
              botRateLimiter(req, res, () => {
                nonSPArouter(req, res, next);
              });
            } else {
              nonSPArouter(req, res, next);
            }
          } else {
            next();
          }
        } else {
          next();
        }
      }
    );
  }

  setupSitemapRoute(): void {
    this.app.get(
      "/sitemap.xml",
      async (req: YpRequest, res: express.Response) => {
        try {
          const url = req.get("host") + req.originalUrl;
          const redisKey = "cache:sitemapv14:" + url;

          const sitemap = await req.redisClient.get(redisKey);
          log.debug("GOT SITEMAPS!!!!" + sitemap);
          if (sitemap) {
            res.header("Content-Type", "application/xml");
            res.send(sitemap);
          } else {
            generateSitemap(req, res);
          }
        } catch (error) {
          log.error("Error getting sitemap from redis", { error });
          generateSitemap(req, res);
        }
      }
    );
  }

  bearerCallback = function () {
    return console.log(
      "The user has tried to authenticate with a bearer token"
    );
  };

  checkAuthForSsoInit(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (
          req.url.indexOf("/auth") > -1 ||
          req.url.indexOf("/login") > -1 ||
          req.url.indexOf("saml_assertion") > -1
        ) {
          sso.init(req.ypDomain?.loginHosts, req.ypDomain?.loginProviders, {
            authorize: this.bearerCallback,
            login: (models as any).User.localCallback,
          });
          req.sso = sso;
        }
        next();
      }
    );
  }

  initializeMiddlewares() {
    this.app.use(morgan("combined"));
    this.app.use(useragent.express());
    this.app.use(requestIp.mw());
    this.app.use(bodyParser.json({ limit: "10mb", strict: false }));
    this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
    this.app.use(cors());
    this.app.use(compression());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "pug");

    const store = new connectRedis({ client: this.redisClient, ttl: 86400 });
    const sessionConfig = {
      store: store,
      name: "yrpri.sid",
      secret: process.env.SESSION_SECRET || "not so secret... use env var.",
      resave: false,
      proxy: process.env.USING_NGINX_PROXY ? true : undefined,
      cookie: { autoSubDomain: true },
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

    const { AllOurIdeasController } = await import(
      "./controllers/allOurIdeas.js"
    );
    console.log("Initializing ES controllers 2 " + this.wsClients);
    const aoiController = new AllOurIdeasController(this.wsClients);
    console.log(
      `Controller path: ${aoiController.path} ${aoiController.router}`
    );
    this.app.use(aoiController.path, aoiController.router);

    const { PolicySynthAgentsController } = await import( "./controllers/policySynthAgents.js");

    const policySynthAgentsController = new PolicySynthAgentsController(this.wsClients);

    this.app.use(policySynthAgentsController.path, policySynthAgentsController.router);

    // Setup those here so they wont override the ES controllers
    this.setupErrorHandler();
  }

  setupStaticFileServing(): void {
    const baseDir = path.join(__dirname, "../webAppsDist");

    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (req.path.endsWith(".js")) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, s-maxage=86400, stale-while-revalidate=86400"
          ); // 1 year cache, 1 day revalidate
        } else if (req.path.match(/\.(png|jpg|jpeg|gif)$/)) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=2592000, s-maxage=86400, stale-while-revalidate=86400"
          ); // 1 month cache, 1 day revalidate
        } else if (req.path.endsWith(".json")) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=43200, s-maxage=60, stale-while-revalidate=60"
          ); // 12 hour cache, 5 minutes revalidate
        }
        next();
      }
    );

    this.app.get("/sw.js", this.handleServiceWorker);
    this.app.get("/service-worker.js", this.handleServiceWorker);

    // Promotion app
    const promotionAppPath = path.join(baseDir, "old/promotion_app/dist");
    this.app.use("/promotion", express.static(promotionAppPath));
    this.app.use("/promotion/domain/*", express.static(promotionAppPath));
    this.app.use("/promotion/community/*", express.static(promotionAppPath));
    this.app.use("/promotion/group/*", express.static(promotionAppPath));
    this.app.use("/promotion/post/*", express.static(promotionAppPath));
    this.app.use(
      "/promotion/locales/en/*",
      express.static(path.join(promotionAppPath, "locales/en"))
    );
    this.app.use(
      "/promotion/locales/is/*",
      express.static(path.join(promotionAppPath, "locales/is"))
    );

    // Land use game
    const landUseGamePath = path.join(baseDir, "land_use_game/dist");
    this.app.use("/land_use", express.static(landUseGamePath));
    this.app.use("/land_use/*", express.static(landUseGamePath));
    this.app.use(
      "/land_use/locales/en/*",
      express.static(path.join(landUseGamePath, "locales/en"))
    );
    this.app.use(
      "/land_use/locales/is/*",
      express.static(path.join(landUseGamePath, "locales/is"))
    );
    this.app.use(
      "/Assets",
      express.static(path.join(landUseGamePath, "Assets"))
    );
    this.app.use(
      "/ThirdParty",
      express.static(path.join(landUseGamePath, "ThirdParty"))
    );
    this.app.use(
      "/Widgets",
      express.static(path.join(landUseGamePath, "Widgets"))
    );
    this.app.use(
      "/Workers",
      express.static(path.join(landUseGamePath, "Workers"))
    );

    // Middleware to set paths based on query parameters
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        const baseDir = path.join(__dirname, "../webAppsDist");

        let useNewVersion =
          req.query.useNewVersion === "true" ||
          (req.session as any).useNewVersion === true;

        let useNewVersionIsFalse = req.query.useNewVersion === "false";

        if (useNewVersionIsFalse) {
          (req.session as any).useNewVersion = false;
          console.log(`Setting new version preference: false`);
        } else if (useNewVersion && !useNewVersionIsFalse) {
          (req.session as any).useNewVersion = true;
          console.log(
            `Setting new version preference: ${req.query.useNewVersion}`
          );
        }

        if (
          req.ypDomain &&
          req.ypDomain.configuration &&
          req.ypDomain.configuration.useNewVersion === true &&
          !useNewVersionIsFalse
        ) {
          useNewVersion = true;
        }

        console.log(
          `------XY-----------------------> Using new version: ${useNewVersion}`
        );
        console.log(`${req.ypDomain.configuration.useNewVersion}`);

        // Set the paths depending on the version
        req.adminAppPath = useNewVersion
          ? path.join(baseDir, "client/dist")
          : path.join(baseDir, "old/translationApp/dist");

        req.clientAppPath = useNewVersion
          ? path.join(baseDir, "client/dist")
          : path.join(baseDir, "old/client/build/bundled");

        const staticPath = req.path.startsWith("/admin")
          ? req.adminAppPath!
          : req.clientAppPath!;

        console.log("Static path", staticPath);
        // Check if the request is for index.html
        if (req.path === "/" || req.path === "/index.html") {
          index(req, res, next); // Use your dynamic handler
        } else {
          express.static(staticPath)(req, res, next);
        }
      }
    );
  }

  initializeRoutes() {
    this.app.use("/", index);
    this.app.use("/index.html", index);
    this.app.use("/domain", index);
    this.app.use("/community", index);
    this.app.use("/group", index);
    this.app.use("/post", index);
    this.app.use("/user", index);
    this.app.use("/admin", index);
    this.app.use("/survey*", index);
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
    this.app.post(
      "/authenticate_from_island_is",
      (req: YpRequest, res: express.Response) => {
        console.log("SAML SAML 1", { domainId: req.ypDomain.id });
        req.sso.authenticate(
          `saml-strategy-${req.ypDomain.id}`,
          {},
          req,
          res,
          (error: any) => {
            console.log("SAML SAML 2", {
              domainId: req.ypDomain.id,
              err: error,
            });
            if (error) {
              console.error("Error from SAML login", { err: error });
              error.url = req.url;
              res.sendStatus(401);
            } else {
              if (req.user.DestinationSSN === "6012101260") {
                console.log("SAML SAML 3", { domainId: req.ypDomain.id });
                res.render("samlLoginComplete", {});
              } else {
                console.error("Error from SAML login", {
                  err: "Failed DestinationSSN check",
                });
                res.sendStatus(401);
              }
            }
          }
        );
      }
    );

    this.app.post(
      "/saml_assertion",
      (req: YpRequest, res: express.Response) => {
        console.log("SAML SAML 1 General", { domainId: req.ypDomain.id });
        req.sso.authenticate(
          `saml-strategy-${req.ypDomain.id}`,
          {},
          req,
          res,
          (error: any, user: any) => {
            console.log("SAML SAML 2 General", {
              domainId: req.ypDomain.id,
              err: error,
            });
            if (error) {
              console.error("Error from SAML General login", { err: error });
              if (error === "customError") {
                res.render("samlCustomError", {
                  customErrorHTML:
                    req.ypDomain.configuration.customSAMLErrorHTML,
                  closeWindowText: "Close window",
                });
              } else {
                error.url = req.url;
                console.error("Error from SAML General login", { err: error });
                res.sendStatus(500);
              }
            } else {
              console.log("SAML SAML 3 General", { domainId: req.ypDomain.id });
              res.render("samlLoginComplete", {});
            }
          }
        );
      }
    );

    this.app.get("/manifest.json", (req, res) => {
      generateManifest(req, res);
    });
  }

  initializePassportStrategies() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    passport.serializeUser((req: YpRequest, profile: any, done: any) => {
      log.info("----> User Serialized", { loginProvider: profile.provider });
      if (profile.provider === "facebook") {
        (models as any).User.serializeFacebookUser(
          profile,
          req.ypDomain,
          (error: any, user: any) => {
            if (error) {
              log.error("Error in User Serialized from Facebook", {
                err: error,
              });
              done(error);
            } else {
              log.info("User Serialized", {
                context: "loginFromFacebook",
                userId: user.id,
              });
              // Assuming registerUserLogin is defined elsewhere in your application
              this.registerUserLogin(user, user.id, "facebook", req, () => {
                done(null, { userId: user.id, loginProvider: "facebook" });
              });
            }
          }
        );
      } else if (profile.provider === "saml") {
        (models as any).User.serializeSamlUser(
          profile,
          req,
          (error: any, user: any) => {
            if (error) {
              log.error("Error in User Serialized from SAML", { err: error });
              done(error);
            } else {
              log.info("User Serialized", {
                context: "loginFromSaml",
                userId: user.id,
              });
              this.registerUserLogin(user, user.id, "saml", req, () => {
                done(null, { userId: user.id, loginProvider: "saml" });
              });
            }
          }
        );
      } else {
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

    passport.deserializeUser(
      (sessionUser: any, done: (err: any, user?: any | false) => void) => {
        (models as any).User.findOne({
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
              model: (models as any).Image,
              as: "UserProfileImages",
              required: false,
            },
            {
              model: (models as any).Image,
              as: "UserHeaderImages",
              required: false,
            },
          ],
        })
          .then((user: any | null) => {
            if (user) {
              user.loginProvider = sessionUser.loginProvider;
              if (
                user.private_profile_data?.saml_agency &&
                sessionUser.loginProvider === "saml"
              ) {
                user.isSamlEmployee = true;
                log.info("SAML isSamlEmployee is true");
              }
              done(null, user);
            } else {
              log.error("User Deserialized Not found", {
                context: "deserializeUser",
              });
              if (airbrake) {
                airbrake
                  .notify("User Deserialized Not found")
                  .then((airbrakeErr: any) => {
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
          .catch((error: any) => {
            log.error("User Deserialize Error", {
              context: "deserializeUser",
              err: error,
              errorStatus: 500,
            });
            if (airbrake) {
              airbrake.notify(error).then((airbrakeErr: any) => {
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
      }
    );
  }

  completeRegisterUserLogin = (
    user: any, // Replace 'any' with the actual user type
    loginType: string,
    req: YpRequest, // Replace 'any' with 'YpRequest' if it's the correct type
    done: () => void
  ): void => {
    user.last_login_at = new Date().getTime(); // Assuming your database expects a timestamp
    user
      .save()
      .then(() => {
        (models as any).AcActivity.createActivity(
          {
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
            access: (models as any).AcActivity.PRIVATE,
          },
          (error: any) => {
            if (error) {
              log.error("Error creating activity for user login", { error });
            }
            done();
          }
        );
      })
      .catch((error: any) => {
        log.error("Error saving user for login registration", { error });
        done();
      });
  };

  registerUserLogin = (
    user: any | null,
    userId: number,
    loginProvider: string,
    req: YpRequest,
    done: () => void
  ): void => {
    if (user && user.private_profile_data) {
      this.completeRegisterUserLogin(user, loginProvider, req, done);
    } else {
      (models as any).User.findOne({
        where: { id: userId },
        attributes: ["id", "private_profile_data", "last_login_at"],
      })
        .then((user: any | null) => {
          if (user) {
            this.completeRegisterUserLogin(user, loginProvider, req, done);
          } else {
            log.error("Did not find user for login registration", { userId });
            done();
          }
        })
        .catch((error: any) => {
          log.error("Error saving user for login registration", { error });
          done();
        });
    }
  };

  setupErrorHandler(): void {
    this.app.use(
      (err: any, req: YpRequest, res: express.Response, next: NextFunction) => {
        if (err instanceof auth.UnauthorizedError) {
          log.info("Anon debug UnauthorizedError", { user: req.user });
          log.error("User Unauthorized", {
            context: "unauthorizedError",
            user: toJson(req.user),
            err: "Unauthorized",
            errorStatus: 401,
          });
          res.sendStatus(401);
        } else {
          next(err);
        }
      }
    );

    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        const err: any = new Error("Not Found");
        err.status = 404;
        log.warn("Not Found", {
          context: "notFound",
          user: toJson(req.user),
          err: "Not Found",
          errorStatus: 404,
        });
        next(err);
      }
    );

    this.app.use(
      (err: any, req: YpRequest, res: express.Response, next: NextFunction) => {
        let status = err.status || 500;
        if (err.message && err.message.includes("Expected url like")) {
          status = 404;
        }

        let body = null;
        try {
          if (req.body) {
            body = JSON.stringify(req.body);
          }
        } catch (bodyError) {
          log.error("General Error: Body JSON parsing error", {
            err: bodyError,
          });
        }

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

        if (status !== 404 && status !== 401) {
          // Optionally notify an error tracking service like Airbrake
          if (airbrake) {
            airbrake.notify(err).then((airbrakeErr: any) => {
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
        res.sendStatus(status);
      }
    );
  }

  async listen() {
    const server = await this.setupHttpsServer();

    const [pub, sub] = await this.setupPubSub();

    this.ws = new WebSocketServer({ server: server });

    this.ws.on("connection", (ws) => {
      const clientId = uuidv4();
      this.wsClients.set(clientId, ws);

      console.log(`New WebSocket connection: clientId ${clientId}`);

      ws.send(JSON.stringify({ clientId: clientId }));

      ws.on("message", (message: any) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch (e) {
          console.log(
            `Received non-JSON message from client ${clientId}:`,
            message
          );
          parsedMessage = message;
        }

        if (parsedMessage && parsedMessage.type === "heartbeat") {
          console.log(`Received heartbeat from client ${clientId}`);
          ws.send(JSON.stringify({ type: "heartbeat_ack" }));
        } else if (!this.wsClients.has(clientId)) {
          const messageToSend = JSON.stringify({
            clientId,
            action: "directMessage",
            data: parsedMessage,
          });

          pub
            .publish("ypWebsocketChannel", messageToSend)
            .then((reply) => {
              console.log(`Message published to ypWebsocketChannel: ${reply}`);
            })
            .catch((err) => {
              console.error(
                `Error publishing to Redis channel ypWebsocketChannel:`,
                err
              );
            });
        }
      });

      ws.on("close", () => {
        this.wsClients.delete(clientId);
        console.log(`WebSocket connection closed: clientId ${clientId}`);
      });

      ws.on("error", (err) => {
        this.wsClients.delete(clientId);
        console.error(`WebSocket error with clientId ${clientId}:`, err);
      });
    });
  }

  async setupPubSub() {
    const pub = this.redisClient.duplicate();
    const sub = this.redisClient.duplicate();

    pub.on("error", (err) => {
      console.error("Publisher Redis client error:", err);
    });

    pub.on("connect", () => {
      console.log("Publisher Redis client is connected");
    });

    pub.on("reconnecting", () => {
      console.log("Publisher Redis client is reconnecting");
    });

    sub.on("error", (err) => {
      console.error("Subscriber Redis client error:", err);
    });

    sub.on("connect", () => {
      console.log("Subscriber Redis client is connected");
    });

    sub.on("reconnecting", () => {
      console.log("Subscriber Redis client is reconnecting");
    });

    try {
      await Promise.all([pub.connect(), sub.connect()]);
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }

    sub.subscribe("ypWebsocketChannel", (message, channel) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { clientId, action, data } = parsedMessage;

        console.log(`Received message from Redis: ${message} at ${channel}`);

        switch (action) {
          case "broadcast":
            this.wsClients.forEach((ws, id) => {
              try {
                ws.send(JSON.stringify(data));
              } catch (err) {
                console.error(
                  `Error sending broadcast message to client ${id}:`,
                  err
                );
              }
            });
            break;
          case "directMessage":
            const ws = this.wsClients.get(clientId);
            if (ws) {
              try {
                ws.send(JSON.stringify(data));
              } catch (err) {
                console.error(
                  `Error sending direct message to client ${clientId}:`,
                  err
                );
              }
            } else {
              console.warn(`No WebSocket found for clientId ${clientId}`);
              this.wsClients.delete(clientId);
            }
            break;
        }
      } catch (e) {
        console.error("Error handling message from Redis:", e);
      }
    });

    return [pub, sub];
  }

  handleLocalMessage(clientId: string, parsedMessage: any) {
    const ws = this.wsClients.get(clientId);
    if (ws) {
      try {
        ws.send(parsedMessage);
      } catch (err) {
        console.error(`Error sending message to client ${clientId}:`, err);
      }
    } else {
      console.warn(`No WebSocket found for clientId ${clientId}`);
      this.wsClients.delete(clientId);
    }
  }

  setupHttpsServer() {
    let server: any;

    const portNumber = process.env.PORT ? parseInt(process.env.PORT) : 4242;

    if (process.env.YOUR_PRIORITIES_LISTEN_HOST) {
      server = this.app.listen(
        portNumber,
        process.env.YOUR_PRIORITIES_LISTEN_HOST,
        () => {
          log.info(
            `Your Priorities Platform API Server listening on port ${
              process.env.YOUR_PRIORITIES_LISTEN_HOST
            }:${this.app.get("port")} on ${process.env.NODE_ENV}`
          );
        }
      );
    } else {
      server = this.app.listen(portNumber, function () {
        log.info(
          "Your Priorities Platform API Server listening on port " +
            server.address().port +
            ` on ${process.env.NODE_ENV}`
        );
      });
    }

    return server;
  }
}
