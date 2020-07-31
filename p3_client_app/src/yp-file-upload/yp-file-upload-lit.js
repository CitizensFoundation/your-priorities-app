/**
@license
Copyright (c) 2015 Winston Howes. All rights reserved.
This code may only be used under the MIT license found at https://github.com/winhowes/file-upload/blob/master/LICENSE
*/
/**
An element providing a solution to no problem in particular.

Example:

    <file-upload target="/path/to/destination"></file-upload>

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@material/mwc-button';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '../yp-app-globals/yp-app-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpFileUploadLit extends YpBaseElement {
  static get properties() {
    return {
        /**
       * `target` is the target url to upload the files to.
       * Additionally by adding "<name>" in your url, it will be replaced by
       * the file name.
       */
      target: {
        type: String,
        value: ""
      },

      uploadLimitSeconds: {
        type: Number,
        value: null
      },

      /**
       * `progressHidden` indicates whether or not the progress bar should be hidden.
       */
      progressHidden: {
        type: Boolean,
        value: false
      },

      /**
       * `droppable` indicates whether or not to allow file drop.
      */
      droppable: {
        type: Boolean,
        value: false
      },

      /**
       * `dropText` is the  text to display in the file drop area.
      */
      dropText: {
        type: String,
        value: "Drop Files Here"
      },

      /**
       * `multi` indicates whether or not to allow multiple files to be uploaded.
      */
      multi: {
        type: Boolean,
        value: false
      },

      /**
       * `files` is the list of files to be uploaded
      */
      files: {
        type: Array,
        value: function() {
            return [];
        }
      },

      /**
       * `method` is the http method to be used during upload
      */
      method: {
        type: String,
        value: "PUT"
      },

      /**
       * `raised` indicates whether or not the button should be raised
      */
      raised: {
        type: Boolean,
        value: false
      },

      /**
       * `noink` indicates that the button should not have an ink effect
      */
      noink: {
        type: Boolean,
        value: false
      },

      /**
       * `headers` is a key value map of header names and values
      */
      headers: {
        type: Object,
        value: {},
      },

      /**
       * `retryText` is the text for the tooltip to retry an upload
      */
      retryText: {
        type: String,
        value: 'Retry Upload'
      },

      /**
       * `removeText` is the text for the tooltip to remove an upload
      */
      removeText: {
          type: String,
          value: 'Remove'
      },

      /**
       * `successText` is the text for the tooltip of a successful upload
      */
      successText: {
          type: String,
          value: 'Success'
      },

      /**
       * `errorText` is the text to display for a failed upload
      */
      errorText: {
          type: String,
          value: 'Error uploading file...'
      },

      noDefaultCoverImage: {
        type: Boolean,
        value: false
      },

      /**
       * `_shownDropText` indicates whether or not the drop text should be shown
      */
      _shownDropText: {
        type: Boolean,
        value: false
      },

      videoUpload: {
        type: Boolean,
        value: false
      },

      audioUpload: {
        type: Boolean,
        value: false
      },

      currentVideoId: Number,

      currentAudioId: Number,

      transcodingJobId: Number,

      currentFile: {
        type: String,
        value: null,
        notify: true
      },

      isPollingForTranscoding: {
        type: Boolean,
        value: false
      },

      indeterminateProgress: {
        type: Boolean,
        value: false
      },

      uploadStatus: {
        type: String
      },

      accept: {
        type: String,
        value: "image/*"
      },

      group: {
        type: Object,
        value: null
      },

      capture: {
        type: Boolean,
        value: false
      },

      containerType: String,

      previewVideoUrl: {
        type: String,
        value: null
      },

      videoImages: {
        type: Array,
        value: null
      },

      selectedVideoCoverIndex: {
        type: Number,
        value: 0
      }
    }
  }

  static get styles() {
    return [
      css`

        .enabled {
          border: 1px dashed #555;
        }

        .hover {
          opacity: .7;
          border: 1px dashed #111;
        }

        #UploadBorder {
          vertical-align: middle;
          color: #555;
          padding: 8px;
          padding-right: 16px;
          max-height: 200px;
          overflow-y: auto;
          display: inline-block;
        }

        #dropArea {
          text-align: center;
        }

        mwc-button {
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
          opacity: .9;
        }

        .commands iron-icon:hover {
          opacity: 1;
        }

        [hidden] {
          display: none;
        }

        .error {
          color: #f40303;
          font-size: 11px;
          margin: 2px 0px -3px;
        }

        paper-progress {
          --paper-progress-active-color: #03a9f4;
        }

        paper-progress[error] {
          --paper-progress-active-color: #f40303;
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

       .previewFrame {
         max-height: 50px;
         max-width: 89px;
         height: 50px;
         width: 89px;
         cursor: pointer;
       }

       .videoImages {
         overflow-x: auto;
         width: 200px;
         max-height: 70px;
         height: 70px;
       }

       .videoPreviewContainer {
       }

       .selectedCover {
         border-top: 2px solid var(--accent-color);
         max-height: 50px;
         max-width: 89px;
         white-space: nowrap;
       }

       .coverImage {
         max-height: 50px;
         max-width: 89px;
         white-space: nowrap;
       }


       .limitInfo  {
         margin-top: 0;
         color: #656565;
         text-align: center;
         font-size: 14px;
       }

       mwc-button {
         min-width: 100px;
       }

       .mainPhotoCheckbox {
         margin-top: 4px;
         margin-bottom: 4px;
       }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical center-center mainContainer">
      <div class="layout vertical center-center">
        <div class="layout horizontal center-center">
          <mwc-button id="button" .icon="file-upload" class="blue" @click="${this._fileClick}">
            <slot></slot>
          </mwc-button>
          <paper-icon-button .ariaLabel="${this.t('deleteFile')}" class="removeButton layout self-start" .icon="delete" @click="${this.clear}" ?hidden="${!this.currentFile}"></paper-icon-button>
        </div>
        <div ?hidden="${!this.uploadLimitSeconds}" class="limitInfo layout horizontal center-center"><em ?hidden="${this.currentFile}">${this.uploadLimitSeconds} ${this.t('seconds')}</em></div>
      </div>
      <div id="UploadBorder">

        ${ this.files.map(item => html`
          <div class="file">
            <div class="name">
              <span>${this.uploadStatus}</span>
              <div class="commands">
                <iron-icon .icon="autorenew" .title="${this.retryText}" @click="${this._retryUpload}" ?hidden="${!this.item.error}"></iron-icon>
                <iron-icon .icon="cancel" .title="${this.removeText}" @click="${this._cancelUpload}" ?hidden="${this.item.complete}"></iron-icon>
                <iron-icon .icon="check-circle" .title="${this.successText}" ?hidden="${!this.item.complete}"></iron-icon>
              </div>
            </div>
            <div class="error" ?hidden="${!this.item.error}">${this.errorText}</div>
            <div ?hidden="${this.item.complete}">
              <paper-progress .value="${this.item.progress}" .indeterminate="${this.indeterminateProgress}" .error="${this.item.error}"></paper-progress>
            </div>
          </div>
        `)}

        ${this.videoImages ? html`
          <video ?hidden .controls class="previewVideo" url="${this.previewVideoUrl}"></video>
          <div class="layout horizontal videoImages videoPreviewContainer">
            <div .style="white-space: nowrap">

              ${ this.videoImages.map(image => html`
                <img .class="${this._classFromImageIndex(index)}" data-index="${this.index}" @tap="${this._selectVideoCover}" .sizing="cover" class="previewFrame" src="${this.image}">
              `)}

              <div class="layout horizontal mainPhotoCheckbox" ?hidden="${this.noDefaultCoverImage}">
                <paper-checkbox id="useMainPhotoId" on-tap="_selectVideoCoverMainPhoto">${this.t('useMainPhoto')}</paper-checkbox>
              </div>
            </div>
          </div>
        `: html``}

      </div>
      <yp-ajax ?hidden="" id="transcodePollingAjax" .method="PUT" @response="${this._transcodePollingResponse}"></yp-ajax>
      <yp-ajax ?hidden="" id="startTranscodeAjax" .method="POST" @response="${this._startTranscodeResponse}"></yp-ajax>
      <yp-ajax ?hidden="" id="getVideoMetaAjax" @response="${this._getVideoMetaResponse}"></yp-ajax>
      <yp-ajax ?hidden="" id="setVideoCoverAjax" .method="PUT"></yp-ajax>
    </div>
    <input .type="file" id="fileInput" .capture="${this.capture}" @change="${this._fileChange}" .accept="${this.accept}" ?hidden="" .multiple="${this.multi}">
    <!--<paper-toast id="toastSuccess" text="File uploaded successfully!"></paper-toast>
    <paper-toast id="toastFail" text="Error uploading file!"></paper-toast>-->
`
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

  _classFromImageIndex(index) {
    if (index == this.selectedVideoCoverIndex) {
      return 'selectedCover';
    } else {
      return "coverImage";
    }
  }

  /**
   * Clears the list of files
  */
  clear() {
    this.set("files", []);
    this._showDropText();
    this.uploadStatus = null;
    this.currentVideoId = null;
    this.currentAudioId = null;
    this.currentFile = null;
    this.transcodingJobId = null;
    this.indeterminateProgress = false;
    this.capture = false;
    this.previewVideoUrl = null;
    this.videoImages = null;
    this.isPollingForTranscoding = false;
    this.useMainPhotoForVideoCover = false;

    this.$$("#fileInput").value = null;
    if (this.videoUpload)
      this.fire("success", { detail: null, videoId: null });
    else if (this.audioUpload)
      this.fire("success", { detail: null, audioId: null });
  }

  connectedCallback() {
    super.connectedCallback()
      if (this.raised) {
        this.toggleAttribute("raised", true, this.$$("#button"));
      }
      if (this.noink) {
        this.toggleAttribute("noink", true, this.$$("#button"));
      }
      if (this.droppable) {
        this._showDropText();
        this.setupDrop();
      }
      if (this.videoUpload) {
        this.accept','video/*');
        this.capture', true);
      } else if (this.audioUpload) {
        this.accept','audio/*');
        this.capture', true);
      }

      if (!this.uploadLimitSeconds && (this.videoUpload || this.audioUpload)) {
        this.uploadLimitSeconds', 600);
      }
  }

  /**
   * A function to set up a drop area for drag-and-drop file uploads
  */
  setupDrop() {
    const uploadBorder = this.$$("#UploadBorder");
    this.toggleClass("enabled", true, uploadBorder);

    this.ondragover = function(e) {
      e.stopPropagation();
      this.toggleClass("hover", true, uploadBorder);
      return false;
    }

    this.ondragleave = function() {
      this.toggleClass("hover", false, uploadBorder);
      return false;
    }

    this.ondrop = function(event) {
      this.toggleClass("hover", false, uploadBorder);
      event.preventDefault();
      const length = event.dataTransfer.files.length;
      for (let i = 0; i < length; i++) {
        const file = event.dataTransfer.files[i];
        file.progress = 0;
        file.error = false;
        file.complete = false;
        this.push("files", file);
        this.uploadFile(file);
      }
    }
  }

  _hasRecorderApp() {
    const isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;
    const isEdge = /Edge/.test(navigator.userAgent);
    if (this.videoUpload) {
      if ((isIOs || isAndroid) && !isEdge) {
        return true;
      } else {
        return false;
      }
    } else if (this.audioUpload) {
      return false;
    } else {
      return true;
    }
  }

  _fileClick() {
    const isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;
    const rawChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    const chromeVersion = rawChrome ? parseInt(rawChrome[2], 10) : false;
    const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);
    const isEdge = /Edge/.test(navigator.userAgent);
    const isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (this._hasRecorderApp()) {
      this._openFileInput();
    }  else {
      if (!isEdge && ((isIOs && this.audioUpload) || isFirefox || (chromeVersion && !isSamsungBrowser))) {
        this._openMediaRecorder();
      } else {
        this._openFileInput();
      }
    }
  }

  _openFileInput() {
    const elem = this.$$("#fileInput");
    if (elem && document.createEvent) { // sanity check
      const evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
    }
  }

  _openMediaRecorder() {
    window.appGlobals.activity('open', 'mediaRecorder');
    dom(document).querySelector('yp-app').getMediaRecorderAsync(function (dialog) {
      dialog.open({ callbackFunction: this._dataFromMediaRecorder.bind(this),
                    videoRecording: this.videoUpload,
                    audioRecording: this.audioUpload,
                    uploadFileFunction: this._openFileInput.bind(this),
                    maxLength: this.uploadLimitSeconds });
    }.bind(this));
  }

  _dataFromMediaRecorder(file) {
    file.progress = 0;
    file.error = false;
    file.complete = false;
    this.push("files", file);
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
      this.push("files", file);
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
      this.splice("files", this.files.indexOf(file), 1);
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
    e.model.set("item.error", false);
    e.model.set("item.progress", 0);
    // The async helps give visual feedback of a retry occurring, even though it's less efficient.
    const self = this;
    this.async(function() {
      self.uploadFile(e.model.__data__.item);
    }, 50);
  }

  /**
   * Whether or not to display the drop text
  */
  _showDropText() {
    this.set("_shownDropText", (!this.files.length && this.droppable));
  }

  uploadFile(file) {
    if (this.videoUpload || this.audioUpload) {
      this.indeterminateProgress = true;
      this.currentFile = file;
      const ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';

      if (this.videoUpload) {
        window.appGlobals.activity('starting', 'videoUpload');
        this.uploadStatus = this.t("uploadingVideo");
        this.headers =  {"Content-Type": 'video/mp4'};
        if (this.group) {
          ajax.url = '/api/videos/'+this.group.id+'/createAndGetPreSignedUploadUrl';
        } else {
          ajax.url = '/api/videos/createAndGetPreSignedUploadUrlLoggedIn';
        }
      } else {
        window.appGlobals.activity('starting', 'audioUpload');
        this.uploadStatus = this.t("uploadingAudio");
        this.headers =  {"Content-Type": 'audio/mp4'};
        if (this.group) {
          ajax.url = '/api/audios/'+this.group.id+'/createAndGetPreSignedUploadUrl';
        } else {
          ajax.url = '/api/audios/createAndGetPreSignedUploadUrlLoggedIn';
        }
      }
      ajax.method = 'POST';
      ajax.body = {};
      ajax.addEventListener('response', function (event) {
        this.target = event.detail.response.presignedUrl;
        if (this.videoUpload)
          this.currentVideoId = event.detail.response.videoId;
        else
          this.currentAudioId = event.detail.response.audioId;
        this.method = "PUT";
        this.indeterminateProgress = false;
        this.reallyUploadFile(this.currentFile);
      }.bind(this));
      ajax.generateRequest();
    } else {
      window.appGlobals.activity('starting', 'imageUpload');
      this.uploadStatus = this.t("uploadingImage");
      this.reallyUploadFile(file);
    }
  }

  _checkTranscodingJob() {
    this.async(function () {
      this.$$("#transcodePollingAjax").generateRequest();
    }, 1000);
  }

  _getVideoMetaResponse(event, detail) {
    if (detail.response.previewVideoUrl && detail.response.videoImages) {
      this.previewVideoUrl = detail.response.previewVideoUrl;
      this.videoImages = detail.response.videoImages;
      this.uploadStatus = this.t('selectCoverImage');
    }
  }

  _getVideoMeta() {
    if (this.currentVideoId) {
      this.$$("#getVideoMetaAjax").url = "/api/videos/"+this.currentVideoId+"/formatsAndImages";
      this.$$("#getVideoMetaAjax").generateRequest();
    } else {
      console.error("_getVideoImages no video id");
    }
  }

  _selectVideoCover(event, detail) {
    const frameIndex = event.target.getAttribute('data-index');
    this.selectedVideoCoverIndex = frameIndex;
    this.$$("#setVideoCoverAjax").url ="/api/videos/"+this.currentVideoId+'/setVideoCover';
    this.$$("#setVideoCoverAjax").body = { frameIndex: frameIndex };
    this.$$("#setVideoCoverAjax").generateRequest();
    const videoImages = this.videoImages;
    this.videoImages = null;
    this.async(function () {
      this.videoImages = videoImages;
    });
    this.useMainPhotoForVideoCover = false);
  }

  _selectVideoCoverMainPhoto() {
    this.async(function () {
      if (this.$$("#useMainPhotoId") && this.$$("#useMainPhotoId").checked) {
        this.$.setVideoCoverAjax.url ="/api/videos/"+this.currentVideoId+'/setVideoCover';
        this.$.setVideoCoverAjax.body = { frameIndex: -2 };
        this.$.setVideoCoverAjax.generateRequest();
      }
    });
  }

  _transcodePollingResponse(event, detail) {
    const prefix = "files." + this.files.indexOf(this.currentFile);
    if (detail.response.status==="Complete") {
      this.set(prefix + ".complete", true);
      this.uploadStatus = this.t('uploadCompleted');
      if (this.videoUpload) {
        this.fire("success", { detail: detail, videoId: this.currentVideoId });
        this._getVideoMeta();
      } else
        this.fire("success", { detail: detail, audioId: this.currentAudioId });
      this.fire('file-upload-complete');
      window.appGlobals.activity('complete', 'mediaTranscoding');
    } else if (detail.error) {
      this.set(prefix + ".error", true);
      this.set(prefix + ".complete", false);
      this.set(prefix + ".progress", 100);
      this.updateStyles();
      this.fire("error", {xhr:event});
      this.fire('file-upload-complete');
      window.appGlobals.activity('error', 'mediaTranscoding');
    } else {
      this._checkTranscodingJob();
    }
  }

  _startTranscodeResponse(event, detail) {
    if (this.videoUpload)
      this.$$("#transcodePollingAjax").url = '/api/videos/'+this.currentVideoId+'/getTranscodingJobStatus';
    else
      this.$$("#transcodePollingAjax").url = '/api/audios/'+this.currentAudioId+'/getTranscodingJobStatus';
    this.$$("#transcodePollingAjax").body = { jobId: detail.response.transcodingJobId };
    this._checkTranscodingJob();
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

    let aspect;
    if (window.innerHeight>window.innerWidth) {
      aspect = "portrait";
    } else {
      aspect = "landscape";
    }

    this.fire('file-upload-starting');
    this._showDropText();
    const prefix = "files." + this.files.indexOf(file);
    const self = this;

    const formData = new FormData();
    formData.append("file", file, file.name);

    const xhr = file.xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(e) {
      const done = e.loaded, total = e.total;
      self.set(prefix + ".progress", Math.floor((done/total)*1000)/10);
    };

    const url = this.target.replace("<name>", file.name);
    xhr.open(this.method, url, true);
    for (key in this.headers) {
      if (this.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, this.headers[key]);
      }
    }


    xhr.onload = function(e) {
      if (xhr.status === 200) {
        if (this.videoUpload) {
          this.indeterminateProgress = true;
          this.uploadStatus = this.t("transcodingVideo");
          if (this.group) {
            this.$$("#startTranscodeAjax").url = '/api/videos/'+this.group.id+'/'+this.currentVideoId+'/startTranscoding';
          } else {
            this.$$("#startTranscodeAjax").url = '/api/videos/'+this.currentVideoId+'/startTranscodingLoggedIn';
          }
          let options;
          if (this.containerType==="posts") {
            options = {
              videoPostUploadLimitSec: this.group.configuration.videoPostUploadLimitSec
            }
          } else if (this.containerType==="points") {
            options = {
              videoPointUploadLimitSec: this.group.configuration.videoPointUploadLimitSec
            }
          } else {
            options = {}
          }

          options.aspect = aspect;

          this.$$("#startTranscodeAjax").body = options;
          this.$$("#startTranscodeAjax").generateRequest();
          window.appGlobals.activity('complete', 'videoUpload');
          window.appGlobals.activity('start', 'mediaTranscoding');
        } else if (this.audioUpload) {
          this.indeterminateProgress = true;
          this.uploadStatus = this.t("transcodingAudio");

          if (this.group) {
            this.$$("#startTranscodeAjax").url = '/api/audios/'+this.group.id+'/'+this.currentAudioId+'/startTranscoding';
          } else {
            this.$$("#startTranscodeAjax").url = '/api/audios/'+this.currentAudioId+'/startTranscodingLoggedIn';
          }

          let options;
          if (this.containerType==="posts") {
            options = {
              audioPostUploadLimitSec: this.group.configuration.audioPostUploadLimitSec
            }
          } else if (this.containerType==="points") {
            options = {
              audioPointUploadLimitSec: this.group.configuration.audioPointUploadLimitSec
            }
          } else {
            options = {}
          }
          this.$$("#startTranscodeAjax").body = options;
          this.$$("#startTranscodeAjax").generateRequest();
          window.appGlobals.activity('complete', 'audioUpload');
          window.appGlobals.activity('start', 'mediaTranscoding');
        } else {
          this.uploadStatus = this.t('uploadCompleted');
          self.fire('file-upload-complete');
          self.set(prefix + ".complete", true);
          self.fire("success", {xhr: xhr, videoId: this.currentVideoId });
          window.appGlobals.activity('complete', 'imageUpload');
        }
      } else {
        self.fire('file-upload-complete');
        self.set(prefix + ".error", true);
        self.set(prefix + ".complete", false);
        self.set(prefix + ".progress", 100);
        self.updateStyles();
        self.fire("error", {xhr:xhr});
        window.appGlobals.activity('error', 'mediaUpload');
      }
    }.bind(this);

    if (this.videoUpload || this.audioUpload) {
      xhr.send(file)
    } else {
      xhr.send(formData);
    }
  }
}

window.customElements.define('yp-file-upload-lit', YpFileUploadLit)
