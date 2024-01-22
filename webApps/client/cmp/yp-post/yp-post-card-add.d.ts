import { nothing } from 'lit';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../yp-magic-text/yp-magic-text.js';
import "@material/web/icon/icon.js";
export declare class YpPostCardAdd extends YpBaseElement {
    disableNewPosts: boolean;
    group: YpGroupData | undefined;
    index: number | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    _keyDown(event: KeyboardEvent): void;
    _newPost(): void;
}
//# sourceMappingURL=yp-post-card-add.d.ts.map