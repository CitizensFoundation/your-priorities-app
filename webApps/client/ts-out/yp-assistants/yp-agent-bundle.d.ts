import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpAgentBundle extends YpBaseElementWithLogin {
    domainId: number;
    subRoute?: string;
    loggedInChecked: boolean;
    static get styles(): any[];
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    temporaryAccessIds: string[];
    temporaryAccessIdsOld: string[];
    _loggedIn(event: CustomEvent): void;
    renderLogo(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-bundle.d.ts.map