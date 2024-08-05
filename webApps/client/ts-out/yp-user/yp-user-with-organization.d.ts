import { YpBaseElement } from '../common/yp-base-element.js';
import './yp-user-image.js';
export declare class YpUserWithOrganization extends YpBaseElement {
    user: YpUserData;
    titleDate: Date | undefined;
    hideImage: boolean;
    mediumImage: boolean;
    inverted: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get userTitle(): string;
    get organizationName(): string | null;
    get organizationImageUrl(): any;
}
//# sourceMappingURL=yp-user-with-organization.d.ts.map