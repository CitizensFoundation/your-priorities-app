import { YpBaseElement } from './yp-base-element.js';
export declare abstract class YpEditBase extends YpBaseElement {
    new: boolean;
    editHeaderText: string | undefined;
    saveText: string | undefined;
    snackbarText: string | undefined;
    params: Record<string, string | boolean | number | object> | undefined;
    method: string;
    refreshFunction: Function | undefined;
    uploadedLogoImageId: number | undefined;
    imagePreviewUrl: string | undefined;
    uploadedHeaderImageId: number | undefined;
    uploadedDefaultDataImageId: number | undefined;
    uploadedDefaultPostImageId: number | undefined;
    customRedirect(unknown: YpDatabaseItem): void;
    setupAfterOpen(params?: YpEditFormParams): void;
    customFormResponse(event?: CustomEvent): void;
    abstract clear(): void;
    abstract setupTranslation(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _logoImageUploaded(event: CustomEvent): void;
    _headerImageUploaded(event: CustomEvent): void;
    _defaultDataImageUploaded(event: CustomEvent): void;
    _defaultPostImageUploaded(event: CustomEvent): void;
    _formResponse(event: CustomEvent): void;
    _setupNewUpdateState(): void;
    open(newItem: boolean, params: Record<string, string | boolean | number | object>): Promise<void>;
    close(): void;
}
//# sourceMappingURL=yp-edit-base.d.ts.map