import { nothing } from 'lit';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-collection-stats.js';
export declare class YpCollectionItemCard extends YpBaseElement {
    item: YpCollectionData | undefined;
    itemType: string | undefined;
    collection: YpCollectionData | undefined;
    static get styles(): any[];
    get archived(): boolean;
    get featured(): boolean;
    connectedCallback(): void;
    goToItem(event: CustomEvent): void;
    _setupFontNameFontSize(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    renderLogoImage(): import("lit-html").TemplateResult<1>;
    renderDataViz(): import("lit-html").TemplateResult<1>;
    renderCardInfo(): import("lit-html").TemplateResult<1>;
    get statsCollection(): YpCollectionData;
    get statsCollectionType(): string;
    get contentDescription(): string | undefined;
    get contentName(): string;
    get contentId(): number;
    get contentLanguage(): string | undefined;
    get contentUrlBase(): string | undefined;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=yp-collection-item-card.d.ts.map