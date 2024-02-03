import "@material/web/textfield/outlined-text-field.js";
import "vanilla-colorful";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpThemeColorInput extends YpBaseElement {
    color: string | undefined;
    label: string;
    disableSelection: boolean | undefined;
    private isColorPickerActive;
    static get styles(): any[];
    isValidHex(color: string | undefined): boolean;
    handleColorInput(event: CustomEvent): void;
    openPalette(): void;
    handleOutsideClick: (event: MouseEvent) => void;
    closePalette(): void;
    disconnectedCallback(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleColorChanged(event: CustomEvent): void;
    clearColor(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-theme-color-input.d.ts.map