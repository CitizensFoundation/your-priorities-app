import '../reports/pl-list-report.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import { BrowserHistory } from '../../util/history.js';
export declare class PlausableCountriesMap extends PlausibleBaseElementWithState {
    countries: PlausibleCountryData[] | undefined;
    loading: boolean;
    darkTheme: boolean;
    history: BrowserHistory | undefined;
    map: any;
    defaultFill: string;
    constructor();
    connectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    getDataset(): {};
    updateCountries(): void;
    fetchCountries(): Promise<void>;
    resizeMap(): void;
    drawMap(): void;
    onClick(): void;
    geolocationDbNotice(): import("lit-html").TemplateResult<1> | null;
    renderBody(): import("lit-html").TemplateResult<1> | null;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-countries-map.d.ts.map