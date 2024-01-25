import { YpBaseElementWithLogin } from "../../common/yp-base-element-with-login";
import "@material/web/fab/fab.js";
import "@material/web/radio/radio.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/textfield/filled-text-field.js";
import "../../common/yp-image.js";
import "../../yp-file-upload/yp-file-upload-icon.js";
export declare class YpNewCampaign extends YpBaseElementWithLogin {
    collectionType: string;
    collectionId: number | string;
    collection: YpCollectionData | undefined;
    campaign: YpCampaignData | undefined;
    previewEnabled: boolean;
    uploadedImageUrl: string | undefined;
    targetAudience: string | undefined;
    campaignName: string | undefined;
    promotionText: string | undefined;
    static get styles(): any[];
    open(): void;
    getMediums(): string[];
    inputsChanged(): Promise<void>;
    save(): void;
    discard(): void;
    close(): void;
    cancel(): void;
    renderAdMediums(): import("lit-html").TemplateResult<1>;
    renderTextInputs(): import("lit-html").TemplateResult<1>;
    imageUploadCompleted(event: CustomEvent): void;
    get collectionImageUrl(): string | undefined;
    renderPreview(): import("lit-html").TemplateResult<1>;
    renderConfirmationDialog(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-new-campaign.d.ts.map