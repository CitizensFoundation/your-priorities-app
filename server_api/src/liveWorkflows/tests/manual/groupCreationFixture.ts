/** Disposable application fixtures for the opt-in group-creation browser test.
 * Uses the production group models, router, authorization and workflow access rules.
 * Only login/session bootstrap and unrelated background queue delivery are fixtures.
 */
import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Express, RequestHandler } from "express";
import { DataTypes, Sequelize } from "sequelize";
import { apiRoot } from "./environment.js";

const require = createRequire(import.meta.url);
type ApplicationModels = Record<string, any>;

export async function groupCreationFixture(
  database: Sequelize,
  userId: number,
) {
  const savedModules = new Map<string, NodeModule | undefined>();
  const replace = (filename: string, exports: unknown) => {
    const resolved = require.resolve(filename);
    savedModules.set(resolved, require.cache[resolved]);
    const entry = new Module(resolved);
    entry.filename = resolved;
    entry.loaded = true;
    entry.exports = exports;
    require.cache[resolved] = entry;
  };
  const close = () => {
    for (const [filename, previous] of savedModules) {
      if (previous) require.cache[filename] = previous;
      else delete require.cache[filename];
    }
  };
  const models: ApplicationModels = { sequelize: database, Sequelize };
  const queuedJobs: string[] = [];
  let createdGroupId: number | undefined;
  try {
    // Never load the application DB bootstrap or connect to a developer's Redis.
    // These substitutions exist only in this standalone manual-test process.
    replace(path.join(apiRoot, "src/models/index.cts"), models);
    replace(path.join(apiRoot, "src/services/workers/queue.cjs"), {
      add: async (name: string) => {
        queuedJobs.push(name);
      },
    });
    for (const directory of ["src/models", "src/services/models"]) {
      const absolute = path.join(apiRoot, directory);
      for (const filename of (await readdir(absolute)).sort()) {
        if (!filename.endsWith(".cjs") || filename === "index.cjs") continue;
        const model = require(path.join(absolute, filename))(
          database,
          DataTypes,
        );
        models[model.name] = model;
      }
    }
    for (const model of Object.values(models)) model.associate?.(models);
    await database.sync();
    const user = await models.User.create({
      id: userId,
      name: "Workflow test administrator",
      status: "active",
      email: "workflow-admin@example.invalid",
      default_locale: "en",
      profile_data: {},
      private_profile_data: {},
    });
    const outsider = await models.User.create({
      id: userId + 1,
      name: "Other group owner",
      status: "active",
    });
    const domain = await models.Domain.create({
      name: "Manual browser test",
      domain_name: "127.0.0.1",
      access: 1,
      default_locale: "en",
      ip_address: "127.0.0.1",
      user_agent: "manual-test",
      configuration: {},
      user_id: userId,
    });
    const community = await models.Community.create({
      name: "Workflow test community",
      hostname: "127.0.0.1",
      access: 1,
      ip_address: "127.0.0.1",
      user_agent: "manual-test",
      status: "active",
      configuration: {},
      domain_id: domain.id,
      user_id: userId,
    });
    const otherCommunity = await models.Community.create({
      name: "Other private community",
      hostname: "127.0.0.1",
      access: 2,
      ip_address: "127.0.0.1",
      user_agent: "manual-test",
      status: "active",
      configuration: {},
      domain_id: domain.id,
      user_id: outsider.id,
    });
    await domain.addDomainAdmins(user);
    await domain.addDomainUsers(user);
    await community.addCommunityAdmins(user);
    await community.addCommunityUsers(user);
    const otherGroup = await models.Group.create({
      name: "Unrelated private group",
      access: 2,
      configuration: { groupType: 0 },
      user_id: outsider.id,
      community_id: otherCommunity.id,
    });
    const router = require(path.join(apiRoot, "src/controllers/groups.cjs"));
    const access = await import("../../access.js");
    const identify: RequestHandler = (req, _res, next) => {
      req.user = user;
      Object.assign(req, {
        ypDomain: domain,
        // Exercise database reads on every navigation, without developer Redis.
        redisClient: { get: async () => null, setEx: async () => {} },
      });
      req.useragent = { source: "manual-browser-test" } as typeof req.useragent;
      req.clientIp = "127.0.0.1";
      req.isAuthenticated = (() => true) as typeof req.isAuthenticated;
      next();
    };
    const mount = (app: Express) => {
      app.use(identify);
      app.get("/manual/bootstrap", async (_req, res) => {
        const owned = await models.Group.findAll({
          where: { user_id: userId },
        });
        res.json({
          user: {
            id: user.id,
            name: user.name,
            profile_data: {},
            UserProfileImages: [],
          },
          domain: domain.toJSON(),
          community: { ...community.toJSON(), Domain: domain.toJSON() },
          groups: owned.map((group: any) => group.toJSON()),
          otherGroupId: otherGroup.id,
        });
      });
      app.get("/api/users/loggedInUser/adminRights", async (_req, res) => {
        const groups = await models.Group.findAll({
          where: { user_id: userId },
        });
        res.json({
          DomainAdmins: [domain],
          CommunityAdmins: [community],
          GroupAdmins: groups,
        });
      });
      app.get("/api/users/loggedInUser/promoterRights", (_req, res) =>
        res.json({ GroupPromoters: [], CommunityPromoters: [] }),
      );
      app.use(
        "/api/groups",
        (req, res, next) => {
          if (req.method === "POST" && req.path === `/${community.id}`) {
            if (createdGroupId) {
              res
                .status(409)
                .json({ error: "This test permits creating one group" });
              return;
            }
            const send = res.send.bind(res);
            res.send = (body) => {
              if (res.statusCode === 200 && Number.isSafeInteger(body?.id))
                createdGroupId = body.id;
              return send(body);
            };
          }
          next();
        },
        router,
      );
    };
    return {
      mount,
      close,
      communityId: Number(community.id),
      otherGroupId: Number(otherGroup.id),
      groupId: () => createdGroupId,
      groupAccess: access.groupAccess,
      groupChoices: access.groupChoices,
      async verify() {
        assert.ok(
          createdGroupId,
          "Create the group through the normal form first",
        );
        const group = await models.Group.findByPk(createdGroupId);
        assert.equal(Number(group.configuration.groupType), 5);
        assert.equal(group.community_id, community.id);
        assert.equal(group.user_id, userId);
        assert.ok(await group.hasGroupAdmin(user));
        assert.ok(await group.hasGroupUser(user));
        assert.equal(
          await models.Group.count({ where: { user_id: userId } }),
          1,
        );
        await assert.rejects(access.groupAccess(otherGroup.id, userId));
        const unrelated = await models.Group.findByPk(otherGroup.id);
        assert.equal(unrelated.name, "Unrelated private group");
        return {
          groupId: createdGroupId,
          communityId: Number(community.id),
          name: group.name as string,
          groupType: Number(group.configuration.groupType),
          creatorIsAdminAndMember: true,
          unrelatedGroupAccessDenied: true,
          backgroundJobsRecordedOnly: queuedJobs,
        };
      },
    };
  } catch (error) {
    close();
    throw error;
  }
}
export type GroupCreationFixture = Awaited<
  ReturnType<typeof groupCreationFixture>
>;
