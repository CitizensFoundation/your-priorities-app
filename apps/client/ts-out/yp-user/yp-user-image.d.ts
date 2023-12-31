import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
export declare class YpUserImage extends YpBaseElement {
    veryLarge: boolean;
    large: boolean;
    titleFromUser: string | undefined;
    user: YpUserData;
    noDefault: boolean;
    noProfileImage: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get userTitle(): string;
    get profileImageUrl(): any;
    get computeClass(): "small rounded" | "large rounded-more" | "veryLarge rounded-even-more" | "medium rounded";
    get computeFacebookSrc(): string | undefined;
}
//# sourceMappingURL=yp-user-image.d.ts.map