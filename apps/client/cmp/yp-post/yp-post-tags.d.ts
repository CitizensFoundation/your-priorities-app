import { YpBaseElement } from '../common/yp-base-element.js';
import '../yp-magic-text/yp-magic-text.js';
import '@material/web/icon/icon.js';
export declare class YpPostTags extends YpBaseElement {
    post: YpPostData;
    translatedTags: string | undefined;
    autoTranslate: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _trimmedItem(item: string): string;
    _autoTranslateEvent(event: CustomEvent): void;
    computeSpanHidden(items: Array<string>, index: number): boolean;
    _newTranslation(): void;
    get postTags(): string[];
}
//# sourceMappingURL=yp-post-tags.d.ts.map