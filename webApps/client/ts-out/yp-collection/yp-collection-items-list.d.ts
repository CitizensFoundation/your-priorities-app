import { nothing, TemplateResult } from "lit";
import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-collection-item-card.js";
export declare class YpCollectionItemsList extends YpBaseElement {
    collection: YpCollectionData | undefined;
    collectionItems: Array<YpCollectionData> | undefined;
    collectionItemType: string;
    sortedCollectionItems: Array<YpCollectionData> | undefined;
    grid: boolean;
    useEvenOddItemLayout: boolean;
    resetListSize: Function | undefined;
    skipIronListWidth: boolean;
    static get styles(): any[];
    render(): typeof nothing | TemplateResult<1>;
    renderItem(item: YpCollectionData, index: number): TemplateResult;
    get pluralItemType(): "groups" | "posts" | "communities" | "unknownItemType";
    _keypress(event: KeyboardEvent): void;
    refresh(): Promise<void>;
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    _selectedItemChanged(event: CustomEvent): void;
    scrollToItem(item: YpDatabaseItem | undefined): void;
}
//# sourceMappingURL=yp-collection-items-list.d.ts.map