import { TemplateResult } from 'lit';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/circular-progress.js';
import '../common/yp-emoji-selector.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpPostTranscript extends YpBaseElement {
    isEditing: boolean;
    editText: string | undefined;
    checkingTranscript: boolean;
    checkTranscriptError: boolean;
    post: YpPostData;
    static get styles(): any[];
    render(): TemplateResult<1>;
    _isEditingChanged(): void;
    _updateEmojiBindings(): void;
    _cancelEdit(): void;
    _saveEdit(): Promise<void>;
    _editPostTranscript(): void;
    _checkTranscriptStatus(): Promise<void>;
    get hasPostAccess(): boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _postChanged(): void;
}
//# sourceMappingURL=yp-post-transcript.d.ts.map