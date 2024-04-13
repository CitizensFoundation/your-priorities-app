import { YpBaseElement } from "./yp-base-element.js";
import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
export declare class YpGenerateAiImage extends YpBaseElement {
    submitting: boolean;
    currentError: string | undefined;
    name: string | undefined;
    description: string | undefined;
    disableBackgroundGeneration: boolean;
    collectionId: number;
    collectionType: string;
    imageType: YpAiGenerateImageTypes;
    jobId: number | undefined;
    styleText: HTMLInputElement;
    timeout: number | undefined;
    resetGenerator(): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    get finalPrompt(): string;
    pollForImage(): Promise<void>;
    submit(): Promise<void>;
    dialog: MdDialog;
    scrollUp(): void;
    open(name?: string | undefined, description?: string | undefined): void;
    cancel(): void;
    moveToBackground(): void;
    textAreaKeyDown(e: KeyboardEvent): false | undefined;
    static get styles(): any[];
    renderContent(): import("lit-html").TemplateResult<1>;
    renderFooter(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-generate-ai-image.d.ts.map