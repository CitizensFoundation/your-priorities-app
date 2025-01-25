import { TemplateResult, PropertyValues, nothing } from "lit";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login";
export declare class YpAgentBundleTopBar extends YpBaseElementWithLogin {
    private domain;
    numberOfUnViewedNotifications: string | undefined;
    page: string | undefined;
    hasStaticBadgeTheme: boolean;
    static get styles(): any[];
    constructor();
    get inForAgentBundle(): boolean | "" | 0 | undefined;
    updated(changedProperties: PropertyValues): void;
    connectedCallback(): void;
    renderLogo(): TemplateResult<1>;
    disconnectedCallback(): void;
    private _onDomainChanged;
    _login(): void;
    renderUser(): typeof nothing | TemplateResult<1>;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-agent-bundle-top-bar.d.ts.map