import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/filled-text-field.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class PsAddConnectorDialog extends YpBaseElement {
    open: boolean;
    selectedAgentId: number | null;
    selectedInputOutputType: "input" | "output" | null;
    private activeConnectorClasses;
    private selectedConnectorClassId;
    private connectorName;
    private api;
    connectedCallback(): Promise<void>;
    fetchActiveConnectorClasses(): Promise<void>;
    disableScrim(event: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1>;
    private _handleNameInput;
    private _handleConnectorClassSelection;
    private _handleClose;
    private _handleAddConnector;
    static get styles(): any[];
}
//# sourceMappingURL=ps-add-connector-dialog.d.ts.map