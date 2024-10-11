import { YpCollection } from "./yp-collection.js";
import { nothing } from "lit";
import "./yp-domain-header.js";
export declare class YpDomain extends YpCollection {
    customWelcomeHtml: string | undefined;
    useEvenOddItemLayout: boolean;
    constructor();
    static get styles(): (any[] | import("lit").CSSResult)[];
    refresh(): Promise<void>;
    scrollToCommunityItem(): void;
    scrollToCollectionItemSubClass(): void;
    _forgotPassword(): void;
    renderHeader(): typeof nothing | import("lit-html").TemplateResult<1>;
    renderDomainLogin(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-domain.d.ts.map