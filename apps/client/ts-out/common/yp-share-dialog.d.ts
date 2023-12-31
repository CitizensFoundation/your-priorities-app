import { YpBaseElement } from './yp-base-element.js';
export declare class YpShareDialog extends YpBaseElement {
    sharedContent: Function | undefined;
    url: string | undefined;
    label: string | undefined;
    render(): import("lit-html").TemplateResult<1>;
    open(url: string, label: string, sharedContent: Function): Promise<void>;
}
//# sourceMappingURL=yp-share-dialog.d.ts.map