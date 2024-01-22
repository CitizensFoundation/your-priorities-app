import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';
import '../yp-magic-text/yp-magic-text.js';
declare const AcActivityPost_base: (new (...args: any[]) => import("../yp-post/yp-post-base-with-answers.js").YpPostBaseWithAnswersInterface) & typeof AcActivityWithGroupBase;
export declare class AcActivityPost extends AcActivityPost_base {
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    _goToPost(): void;
    get isIE11(): boolean;
}
export {};
//# sourceMappingURL=ac-activity-post.d.ts.map