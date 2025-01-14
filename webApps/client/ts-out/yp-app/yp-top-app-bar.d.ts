import { TemplateResult, PropertyValues, nothing } from "lit";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElement } from "../common/yp-base-element";
export declare class YpTopAppBar extends YpBaseElement {
    private isTitleLong;
    private isMenuOpen;
    private domain;
    hideBreadcrumbs: boolean;
    hideTitle: boolean;
    restrictWidth: boolean;
    disableArrowBasedNavigation: boolean;
    breadcrumbs: Array<{
        name: string;
        url: string;
    }>;
    fixed: boolean;
    useLowestContainerColor: boolean;
    backUrl: string | undefined;
    titleString: string;
    myDomains: Array<YpShortDomainList> | undefined;
    get computedBreadcrumbs(): {
        name: string;
        url: string;
    }[];
    renderBreadcrumbsDropdown(): TemplateResult<1> | typeof nothing;
    redirectTo(url: string): void;
    renderMyDomainsDropdown(): TemplateResult<1> | typeof nothing;
    private _toggleMenu;
    private _onMenuClosed;
    static get styles(): any[];
    lastScrollY: number;
    constructor();
    updated(changedProperties: PropertyValues): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _onDomainChanged;
    private _onMyDomainsLoaded;
    handleScroll(): void;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-top-app-bar.d.ts.map