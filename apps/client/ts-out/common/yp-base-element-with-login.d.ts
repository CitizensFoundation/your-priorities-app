import { YpBaseElement } from './yp-base-element.js';
export declare class YpBaseElementWithLogin extends YpBaseElement {
    loggedInUser: YpUserData | undefined;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get isLoggedIn(): boolean;
    _loggedIn(event: CustomEvent): void;
}
//# sourceMappingURL=yp-base-element-with-login.d.ts.map