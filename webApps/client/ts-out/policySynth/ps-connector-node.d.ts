import { nothing } from "lit";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
export declare class PsAgentConnector extends PsOperationsBaseNode {
    hasStaticTheme: boolean;
    connector: PsAgentConnectorAttributes;
    connectorId: number;
    groupId: number;
    agentName: string;
    internalLink: string | undefined;
    externalLink: string | undefined;
    openInternalLinkInNewTab: boolean;
    connectedCallback(): void;
    static get styles(): (any[] | import("lit").CSSResult)[];
    editNode(): void;
    toggleMenu(): void;
    renderImage(): import("lit-html").TemplateResult<1>;
    openInternalLink(): void;
    openExternalLink(): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ps-connector-node.d.ts.map