import { nothing, TemplateResult } from "lit";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/fab/fab.js";
import "@material/web/fab/fab.js";
import "./yp-collection-header.js";
import "./yp-collection-items-list.js";
import "../ac-activities/ac-activities.js";
import "../yp-post/yp-post-map.js";
import "../yp-assistants/yp-assistant.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare const CollectionTabTypes: Record<string, number>;
export declare abstract class YpCollection extends YpBaseElementWithLogin {
    noHeader: boolean;
    tabsHidden: boolean;
    collectionId: number | undefined;
    collectionName: string | undefined;
    collection: YpCollectionData | undefined;
    subRoute: string | undefined;
    selectedTab: number;
    collectionItems: Array<YpCommunityData | YpGroupData> | undefined;
    hideNewsfeed: boolean;
    locationHidden: boolean;
    hideCollection: boolean;
    createFabIcon: string | undefined;
    createFabLabel: string | undefined;
    headerImageUrl: string | undefined;
    useEvenOddItemLayout: boolean;
    collectionHeaderHidden: boolean;
    collectionType: string;
    collectionItemType: string | null;
    collectionCreateFabIcon: string;
    collectionCreateFabLabel: string;
    constructor(collectionType: string, collectionItemType: string | null, collectionCreateFabIcon: string, collectionCreateFabLabel: string);
    loggedInUserCustom(): Promise<void>;
    abstract scrollToCollectionItemSubClass(): void;
    setupTheme(): void;
    connectedCallback(): void;
    hideCollectionHeader(event: CustomEvent): void;
    themeApplied(): Promise<void>;
    disconnectedCallback(): void;
    refresh(): void;
    getCollection(): Promise<void>;
    _getHelpPages(collectionTypeOverride?: string | undefined, collectionIdOverride?: number | undefined): Promise<void>;
    get collectionTabLabel(): string;
    collectionIdChanged(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _selectTab(event: CustomEvent): void;
    _openAdmin(): void;
    _setSelectedTabFromRoute(routeTabName: string): void;
    scrollToCachedItem(): void;
    scrollToCollectionItemSubClassDomain(): void;
    setFabIconIfAccess(onlyAdminCanCreate: boolean, hasCollectionAccess: boolean): void;
    _useHardBack(configuration: YpCollectionConfiguration): boolean;
    createNewCollection(): void;
    static get styles(): any[];
    renderHeader(): TemplateResult<1> | typeof nothing;
    renderAssistantTab(): TemplateResult<1>;
    renderNewsAndMapTabs(): TemplateResult<1>;
    renderTabs(): TemplateResult<1> | typeof nothing;
    renderCurrentTabPage(): TemplateResult | undefined;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=yp-collection.d.ts.map