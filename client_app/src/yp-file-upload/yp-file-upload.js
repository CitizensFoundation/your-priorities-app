import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-progress/paper-progress.js';
import '../yp-app-globals/yp-app-icons.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

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
Polymer({
  _template: `
     <style type="text/css">
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

        paper-button {
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
         padding-right: 4px;
       }
      </style>

    <div>
      <paper-button id="button" icon="file-upload" class="blue" on-click="_fileClick">
        <slot></slot>
      </paper-button>
      <div id="UploadBorder">
        <div id="dropArea" hidden\$="{{!_shownDropText}}">{{dropText}}</div>
        <template is="dom-repeat" items="{{files}}">
          <div class="file">
            <div class="name">
              <span>{{item.name}}</span>
              <div class="commands">
                <iron-icon icon="autorenew" title="{{retryText}}" on-click="_retryUpload" hidden\$="{{!item.error}}"></iron-icon>
                <iron-icon icon="cancel" title="{{removeText}}" on-click="_cancelUpload" hidden\$="{{item.complete}}"></iron-icon>
                <iron-icon icon="check-circle" title="{{successText}}" hidden\$="{{!item.complete}}"></iron-icon>
              </div>
            </div>
            <div class="error" hidden\$="{{!item.error}}">{{errorText}}</div>
            <div hidden\$="{{item.complete}}">
              <paper-progress value\$="{{item.progress}}" indeterminate="" error\$="{{item.error}}"></paper-progress>
            </div>
          </div>
        </template>
      </div>
    </div>
    <input type="file" id="fileInput" on-change="_fileChange" hidden="" multiple="{{multi}}">
    <!--<paper-toast id="toastSuccess" text="File uploaded successfully!"></paper-toast>
    <paper-toast id="toastFail" text="Error uploading file!"></paper-toast>-->
`,

  is: 'yp-file-upload',

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

  properties: {

    /**
     * `target` is the target url to upload the files to.
     * Additionally by adding "<name>" in your url, it will be replaced by
     * the file name.
     */
    target: {
      type: String,
      value: ""
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

    /**
     * `_shownDropText` indicates whether or not the drop text should be shown
    */
    _shownDropText: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Clears the list of files
  */
  clear: function() {
    this.set("files", []);
    this._showDropText();
  },

  ready: function() {
    if (this.raised) {
      this.toggleAttribute("raised", true, this.$.button);
    }
    if (this.noink) {
      this.toggleAttribute("noink", true, this.$.button);
    }
    if (this.droppable) {
      this._showDropText();
      this.setupDrop();
    }
  },

  /**
   * A function to set up a drop area for drag-and-drop file uploads
  */
  setupDrop: function() {
    var uploadBorder = this.$.UploadBorder;
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
      var length = event.dataTransfer.files.length;
      for (var i = 0; i < length; i++) {
        var file = event.dataTransfer.files[i];
        file.progress = 0;
        file.error = false;
        file.complete = false;
        this.push("files", file);
        this.uploadFile(file);
      }
    }
  },

  /**
   * Clicks the invisible file input
  */
  _fileClick: function() {
    var elem = this.$.fileInput;
    if (elem && document.createEvent) { // sanity check
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
    }
  },

  /**
   * Called whenever the list of selected files changes
  */
  _fileChange: function(e) {
    var length = e.target.files.length;
    for (var i = 0; i < length; i++) {
      var file = e.target.files[i];
      file.progress = 0;
      file.error = false;
      file.complete = false;
      this.push("files", file);
      this.uploadFile(file);
    }
  },

  /**
   * Cancels the file upload for a specific file
   *
   * @param {object} a file, an element of the files array
  */
  cancel: function(file) {
    if (file && file.xhr) {
      file.xhr.abort();
      this.splice("files", this.files.indexOf(file), 1);
      this._showDropText();
    }
  },

  /**
   * Cancels the file upload
   *
   * @param {object}, an event object
  */
  _cancelUpload: function(e) {
    this.cancel(e.model.__data__.item);
  },

  /**
   * Retries to upload the file
   *
   * @param {object}, an event object
  */
  _retryUpload: function(e) {
    e.model.set("item.error", false);
    e.model.set("item.progress", 0);
    // The async helps give visual feedback of a retry occurring, even though it's less efficient.
    var self = this;
    this.async(function() {
      self.uploadFile(e.model.__data__.item);
    }, 50);
  },

  /**
   * Whether or not to display the drop text
  */
  _showDropText: function() {
    this.set("_shownDropText", (!this.files.length && this.droppable));
  },

  /**
   * Uploads a file
   *
   * @param {object} a file, an element of the files array
  */
  uploadFile: function(file) {
    if (!file) {
      return;
    }
    this.fire('file-upload-starting');
    this._showDropText();
    var prefix = "files." + this.files.indexOf(file);
    var self = this;

    var formData = new FormData();
    formData.append("file", file, file.name);

    var xhr = file.xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(e) {
      var done = e.loaded, total = e.total;
      self.set(prefix + ".progress", Math.floor((done/total)*1000)/10);
    };

    var url = this.target.replace("<name>", file.name);
    xhr.open(this.method, url, true);
    for (key in this.headers) {
      if (this.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, this.headers[key]);
      }
    }
    xhr.onload = function(e) {
    self.fire('file-upload-complete');
      if (xhr.status === 200) {
        self.fire("success", {xhr: xhr});
        self.set(prefix + ".complete", true);
      } else {
        self.set(prefix + ".error", true);
        self.set(prefix + ".complete", false);
        self.set(prefix + ".progress", 100);
        self.updateStyles();
        self.fire("error", {xhr:xhr});
      }
    };
    xhr.send(formData);
  }
});
