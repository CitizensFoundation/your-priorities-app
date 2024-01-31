import { nothing } from 'lit';
import '../reports/pl-list-report.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausableDevices extends PlausibleBaseElementWithState {
    tabKey: string;
    storedTab: string | undefined;
    mode: string | undefined;
    connectedCallback(): void;
    setMode(mode: string): void;
    renderBrowsers(): import("lit-html").TemplateResult<1>;
    renderBrowserVersions(): import("lit-html").TemplateResult<1>;
    renderOperatingSystems(): import("lit-html").TemplateResult<1>;
    renderOperatingSystemVersions(): import("lit-html").TemplateResult<1>;
    renderScreenSizes(): import("lit-html").TemplateResult<1>;
    iconFor(screenSize: string): typeof nothing | import("lit-html").TemplateResult<1>;
    renderContent(): import("lit-html").TemplateResult<1>;
    renderPill(name: string, mode: string): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-devices.d.ts.map