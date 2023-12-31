import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';
export declare class YpUserDeleteOrAnonymize extends YpBaseElement {
    spinnerActive: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _deleteUser(): void;
    _deleteUserFinalWarning(): void;
    _anonymizeUser(): void;
    _anonymizeUserFinalWarning(): void;
    _deleteUserForReal(): Promise<void>;
    _anonymizeUserForReal(): Promise<void>;
    open(): void;
    _completed(): void;
}
//# sourceMappingURL=yp-user-delete-or-anonymize.d.ts.map