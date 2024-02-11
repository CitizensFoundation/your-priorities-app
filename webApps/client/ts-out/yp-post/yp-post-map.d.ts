/// <reference path="../../src/types.d.ts" />
import { nothing } from 'lit';
import { YpBaseElement } from '../common/yp-base-element.js';
import 'lit-google-map';
import './yp-post-card.js';
export declare class YpPostMap extends YpBaseElement {
    posts: Array<YpPostData> | undefined;
    groupId: number | undefined;
    communityId: number | undefined;
    noPosts: boolean;
    selectedPost: YpPostData | undefined;
    collectionId: number;
    collectionType: string;
    skipFitToMarkersNext: boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    renderInfoCard(post: YpPostData): typeof nothing | import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    resetMapHeight(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _groupChanged(): Promise<void>;
    _communityChanged(): Promise<void>;
    _refreshAjax(): void;
    _response(response: Array<YpPostData>): void;
    markerClick(post: YpPostData): void;
}
//# sourceMappingURL=yp-post-map.d.ts.map