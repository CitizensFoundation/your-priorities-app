import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import { YpEditBase } from '../common/yp-edit-base.js';
export declare class YpPostUserImageEdit extends YpEditBase {
    image: YpImageData | undefined;
    post: YpPostData | undefined;
    new: boolean;
    action: string;
    uploadedPostUserImageId: number | undefined;
    oldUploadedPostUserImageId: number | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
    _postChanged(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _imageChanged(): void;
    _formInvalid(): void;
    _imageUploaded(event: CustomEvent): void;
    clear(): void;
    setup(post: YpPostData, image: YpImageData | undefined, newNotEdit: boolean, refreshFunction: Function): void;
    setupTranslation(): void;
}
//# sourceMappingURL=yp-post-user-image-edit.d.ts.map