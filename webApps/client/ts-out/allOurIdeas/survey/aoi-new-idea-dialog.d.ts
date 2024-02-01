import { YpBaseElement } from '../../common/yp-base-element.js';
import '@material/web/dialog/dialog.js';
import { MdDialog } from '@material/web/dialog/dialog.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/textfield/filled-text-field.js';
export declare class AoiNewIdeaDialog extends YpBaseElement {
    earl: AoiEarlData;
    groupId: number;
    question: AoiQuestionData;
    submitting: boolean;
    currentError: string | undefined;
    ideaText: HTMLInputElement;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    submit(): Promise<void>;
    dialog: MdDialog;
    scrollUp(): void;
    open(): void;
    cancel(): void;
    textAreaKeyDown(e: KeyboardEvent): boolean;
    static get styles(): any[];
    renderContent(): import("lit-html").TemplateResult<1>;
    renderFooter(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-new-idea-dialog.d.ts.map