/** Browser entry point for the explicitly invoked, disposable group-creation test.
 * The shell supplies a signed-in fixture and routes; forms and group views are
 * the production components, with their normal HTTP requests and navigation.
 */
import { html, render } from "lit";
import i18next from "i18next";
import { YpServerApi } from "../../common/YpServerApi.js";
import { YpAppGlobals } from "../../yp-app/YpAppGlobals.js";
import { YpAppUser } from "../../yp-app/YpAppUser.js";
import { YpCache } from "../../yp-app/YpCache.js";
import { YpAnalytics } from "../../yp-app/YpAnalytics.js";
import { YpThemeManager } from "../../yp-app/YpThemeManager.js";
import "../../admin/yp-admin-config-group.js";
import "../../yp-collection/yp-group.js";

async function main() {
  const bootstrap = (await fetch("/manual/bootstrap").then((response) =>
    response.json(),
  )) as {
    user: YpUserData;
    domain: YpDomainData;
    community: YpCommunityData;
    groups: YpGroupData[];
  };
  const translation = await fetch("/locales/en/translation.json").then(
    (response) => response.json(),
  );
  await i18next.init({ lng: "en", resources: { en: { translation } } });
  window.serverApi = new YpServerApi();
  window.appGlobals = new YpAppGlobals(window.serverApi, true);
  Object.assign(window.appGlobals, {
    serverApi: window.serverApi,
    cache: new YpCache(),
    analytics: new YpAnalytics(),
    theme: new YpThemeManager(),
    domain: bootstrap.domain,
    locale: "en",
    i18nTranslation: i18next,
    haveLoadedLanguages: true,
    disableWelcome: true,
    activity: () => {}, // No analytics or background activity delivery in this fixture.
  });
  window.appGlobals.theme.setTheme(undefined, {
    theme: window.appGlobals.defaultTheme,
  });
  window.appUser = new YpAppUser(window.serverApi, true);
  window.appUser.user = bootstrap.user;
  window.appUser.adminRights = {
    DomainAdmins: [bootstrap.domain],
    CommunityAdmins: [bootstrap.community],
    GroupAdmins: bootstrap.groups,
    OrganizationAdmins: [],
  } as YpAdminRights;

  const root = document.querySelector<HTMLDivElement>("#manual-app")!;
  const route = async () => {
    const newGroup = /^\/admin\/group\/new\/(\d+)$/.exec(location.pathname);
    const editGroup = /^\/admin\/group\/(\d+)$/.exec(location.pathname);
    const group = /^\/group\/(\d+)$/.exec(location.pathname);
    if (newGroup) {
      render(
        html`<yp-admin-config-group
          collectionType="group"
          .collectionId=${"new"}
          .parentCollectionId=${Number(newGroup[1])}
          .parentCollection=${bootstrap.community}
        ></yp-admin-config-group>`,
        root,
      );
    } else if (editGroup) {
      const results = (await window.serverApi.getCollection(
        "group",
        Number(editGroup[1]),
      )) as YpGroupResults;
      render(
        html`<yp-admin-config-group
          collectionType="group"
          .collectionId=${Number(editGroup[1])}
          .collection=${results.group}
        ></yp-admin-config-group>`,
        root,
      );
    } else if (group) {
      render(
        html`<yp-group .collectionId=${Number(group[1])}></yp-group>`,
        root,
      );
    } else {
      render(
        html`<p>${bootstrap.community.name}</p>
          <a href=${`/admin/group/new/${bootstrap.community.id}`}
            >Create a new group</a
          >`,
        root,
      );
    }
  };
  window.addEventListener("location-changed", route);
  window.addEventListener("popstate", route);
  route();
}
void main();
