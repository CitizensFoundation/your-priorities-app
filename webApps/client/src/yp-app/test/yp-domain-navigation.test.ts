import { aTimeout, expect } from "@open-wc/testing";
import { html, LitElement } from "lit";

import { YpApp } from "../yp-app.js";
import { YpAppGlobals } from "../YpAppGlobals.js";
import { YpAppUser } from "../YpAppUser.js";
import { YpCache } from "../YpCache.js";
import { YpNavHelpers } from "../../common/YpNavHelpers.js";
import { YpGroup } from "../../yp-collection/yp-group.js";

class NavigationTestPage extends LitElement {
  scrollToGroupItem() {}
}
customElements.define("yp-navigation-test-page", NavigationTestPage);

class CachedGroupNavigationTest extends YpGroup {
  override async refresh() {}
  override updated() {}
  override async setupThemeSettings() {}
  override render() { return html``; }
}
customElements.define("yp-cached-group-navigation-test", CachedGroupNavigationTest);

// Keep the real app shell, navigation controls and router, without starting
// background services or loading collection content from the server.
class DomainNavigationTestApp extends YpApp {
  override setupAppGlobals() {
    window.appGlobals = new YpAppGlobals(window.serverApi, true);
    window.appGlobals.cache = new YpCache();
    window.appGlobals.theme = {
      hasStaticTheme: false,
    } as typeof window.appGlobals.theme;
    window.appGlobals.analytics = {
      sendToAnalyticsTrackers() {},
    } as unknown as typeof window.appGlobals.analytics;
    window.appGlobals.setupTranslationSystem = () => {};
  }

  override async setupThemeSettings() {}
  override _setupSamlCallback() {}

  override renderPage() {
    return html`<yp-navigation-test-page
      id="${this.page}Page"
      data-route="${this.route}"
    >${this.page}</yp-navigation-test-page>`;
  }

  override render() {
    return html`${this.renderDrawers()} ${this.renderMainApp()}`;
  }
}
customElements.define("yp-domain-navigation-test-app", DomainNavigationTestApp);

describe("domain data during public navigation", () => {
  let element: DomainNavigationTestApp;
  const originalUrl = window.location.href;
  const originalApp = window.app;
  const originalAppGlobals = window.appGlobals;
  const originalAppUser = window.appUser;
  const originalServerApi = window.serverApi;
  const originalAdminServerApi = window.adminServerApi;
  const originalCheckLogin = YpAppUser.prototype.checkLogin;
  const originalSetupFingerprint = YpAppUser.prototype._setupBrowserFingerprint;

  const fullDomain = () => ({
    id: 2,
    name: "Domain",
    domain_name: "example.test",
    theme_id: 1,
    configuration: { disableArrowBasedTopNavigation: true },
  }) as YpDomainData;

  // This is the Domain shape embedded in cached community-list groups.
  const partialDomain = () => ({
    id: 2,
    name: "Domain",
    theme_id: 1,
  }) as YpDomainData;

  beforeEach(async () => {
    YpAppUser.prototype.checkLogin = async () => {};
    YpAppUser.prototype._setupBrowserFingerprint = () => {};
    history.replaceState({}, "", "/group/31803");
    element = document.createElement(
      "yp-domain-navigation-test-app"
    ) as DomainNavigationTestApp;
    window.appGlobals.domain = fullDomain();
    element.showBack = true;
    element.backPath = "/community/10361";
    document.body.append(element);
    await element.updateComplete;
    await aTimeout(0);
  });

  afterEach(async () => {
    element.remove();
    await aTimeout(60);
    YpAppUser.prototype.checkLogin = originalCheckLogin;
    YpAppUser.prototype._setupBrowserFingerprint = originalSetupFingerprint;
    history.replaceState({}, "", originalUrl);
    window.app = originalApp;
    window.appGlobals = originalAppGlobals;
    window.appUser = originalAppUser;
    window.serverApi = originalServerApi;
    window.adminServerApi = originalAdminServerApi;
  });

  it("preserves loaded configuration and fields when a cached group supplies a partial domain", () => {
    const domain = fullDomain();
    const partial = partialDomain();
    window.appGlobals.domain = domain;
    window.appGlobals.setCurrentDomain(partial);

    expect(window.appGlobals.domain.configuration).to.equal(domain.configuration);
    expect(window.appGlobals.domain.domain_name).to.equal(domain.domain_name);
    expect(partial).not.to.have.property("configuration");
  });

  it("publishes the normalized domain to domain-change listeners", () => {
    let publishedDomain: YpDomainData | undefined;
    const listener = (event: Event) => {
      publishedDomain = (event as CustomEvent).detail.domain;
    };
    document.addEventListener("yp-domain-changed", listener, { once: true });
    window.appGlobals.setCurrentDomain(partialDomain());

    expect(publishedDomain).to.equal(window.appGlobals.domain);
    expect(publishedDomain?.configuration.disableArrowBasedTopNavigation).to.be.true;
  });

  it("accepts new configuration, including an explicitly empty configuration", () => {
    window.appGlobals.setCurrentDomain({ ...fullDomain(), configuration: {} });
    expect(window.appGlobals.domain?.configuration).to.deep.equal({});
  });

  it("does not carry configuration or other fields across different domains", () => {
    window.appGlobals.setCurrentDomain({ ...partialDomain(), id: 3 });
    expect(window.appGlobals.domain?.configuration).to.deep.equal({});
    expect(window.appGlobals.domain?.domain_name).to.be.undefined;
  });

  for (const configuration of [undefined, null]) {
    it(`handles a first domain with ${configuration} configuration`, () => {
      window.appGlobals.domain = undefined;
      window.appGlobals.setCurrentDomain({
        ...partialDomain(), configuration,
      } as unknown as YpDomainData);
      expect(window.appGlobals.domain).to.have.property("configuration")
        .that.deep.equals({});
    });

    it(`renders every navigation surface with ${configuration} configuration`, () => {
      window.appGlobals.domain = {
        ...partialDomain(), configuration,
      } as unknown as YpDomainData;
      expect(() => element.renderDrawers()).not.to.throw();
      expect(() => element.renderNavigation()).not.to.throw();
      expect(() => element.renderActionItems()).not.to.throw();
      expect(() => element.renderTopBar()).not.to.throw();
    });
  }

  it("renders navigation before any domain is loaded", () => {
    window.appGlobals.domain = undefined;
    expect(() => element.render()).not.to.throw();
  });

  it("updates the visible page on repeated group-to-community navigation through cached groups", async () => {
    window.appGlobals.domain = { ...fullDomain(), configuration: {} };
    window.appGlobals.cache.groupItemsCache[31803] = {
      id: 31803,
      Community: { Domain: partialDomain() },
    } as YpGroupData;
    // Exercise the real connected loader without mounting the post list.
    const group = document.createElement(
      "yp-cached-group-navigation-test"
    ) as CachedGroupNavigationTest;
    group.collectionId = 31803;
    document.body.append(group);
    try {
      for (let visit = 0; visit < 2; visit++) {
        YpNavHelpers.redirectTo("/group/31803");
        await element.updateComplete;
        await group.getCollection();

        // The real top-left button must change both URL and rendered content.
        element.shadowRoot!.querySelector<HTMLElement>("#goBackButton")!.click();
        await element.updateComplete;
        await aTimeout(0);
        expect(window.location.pathname).to.equal("/community/10361");
        expect(element.shadowRoot!.querySelector("#groupPage")).to.be.null;
        expect(element.shadowRoot!.querySelector("#communityPage")?.textContent)
          .to.equal("community");
      }
    } finally {
      group.remove();
    }
  });
});
