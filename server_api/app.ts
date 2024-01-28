import express, { NextFunction } from "express";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";
import useragent from "express-useragent";
import requestIp from "request-ip";
import compression from "compression";
import isBot from "isbot";
import redis from "redis";
import rateLimit from "express-rate-limit";
import { RedisStore as RedisLimitStore } from "rate-limit-redis";
import passport from "passport";
import models from "./models";
import auth from "./authorization";
import index from "./controllers/index";
import news_feeds from "./active-citizen/controllers/news_feeds";
import activities from "./active-citizen/controllers/activities";
import notifications from "./active-citizen/controllers/notifications";
import recommendations from "./active-citizen/controllers/recommendations";
import posts from "./controllers/posts";
import groups from "./controllers/groups";
import communities from "./controllers/communities";
import domains from "./controllers/domains";
import organizations from "./controllers/organizations";
import points from "./controllers/points";
import users from "./controllers/users";
import categories from "./controllers/categories";
import images from "./controllers/images";
import externalIds from "./controllers/externalIds";
import ratings from "./controllers/ratings";
import bulkStatusUpdates from "./controllers/bulkStatusUpdates";
import videos from "./controllers/videos";
import audios from "./controllers/audios";
import legacyPosts from "./controllers/legacyPosts";
import legacyUsers from "./controllers/legacyUsers";
import legacyPages from "./controllers/legacyPages";
import nonSPArouter from "./controllers/nonSpa";
import generateSitemap from "./utils/sitemap_generator";
import generateManifest from "./utils/manifest_generator";
import toJson from "./utils/to_json";
//@ts-ignore
import sso from "passport-sso";
import cors from "cors";
import RedisStore from "rate-limit-redis";
import log from "./utils/loggerTs.js";
import { createClient } from "redis";

import { Notifier } from "@airbrake/node";

let airbrake: any;

if (process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_API_KEY) {
  airbrake = new Notifier({
    projectId: parseInt(process.env.AIRBRAKE_PROJECT_ID),
    projectKey: process.env.AIRBRAKE_API_KEY,
    performanceStats: false,
  });
}

import {
  robotsTxt,
  botsWithJavascript,
  isBadBot,
  isCustomBot,
} from "./bot_control";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
}


let redisClient: any;
if (process.env.REDIS_URL) {
  let redisUrl = process.env.REDIS_URL;

  if (redisUrl.startsWith("redis://h:")) {
    redisUrl = redisUrl.replace("redis://h:", "redis://:");
  }

  if (redisUrl.includes("rediss://")) {
    redisClient = createClient({
      legacyMode: true,
      url: redisUrl,
      socket: { tls: true, rejectUnauthorized: false },
    });
  } else {
    redisClient = createClient({ legacyMode: false, url: redisUrl });
  }
} else {
  redisClient = createClient({ legacyMode: false });
}

redisClient.on("error", (err: any) => console.error("Redis client error", err));
redisClient.on("connect", () => console.log("Redis client is connect"));
redisClient.on("reconnecting", () =>
  console.log("Redis client is reconnecting")
);
redisClient.on("ready", () => console.log("Redis client is ready"));

redisClient.connect().catch(console.error);

export class YourPrioritiesApi {
  public app: express.Application;
  public port: number;
  public httpServer: any;
  public ws!: WebSocketServer;
  public redisClient: any;
  public wsClients = new Map<string, WebSocket>();

  constructor(port: number | undefined = undefined) {
    this.app = express();
    this.port = port || (process.env.PORT ? parseInt(process.env.PORT) : 4242);
    this.wsClients = new Map();
    this.redisClient = redisClient;
    this.addRedisToRequest();
    this.forceHttps();
    this.initializeMiddlewares();
    this.handleShortenedRedirects();
    this.handleServiceWorkerRequests();
    this.setupStaticFileServing();
    this.initializePassportStrategies();
    this.initializeRateLimiting();
    this.setupDomainAndCommunity();
    this.setupSitemapRoute();
    this.checkAuthForSsoInit();
    this.initializeRoutes();
    this.initializeEsControllers();
    this.setupErrorHandler();
  }

  addRedisToRequest(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (this.redisClient && typeof this.redisClient.get === "function") {
          req.redisClient = this.redisClient;
          log.info("Have connected redis client");
        } else {
          log.error(
            "Redis client get method not found or client not initialized"
          );
        }
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

  handleServiceWorkerRequests(): void {
    this.app.get(
      "/*",
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (req.url.indexOf("service-worker.js") > -1) {
          res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
          );
          res.setHeader("Last-Modified", new Date(Date.now()).toUTCString());
        }
        next();
      }
    );
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

  checkAuthForSsoInit(): void {
    this.app.use(
      (req: YpRequest, res: express.Response, next: NextFunction) => {
        if (
          req.url.indexOf("/auth") > -1 ||
          req.url.indexOf("/login") > -1 ||
          req.url.indexOf("saml_assertion") > -1
        ) {
          sso.init(req.ypDomain?.loginHosts, req.ypDomain?.loginProviders, {
            //@ts-ignore
            authorize: bearerCallback, // Ensure bearerCallback is defined or imported
            login: (models as any).User.localCallback, // Ensure localCallback is defined in your User model
          });
          req.sso = sso;
        }
        next();
      }
    );
  }

  setupStaticFileServing(): void {
    const baseDir = path.join(__dirname, "../webApps");

    // Promotion app
    const promotionAppPath = path.join(baseDir, "promotion_app/dist");
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

    // Analytics app
    const analyticsAppPath = path.join(baseDir, "analytics_app/dist");
    this.app.use("/analytics/", express.static(analyticsAppPath));
    this.app.use("/analytics/domain/*", express.static(analyticsAppPath));
    this.app.use("/analytics/community/*", express.static(analyticsAppPath));
    this.app.use("/analytics/group/*", express.static(analyticsAppPath));

    // Admin app
    const adminAppPath = path.join(baseDir, "admin_app/dist");
    this.app.use("/admin/", express.static(adminAppPath));
    this.app.use("/admin/domain/*", express.static(adminAppPath));
    this.app.use("/admin/community/*", express.static(adminAppPath));
    this.app.use("/admin/group/*", express.static(adminAppPath));
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
    this.app.use(session(sessionConfig));
  }

  initializeEsControllers() {
    console.log("Initializing ES controllers");

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
  }

  initializeRoutes() {
    this.app.use("/", index);
    this.app.use("/domain", index);
    this.app.use("/community", index);
    this.app.use("/group", index);
    this.app.use("/post", index);
    this.app.use("/user", index);
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
    // Setup passport strategies and session handling
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    passport.serializeUser(
      //@ts-ignore
      (req: YpRequest, profile: any, done: any) => {
        log.info("User Serialized", { loginProvider: profile.provider });
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
            userEmail: profile.emails?.[0].value,
            userId: profile.id,
          });
          this.registerUserLogin(
            null,
            parseInt(profile.id),
            "email",
            req,
            () => {
              done(null, {
                userId: parseInt(profile.id),
                loginProvider: "email",
              });
            }
          );
        }
      }
    );

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
    user: any,
    loginType: string,
    req: any /*YpRequest*/,
    done: () => void
  ): void => {
    user.last_login_at = new Date();
    user
      .save()
      .then(() => {
        (models as any).AcActivity.createActivity({
          type: "activity.user.login",
          userId: user.id,
          domainId: req.ypDomain.id,
          communityId: req.ypCommunity ? req.ypCommunity.id : null,
          object: {
            loginType: loginType,
            userDepartment: user.private_profile_data?.saml_agency ?? null,
            samlProvider: user.private_profile_data?.saml_provider ?? null,
          },
          access: (models as any).AcActivity.PRIVATE, // Assuming PRIVATE is a valid constant or enum
        })
          .then(() => done())
          .catch((error: any) => {
            log.error("Error in create activity", { error });
            done();
          });
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
    // Catch-all handler for 404 Not Found
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

    // General error handler
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

  listen() {
    let server: any;

    if (process.env.YOUR_PRIORITIES_LISTEN_HOST) {
      server = this.app.listen(
        this.app.get("port"),
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
      server = this.app.listen(4242, function () {
        log.info(
          "Your Priorities Platform API Server listening on port " +
            server.address().port +
            ` on ${process.env.NODE_ENV}`
        );
      });
    }

    this.ws = new WebSocketServer({ server });

    this.ws.on("connection", (ws) => {
      const clientId = uuidv4();
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
