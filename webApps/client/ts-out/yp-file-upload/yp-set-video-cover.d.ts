import { nothing } from 'lit';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/radio/radio.js';
import '../common/yp-emoji-selector.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpSetVideoCover extends YpBaseElement {
    videoId: number;
    previewVideoUrl: string | undefined;
    videoImages: Array<string> | undefined;
    selectedVideoCoverIndex: number;
    useMainPhotoForVideoCover: boolean;
    noDefaultCoverImage: boolean;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    _classFromImageIndex(index: number): "selectedCover" | "coverImage";
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _getVideoMeta(): Promise<void>;
    _selectVideoCover(event: CustomEvent): void;
    _selectVideoCoverMainPhoto(): void;
}
//# sourceMappingURL=yp-set-video-cover.d.ts.map