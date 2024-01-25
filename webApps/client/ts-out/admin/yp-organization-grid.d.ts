import "@material/web/dialog/dialog.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/outlined-text-field.js";
import { YpBaseElement } from "../common/yp-base-element";
import "./yp-organization-edit.js";
export declare class YpOrganizationGrid extends YpBaseElement {
    organizations: Array<any> | undefined;
    headerText: string | undefined;
    domainId: string | undefined;
    selected: any | undefined;
    organizationToDeleteId: number | undefined;
    static get styles(): any[];
    constructor();
    connectedCallback(): Promise<void>;
    refresh(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    _deleteOrganization(organization: YpOrganizationData): void;
    _reallyDeleteOrganization(): Promise<void>;
    _afterEdit(): void;
    _createOrganization(): void;
    _editOrganization(organization: any): void;
    _organizationImageUrl(organization: any): string | null;
}
//# sourceMappingURL=yp-organization-grid.d.ts.map