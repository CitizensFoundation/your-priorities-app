import { nothing } from 'lit';
import './ac-activity-point.js';
import './ac-activity-post.js';
import './ac-activity-point-news-story.js';
import './ac-activity-post-status-update.js';
import '../yp-user/yp-user-with-organization.js';
import '@material/web/button/outlined-button.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
export declare class AcActivity extends YpBaseElementWithLogin {
    activity: AcActivityData | undefined;
    domainId: number | undefined;
    communityId: number | undefined;
    groupId: number | undefined;
    postId: number | undefined;
    postGroupId: number | undefined;
    userId: number | undefined;
    static get styles(): any[];
    renderActivity(): import("lit-html").TemplateResult<1> | typeof nothing;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    fromTime(timeValue: string): any;
    fromLongTime(timeValue: string): any;
    get hasActivityAccess(): boolean;
    _deleteActivity(): void;
    _isNotActivityType(activity: AcActivityData, type: string): boolean;
    _isActivityType(activity: AcActivityData, type: string): boolean;
}
//# sourceMappingURL=ac-activity.d.ts.map