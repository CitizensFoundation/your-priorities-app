/// <reference path="../../src/types.d.ts" />
import { nothing } from 'lit';
import '@material/web/button/outlined-button.js';
import '@material/web/progress/circular-progress.js';
import 'lit-google-map';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpPostLocation extends YpBaseElement {
    map: YpLitGoogleMapElement | undefined;
    group: YpGroupData | undefined;
    post: YpPostData | undefined;
    defaultLatitude: number;
    defaultLongitude: number;
    mapSearchString: string;
    mapSearchResultAddress: string;
    location: YpLocationData | undefined;
    encodedLocation: string | undefined;
    marker: HTMLElement | undefined;
    active: boolean;
    narrowPad: boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    _mapZoomChanged(event: CustomEvent): void;
    get mapZoom(): number;
    _submitOnEnter(event: KeyboardEvent): void;
    _searchMap(): void;
    connectedCallback(): void;
    _zoomChanged(event: CustomEvent): void;
    _mapTypeChanged(event: CustomEvent): void;
    _locationChanged(): void;
    _setLocation(event: CustomEvent): void;
    _groupChanged(): void;
    _postChanged(): void;
}
//# sourceMappingURL=yp-post-location.d.ts.map