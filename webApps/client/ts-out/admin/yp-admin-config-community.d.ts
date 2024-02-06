import { nothing } from "lit";
import "@material/web/radio/radio.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "../yp-survey/yp-structured-question-edit.js";
import { YpAdminConfigBase } from "./yp-admin-config-base.js";
import "../yp-theme/yp-theme-selector.js";
import "../yp-file-upload/yp-file-upload.js";
import "../common/languages/yp-language-selector.js";
export declare class YpAdminConfigCommunity extends YpAdminConfigBase {
    appHomeScreenIconImageId: number | undefined;
    hostnameExample: string | undefined;
    hasSamlLoginProvider: boolean;
    availableCommunityFolders: Array<YpCommunityData> | undefined;
    ssnLoginListDataId: number | undefined;
    ssnLoginListDataCount: number | undefined;
    inCommunityFolderId: number | undefined;
    signupTermsPageId: number | undefined;
    welcomePageId: number | undefined;
    status: string | undefined;
    communityAccess: YpCommunityAccessTypes;
    constructor();
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderHeader(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderHiddenAccessSettings(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderHiddenInputsNotActive(): import("lit-html").TemplateResult<1>;
    renderHiddenInputs(): import("lit-html").TemplateResult<1>;
    _hostnameChanged(): void;
    _clear(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    languageChanged(): void;
    _communityChanged(): void;
    _deleteSsnLoginList(): void;
    _ssnLoginListDataUploaded(event: CustomEvent): void;
    _getSsnListCount(): Promise<void>;
    _collectionIdChanged(): void;
    _checkCommunityFolders(community: YpCommunityData): Promise<void>;
    _setupTranslations(): void;
    _formResponse(event: CustomEvent): Promise<void>;
    _finishRedirect(community: YpCommunityData): void;
    _statusSelected(event: CustomEvent): void;
    get statusIndex(): number;
    get collectionStatusOptions(): {
        name: string;
        translatedName: string;
    }[];
    _accessRadioChanged(event: CustomEvent): void;
    private _getAccessTab;
    private _getBasicTab;
    _welcomePageSelected(event: CustomEvent): void;
    get welcomePageIndex(): number;
    _signupTermsPageSelected(event: CustomEvent): void;
    get signupTermsPageIndex(): number;
    _communityFolderSelected(event: CustomEvent): void;
    get communityFolderIndex(): number;
    _getLookAndFeelTab(): YpConfigTabData;
    _getWebAppTab(): {
        name: string;
        icon: string;
        items: ({
            text: string;
            type: string;
            maxLength: number;
            templateData?: undefined;
        } | {
            text: string;
            type: string;
            templateData: import("lit-html").TemplateResult<1>;
            maxLength?: undefined;
        })[];
    };
    _getSamlTab(): {
        name: string;
        icon: string;
        items: ({
            text: string;
            type: string;
            disabled: boolean;
            rows?: undefined;
            maxRows?: undefined;
            maxLength?: undefined;
            templateData?: undefined;
        } | {
            text: string;
            type: string;
            rows: number;
            maxRows: number;
            maxLength: number;
            disabled?: undefined;
            templateData?: undefined;
        } | {
            text: string;
            type: string;
            templateData: import("lit-html").TemplateResult<1>;
            disabled?: undefined;
            rows?: undefined;
            maxRows?: undefined;
            maxLength?: undefined;
        })[];
    };
    setupConfigTabs(): YpConfigTabData[];
    _appHomeScreenIconImageUploaded(event: CustomEvent): void;
}
//# sourceMappingURL=yp-admin-config-community.d.ts.map