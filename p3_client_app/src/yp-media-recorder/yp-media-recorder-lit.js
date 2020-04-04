/*
<script src="./rtc-adapter.js"></script>
<script src="./RecordRTC.js"></script>
<script src="./wavesurfer.js"></script>
<script src="./wavesurfer.mic.js"></script>
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'lite-signal/lite-signal.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpMediaRecorderLit extends YpBaseElement {
  static get properties() {
    return {
      recorder: {
        type: Object,
        value: null
      },

      mediaStream: Object,

      audioRecording: {
        type: Boolean,
        value: false
      },

      videoRecording: {
        type: Boolean,
        value: false
      },

      maxLength: {
        type: Number,
        value: 5
      },

      recordedData: {
        type: Object,
        value: null
      },

      recordingFinished: {
        type: Boolean,
        value: false
      },

      callbackFunction: {
        type: Function,
        value: null
      },

      error: {
        type: String,
        value: null
      },

      recordSecondsLeft: Number,

      isRecording: {
        type: Boolean,
        value: false
      },

      rememberDevice: {
        type: Boolean,
        value: false
      },

      audioDevices: Array,

      videoDevices: Array,

      allDevices: Array,

      captureCallback: Function,

      uploadFileFunction: Function,

      captureStream: Object,

      previewActive: {
        type: Boolean,
        value: false
      },

      videoOptions: Object,

      selectDeviceTitle: String,

      selectDeviceFunction: {
        type: Function,
        value: null
      },

      surfer: {
        type: Object,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      video {

      }

      paper-dialog {
        background-color: #FFF;
      }

      #dialog[audio-recording] {
        width: 430px;
      }

      .mainbuttons {
        width: 100%;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .horizontal {

      }

      .center-center {

      }

      .flex {

      }

      .recording {
        color: #f00;
        animation-name: pulse;
        animation-duration: 1.3s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      .recordingTime {
        color: #f00;
        animation-name: pulse;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      @keyframes pulse {
        from { opacity: 1; }
        to { opacity: 0.5; }
      }

      .buttonText {
        margin-left: 6px;
      }

      .actionButton {
        color: var(--accent-color);
      }

      .iconButtons {
        margin-top: 2px;
      }

      #secondsLeft {
        margin-top: 12px;
        margin-left: 4px;
        margin-right: 4px;
      }

      .mainContainer {
        padding: 0 24px;
      }

      @media (max-width: 640px) {
        #dialog {
          padding: 0;
          margin: 0;
        }
        .mainContainer {
          padding: 0 0;
        }

        .mainbuttons {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: rgba(240,240,240,0.5);
        }

        #dialog {
          min-height: 242px;
          min-width: 320px;
          width: 100%;
        }
      }

      @media (max-width: 360px) {
        .uploadFileText {
          display: none;
        }
      }

      .rememberBox {
        margin-top: 8px;
      }

      #checkBox {
        margin-left: 6px;
      }

      .header {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
      }

      .uploadFileButton {
        color: #888;
      }

      #waveform {
        height: 128px;
      }
  `, YpFlexLayout]

  }

  render() {
    return html`
    <paper-dialog id="selectDevices" .modal>
      <h2>${this.selectDeviceTitle}</h2>
      <paper-dialog-scrollable>
        <paper-listbox id="deviceListBox">

          ${ this.allDevices.map(item => html`
            <paper-item @tap="${this.selectDeviceFunction}" id="${this.item.deviceId}">${this.item.label}</paper-item>
          `)}

        </paper-listbox>
        <div class="layout horizontal rememberBox">
          <div>
            ${this.t('rememberDevice')}
          </div>
          <input id="checkBox" .type="checkbox">
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>

    <paper-dialog id="noDevices">
      <h2>${this.t('noDevicesFound')}</h2>
      <div class="button layout horizontal center-center">
        <paper-button dialog-dismiss="" raised>${this.t('ok')}</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog" .modal ?audioRecording="${audioRecording}">
      <div class="layout vertical no-padding mainContainer">

        ${this.videoRecording ? html`
          <video id="videoRecorder" class="videoRecorder" ?hidden="${this.previewActive}"></video>
          <video id="videoPreviewer" .preload="auto" class="videoRecorder" ?hidden="${!this.previewActive}"></video>
        `: html``}

        ${this.audioRecording ? html`
          <div class="layout vertical center-center">
            <div class="layout horizontal center-center header">${this.t('voiceRecorder')}</div>
            <div id="waveform" ?hidden="${this.recordedData}"></div>
            <audio id="audioRecorder" class="audioRecorder" ?hidden=""></audio>
            <audio id="audioPreviewer" .controls="" .preload="auto" class="audioRecorder" ?hidden="${!this.previewActive}"></audio>
          </div>
        `: html``}

        <div class="layout horizontal mainbuttons" ?hidden="${!this.recorder}">
          <paper-icon-button ariaLabel="${this.t('closeRecordingWindow')}" .icon="clear" class="iconButtons" @tap="${this._close}"></paper-icon-button>
          <paper-icon-button ariaLabel="${this.t('deleteRecordedMedia')}" .icon="delete" class="iconButtons" @tap="${this._deleteRecording}" ?hidden="${!this.recordedData}"></paper-icon-button>
          <paper-button @tap="${this._startRecording}" ?hidden="${this.recordedData}">
            <iron-icon id="recordingIcon" .icon="fiber-manual-record"></iron-icon>
            <div class="buttonText">${this.t('record')}</div>
          </paper-button>
          <div id="secondsLeft" ?hidden="${this.recordedData}">${this.recordSecondsLeft} ${this.t('seconds')}</div>
          <paper-button @tap="${this._stopRecording}" ?hidden="${!this.isRecording}">
            <iron-icon icon="stop"></iron-icon>
            <div class="buttonText">${this.t('stop')}</div>
          </paper-button>
          <span ?hidden="${this.isRecording}">
            <paper-button id="uploadFileButton" class="uploadFileButton" @tap="${this._uploadFile}" ?hidden="${this.recordedData}">
              <iron-icon ?icon="file-upload"></iron-icon>
              <div class="buttonText uploadFileText">${this.t('uploadFile')}</div>
            </paper-button>
          </span>
          <paper-button @tap="${this._sendBack}" class="actionButton" ?hidden="${!this.recordedData}">
            <iron-icon .icon="send"></iron-icon>
            <div class="buttonText">${this.t('send')}</div>
          </paper-button>
        </div>
      </div>
      <div ?hidden="${!this.error}">
        ${this.error}
      </div>
    </paper-dialog>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-ajax id="getTranslationAjax" @response="${this._getTranslationResponse}"></iron-ajax>
`
  }

  _selectAudioDevice (event, detail) {
    if (event.target.id) {
      this.set('selectedAudioDeviceId', event.target.id);
    }

    if (this.$$("#checkBox").checked) {
      localStorage.setItem("selectedAudioDeviceId", this.selectedAudioDeviceId);
    }

    this.$.selectDevices.close();
    this._openMediaSession(this.captureCallback);
  }

  _selectVideoDevice (event) {
    if (event.target.id) {
      this.set('selectedVideoDeviceId', event.target.id);
    }

    if (this.$$("#checkBox").checked) {
      localStorage.setItem("selectedVideoDeviceId", this.selectedVideoDeviceId);
    }

    this.$.selectDevices.close();
    this._checkAudioDevices();
  }

  _checkAudioDevices () {
    if (this.audioDevices && this.audioDevices.length>1) {
      if (localStorage.getItem("selectedAudioDeviceId")) {
        this.set('selectedAudioDeviceId', localStorage.getItem("selectedAudioDeviceId"));
        this._openMediaSession(this.captureCallback);
      } else {
        this.set('selectDeviceTitle', this.t('selectAudioDevice'));
        this.$$("#checkBox").checked = false;
        this.selectDeviceFunction = this._selectAudioDevice.bind(this);
        this.set('allDevices', this.audioDevices);
        this.$$("#deviceListBox").selected = null;
        this.$.selectDevices.open();
      }
    } else {
      this._openMediaSession(this.captureCallback);
    }
  }

  _checkVideoDevices () {
    if (this.videoRecording && this.videoDevices && this.videoDevices.length>1) {
      if (localStorage.getItem("selectedVideoDeviceId")) {
        this.set('selectedVideoDeviceId', localStorage.getItem("selectedVideoDeviceId"));
        this._checkAudioDevices();
      } else {
        this.set('selectDeviceTitle', this.t('selectVideoDevice'));
        this.$$("#checkBox").checked = false;
        this.set('rememberDevice', false);
        this.selectDeviceFunction = this._selectVideoDevice.bind(this);
        this.set('allDevices', this.videoDevices);
        this.$$("#deviceListBox").selected = null;
        this.$.selectDevices.open();
      }
    } else {
      this._checkAudioDevices();
    }
  }

  _close () {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    if (this.surfer) {
      this.surfer.microphone.stop();
      this.surfer.destroy();
    }
    this.set('previewActive', false);
    this.$.dialog.close();
  }

  _uploadFile () {
    this._close();
    this.uploadFileFunction();
  }

  _sendBack () {
    if (this.callbackFunction && this.recorder) {
      this.callbackFunction(this.recordedData);
      this.recordedData = null;
      this.recorder.clearRecordedData();
      this.recorder.reset();
      this.recorder = null;
      this._close();
    } else {
      console.error("No callback function for media player");
    }
  }

  checkDevices (callback) {
    navigator.mediaDevices.enumerateDevices().then( function (devicesIn) {
      this.audioDevices =  devicesIn.filter(function (d) {
        return d.kind === 'audioinput'
      });

      this.videoDevices =  devicesIn.filter(function (d) {
        return d.kind === 'videoinput'
      });

      var hasLabels=false;

      this.videoDevices.forEach(function (device) {
        if (device.label && device.label!="") {
          hasLabels = true;
        }
      });

      if (!hasLabels) {
        this.videoDevices = null;
        this.audioDevices = null;
      }

      this._checkVideoDevices();
    }.bind(this));
  }

  captureUserMedia (callback) {
    this.captureCallback = callback;
    this.checkDevices();
  }

  _openMediaSession (callback) {
    if (this.selectedVideoDeviceId) {
      this.videoSettings.deviceId = this.selectedVideoDeviceId;
    }

    var constraints = {
      audio: this.selectedAudioDeviceId ? { deviceId: this.selectedAudioDeviceId } : true,
      video: this.videoRecording ? this.videoSettings : null
    };

    var isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;

    if (isFirefox) {
      navigator.getUserMedia(constraints, function (stream) {
        callback(stream);
      }, function(error) {
        console.error(error);
        //TODO: Fire user error
        callback(null);
      });
    } else {
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        stream.getTracks().forEach(function (track) {
          console.info(track.getCapabilities());
        });
        callback(stream);
      }).catch(function(error) {
        console.error(error);
        //TODO: Fire user error
        callback(null);
      });
    }
  }

  $$ (id) {
    return this.shadowRoot.querySelector(id)
  }

  open (options) {
    this.callbackFunction = options.callbackFunction;
    this.set('recordingFinished', false);
    this.set('error', null);
    this.set('audioRecording', false);
    this.set('videoRecording', false);
    if (options.videoRecording) {
      this.set('videoRecording', true);
    } else if (options.audioRecording) {
      this.set('audioRecording', true);
    }
    this.set('maxLength', options.maxLength);
    this.set('uploadFileFunction', options.uploadFileFunction);
    this.$$("#secondsLeft").className = "";

    setTimeout(function () {
      if (this.videoRecording) {
        var videoElement = this.shadowRoot.querySelector('#videoRecorder');
        var videoPreviewElement = this.shadowRoot.querySelector('#videoPreviewer');
        var width, height;

        if (window.innerHeight>window.innerWidth) {
          this.set('videoSettings', { width: 720, height: 1280 } );
          height = Math.min(1280, Math.abs(window.innerHeight)).toFixed();
          width = Math.min(720, Math.abs(height*0.5625)).toFixed();
          console.info("Portrait - width: "+width+" height: "+height+" video width: "+720+" height: 1280");
        } else {
          this.set('videoSettings', { width: 1280, height: 720 });
          var scaleFactor = 0.8;
          if (window.innerHeight<700)
            scaleFactor = 0.7;
          if (window.innerHeight<500)
            scaleFactor = 0.6;
          height = Math.min(720, Math.abs(window.innerHeight*scaleFactor)).toFixed();
          width = Math.min(1280, Math.abs(height*1.77777777778)).toFixed();
          console.info("Landscape - width: "+width+" height: "+height);
        }
        videoElement.style.height = height + 'px';
        videoElement.style.width = width + 'px';
        videoPreviewElement.style.height = (height*0.8).toFixed() + 'px';
        videoPreviewElement.style.width = (width*0.8).toFixed() + 'px';
        setTimeout(function () {
          this.$.dialog.open();
        }.bind(this));
      } else if (this.audioRecording) {
        setTimeout(function () {
          this.$.dialog.open();
        }.bind(this));
      }
    }.bind(this));

    setTimeout(function () {
      this.setupRecorders();
    }.bind(this), 20);
  }

  _generateRandomString () {
    if (window.crypto) {
      var a = window.crypto.getRandomValues(new Uint32Array(3)),
        token = '';
      for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
      return token;
    } else {
      return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
    }
  }

  _startRecording () {
    if (!this.isRecording) {
      this.recorder.startRecording();
      this.recordSecondsLeft = this.maxLength;
      this.set('isRecording', true);
      this.$$("#recordingIcon").className = "recording";
      this._recordingTimer();
    } else {
      this._stopRecording();
    }
  }

  _stopRecording () {
    this.$$("#recordingIcon").className = "";
    this.set('isRecording', false);
    this.recorder.stopRecording(this._storeRecordedData.bind(this));
    this.$$("#secondsLeft").className = "";
  }

  _deleteRecording () {
    this.recorder.reset();
    this.set('previewActive', false);
    this.set('recordedData',  null);
    this.recordSecondsLeft = this.maxLength;
    this.$$("#secondsLeft").className = "";
    this.$$("#recordingIcon").className = "";
  }

  _storeRecordedData () {
    var blob = this.recorder.getBlob();
    var fileName;

    if (this.videoRecording) {
      var videoElement = this.shadowRoot.querySelector('#videoRecorder');
      var videoPreviewer = this.shadowRoot.querySelector('#videoPreviewer');
      fileName = this._generateRandomString() + '.webm';
      this.recordedData = new File([blob], fileName, {
        type: 'video/webm'
      });
      videoElement.controls = true;
      this.recorder.reset();
      videoPreviewer.src = window.URL.createObjectURL(this.recordedData);
      videoPreviewer.controls = true;
      this.set('previewActive', true);
    } else if (this.audioRecording) {
      var audioElement = this.shadowRoot.querySelector('#audioRecorder');
      var audioPreviewer = this.shadowRoot.querySelector('#audioPreviewer');
      fileName = this._generateRandomString() + '.mp3';
      this.recordedData = new File([blob], fileName, {
        type: 'audio/mp3'
      });
      audioElement.controls = true;
      audioElement.pause();
      audioPreviewer.src = window.URL.createObjectURL(this.recordedData);
      audioPreviewer.controls = true;
      this.set('previewActive', true);
    }
  }

  _recordingTimer () {
    if (this.isRecording) {
      setTimeout(function () {
        if (this.isRecording) {
          if (this.recordSecondsLeft>0) {
            this._recordingTimer();
          } else {
            this._stopRecording();
          }
          if (this.recordSecondsLeft>0)
            this.recordSecondsLeft -= 1;
          if (this.recordSecondsLeft<=5) {
            this.$$("#secondsLeft").className = "recordingTime";
          }
        }
      }.bind(this), 1000);
    } else {
      console.error("_recordingTimer called without in recording mode");
    }
  }

  setupRecorders () {
    this.recordSecondsLeft = this.maxLength;
    if (this.videoRecording) {
      var videoElement = this.shadowRoot.querySelector('#videoRecorder');

      this.captureUserMedia(function(stream) {
        if (stream) {
          this.mediaStream = stream;
          try {
            videoElement.srcObject = stream;
          } catch (error) {
            console.error(error);
            videoElement.src = window.URL.createObjectURL(stream);
          }
          videoElement.play();
          videoElement.muted = true;
          videoElement.controls = false;

          this.recorder = RecordRTC(stream, {
            type: 'video'
          });
        } else {
          console.error("Can't find stream");
          this.$.noDevices.open();
          this.$$("#uploadFileButton").style.color = "#F00";
        }
      }.bind(this));

    } else if (this.audioRecording) {
      var audioElement = this.shadowRoot.querySelector('#audioRecorder');

      this.captureUserMedia(function(stream) {
        if (stream) {
          this.mediaStream = stream;
          try {
            audioElement.srcObject = stream;
          } catch (error) {
            console.error(error);
            audioElement.src = window.URL.createObjectURL(stream);
          }
          audioElement.play();
          audioElement.muted = true;
          audioElement.controls = false;
          this.surfer = WaveSurfer.create({
            container: this.$$("#waveform"),
            waveColor: '#ff3d00',
            progressColor: '#ff3d00',
            cursorWidth: 0,
            plugins: [
              WaveSurfer.microphone.create({ stream: this.mediaStream })
            ]
          });

          this.surfer.microphone.play();

          this.recorder = RecordRTC(stream, {
            type: 'audio'
          });
        } else {
          console.error("Can't find stream");
          this.$.noDevices.open();
          this.$$("#uploadFileButton").style.color = "#F00";
        }
      }.bind(this));

    }
    setTimeout(function () {
      this.$.dialog.center();
    }.bind(this));
  }

  ready () {
    if (window.i18nTranslation) {
      this.set('language', window.locale);
    }
    super.ready();
  }

  _languageEvent (event, detail) {
    if (detail.type === 'language-loaded') {
      this.set('language', detail.language);
    }
  }
}

window.customElements.define('yp-media-recorder-lit', YpMediaRecorderLit)
