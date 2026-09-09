import { aTimeout, expect } from "@open-wc/testing";
import { html } from "lit";

import { YpAdminApp } from "../yp-admin-app.js";
import { YpServerApi } from "../../common/YpServerApi.js";

// Exercise the real routing, lifecycle and access checks without mounting editors.
class AdminAccessTestApp extends YpAdminApp {
  accessChecks = 0;

  override _checkAdminAccess() {
    this.accessChecks += 1;
    super._checkAdminAccess();
  }

  override async setupThemeSettings() {}

  override render() {
    return html``;
  }
}

customElements.define("yp-admin-access-test-app", AdminAccessTestApp);

describe("admin session restoration", () => {
  let element: AdminAccessTestApp | undefined;
  let requests: string[];
  let loginPrompts: number;
  let collectionRequiresLogin: boolean;
  let responseGate: Promise<void> | undefined;
  let releaseResponse: (() => void) | undefined;
  const originalUrl = window.location.href;
  const originalFetch = window.fetch;
  const originalAppGlobals = window.appGlobals;
  const originalAppUser = window.appUser;
  const originalServerApi = window.serverApi;

  const domain = { id: 1, configuration: {} } as YpDomainData;
  const community = {
    id: 10257,
    domain_id: domain.id,
    configuration: { onlyAdminsCanCreateGroups: true },
  } as YpCommunityData;
  const group = {
    id: 31802,
    community_id: community.id,
    configuration: {},
  } as YpGroupData;

  const fire = (name: string) =>
    document.dispatchEvent(new CustomEvent(name));

  function restoreUser() {
    window.appUser.user = { id: 7, name: "Admin" } as YpUserData;
    fire("yp-logged-in");
  }

  function restoreRights() {
    window.appUser.adminRights = {
      GroupAdmins: [group],
      CommunityAdmins: [community],
      DomainAdmins: [domain],
      OrganizationAdmins: [],
    };
    fire("yp-got-admin-rights");
  }

  async function mount(path: string) {
    history.replaceState({}, "", path);
    element = document.createElement(
      "yp-admin-access-test-app"
    ) as AdminAccessTestApp;
    document.body.append(element);
    await aTimeout(0);
    return element;
  }

  beforeEach(() => {
    requests = [];
    loginPrompts = 0;
    collectionRequiresLogin = false;
    responseGate = undefined;
    releaseResponse = undefined;
    window.appGlobals = {
      originalQueryParameters: {},
      theme: { hasStaticTheme: false },
      analytics: { sendToAnalyticsTrackers() {} },
    } as unknown as typeof window.appGlobals;
    window.appUser = {
      ensureLoginChecked: async () => !!window.appUser.user,
      openUserlogin: () => { loginPrompts += 1; },
      loginFor401: () => { loginPrompts += 1; },
    } as unknown as typeof window.appUser;
    window.serverApi = new YpServerApi();
    window.fetch = async (input) => {
      const url = String(input);
      requests.push(url);
      await responseGate;
      if (collectionRequiresLogin && !window.appUser.user) {
        return new Response("Unauthorized", { status: 401 });
      }
      const data: Record<string, unknown> = {
        "/api/groups/31802": { group },
        "/api/communities/10257": community,
        "/api/domains/1": domain,
      };
      return new Response(JSON.stringify(data[url] || {}), {
        status: data[url] ? 200 : 401,
        headers: { "Content-Type": "application/json" },
      });
    };
  });

  afterEach(async () => {
    element?.remove();
    releaseResponse?.();
    await aTimeout(0);
    window.fetch = originalFetch;
    window.appGlobals = originalAppGlobals;
    window.appUser = originalAppUser;
    window.serverApi = originalServerApi;
    history.replaceState({}, "", originalUrl);
  });

  for (const [type, id, apiType] of [
    ["group", 31802, "groups"],
    ["community", 10257, "communities"],
    ["domain", 1, "domains"],
  ] as const) {
    it(`restores an existing ${type} without requesting an undefined parent`, async () => {
      const app = await mount(`/admin/${type}/${id}`);
      expect(app.adminConfirmed).to.equal(false);
      restoreUser();
      restoreRights();
      await aTimeout(0);
      expect(app.adminConfirmed).to.equal(true);

      // A subsequent successful login must not restart the login loop.
      fire("yp-logged-in");
      await aTimeout(0);
      expect(requests).to.deep.equal([`/api/${apiType}/${id}`]);
      expect(loginPrompts).to.equal(0);
    });
  }

  it("accepts session and permissions that arrive before the collection", async () => {
    responseGate = new Promise(resolve => { releaseResponse = resolve; });
    const app = await mount("/admin/group/31802");
    restoreUser();
    restoreRights();
    expect(app.adminConfirmed).to.equal(false);
    releaseResponse!();
    await aTimeout(0);
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("rechecks when permissions arrive before the user", async () => {
    const app = await mount("/admin/group/31802");
    restoreRights();
    expect(app.adminConfirmed).to.equal(false);
    restoreUser();
    await aTimeout(0);
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("supports Settings navigation with an already restored session", async () => {
    restoreUser();
    restoreRights();
    const app = await mount("/admin/group/31802");
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("retries the current collection after signing in to an expired session", async () => {
    collectionRequiresLogin = true;
    const app = await mount("/admin/group/31802");
    expect(loginPrompts).to.equal(1);
    restoreUser();
    restoreRights();
    await aTimeout(0);
    expect(app.adminConfirmed).to.equal(true);
    expect(requests).to.deep.equal(["/api/groups/31802", "/api/groups/31802"]);
    expect(loginPrompts).to.equal(1);
  });

  it("requires access to the existing group even when the user can create groups in its parent", async () => {
    restoreUser();
    restoreRights();
    window.appUser.adminRights!.GroupAdmins = [];
    const app = await mount("/admin/group/31802");
    fire("yp-logged-in");
    await aTimeout(0);
    expect(app.adminConfirmed).to.equal(false);
    expect(requests).to.deep.equal(["/api/groups/31802"]);
    expect(loginPrompts).to.equal(0);
  });

  it("removes listeners on exit and registers them once on reconnect", async () => {
    restoreUser();
    restoreRights();
    const app = await mount("/admin/group/31802");
    app.remove();
    const checksBeforeExit = app.accessChecks;
    fire("yp-logged-in");
    fire("yp-got-admin-rights");
    fire("yp-boot-from-server");
    expect(app.accessChecks).to.equal(checksBeforeExit);

    document.body.append(app);
    const checksAfterReconnect = app.accessChecks;
    fire("yp-logged-in");
    expect(app.accessChecks).to.equal(checksAfterReconnect + 1);
    await aTimeout(0);
    expect(requests).to.deep.equal(["/api/groups/31802"]);
    expect(loginPrompts).to.equal(0);
  });

  it("uses the loaded parent IDs and loads the destination when navigating up", async () => {
    restoreUser();
    restoreRights();
    const app = await mount("/admin/group/31802");
    app.setPage("back");
    await aTimeout(0);
    expect(location.pathname).to.equal("/admin/community/10257/groups");
    expect(app.collection?.id).to.equal(community.id);
    expect(app.adminConfirmed).to.equal(true);

    app.setPage("back");
    await aTimeout(0);
    expect(location.pathname).to.equal("/admin/domain/1/communities");
    expect(app.collection?.id).to.equal(domain.id);
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("checks the parent permissions when creating a new group", async () => {
    restoreUser();
    const app = await mount("/admin/group/new/10257");
    expect(app.adminConfirmed).to.equal(false);
    restoreRights();
    await aTimeout(0);
    expect(app.adminConfirmed).to.equal(true);
    expect(requests.length).to.be.greaterThan(0);
    expect(requests.every(url => url === "/api/communities/10257")).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("opens login once when creating a new group while signed out", async () => {
    await mount("/admin/group/new/10257");
    expect(loginPrompts).to.equal(1);
    expect(requests).to.deep.equal([]);
  });

  it("ignores a collection response after navigating to another admin page", async () => {
    restoreUser();
    restoreRights();
    responseGate = new Promise(resolve => { releaseResponse = resolve; });
    const app = await mount("/admin/group/31802");
    responseGate = undefined;
    history.replaceState({}, "", "/admin/domain/1");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await aTimeout(0);
    expect(app.collection?.id).to.equal(domain.id);

    releaseResponse!();
    await aTimeout(0);
    expect(app.collection?.id).to.equal(domain.id);
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("waits for the domain before creating a community for a new group", async () => {
    restoreUser();
    restoreRights();
    window.appGlobals.originalQueryParameters.createCommunityForGroup = "true";
    const app = await mount("/admin/group/new/10257");
    expect(requests).to.deep.equal([]);
    window.appGlobals.domain = domain;
    fire("yp-boot-from-server");
    await aTimeout(0);
    expect(requests).to.deep.equal(["/api/domains/1"]);
    expect(app.adminConfirmed).to.equal(true);
    expect(loginPrompts).to.equal(0);
  });

  it("revokes admin confirmation when the user logs out", async () => {
    restoreUser();
    restoreRights();
    const app = await mount("/admin/group/31802");
    window.appUser.user = null;
    fire("yp-logged-in");
    expect(app.adminConfirmed).to.equal(false);
    expect(loginPrompts).to.equal(0);
  });
});
