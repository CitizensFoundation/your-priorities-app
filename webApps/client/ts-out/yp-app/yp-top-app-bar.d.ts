import { TemplateResult, PropertyValues, nothing } from "lit";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElement } from "../common/yp-base-element";
export declare class YpTopAppBar extends YpBaseElement {
    private isTitleLong;
    private isMenuOpen;
    hideBreadcrumbs: boolean;
    restrictWidth: boolean;
    disableArrowBasedNavigation: boolean;
    myDomains: Array<YpShortDomainList> | undefined;
    fixed: boolean;
    backUrl: string | undefined;
    titleString: string;
    breadcrumbs: Array<{
        name: string;
        url: string;
    }>;
    renderBreadcrumbsDropdown(): TemplateResult<1> | typeof nothing;
    renderMyDomainsDropdown(): TemplateResult<1> | typeof nothing;
    navigateTo(url: string): void;
    private _toggleMenu;
    private _onMenuClosed;
    static get styles(): any[];
    lastScrollY: number;
    constructor();
    updated(changedProperties: PropertyValues): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _onMyDomainsLoaded(event: CustomEvent): void;
    handleScroll(): void;
    get lastBreadcrumbItem(): {
        name: string;
        url: string;
    } | null;
    goToUrl(e: Event): void;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-top-app-bar.d.ts.map