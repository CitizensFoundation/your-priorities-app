import { YpCollectionHeader } from "./yp-collection-header.js";
export declare class YpGroupHeader extends YpCollectionHeader {
    collection: YpGroupData | undefined;
    static get styles(): (any[] | import("lit").CSSResult)[];
    get groupTypeName(): string;
    get isGroupFolder(): boolean | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-group-header.d.ts.map