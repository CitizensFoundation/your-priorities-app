import "@material/web/textfield/outlined-text-field.js";
import "../yp-file-upload/yp-file-upload.js";
import "../yp-edit-dialog/yp-edit-dialog.js";
import { YpEditBase } from "../common/yp-edit-base.js";
export declare class YpOrganizationEdit extends YpEditBase {
    organization: YpOrganizationData | undefined;
    organizationAccess: string;
    domainId: number | undefined;
    action: string;
    uploadedLogoImageId: number | undefined;
    static get styles(): any[];
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    clear(): void;
    setup(organization: YpOrganizationData | undefined, newNotEdit: boolean, refreshFunction: Function): void;
    setupTranslation(): void;
}
//# sourceMappingURL=yp-organization-edit.d.ts.map