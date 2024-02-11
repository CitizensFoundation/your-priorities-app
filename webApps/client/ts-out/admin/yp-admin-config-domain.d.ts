import { nothing } from "lit";
import "../yp-survey/yp-structured-question-edit.js";
import "../yp-file-upload/yp-file-upload.js";
import { YpAdminConfigBase } from "./yp-admin-config-base.js";
import "../yp-file-upload/yp-file-upload.js";
import "../yp-theme/yp-theme-selector.js";
import "../common/languages/yp-language-selector.js";
import "./yp-admin-communities.js";
export declare class YpAdminConfigDomain extends YpAdminConfigBase {
    appHomeScreenIconImageId: number | undefined;
    constructor();
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderHeader(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderHiddenInputs(): import("lit-html").TemplateResult<1>;
    _clear(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _setupTranslations(): void;
    _formResponse(event: CustomEvent): Promise<void>;
    _finishRedirect(domain: YpDomainData): void;
    setupConfigTabs(): YpConfigTabData[];
    _appHomeScreenIconImageUploaded(event: CustomEvent): void;
}
//# sourceMappingURL=yp-admin-config-domain.d.ts.map