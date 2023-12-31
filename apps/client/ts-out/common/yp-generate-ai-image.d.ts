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
    name: string;
    description: string;
    collectionId: number;
    collectionType: string;
    jobId: number | undefined;
    styleText: HTMLInputElement;
    timeout: number | undefined;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    get finalPrompt(): string;
    pollForImage(): Promise<void>;
    submit(): Promise<void>;
    dialog: MdDialog;
    scrollUp(): void;
    open(name?: string | undefined, description?: string | undefined): void;
    cancel(): void;
    textAreaKeyDown(e: KeyboardEvent): false | undefined;
    static get styles(): any[];
    renderContent(): import("lit-html").TemplateResult<1>;
    renderFooter(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-generate-ai-image.d.ts.map