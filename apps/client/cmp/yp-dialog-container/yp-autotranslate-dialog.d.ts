import { YpBaseElement } from '../common/yp-base-element.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '../yp-app/yp-language-selector.js';
export declare class YpAutoTranslateDialog extends YpBaseElement {
    confirmationText: string | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _no(): void;
    _dontAskAgain(): void;
    _startAutoTranslateAndDoSoAlways(): void;
    _startAutoTranslate(): void;
    openLaterIfAutoTranslationEnabled(): void;
}
//# sourceMappingURL=yp-autotranslate-dialog.d.ts.map