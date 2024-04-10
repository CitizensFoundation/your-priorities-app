import { PropertyValues } from 'lit';
import { YpBaseElement } from '../common/yp-base-element';
import '@tinymce/tinymce-webcomponent';
export declare class YpAdminHtmlEditor extends YpBaseElement {
    data: string;
    configuration: {
        content: string;
    };
    firstUpdated(_changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
    disconnectedCallback(): void;
}
//# sourceMappingURL=yp-admin-html-editor.d.ts.map