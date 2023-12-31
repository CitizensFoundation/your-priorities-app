/**
@license
Copyright (c) 2015 Winston Howes. All rights reserved.
Copyright (c) 2016-2021 Citizens Foundation.
This code may only be used under the MIT license found at https://github.com/winhowes/file-upload/blob/master/LICENSE
*/
/**
An element providing a solution to no problem in particular.

Example:

    <file-upload target="/path/to/destination"></file-upload>
*/
import "@material/web/progress/linear-progress.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/outlined-button.js";
import "../common/yp-emoji-selector.js";
import "./yp-set-video-cover.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpFileUpload extends YpBaseElement {
    /**
     * `target` is the target url to upload the files to.
     * Additionally by adding "<name>" in your url, it will be replaced by
     * the file name.
     */
    target: string;
    uploadLimitSeconds: number | undefined;
    /**
     * `progressHidden` indicates whether or not the progress bar should be hidden.
     */
    progressHidden: boolean;
    /**
     * `droppable` indicates whether or not to allow file drop.
     */
    droppable: boolean;
    /**
     * `dropText` is the  text to display in the file drop area.
     */
    dropText: string;
    /**
     * `multi` indicates whether or not to allow multiple files to be uploaded.
     */
    multi: boolean;
    /**
     * `files` is the list of files to be uploaded
     */
    files: Array<YpUploadFileData>;
    /**
     * `method` is the http method to be used during upload
     */
    method: string;
    /**
     * `raised` indicates whether or not the button should be raised
     */
    raised: boolean;
    subText: string | undefined;
    /**
     * `noink` indicates that the button should not have an ink effect
     */
    noink: boolean;
    useIconButton: boolean;
    /**
     * `headers` is a key value map of header names and values
     */
    headers: Record<string, string>;
    /**
     * `retryText` is the text for the tooltip to retry an upload
     */
    retryText: string;
    /**
     * `removeText` is the text for the tooltip to remove an upload
     */
    removeText: string;
    /**
     * `successText` is the text for the tooltip of a successful upload
     */
    successText: string;
    /**
     * `errorText` is the text to display for a failed upload
     */
    errorText: string;
    noDefaultCoverImage: boolean;
    /**
     * `shownDropText` indicates whether or not the drop text should be shown
     */
    shownDropText: boolean;
    videoUpload: boolean;
    audioUpload: boolean;
    attachmentUpload: boolean;
    currentVideoId: number | undefined;
    currentAudioId: number | undefined;
    transcodingJobId: number | undefined;
    transcodingComplete: boolean;
    currentFile: YpUploadFileData | undefined;
    isPollingForTranscoding: boolean;
    indeterminateProgress: boolean;
    uploadStatus: string | undefined;
    accept: string;
    group: YpGroupData | undefined;
    capture: boolean;
    hideStatus: boolean;
    containerType: string | undefined;
    selectedVideoCoverIndex: number;
    videoAspect: string | undefined;
    useMainPhotoForVideoCover: boolean;
    buttonText: string;
    buttonIcon: string;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    /**
     * Fired when a response is received status code 200.
     *
     * @event success
     */
    /**
     * Fired when a response is received other status code.
     *
     * @event error
     */
    /**
     * Fired when a file is about to be uploaded.
     *
     * @event before-upload
     */
    /**
     * Clears the list of files
     */
    clear(): void;
    connectedCallback(): void;
    /**
     * A function to set up a drop area for drag-and-drop file uploads
     */
    setupDrop(): void;
    _hasRecorderApp(): boolean;
    _fileClick(): void;
    _openFileInput(aspect?: string | undefined): void;
    _openMediaRecorder(): void;
    _dataFromMediaRecorder(file: YpUploadFileData): void;
    /**
     * Called whenever the list of selected files changes
     */
    _fileChange(e: {
        target: {
            files: Array<YpUploadFileData>;
        };
    }): void;
    /**
     * Cancels the file upload for a specific file
     *
     * @param {object} a file, an element of the files array
     */
    cancel(file: YpUploadFileData): void;
    /**
     * Cancels the file upload
     *
     * @param {object}, an event object
     */
    _cancelUpload(e: {
        model: {
            __data__: {
                item: YpUploadFileData;
            };
        };
    }): void;
    /**
     * Retries to upload the file
     *
     * @param {object}, an event object
     */
    _retryUpload(e: {
        model: {
            item: YpUploadFileData;
            __data__: {
                item: any;
            };
        };
    }): void;
    /**
     * Whether or not to display the drop text
     */
    _showDropText(): void;
    uploadFile(file: YpUploadFileData): Promise<void>;
    _checkTranscodingJob(jobId: string): void;
    _setVideoCover(event: CustomEvent): void;
    _setDefaultImageAsVideoCover(event: CustomEvent): void;
    /**
     * Really uploads a file
     *
     * @param {object} a file, an element of the files array
     */
    reallyUploadFile(file: YpUploadFileData): void;
}
//# sourceMappingURL=yp-file-upload.d.ts.map