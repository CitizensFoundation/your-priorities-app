import { PropertyValues } from "lit";
import { YpBaseElement } from "../common/yp-base-element";
import "../yp-survey/yp-simple-html-editor.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/tabs.js";
import "@material/web/icon/icon.js";
import "@material/web/textfield/filled-text-field.js";
import "../common/yp-generate-ai-image.js";
export declare class YpAdminHtmlEditor extends YpBaseElement {
    content: string;
    media: Array<YpSimpleGroupMediaData>;
    selectedTab: number;
    mediaLoaded: {
        [key: number]: boolean;
    };
    generatingAiImageInBackground: boolean;
    group: YpGroupData;
    parentCollectionId: number | undefined;
    collectionId: number | string | undefined;
    hasVideoUpload: boolean;
    private debounceTimer?;
    _selectTab(event: CustomEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): any[];
    _generateLogo(event: CustomEvent): void;
    firstUpdated(_changedProperties: PropertyValues): void;
    renderAiImageGenerator(): import("lit-html").TemplateResult<1>;
    _setMediaLoaded(id: number, loaded: boolean): void;
    _logoImageUploaded(event: CustomEvent): void;
    _gotAiImage(event: CustomEvent): void;
    _videoUploaded(event: CustomEvent): void;
    _removeMedia(media: YpSimpleGroupMediaData): void;
    renderMedia(): import("lit-html").TemplateResult<1>;
    _insertMediaIntoHtml(media: YpSimpleGroupMediaData): void;
    renderImageUploadOptions(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    changed(event: CustomEvent): void;
    debouncedSave(): void;
}
//# sourceMappingURL=yp-admin-html-editor.d.ts.map