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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/outlined-button.js";
//import '../yp-post/yp-posts-list.js';
import "../common/yp-emoji-selector.js";
//import '../yp-post/yp-post-card-add.js';
import "./yp-set-video-cover.js";
import { YpBaseElement } from "../common/yp-base-element.js";
//import { YpMediaRecorder } from '../yp-media-recorder/yp-media-recorder.js';
let YpFileUpload = class YpFileUpload extends YpBaseElement {
    constructor() {
        super(...arguments);
        /**
         * `target` is the target url to upload the files to.
         * Additionally by adding "<name>" in your url, it will be replaced by
         * the file name.
         */
        this.target = "";
        /**
         * `progressHidden` indicates whether or not the progress bar should be hidden.
         */
        this.progressHidden = false;
        /**
         * `droppable` indicates whether or not to allow file drop.
         */
        this.droppable = false;
        /**
         * `dropText` is the  text to display in the file drop area.
         */
        this.dropText = "";
        /**
         * `multi` indicates whether or not to allow multiple files to be uploaded.
         */
        this.multi = false;
        /**
         * `files` is the list of files to be uploaded
         */
        this.files = [];
        /**
         * `method` is the http method to be used during upload
         */
        this.method = "PUT";
        /**
         * `raised` indicates whether or not the button should be raised
         */
        this.raised = false;
        /**
         * `noink` indicates that the button should not have an ink effect
         */
        this.noink = false;
        this.useIconButton = false;
        /**
         * `headers` is a key value map of header names and values
         */
        this.headers = {};
        /**
         * `retryText` is the text for the tooltip to retry an upload
         */
        this.retryText = "Retry Upload";
        /**
         * `removeText` is the text for the tooltip to remove an upload
         */
        this.removeText = "Remove";
        /**
         * `successText` is the text for the tooltip of a successful upload
         */
        this.successText = "Success";
        /**
         * `errorText` is the text to display for a failed upload
         */
        this.errorText = "Error uploading file...";
        this.noDefaultCoverImage = false;
        /**
         * `shownDropText` indicates whether or not the drop text should be shown
         */
        this.shownDropText = false;
        this.videoUpload = false;
        this.audioUpload = false;
        this.attachmentUpload = false;
        this.transcodingComplete = false;
        this.isPollingForTranscoding = false;
        this.indeterminateProgress = false;
        this.accept = "image/*";
        this.capture = false;
        this.hideStatus = false;
        this.selectedVideoCoverIndex = 0;
        this.useMainPhotoForVideoCover = false;
        this.buttonText = "";
        this.buttonIcon = "file_upload";
    }
    static get styles() {
        return [
            super.styles,
            css `
        .enabled {
          border: 1px dashed #555;
        }

        .hover {
          opacity: 0.7;
          border: 1px dashed #111;
        }

        #UploadBorder {
          vertical-align: middle;
          padding: 8px;
          padding-right: 16px;
          max-height: 200px;
          overflow-y: auto;
          display: inline-block;
        }

        #dropArea {
          text-align: center;
        }

        md-outlined-button {
          margin-bottom: 8px;
        }

        .file {
          padding: 10px 0px;
        }

        .commands {
          float: right;
        }

        .commands iron-icon:not([icon="check-circle"]) {
          cursor: pointer;
          opacity: 0.9;
        }

        .commands iron-icon:hover {
          opacity: 1;
        }

        [hidden] {
          display: none;
        }

        .error {
          color: var(--md-sys-color-error);
          font-size: 11px;
          margin: 2px 0px -3px;
        }

        [hidden] {
          display: none !important;
        }
        ::slotted(iron-icon) {
          padding-right: 6px;
        }

        .mainContainer {
          width: 100%;
        }

        .removeButton {
          margin-bottom: 18px;
        }

        .limitInfo {
          margin-top: 0;
          text-align: center;
          font-size: 14px;
        }

        md-outlined-button {
          min-width: 100px;
        }

        .subText {
          font-size: 12px;
          font-style: italic;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical center-center mainContainer">
        <div class="layout vertical center-center">
          <div class="layout horizontal center-center">
            ${this.useIconButton
            ? html `
                  <md-filled-icon-button
                    id="button"
                    class="blue"
                    @click="${this._fileClick}"
                    ><md-icon
                      >${this.buttonIcon}</md-icon
                    ></md-filled-icon-button
                  >
                `
            : html `
                  <md-outlined-button
                    id="button"
                    class="blue"
                    trailing-icon
                    @click="${this._fileClick}"
                    ><md-icon slot="icon">${this.buttonIcon}</md-icon> ${this
                .buttonText}</md-outlined-button
                  >
                `}
            <md-outlined-icon-button
              .ariaLabel="${this.t("deleteFile")}"
              class="removeButton layout self-start"
              @click="${this.clear}"
              ?hidden="${!this.currentFile}"
              ><md-icon>delete</md-icon></md-outlined-icon-button
            >
          </div>
          <div class="subText" ?hidden="${!this.subText}">${this.subText}</div>
          <div
            ?hidden="${!this.uploadLimitSeconds || this.useIconButton}"
            class="limitInfo layout horizontal center-center"
          >
            <em ?hidden="${this.currentFile != null}"
              >${this.uploadLimitSeconds} ${this.t("seconds")}</em
            >
          </div>
        </div>
        <div id="UploadBorder" ?hidden="${this.hideStatus}">
          ${this.files.map((item) => html `
              <div class="file">
                <div class="name">
                  <span>${this.uploadStatus}</span>
                  <div class="commands">
                    <md-icon
                      .title="${this.retryText}"
                      @click="${this._retryUpload}"
                      ?hidden="${!item.error}"
                      >autorenew</md-icon
                    >
                    <md-icon
                      .title="${this.removeText}"
                      @click="${this._cancelUpload}"
                      ?hidden="${item.complete}"
                      >cancel</md-icon
                    >
                    <md-icon
                      .title="${this.successText}"
                      ?hidden="${!item.complete}"
                      >check_circle</md-icon
                    >
                  </div>
                </div>
                <div class="error" ?hidden="${!item.error}">
                  ${this.errorText}
                </div>
                <div ?hidden="${item.complete}">
                  <md-linear-progress
                    .value="${item.progress}"
                    ?indeterminate="${this.indeterminateProgress}"
                    .error="${item.error}"
                  ></md-linear-progress>
                </div>
              </div>
            `)}
        </div>
        ${this.currentVideoId && this.transcodingComplete
            ? html `<yp-set-video-cover
              .noDefaultCoverImage="${this.noDefaultCoverImage}"
              .videoId="${this.currentVideoId}"
              @set-cover="${this._setVideoCover}"
              @set-default-cover="${this._setDefaultImageAsVideoCover}"
            ></yp-set-video-cover> `
            : nothing}
      </div>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}"
      />
    `;
    }
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
    clear() {
        this.files = [];
        this._showDropText();
        this.uploadStatus = undefined;
        this.currentVideoId = undefined;
        this.currentAudioId = undefined;
        this.currentFile = undefined;
        this.transcodingJobId = undefined;
        this.indeterminateProgress = false;
        this.transcodingComplete = false;
        this.capture = false;
        this.isPollingForTranscoding = false;
        this.useMainPhotoForVideoCover = false;
        const fileInput = this.$$("#fileInput");
        if (fileInput)
            fileInput.value = "";
        if (this.videoUpload)
            this.fire("success", { detail: null, videoId: null });
        else if (this.audioUpload)
            this.fire("success", { detail: null, audioId: null });
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.raised) {
            this.$$("#button")?.toggleAttribute("raised", true);
        }
        if (this.droppable) {
            this._showDropText();
            this.setupDrop();
        }
        if (this.videoUpload) {
            this.accept = "video/*";
            this.capture = true;
        }
        else if (this.audioUpload) {
            this.accept = "audio/*";
            this.capture = true;
        }
        if (!this.uploadLimitSeconds && (this.videoUpload || this.audioUpload)) {
            this.uploadLimitSeconds = 600;
        }
    }
    /**
     * A function to set up a drop area for drag-and-drop file uploads
     */
    setupDrop() {
        const uploadBorder = this.$$("#UploadBorder");
        //this.toggleClass('enabled', true, uploadBorder);
        this.ondragover = (e) => {
            e.stopPropagation();
            //this.toggleClass('hover', true, uploadBorder);
            return false;
        };
        this.ondragleave = () => {
            //this.toggleClass('hover', false, uploadBorder);
            return false;
        };
        this.ondrop = (event) => {
            //this.toggleClass('hover', false, uploadBorder);
            event.preventDefault();
            if (event.dataTransfer) {
                const length = event.dataTransfer.files.length;
                for (let i = 0; i < length; i++) {
                    const file = event.dataTransfer.files[i];
                    file.progress = 0;
                    file.error = false;
                    file.complete = false;
                    this.files.push(file);
                    this.uploadFile(file);
                }
            }
        };
    }
    _hasRecorderApp() {
        const isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;
        if (this.videoUpload) {
            if (isIOs || isAndroid) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.audioUpload) {
            return false;
        }
        else {
            return true;
        }
    }
    _fileClick() {
        const isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;
        const rawChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        const chromeVersion = rawChrome ? parseInt(rawChrome[2], 10) : false;
        const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);
        const isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (this._hasRecorderApp()) {
            this._openFileInput();
        }
        else {
            if ((isIOs && this.audioUpload) ||
                isFirefox ||
                (chromeVersion && !isSamsungBrowser)) {
                this._openMediaRecorder();
            }
            else {
                this._openFileInput();
            }
        }
    }
    _openFileInput(aspect = undefined) {
        if (aspect) {
            this.videoAspect = aspect;
        }
        const elem = this.$$("#fileInput");
        if (elem && document.createEvent) {
            // sanity check
            const evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, false);
            elem.dispatchEvent(evt);
        }
    }
    _openMediaRecorder() {
        window.appGlobals.activity("open", "mediaRecorder");
        window.appDialogs.getMediaRecorderAsync((dialog /*YpMediaRecorder*/) => {
            dialog.open({
                callbackFunction: this._dataFromMediaRecorder.bind(this),
                videoRecording: this.videoUpload,
                audioRecording: this.audioUpload,
                uploadFileFunction: this._openFileInput.bind(this),
                maxLength: this.uploadLimitSeconds || 600,
            });
        });
    }
    _dataFromMediaRecorder(file) {
        file.progress = 0;
        file.error = false;
        file.complete = false;
        this.files.push(file);
        this.uploadFile(file);
    }
    /**
     * Called whenever the list of selected files changes
     */
    _fileChange(e) {
        const length = e.target.files.length;
        for (let i = 0; i < length; i++) {
            const file = e.target.files[i];
            file.progress = 0;
            file.error = false;
            file.complete = false;
            this.files.push(file);
            this.uploadFile(file);
        }
    }
    /**
     * Cancels the file upload for a specific file
     *
     * @param {object} a file, an element of the files array
     */
    cancel(file) {
        if (file && file.xhr) {
            file.xhr.abort();
            this.files.splice(this.files.indexOf(file), 1);
            this._showDropText();
        }
    }
    /**
     * Cancels the file upload
     *
     * @param {object}, an event object
     */
    _cancelUpload(e) {
        this.cancel(e.model.__data__.item);
    }
    /**
     * Retries to upload the file
     *
     * @param {object}, an event object
     */
    _retryUpload(e) {
        e.model.item.error = false;
        e.model.item.progress = 0;
        // The async helps give visual feedback of a retry occurring, even though it's less efficient.
        setTimeout(() => {
            this.uploadFile(e.model.__data__.item);
        }, 50);
    }
    /**
     * Whether or not to display the drop text
     */
    _showDropText() {
        this.shownDropText = !this.files.length && this.droppable;
    }
    async uploadFile(file) {
        if (this.videoUpload || this.audioUpload || this.attachmentUpload) {
            this.indeterminateProgress = true;
            this.currentFile = file;
            let mediaUrl;
            let ajaxBody = {};
            if (this.videoUpload) {
                window.appGlobals.activity("starting", "videoUpload");
                this.uploadStatus = this.t("uploadingVideo");
                this.headers = { "Content-Type": "video/mp4" };
                if (this.group) {
                    mediaUrl =
                        "/api/videos/" + this.group.id + "/createAndGetPreSignedUploadUrl";
                }
                else {
                    mediaUrl = "/api/videos/createAndGetPreSignedUploadUrlLoggedIn";
                }
            }
            else if (this.audioUpload) {
                window.appGlobals.activity("starting", "audioUpload");
                this.uploadStatus = this.t("uploadingAudio");
                this.headers = { "Content-Type": "audio/mp4" };
                if (this.group) {
                    mediaUrl =
                        "/api/audios/" + this.group.id + "/createAndGetPreSignedUploadUrl";
                }
                else {
                    mediaUrl = "/api/audios/createAndGetPreSignedUploadUrlLoggedIn";
                }
            }
            else if (this.attachmentUpload) {
                window.appGlobals.activity("starting", "attachmentUpload");
                this.uploadStatus = this.t("attachmentUpload");
                if (this.group) {
                    ajaxBody = {
                        filename: file.name,
                        contentType: file.type,
                    };
                    mediaUrl =
                        "/api/groups/" + this.group.id + "/getPresignedAttachmentURL";
                }
                else {
                    console.error("No group for attachment upload");
                    return;
                }
            }
            const response = await window.serverApi.createPresignUrl(mediaUrl, ajaxBody);
            this.target = response.presignedUrl;
            if (this.videoUpload)
                this.currentVideoId = response.videoId;
            else
                this.currentAudioId = response.audioId;
            this.method = "PUT";
            this.indeterminateProgress = false;
            this.reallyUploadFile(this.currentFile);
        }
        else {
            window.appGlobals.activity("starting", "imageUpload");
            this.uploadStatus = this.t("uploadingImage");
            this.reallyUploadFile(file);
        }
    }
    _checkTranscodingJob(jobId) {
        setTimeout(async () => {
            let mediaType, mediaId;
            if (this.videoUpload) {
                mediaType = "videos";
                mediaId = this.currentVideoId;
            }
            else {
                mediaType = "audios";
                mediaId = this.currentAudioId;
            }
            if (mediaId) {
                const detail = await window.serverApi.getTranscodingJobStatus(mediaType, mediaId, jobId);
                if (this.currentFile) {
                    const fileIndex = this.files.indexOf(this.currentFile);
                    if (detail.status === "Complete") {
                        this.files[fileIndex].complete = true;
                        this.uploadStatus = this.t("uploadCompleted");
                        this.transcodingComplete = true;
                        if (this.videoUpload) {
                            this.fire("success", {
                                detail: detail,
                                videoId: this.currentVideoId,
                            });
                            this.uploadStatus = this.t("selectCoverImage");
                        }
                        else
                            this.fire("success", {
                                detail: detail,
                                audioId: this.currentAudioId,
                            });
                        this.fire("file-upload-complete");
                        window.appGlobals.activity("complete", "mediaTranscoding");
                    }
                    else if (detail.error) {
                        this.files[fileIndex].error = true;
                        this.files[fileIndex].complete = false;
                        this.files[fileIndex].progress = 100;
                        this.requestUpdate();
                        this.fire("error", { xhr: event });
                        this.fire("file-upload-complete");
                        window.appGlobals.activity("error", "mediaTranscoding");
                    }
                    else {
                        this._checkTranscodingJob(jobId);
                    }
                }
                else {
                    console.error("Trying to process non file");
                }
            }
            else {
                console.error("No media edit for transcoding check");
            }
        }, 1000);
    }
    _setVideoCover(event) {
        this.selectedVideoCoverIndex = event.detail;
    }
    _setDefaultImageAsVideoCover(event) {
        this.useMainPhotoForVideoCover = event.detail;
    }
    /**
     * Really uploads a file
     *
     * @param {object} a file, an element of the files array
     */
    reallyUploadFile(file) {
        if (!file) {
            return;
        }
        let aspect = this.videoAspect;
        if (!aspect) {
            if (window.innerHeight > window.innerWidth) {
                aspect = "portrait";
            }
            else {
                aspect = "landscape";
            }
        }
        this.fire("file-upload-starting");
        this._showDropText();
        const fileIndex = this.files.indexOf(file);
        const xhr = (file.xhr = new XMLHttpRequest());
        xhr.upload.onprogress = (e) => {
            const done = e.loaded, total = e.total;
            this.files[fileIndex].progress = Math.floor((done / total) * 1000) / 10;
        };
        const url = this.target.replace("<name>", file.name);
        xhr.open(this.method, url, true);
        for (const key in this.headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, this.headers[key]);
            }
        }
        xhr.onload = async () => {
            if (xhr.status === 200) {
                if (this.videoUpload && this.currentVideoId) {
                    this.indeterminateProgress = true;
                    this.uploadStatus = this.t("transcodingVideo");
                    let startType;
                    if (this.group) {
                        startType = "startTranscoding";
                    }
                    else {
                        startType = "startTranscodingLoggedIn";
                    }
                    let options;
                    if (this.containerType === "posts" && this.group) {
                        options = {
                            videoPostUploadLimitSec: this.group.configuration.videoPostUploadLimitSec,
                            aspect: "",
                        };
                    }
                    else if (this.containerType === "points" && this.group) {
                        options = {
                            videoPointUploadLimitSec: this.group.configuration.videoPointUploadLimitSec,
                            aspect: "",
                        };
                    }
                    else {
                        options = {};
                    }
                    options.aspect = aspect;
                    const response = (await window.serverApi.startTranscoding("videos", this.currentVideoId, startType, options));
                    this._checkTranscodingJob(response.transcodingJobId);
                    window.appGlobals.activity("complete", "videoUpload");
                    window.appGlobals.activity("start", "mediaTranscoding");
                }
                else if (this.audioUpload && this.currentAudioId) {
                    this.indeterminateProgress = true;
                    this.uploadStatus = this.t("transcodingAudio");
                    let startType;
                    if (this.group) {
                        startType = "startTranscoding";
                    }
                    else {
                        startType = "startTranscodingLoggedIn";
                    }
                    let options;
                    if (this.containerType === "posts" && this.group) {
                        options = {
                            audioPostUploadLimitSec: this.group.configuration.audioPostUploadLimitSec,
                        };
                    }
                    else if (this.containerType === "points" && this.group) {
                        options = {
                            audioPointUploadLimitSec: this.group.configuration.audioPointUploadLimitSec,
                        };
                    }
                    else {
                        options = {};
                    }
                    const response = (await window.serverApi.startTranscoding("audios", this.currentAudioId, startType, options));
                    this._checkTranscodingJob(response.transcodingJobId);
                    window.appGlobals.activity("complete", "audioUpload");
                    window.appGlobals.activity("start", "mediaTranscoding");
                }
                else if (this.attachmentUpload) {
                    this.uploadStatus = this.t("uploadCompleted");
                    this.fire("file-upload-complete");
                    this.files[fileIndex].complete = true;
                    this.fire("success", { xhr: xhr, filename: file.name });
                    window.appGlobals.activity("complete", "attachmentUpload");
                }
                else {
                    this.uploadStatus = this.t("uploadCompleted");
                    this.fire("file-upload-complete");
                    this.files[fileIndex].complete = true;
                    this.fire("success", { xhr: xhr, videoId: this.currentVideoId });
                    window.appGlobals.activity("complete", "imageUpload");
                }
            }
            else {
                this.fire("file-upload-complete");
                this.files[fileIndex].error = true;
                this.files[fileIndex].complete = false;
                this.files[fileIndex].progress = 100;
                this.requestUpdate();
                this.fire("error", { xhr: xhr });
                window.appGlobals.activity("error", "mediaUpload");
            }
        };
        if (this.videoUpload || this.audioUpload || this.attachmentUpload) {
            xhr.send(file);
        }
        else {
            const formData = new FormData();
            formData.append("file", file, file.name);
            xhr.send(formData);
        }
    }
};
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "target", void 0);
__decorate([
    property({ type: Number })
], YpFileUpload.prototype, "uploadLimitSeconds", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "progressHidden", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "droppable", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "dropText", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "multi", void 0);
__decorate([
    property({ type: Array })
], YpFileUpload.prototype, "files", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "method", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "raised", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "subText", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "noink", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "useIconButton", void 0);
__decorate([
    property({ type: Object })
], YpFileUpload.prototype, "headers", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "retryText", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "removeText", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "successText", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "errorText", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "noDefaultCoverImage", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "shownDropText", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "videoUpload", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "audioUpload", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "attachmentUpload", void 0);
__decorate([
    property({ type: Number })
], YpFileUpload.prototype, "currentVideoId", void 0);
__decorate([
    property({ type: Number })
], YpFileUpload.prototype, "currentAudioId", void 0);
__decorate([
    property({ type: Number })
], YpFileUpload.prototype, "transcodingJobId", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "transcodingComplete", void 0);
__decorate([
    property({ type: Object })
], YpFileUpload.prototype, "currentFile", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "isPollingForTranscoding", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "indeterminateProgress", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "uploadStatus", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "accept", void 0);
__decorate([
    property({ type: Object })
], YpFileUpload.prototype, "group", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "capture", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "hideStatus", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "containerType", void 0);
__decorate([
    property({ type: Number })
], YpFileUpload.prototype, "selectedVideoCoverIndex", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "videoAspect", void 0);
__decorate([
    property({ type: Boolean })
], YpFileUpload.prototype, "useMainPhotoForVideoCover", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "buttonText", void 0);
__decorate([
    property({ type: String })
], YpFileUpload.prototype, "buttonIcon", void 0);
YpFileUpload = __decorate([
    customElement("yp-file-upload")
], YpFileUpload);
export { YpFileUpload };
//# sourceMappingURL=yp-file-upload.js.map