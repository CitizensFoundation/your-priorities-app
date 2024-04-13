import { YpCollection } from "./yp-collection.js";
export declare class YpDomain extends YpCollection {
    customWelcomeHtml: string | undefined;
    constructor();
    refresh(): Promise<void>;
    scrollToCommunityItem(): void;
    scrollToCollectionItemSubClass(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-domain.d.ts.map