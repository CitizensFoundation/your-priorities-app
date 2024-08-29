import { nothing } from 'lit';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../yp-magic-text/yp-magic-text.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
export declare class YpPostCardAdd extends YpBaseElement {
    disableNewPosts: boolean;
    group: YpGroupData | undefined;
    index: number | undefined;
    private addNewText;
    private closedText;
    static get styles(): any[];
    connectedCallback(): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    _renderHiddenMagicTexts(): import("lit-html").TemplateResult<1>;
    _handleAddNewTextTranslation(e: CustomEvent): void;
    _handleClosedTextTranslation(e: CustomEvent): void;
    _keyDown(event: KeyboardEvent): void;
    _newPost(): void;
    _getAddNewText(): string;
    _getClosedText(): string;
}
//# sourceMappingURL=yp-post-card-add.d.ts.map