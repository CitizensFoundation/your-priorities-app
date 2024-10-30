import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/radio/radio.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";
export declare class YpSubscriptions extends YpBaseElement {
    domainId: number;
    private loading;
    private error;
    private bundleGroups;
    private selectedFreeProductId;
    private selectedPaidProductIds;
    private processingPayment;
    private stripe;
    private elements;
    static get styles(): any[];
    constructor();
    initializeStripe(): Promise<void>;
    firstUpdated(): Promise<void>;
    private loadSubscriptionPlans;
    private processPlanData;
    private handleFreeProductSelect;
    private handlePaidProductSelect;
    private handleSubscribe;
    private handleFreeSubscription;
    private handlePaidSubscription;
    private renderBundleGroup;
    private renderProduct;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-subscriptions.d.ts.map