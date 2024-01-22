import "@material/web/icon/icon.js";
import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class AcNotificationListPoint extends YpBaseElement {
    notification: AcNotificationData | undefined;
    helpfulsText: string | undefined;
    unhelpfulsText: string | undefined;
    newPointMode: boolean | undefined;
    qualityMode: boolean | undefined;
    point: YpPointData | undefined;
    pointContent: string | undefined;
    user: YpUserData | undefined;
    post: YpPostData | undefined;
    postName: string | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get postNameTruncated(): string;
    get pointValueUp(): boolean | undefined;
    goToPost(): void;
    _notificationChanged(): void;
    _createQualityStrings(): void;
    _addWithComma(text: string, toAdd: string): string;
}
//# sourceMappingURL=ac-notification-list-point.d.ts.map