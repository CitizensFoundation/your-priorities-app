import { aTimeout, expect } from "@open-wc/testing";
import { html, nothing } from "lit";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpCollection, CollectionTabTypes } from "../yp-collection.js";
import { YpCommunity } from "../yp-community.js";
import { YpGroup, GroupTabTypes } from "../yp-group.js";
import { YpPost } from "../../yp-post/yp-post.js";

// Real loaders, connection lifecycle and route handlers; no collection UI or
// background services. Tests explicitly start loads to control response order.
class CommunityNavigationProbe extends YpCommunity {
  refreshed: number[] = [];
  override refresh() { if (this.collection) this.refreshed.push(this.collection.id); }
  override updated(_changedProperties: Map<string | number | symbol, unknown>) {}
  override render() { return html``; }
  override async setupThemeSettings() {}
}
class AutoRoutingCommunityProbe extends CommunityNavigationProbe {
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    YpCollection.prototype.updated.call(this, changedProperties);
  }
}
class GroupNavigationProbe extends YpGroup {
  refreshed: number[] = [];
  configRefreshes = 0;
  override async refresh() { if (this.collection) this.refreshed.push(this.collection.id); }
  override _refreshAjax() { this.configRefreshes++; }
  override async _loadTabPostCounts() {}
  override updated(_changedProperties: Map<string | number | symbol, unknown>) {}
  override render() { return html``; }
  override async setupThemeSettings() {}
}
class AutoRoutingGroupProbe extends GroupNavigationProbe {
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    YpCollection.prototype.updated.call(this, changedProperties);
  }
}
class TabRenderingGroupProbe extends GroupNavigationProbe {
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    YpGroup.prototype.updated.call(this, changedProperties);
  }
  override render() { return html`${this.renderTabs()}`; }
}
class StatusTabRenderingGroupProbe extends TabRenderingGroupProbe {
  override renderPostList(statusFilter: string) {
    return html`<div id="statusContent" data-status-filter="${statusFilter}"></div>`;
  }
  override render() {
    // Exercise the real status-to-content routing without starting news/map
    // background services when a test clicks away from the post list.
    return html`${super.render()}
      ${this._isCurrentPostsTab ? this.renderCurrentGroupTabPage() : nothing}`;
  }
}
class PostNavigationProbe extends YpPost {
  refreshed: number[] = [];
  override _processIncomingPost() { if (this.post) this.refreshed.push(this.post.id); }
  override refresh() {}
  override setupTheme() {}
  override updated() {}
  override render() { return html``; }
  override async setupThemeSettings() {}
}
customElements.define("yp-navigation-community-probe", CommunityNavigationProbe);
customElements.define("yp-navigation-auto-community-probe", AutoRoutingCommunityProbe);
customElements.define("yp-navigation-group-probe", GroupNavigationProbe);
customElements.define("yp-navigation-post-probe", PostNavigationProbe);
customElements.define("yp-navigation-auto-group-probe", AutoRoutingGroupProbe);
customElements.define("yp-navigation-tabs-group-probe", TabRenderingGroupProbe);
customElements.define("yp-navigation-status-tabs-group-probe", StatusTabRenderingGroupProbe);

type Probe = CommunityNavigationProbe | GroupNavigationProbe | PostNavigationProbe;

describe("collection navigation and lifecycle", () => {
  const originalGlobals = window.appGlobals;
  const originalUser = window.appUser;
  const originalApi = window.serverApi;
  const originalDialogs = window.appDialogs;
  const originalAddListener = document.addEventListener;
  let elements: HTMLElement[];
  let listeners: Array<[string, EventListenerOrEventListenerObject]>;
  let requested: number[];
  let domains: number[];

  const data = (id: number) => ({
    id, configuration: {}, community_id: 10, group_id: 20,
    Domain: { id, configuration: {} },
    Community: { Domain: { id, configuration: {} }, configuration: {} },
    Group: { Community: { Domain: { id, configuration: {} } } },
  });
  const response = (type: string, id: number) =>
    type === "group" ? { group: data(id), hasNonOpenPosts: false } : data(id);

  async function mount(type: string): Promise<Probe> {
    const element = document.createElement(`yp-navigation-${type}-probe`) as Probe;
    elements.push(element);
    element.collectionId = 101;
    document.body.append(element);
    await element.updateComplete;
    return element;
  }

  const load = (element: Probe) => element instanceof PostNavigationProbe
    ? element._getPost() : element.getCollection();
  const contentId = (element: Probe) => element instanceof PostNavigationProbe
    ? element.post?.id : element.collection?.id;

  function deferRequests() {
    const pending: Array<{ id: number; resolve: (value: unknown) => void }> = [];
    window.serverApi.getCollection = (type, id) => {
      requested.push(id);
      return new Promise(resolve => pending.push({ id,
        resolve: value => resolve(value ?? response(type, id)),
      }));
    };
    return pending;
  }

  function deferHelpRequests() {
    const pending: Array<{type: string; id: number; resolve: (pages: unknown) => void}> = [];
    window.serverApi.getHelpPages = (type, id) => new Promise(resolve => {
      pending.push({type, id, resolve});
    });
    return pending;
  }

  async function mountCommunityRoute(id: number) {
    const element = document.createElement("yp-navigation-auto-community-probe") as AutoRoutingCommunityProbe;
    elements.push(element);
    element.subRoute = `/${id}`;
    document.body.append(element);
    await aTimeout(0);
    return element;
  }

  beforeEach(() => {
    elements = [];
    listeners = [];
    requested = [];
    domains = [];
    document.addEventListener = ((name: string, listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions) => {
      listeners.push([name, listener]);
      originalAddListener.call(document, name, listener, options);
    }) as typeof document.addEventListener;
    window.appGlobals = {
      originalQueryParameters: {},
      cache: { groupItemsCache: {}, getPostFromCache: () => undefined },
      theme: { hasStaticTheme: false },
      activity() {},
      setCurrentDomain(domain: YpDomainData) { domains.push(domain.id); },
    } as unknown as typeof window.appGlobals;
    window.appUser = {} as typeof window.appUser;
    window.serverApi = {
      getCollection: async (type: string, id: number) => {
        requested.push(id);
        return response(type, id);
      },
      getHelpPages: async () => [],
      getGroupConfiguration: async () => ({}),
    } as unknown as typeof window.serverApi;
    window.appDialogs = {
      getDialogAsync: (_name: string, callback: (dialog: object) => void) => callback({}),
    } as unknown as typeof window.appDialogs;
  });

  afterEach(async () => {
    for (const element of elements) {
      if (element instanceof YpGroup) element._cancelConfigCheckTimer();
      element.remove();
    }
    for (const [name, listener] of listeners) document.removeEventListener(name, listener);
    document.addEventListener = originalAddListener;
    await aTimeout(0);
    window.appGlobals = originalGlobals;
    window.appUser = originalUser;
    window.serverApi = originalApi;
    window.appDialogs = originalDialogs;
  });

  for (const type of ["group", "community", "post"]) {
    it(`keeps the newest ${type} when an earlier response arrives last`, async () => {
      const element = await mount(type);
      const pending = deferRequests();
      const first = load(element);
      element.collectionId = 202;
      const second = load(element);
      pending[1].resolve(undefined);
      await second;
      pending[0].resolve(undefined);
      await first;
      expect(contentId(element)).to.equal(202);
      expect(element.refreshed).to.deep.equal([202]);
      expect(domains.every(id => id === 202)).to.be.true;
    });

    it(`ignores an older reload of the same ${type}`, async () => {
      const element = await mount(type);
      const pending = deferRequests();
      const first = load(element);
      const second = load(element);
      pending[1].resolve(undefined);
      await second;
      pending[0].resolve(undefined);
      await first;
      expect(element.refreshed).to.deep.equal([101]);
    });

    it(`ignores a detached ${type} response and resumes loading on reconnect`, async () => {
      const element = await mount(type);
      const pending = deferRequests();
      const first = load(element);
      element.remove();
      document.body.append(element);
      await aTimeout(0);
      expect(pending).to.have.length(2);
      pending[0].resolve(undefined);
      await first;
      expect(element.refreshed).to.deep.equal([]);
      expect(domains).to.deep.equal([]);
      pending[1].resolve(undefined);
      await aTimeout(0);
      expect(contentId(element)).to.equal(101);
      expect(element.refreshed).to.deep.equal([101]);
    });
  }

  it("rejects a response as soon as the sub-route changes, before collectionId updates", async () => {
    const element = await mount("group");
    const pending = deferRequests();
    const request = load(element);
    element.subRoute = "/202";
    pending[0].resolve(undefined);
    await request;
    expect(contentId(element)).to.be.undefined;
    expect(domains).to.deep.equal([]);
  });

  it("loads the latest route through real Lit updates after a pending page reconnects", async () => {
    const pending = deferRequests();
    const element = document.createElement("yp-navigation-auto-group-probe") as AutoRoutingGroupProbe;
    elements.push(element);
    element.subRoute = "/101/news";
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101]);
    element.remove();
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101, 101]);
    element.subRoute = "/202/map";
    await aTimeout(0);
    expect(requested).to.deep.equal([101, 101, 202]);
    pending[2].resolve(undefined);
    await aTimeout(0);
    pending[1].resolve(undefined);
    pending[0].resolve(undefined);
    await aTimeout(0);
    expect(element.collection?.id).to.equal(202);
    expect(element.refreshed).to.deep.equal([202]);
    expect(element.selectedGroupTab).to.equal(GroupTabTypes.Map);
  });

  it("does not let an old request clear a newer group's login retry callback", async () => {
    const element = await mount("group");
    const pending = deferRequests();
    const first = load(element);
    element.collectionId = 202;
    const second = load(element);
    const retry = window.appGlobals.retryMethodAfter401Login;
    pending[0].resolve(undefined);
    await first;
    expect(window.appGlobals.retryMethodAfter401Login).to.equal(retry);
    pending[1].resolve(undefined);
    await second;
    expect(window.appGlobals.retryMethodAfter401Login).to.be.undefined;
  });

  it("ignores folder children arriving after navigation to another group", async () => {
    const element = await mount("group");
    let finishFolder!: (value: unknown) => void;
    window.serverApi.getCollection = async () => ({group: {...data(101), is_group_folder: true}});
    window.serverApi.getGroupFolder = () => new Promise(resolve => { finishFolder = resolve; });
    const first = load(element);
    await aTimeout(0);
    window.appGlobals.cache.groupItemsCache[202] = data(202) as unknown as YpGroupData;
    element.collectionId = 202;
    await load(element);
    finishFolder({group: {Groups: [{id: 999}]}});
    await first;
    expect(contentId(element)).to.equal(202);
    expect(element.collectionItems).to.be.undefined;
    expect(domains).to.deep.equal([202]);
  });

  it("invalidates an in-flight post request when using a cached post", async () => {
    const element = await mount("post") as PostNavigationProbe;
    const pending = deferRequests();
    const first = element._getPost();
    element.collectionId = 202;
    window.appGlobals.cache.cachedPostItem = data(202) as unknown as YpPostData;
    element.collectionIdChanged();
    pending[0].resolve(undefined);
    await first;
    expect(element.post?.id).to.equal(202);
    expect(element.refreshed).to.deep.equal([202]);
  });

  it("ignores help pages from an older route or disconnected page", async () => {
    const element = await mount("community");
    const pending: Array<(pages: unknown) => void> = [];
    window.serverApi.getHelpPages = () => new Promise(resolve => pending.push(resolve));
    const published: number[] = [];
    element.addEventListener("yp-set-pages", event => published.push((event as CustomEvent).detail[0].id));
    const first = element._getHelpPages();
    element.collectionId = 202;
    const second = element._getHelpPages();
    pending[1]([{id: 2}]);
    await second;
    pending[0]([{id: 1}]);
    await first;
    const third = element._getHelpPages();
    element.remove();
    pending[2]([{id: 3}]);
    await third;
    expect(published).to.deep.equal([2]);
  });

  for (const responseTiming of ["while disconnected", "after reconnect"]) {
    it(`resumes interrupted help pages when the original response arrives ${responseTiming}`, async () => {
      const pending = deferHelpRequests();
      const published: number[] = [];
      document.addEventListener("yp-set-pages", event => published.push((event as CustomEvent).detail[0].id));
      const first = await mountCommunityRoute(101);
      expect(first.collection?.id).to.equal(101);
      first.remove();
      const second = await mountCommunityRoute(202);
      pending[1].resolve([{id: 202}]);
      await aTimeout(0);
      expect(published).to.deep.equal([202]);

      if (responseTiming === "while disconnected") {
        pending[0].resolve([{id: 1}]);
        await aTimeout(0);
      }
      second.remove();
      document.body.append(first);
      await aTimeout(0);
      expect(pending.map(request => request.id)).to.deep.equal([101, 202, 101]);
      // The collection finished already; only its interrupted help load resumes.
      expect(requested).to.deep.equal([101, 202]);
      pending[2].resolve([{id: 101}]);
      await aTimeout(0);
      if (responseTiming === "after reconnect") {
        pending[0].resolve([{id: 1}]);
        await aTimeout(0);
      }
      expect(first.collection?.id).to.equal(101);
      expect(published).to.deep.equal([202, 101]);
    });
  }

  it("preserves the group type and ID when resuming a post's help pages", async () => {
    const pending = deferHelpRequests();
    const element = await mount("post") as PostNavigationProbe;
    const published: number[] = [];
    element.addEventListener("yp-set-pages", event => published.push((event as CustomEvent).detail[0].id));
    await element._getPost();
    expect(element.post?.id).to.equal(101);
    element.remove();
    document.body.append(element);
    await aTimeout(0);
    expect(pending.map(({type, id}) => ({type, id}))).to.deep.equal([
      {type: "group", id: 20}, {type: "group", id: 20},
    ]);
    expect(requested).to.deep.equal([101]);
    pending[0].resolve([{id: 1}]);
    pending[1].resolve([{id: 20}]);
    await aTimeout(0);
    expect(published).to.deep.equal([20]);
  });

  it("keeps the replacement help request pending when the invalidated request finishes", async () => {
    const pending = deferHelpRequests();
    const element = await mountCommunityRoute(101);
    const published: number[] = [];
    element.addEventListener("yp-set-pages", event => published.push((event as CustomEvent).detail[0].id));
    element.remove();
    document.body.append(element);
    // A second detach before the reconnect callback must not lose the retry.
    element.remove();
    document.body.append(element);
    await aTimeout(0);
    expect(pending).to.have.length(2);
    pending[0].resolve([{id: 1}]);
    await aTimeout(0);
    element.remove();
    document.body.append(element);
    await aTimeout(0);
    expect(pending).to.have.length(3);
    pending[1].resolve([{id: 2}]);
    pending[2].resolve([{id: 101}]);
    await aTimeout(0);
    expect(requested).to.deep.equal([101]);
    expect(published).to.deep.equal([101]);
  });

  it("does not resume the previous route's help request after reconnecting on a new route", async () => {
    const pending = deferHelpRequests();
    const element = await mountCommunityRoute(101);
    const published: number[] = [];
    element.addEventListener("yp-set-pages", event => published.push((event as CustomEvent).detail[0].id));
    element.remove();
    element.subRoute = "/202";
    document.body.append(element);
    await aTimeout(0);
    expect(pending.map(request => request.id)).to.deep.equal([101, 202]);
    pending[1].resolve([{id: 202}]);
    pending[0].resolve([{id: 101}]);
    await aTimeout(0);
    expect(element.collection?.id).to.equal(202);
    expect(published).to.deep.equal([202]);
  });

  it("does not duplicate help requests when both collection and help loads resume", async () => {
    const collections = deferRequests();
    const pending = deferHelpRequests();
    const element = await mountCommunityRoute(101);
    element.remove();
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101, 101]);
    expect(pending.map(request => request.id)).to.deep.equal([101, 101]);
    for (const collection of collections) collection.resolve(undefined);
    for (const request of pending) request.resolve([]);
    await aTimeout(0);
    expect(element.collection?.id).to.equal(101);
  });

  for (const result of ["success", "empty", "undefined", "failure"]) {
    it(`does not resume a settled help request (${result})`, async () => {
      let helpRequests = 0;
      window.serverApi.getHelpPages = async () => {
        helpRequests++;
        if (result === "failure") throw new Error("Help request failed");
        return result === "undefined" ? undefined : result === "empty" ? [] : [{id: 101}];
      };
      const element = await mount("community");
      await element.getCollection();
      try {
        await element._getHelpPages();
        expect(result).not.to.equal("failure");
      } catch (error) {
        expect(result).to.equal("failure");
        expect((error as Error).message).to.equal("Help request failed");
      }
      element.remove();
      document.body.append(element);
      await aTimeout(0);
      expect(helpRequests).to.equal(1);
      expect(requested).to.deep.equal([101]);
    });
  }

  it("removes login/rights listeners while detached and restores them once on reconnect", async () => {
    const element = await mount("community") as CommunityNavigationProbe;
    await element.getCollection();
    for (let reconnect = 0; reconnect < 2; reconnect++) {
      element.remove();
      requested.length = 0;
      domains.length = 0;
      const refreshes = element.refreshed.length;
      document.dispatchEvent(new CustomEvent("yp-logged-in"));
      document.dispatchEvent(new CustomEvent("yp-got-admin-rights"));
      await aTimeout(0);
      expect(requested).to.deep.equal([]);
      expect(domains).to.deep.equal([]);
      expect(element.refreshed).to.have.length(refreshes);
      window.appUser.user = {id: 7} as YpUserData;
      document.body.append(element);
      await aTimeout(0);
      expect(element.loggedInUser?.id).to.equal(7);
      requested.length = 0;
      document.dispatchEvent(new CustomEvent("yp-got-admin-rights"));
      await aTimeout(0);
      expect(requested).to.deep.equal([101]);
    }
  });

  it("reloads a cached anonymous community after login and rights arrive on another page", async () => {
    window.serverApi.getCollection = async (type, id) => {
      requested.push(id);
      if (type !== "community") return response(type, id);
      return {...data(id), Groups: window.appUser.user ? [{id: 1}, {id: 2}] : [{id: 1}]};
    };
    const community = await mountCommunityRoute(101);
    const groupIds = () => (community.collection as YpCommunityData).Groups?.map(group => group.id);
    expect(groupIds()).to.deep.equal([1]);
    community.remove();
    const group = await mount("group");
    window.appUser.user = {id: 7} as YpUserData;
    document.dispatchEvent(new CustomEvent("yp-logged-in", {detail: window.appUser.user}));
    window.appUser.adminRights = {GroupAdmins: [{id: 2}]} as YpAdminRights;
    document.dispatchEvent(new CustomEvent("yp-got-admin-rights", {detail: true}));
    await aTimeout(0);
    expect(groupIds()).to.deep.equal([1]);
    requested.length = 0;
    group.remove();
    document.body.append(community);
    await aTimeout(0);
    expect(requested).to.deep.equal([101]);
    expect(groupIds()).to.deep.equal([1, 2]);
    expect(community.loggedInUser?.id).to.equal(7);
  });

  for (const change of ["login", "logout", "account switch", "rights granted", "rights revoked", "memberships"]) {
    it(`reloads a returning community after detached ${change}`, async () => {
      window.appUser.user = change === "login" ? undefined : {id: 7} as YpUserData;
      if (change === "rights revoked") window.appUser.adminRights = {} as YpAdminRights;
      const element = await mountCommunityRoute(101);
      element.remove();
      if (change === "login") window.appUser.user = {id: 7} as YpUserData;
      if (change === "logout") window.appUser.user = null;
      if (change === "account switch") window.appUser.user = {id: 8} as YpUserData;
      if (change === "rights granted") window.appUser.adminRights = {} as YpAdminRights;
      if (change === "rights revoked") window.appUser.adminRights = undefined;
      if (change === "memberships") window.appUser.memberships = {} as YpMemberships;
      await aTimeout(0);
      expect(requested).to.deep.equal([101]);
      document.body.append(element);
      await aTimeout(0);
      expect(requested).to.deep.equal([101, 101]);
      expect(element.loggedInUser?.id).to.equal(window.appUser.user?.id);
      // Once refreshed for this access state, a second return needs no reload.
      element.remove();
      document.body.append(element);
      await aTimeout(0);
      expect(requested).to.deep.equal([101, 101]);
    });
  }

  it("keeps cached collections when user identity and rights have not changed", async () => {
    window.appUser.user = {id: 7} as YpUserData;
    const element = await mountCommunityRoute(101);
    element.remove();
    window.appUser.user = {id: 7, name: "Updated display name"} as YpUserData;
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101]);
    expect(element.loggedInUser?.name).to.equal("Updated display name");
  });

  it("loads only the new route when login changes while a community is detached", async () => {
    const element = await mountCommunityRoute(101);
    element.remove();
    window.appUser.user = {id: 7} as YpUserData;
    element.subRoute = "/202";
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101, 202]);
    expect(element.collection?.id).to.equal(202);
  });

  it("coalesces an auth reload with an existing community refresh flag", async () => {
    const element = await mountCommunityRoute(101);
    element.remove();
    window.appUser.user = {id: 7} as YpUserData;
    window.appGlobals.communityNeedsRefresh = true;
    document.body.append(element);
    await aTimeout(0);
    expect(requested).to.deep.equal([101, 101]);
    expect(window.appGlobals.communityNeedsRefresh).to.be.false;
  });

  for (const type of ["group", "post"]) {
    it(`bypasses the ${type} data cache when access changes while detached`, async () => {
      const element = await mount(type);
      await load(element);
      if (type === "group") {
        window.appGlobals.cache.groupItemsCache[101] = data(101) as unknown as YpGroupData;
      } else {
        window.appGlobals.cache.cachedPostItem = data(101) as unknown as YpPostData;
        window.appGlobals.cache.getPostFromCache = () => data(101) as unknown as YpPostData;
      }
      element.remove();
      window.appUser.user = {id: 7} as YpUserData;
      document.body.append(element);
      await aTimeout(0);
      expect(requested).to.deep.equal([101, 101]);
      expect(contentId(element)).to.equal(101);
    });

    it(`still bypasses cached ${type} data if an auth-triggered reload is interrupted`, async () => {
      const element = await mount(type);
      await load(element);
      if (type === "group") {
        window.appGlobals.cache.groupItemsCache[101] = data(101) as unknown as YpGroupData;
      } else {
        window.appGlobals.cache.cachedPostItem = data(101) as unknown as YpPostData;
      }
      element.remove();
      window.appUser.user = {id: 7} as YpUserData;
      const pending = deferRequests();
      document.body.append(element);
      await aTimeout(0);
      expect(pending).to.have.length(1);
      element.remove();
      document.body.append(element);
      await aTimeout(0);
      expect(pending).to.have.length(2);
      pending[0].resolve(undefined);
      pending[1].resolve(undefined);
      await aTimeout(0);
      expect(requested).to.deep.equal([101, 101, 101]);
      expect(contentId(element)).to.equal(101);
    });
  }

  it("cancels group polling while detached and restarts it on reconnect", async () => {
    const element = await mount("group") as GroupNavigationProbe;
    let checks = 0;
    window.serverApi.getGroupConfiguration = async () => { checks++; return {}; };
    element.collection = data(101) as unknown as YpGroupData;
    element.configCheckTTL = 10;
    element._startConfigCheckTimer();
    element.remove();
    await aTimeout(35);
    expect(checks).to.equal(0);
    expect(element.configCheckTimer).to.be.undefined;
    document.body.append(element);
    await aTimeout(35);
    expect(checks).to.be.greaterThan(0);
  });

  it("does not refresh or restart polling from a check completed after disconnect", async () => {
    const element = await mount("group") as GroupNavigationProbe;
    let resolve!: (value: unknown) => void;
    window.serverApi.getGroupConfiguration = () => new Promise(done => { resolve = done; });
    element.collection = data(101) as unknown as YpGroupData;
    const check = element._getGroupConfig();
    element.remove();
    resolve({canVote: false});
    await check;
    expect(element.configRefreshes).to.equal(0);
    expect(element.configCheckTimer).to.be.undefined;
  });

  it("ignores configuration from a previous group after a route change", async () => {
    const element = await mount("group") as GroupNavigationProbe;
    let resolve!: (value: unknown) => void;
    window.serverApi.getGroupConfiguration = () => new Promise(done => { resolve = done; });
    element.collection = data(101) as unknown as YpGroupData;
    const check = element._getGroupConfig();
    element.collectionId = 202;
    element.collection = data(202) as unknown as YpGroupData;
    resolve({canVote: false});
    await check;
    expect(element.configRefreshes).to.equal(0);
    expect(element.configCheckTimer).to.be.undefined;
  });

  for (const [name, expected] of Object.entries({news: CollectionTabTypes.Newsfeed, map: CollectionTabTypes.Map, collection: 0})) {
    it(`opens the community ${name} tab from its URL`, async () => {
      const element = await mount("community");
      element.selectedTab = CollectionTabTypes.Assistant;
      element.subRoute = `/10361/${name}/42`;
      YpCollection.prototype.updated.call(element, new Map([["subRoute", undefined]]));
      expect(element.collectionId).to.equal(10361);
      expect(element.selectedTab).to.equal(expected);
      element.subRoute = "/10361";
      YpCollection.prototype.updated.call(element, new Map([["subRoute", undefined]]));
      expect(element.selectedTab).to.equal(0);
    });
  }

  for (const [name, expected] of Object.entries({news: GroupTabTypes.Newsfeed, map: GroupTabTypes.Map, open: 0, in_progress: 1, successful: 2, failed: 3})) {
    it(`keeps the explicit group ${name} tab through loading and default-tab selection`, async () => {
      const element = await mount("group") as GroupNavigationProbe;
      element.subRoute = `/101/${name}`;
      YpCollection.prototype.updated.call(element, new Map([["subRoute", undefined]]));
      await element.getCollection();
      element.hasNonOpenPosts = true;
      element.tabCounters = {open: 0, in_progress: 10, successful: 0, failed: 0};
      element._setupOpenTab();
      expect(element.selectedGroupTab).to.equal(expected);
      element.subRoute = "/101";
      YpCollection.prototype.updated.call(element, new Map([["subRoute", undefined]]));
      expect(element.selectedGroupTab).to.equal(GroupTabTypes.Open);
    });
  }

  it("retains configured map defaults for bare group URLs", async () => {
    const element = await mount("group") as GroupNavigationProbe;
    element.collection = {...data(101), configuration: {makeMapViewDefault: true}} as unknown as YpGroupData;
    element.subRoute = "/101";
    YpCollection.prototype.updated.call(element, new Map([["subRoute", undefined]]));
    expect(element.selectedGroupTab).to.equal(GroupTabTypes.Map);
  });

  it("selects the correct visible news/map tab when non-open status tabs are absent", async () => {
    const element = await mount("tabs-group") as TabRenderingGroupProbe;
    await aTimeout(0);
    for (const tab of [GroupTabTypes.Newsfeed, GroupTabTypes.Map]) {
      element.selectedGroupTab = tab;
      await aTimeout(0);
      const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
      expect(tabs.activeTabIndex).to.equal(tab - 3);
      expect(element.selectedGroupTab).to.equal(tab);
    }
  });

  for (const [name, tab] of Object.entries({news: GroupTabTypes.Newsfeed, map: GroupTabTypes.Map})) {
    it(`keeps the ${name} tab active when a cached reload removes status tabs`, async () => {
      const element = await mount("tabs-group") as TabRenderingGroupProbe;
      await aTimeout(0);
      window.appGlobals.cache.groupItemsCache[101] = element.collection!;
      element.hasNonOpenPosts = true;
      await aTimeout(0);
      element.selectedGroupTab = tab;
      await aTimeout(0);
      const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
      expect(tabs.activeTabIndex).to.equal(tab);
      const selectedTab = tabs.activeTab!;

      await element.getCollection();
      await aTimeout(0);
      expect(element.hasNonOpenPosts).to.be.false;
      expect(element.selectedGroupTab).to.equal(tab);
      expect(tabs.tabs).to.have.length(3);
      expect(tabs.activeTabIndex).to.equal(tab - 3);
      expect(tabs.activeTab === selectedTab).to.be.true;
      expect(selectedTab.tabIndex).to.equal(0);

      // Status tabs can also reappear after the configuration check completes.
      element.hasNonOpenPosts = true;
      await aTimeout(0);
      expect(tabs.tabs).to.have.length(6);
      expect(tabs.activeTabIndex).to.equal(tab);
      expect(tabs.activeTab === selectedTab).to.be.true;
      expect(element.selectedGroupTab).to.equal(tab);
    });
  }

  it("preserves programmatic tab selection without treating it as a user choice", async () => {
    const element = await mount("tabs-group") as TabRenderingGroupProbe;
    await aTimeout(0);
    element.userSelectedPostStatusTab = false;
    element.selectedGroupTab = GroupTabTypes.Map;
    await aTimeout(0);
    const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
    expect(tabs.activeTabIndex).to.equal(2);
    expect(element.userSelectedPostStatusTab).to.be.false;
  });

  it("applies a new selection after status tabs are inserted in the same update", async () => {
    const element = await mount("tabs-group") as TabRenderingGroupProbe;
    await aTimeout(0);
    element.hasNonOpenPosts = true;
    element.selectedGroupTab = GroupTabTypes.Map;
    await aTimeout(0);
    const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
    expect(tabs.activeTabIndex).to.equal(GroupTabTypes.Map);
    expect(element.selectedGroupTab).to.equal(GroupTabTypes.Map);
  });

  const statusRoutes: Array<[string, number, string]> = [
    ["in_progress", GroupTabTypes.InProgress, "in_progress"],
    ["inProgress", GroupTabTypes.InProgress, "in_progress"],
    ["successful", GroupTabTypes.Successful, "successful"],
    ["successfull", GroupTabTypes.Successful, "successful"],
    ["failed", GroupTabTypes.Failed, "failed"],
  ];

  for (const [route, selectedTab, statusFilter] of statusRoutes) {
    it(`renders the requested empty ${route} status tab and allows switching to news/map`, async () => {
      const element = document.createElement("yp-navigation-status-tabs-group-probe") as StatusTabRenderingGroupProbe;
      elements.push(element);
      element.subRoute = `/101/${route}`;
      document.body.append(element);
      await aTimeout(0);
      const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
      const label = element.tabLabelWithCount(statusFilter === "in_progress" ? "inProgress" : statusFilter);
      expect(element.hasNonOpenPosts).to.be.false;
      expect(element.selectedGroupTab).to.equal(selectedTab);
      expect(element.shadowRoot!.querySelector("#statusContent")?.getAttribute("data-status-filter")).to.equal(statusFilter);
      expect(tabs.activeTab?.textContent).to.include(label);
      expect(tabs.activeTab?.tabIndex).to.equal(0);

      for (const destination of [GroupTabTypes.Newsfeed, GroupTabTypes.Map, GroupTabTypes.Open]) {
        element.selectedGroupTab = selectedTab;
        await aTimeout(0);
        const target = tabs.tabs[destination];
        target.click();
        await aTimeout(0);
        expect(element.selectedGroupTab).to.equal(destination);
        expect(tabs.activeTab === target).to.be.true;
        expect(tabs.tabs).to.have.length(3);
        expect(tabs.activeTabIndex).to.equal(destination === GroupTabTypes.Open ? 0 : destination - 3);
        const statusContent = element.shadowRoot!.querySelector("#statusContent");
        if (destination === GroupTabTypes.Open) {
          expect(statusContent?.getAttribute("data-status-filter")).to.equal("open");
        } else {
          expect(statusContent).to.be.null;
        }
      }
    });
  }

  for (const [route, selectedTab, statusFilter] of statusRoutes.filter(([route]) => !["inProgress", "successfull"].includes(route))) {
    it(`retains the selected ${route} tab when a cached reload reports no non-open posts`, async () => {
      const element = await mount("status-tabs-group") as StatusTabRenderingGroupProbe;
      await aTimeout(0);
      window.appGlobals.cache.groupItemsCache[101] = element.collection!;
      element.hasNonOpenPosts = true;
      element.selectedGroupTab = selectedTab;
      await aTimeout(0);
      const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
      const activeTab = tabs.activeTab;
      await element.getCollection();
      await aTimeout(0);
      expect(element.hasNonOpenPosts).to.be.false;
      expect(element.selectedGroupTab).to.equal(selectedTab);
      expect(tabs.activeTab === activeTab).to.be.true;
      expect(tabs.activeTabIndex).to.equal(selectedTab);
      expect(element.shadowRoot!.querySelector("#statusContent")?.getAttribute("data-status-filter")).to.equal(statusFilter);
    });
  }

  for (const hasNonOpenPosts of [false, true]) {
    it(`maps real tab clicks to content with status tabs ${hasNonOpenPosts ? "present" : "absent"}`, async () => {
      const element = await mount("tabs-group") as TabRenderingGroupProbe;
      await aTimeout(0);
      element.hasNonOpenPosts = hasNonOpenPosts;
      await aTimeout(0);
      const tabs = element.shadowRoot!.querySelector("md-tabs") as MdTabs;
      for (const tab of [GroupTabTypes.Newsfeed, GroupTabTypes.Map, GroupTabTypes.Open]) {
        const visibleIndex = !hasNonOpenPosts && tab >= GroupTabTypes.Newsfeed ? tab - 3 : tab;
        tabs.tabs[visibleIndex].click();
        await aTimeout(0);
        expect(tabs.activeTabIndex).to.equal(visibleIndex);
        expect(element.selectedGroupTab).to.equal(tab);
        expect(element.userSelectedPostStatusTab).to.be.true;
      }
    });
  }
});
