import '../reports/pl-list-report.js';
import './pl-countries-map.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausableLocations extends PlausibleBaseElementWithState {
    tabKey: string;
    storedTab: string | undefined;
    mode: string | undefined;
    countriesRestoreMode: string | undefined;
    connectedCallback(): void;
    setMode(mode: string): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    onCountryFilter(mode: string): void;
    onRegionFilter(): void;
    renderCountries(): import("lit-html").TemplateResult<1>;
    renderRegions(): import("lit-html").TemplateResult<1>;
    renderCities(): import("lit-html").TemplateResult<1>;
    get labelFor(): {
        countries: string;
        regions: string;
        cities: string;
    };
    renderContent(): import("lit-html").TemplateResult<1>;
    renderPill(name: string, mode: string): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-locations.d.ts.map