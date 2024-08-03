import { nothing } from "lit";
import "@material/web/iconbutton/outlined-icon-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpPointActions extends YpBaseElement {
    point: YpPointData | undefined;
    hideNotHelpful: boolean;
    isUpVoted: boolean;
    allDisabled: boolean;
    hideSharing: boolean;
    configuration: YpGroupConfiguration | undefined;
    pointQualityValue: number | undefined;
    pointUrl: string | undefined;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get masterHideSharing(): boolean | undefined;
    _sharedContent(event: CustomEvent): void;
    _shareTap(event: CustomEvent): void;
    _onPointChanged(): void;
    _updateQualitiesFromSignal(): void;
    _updateQualities(): void;
    _qualityChanged(): void;
    _resetClasses(): void;
    _setPointQuality(value: number | undefined): void;
    generatePointQuality(value: number): Promise<void>;
    _pointQualityResponse(pointQualityResponse: YpPointQualityResponse): void;
    generatePointQualityFromLogin(value: number): void;
    pointHelpful(): void;
    pointNotHelpful(): void;
}
//# sourceMappingURL=yp-point-actions.d.ts.map