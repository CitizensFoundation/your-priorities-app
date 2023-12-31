import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
import '../yp-magic-text/yp-magic-text.js';
import '../yp-point/yp-point.js';
export declare class AcActivityPoint extends YpBaseElementWithLogin {
    activity: AcActivityData;
    postId: number | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _goToPoint(): void;
    get isUpVote(): boolean | undefined;
    get isDownVote(): boolean | undefined;
}
//# sourceMappingURL=ac-activity-point.d.ts.map