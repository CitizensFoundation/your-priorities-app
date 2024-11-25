import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
export declare class YpUserImage extends YpBaseElement {
    veryLarge: boolean;
    large: boolean;
    medium: boolean;
    titleFromUser: string | undefined;
    user: YpUserData;
    noDefault: boolean;
    noProfileImage: boolean;
    useImageBorder: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get userTitle(): string;
    get profileImageUrl(): any;
    get computeClass(): "medium rounded" | "small rounded" | "large rounded-more" | "veryLarge rounded-even-more";
    get computeFacebookSrc(): string | undefined;
}
//# sourceMappingURL=yp-user-image.d.ts.map