import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
import "./yp-registration-questions.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpRegistrationQuestionsDialog extends YpBaseElement {
    registrationQuestionsGroup: YpGroupData | undefined;
    static get styles(): any[];
    logout(): void;
    render(): import("lit-html").TemplateResult<1>;
    _onEnter(event: KeyboardEvent): void;
    _questionsUpdated(): void;
    _validateAndSend(): Promise<boolean>;
    open(registrationQuestionsGroup: YpGroupData): Promise<void>;
    close(): void;
}
//# sourceMappingURL=yp-registration-questions-dialog.d.ts.map