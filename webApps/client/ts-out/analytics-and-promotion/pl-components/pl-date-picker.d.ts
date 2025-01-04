import { nothing } from 'lit';
import 'lit-flatpickr';
import './pl-query-button.js';
import './pl-query-link.js';
import { LitFlatpickr } from 'lit-flatpickr';
import { BrowserHistory } from './util/history';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state';
export declare class PlausibleDatePicker extends PlausibleBaseElementWithState {
    history: BrowserHistory;
    dropdownNode: HTMLDivElement;
    calendar: LitFlatpickr;
    leadingText: string | undefined;
    mode: string;
    open: boolean;
    dayBeforeCreation: number | undefined;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    renderArrow(period: string, prevDate: string, nextDate: string): import("lit-html").TemplateResult<1>;
    datePickerArrows(): typeof nothing | import("lit-html").TemplateResult<1>;
    handleKeydown(e: KeyboardEvent): boolean;
    handleClick(e: MouseEvent): void;
    setCustomDate(dates: string[]): void;
    timeFrameText(): string;
    toggle(): void;
    close(): void;
    openCalendar(): Promise<void>;
    renderLink(period: string, text: string, opts?: any): import("lit-html").TemplateResult<1>;
    renderDropDownContent(): typeof nothing | import("lit-html").TemplateResult<1>;
    renderPicker(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-date-picker.d.ts.map