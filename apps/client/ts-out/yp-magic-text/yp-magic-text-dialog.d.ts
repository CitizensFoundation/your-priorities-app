import { YpMagicText } from './yp-magic-text.js';
import '@material/web/dialog/dialog.js';
export declare class YpMagicTextDialog extends YpMagicText {
    static get styles(): (any[] | import("lit").CSSResult)[];
    render(): import("lit-html").TemplateResult<1>;
    subClassProcessing(): void;
    open(content: string, contentId: number, extraId: number, textType: string, contentLanguage: string, closeDialogText: string, structuredQuestionsConfig: string, skipSanitize?: boolean, disableTranslation?: boolean): void;
}
//# sourceMappingURL=yp-magic-text-dialog.d.ts.map