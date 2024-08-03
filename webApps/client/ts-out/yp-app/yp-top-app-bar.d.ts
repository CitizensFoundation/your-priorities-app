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
    titleString: string;
    breadcrumbs: Array<{
        name: string;
        url: string;
    }>;
    renderBreadcrumbsDropdown(): typeof nothing | TemplateResult<1>;
    navigateTo(url: string): void;
    private _toggleMenu;
    private _onMenuClosed;
    static get styles(): any[];
    lastScrollY: number;
    constructor();
    updated(changedProperties: PropertyValues): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleScroll(): void;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-top-app-bar.d.ts.map