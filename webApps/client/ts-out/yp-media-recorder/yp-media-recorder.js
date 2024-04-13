var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/filled-button.js";
import "@material/web/radio/radio.js";
import * as RecordRTC from "recordrtc";
import * as WaveSurfer from "wavesurfer.js";
import * as RecorderPlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import "@material/web/dialog/dialog.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/radio/radio.js";
let YpMediaRecorder = class YpMediaRecorder extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.audioRecording = false;
        this.videoRecording = false;
        this.maxLength = 5;
        this.recordingFinished = false;
        this.isRecording = false;
        this.rememberDevice = false;
        this.previewActive = false;
        this.recordSecondsLeft = 0;
        this.videoAspect = "portrait";
        this.selectedCamera = "user";
        this.hasFacingMode = false;
        this.isMobile = false;
        this.selectedAudioDeviceId = null;
        this.selectedVideoDeviceId = null;
    }
    static get styles() {
        return [
            super.styles,
            css `
        #dialog[audio-recording] {
          width: 430px;
        }

        .checkboxContainer {
          margin-bottom: 16px;
          margin-top: 8px;
        }

        md-radio {
          margin-left: 4px;
        }

        .mainbuttons {
          width: 100%;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .videoAspectDescription {
          margin-top: 24px;
          margin-bottom: 12px;
          font-size: 14px;
        }

        label {
          padding: 8px;
          margin-bottom: 8px;
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
          from {
            opacity: 1;
          }
          to {
            opacity: 0.5;
          }
        }

        .buttonText {
          margin-left: 6px;
        }

        .actionButton {
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

        #waveform {
          height: 128px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    _closeMediaStream() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => {
                track.stop();
            });
            this.mediaStream = undefined;
        }
        if (this.surfer) {
            this.surfer.getActivePlugins()[0].stop();
            this.surfer.destroy();
            this.surfer = undefined;
        }
        this.previewActive = false;
    }
    _uploadFileThroughPhoneCamera() {
        // Close any open dialogs or media streams before starting the upload process
        this._close();
        // Assuming `uploadFileFunction` is a method passed via properties that handles the file upload,
        // and `videoAspect` is a property that determines the aspect ratio of the video to be uploaded.
        if (this.uploadFileFunction) {
            this.uploadFileFunction(this.videoAspect, true);
        }
        else {
            console.error("Upload file function is not defined");
        }
    }
    async _openRecorderDialog() {
        if (this.videoRecording && this.isMobile) {
            this._uploadFileThroughPhoneCamera();
        }
        else if (this.videoRecording) {
            const videoElement = this.shadowRoot.querySelector("#videoRecorder");
            const videoPreviewElement = this.shadowRoot.querySelector("#videoPreviewer");
            let width, height;
            if (window.innerHeight > window.innerWidth) {
                this.videoSettings = { width: 720, height: 1280 };
                height = Math.min(1280, Math.abs(window.innerHeight));
                width = Math.min(720, Math.abs(height * 0.5625));
                console.info(`Portrait - width: ${width} height: ${height} video width: 720 height: 1280`);
            }
            else {
                this.videoSettings = { width: 1280, height: 720 };
                let scaleFactor = 0.8;
                if (window.innerHeight < 700)
                    scaleFactor = 0.7;
                if (window.innerHeight < 500)
                    scaleFactor = 0.6;
                height = Math.min(720, Math.abs(window.innerHeight * scaleFactor));
                width = Math.min(1280, Math.abs(height * 1.77777777778));
                console.info(`Landscape - width: ${width} height: ${height}`);
            }
            videoElement.style.height = `${height}px`;
            videoElement.style.width = `${width}px`;
            videoPreviewElement.style.height = `${height * 0.8}px`;
            videoPreviewElement.style.width = `${width * 0.8}px`;
        }
        if (this.audioRecording || !this.isMobile) {
            await this.updateComplete;
            this.shadowRoot.querySelector("#dialog").open = true;
            this.setupRecorders();
        }
    }
    //TODO: Get WebRTC working again, it almost does
    render() {
        return html `
      <md-dialog id="optionsDialog" modal>
        <div class="layout vertical center-center" slot="content">
          <div class="layout vertical center-center optionsButtons">
            <div hidden class="layout horizontal center-center">
              <md-filled-button
                raised
                dialogAction="confirm"
                class="uploadFileButton"
                @click="${this._openRecorderDialog}"
              >
                <md-icon slot="icon">fiber_manual_record</md-icon>
                <div class="buttonText">${this.t("record")}</div>
              </md-filled-button>
            </div>
            <div class="layout horizontal center-center">
              <md-filled-button
                raised
                dialogAction="confirm"
                class="uploadFileButton"
                @click="${this._uploadFile}"
              >
                <md-icon slot="icon">file_upload</md-icon>
                <div class="buttonText">${this.t("upload")}</div>
              </md-filled-button>
            </div>
          </div>
          <div class="videoAspectDescription">${this.t("videoFormat")}</div>
          <div ?hidden="${this.audioRecording}" class="checkboxContainer">
            <label>
              Landscape
              <md-radio
                @click="${this._setVideoAspect}"
                checked
                value="landscape"
                ><md-icon>landscape</md-icon></md-radio
              >
            </label>
            <label
              >Portrait
              <md-radio value="portrait" @click="${this._setVideoAspect}"
                ><md-icon>portrait</md-icon></md-radio
              >
            </label>
          </div>
          <div class="layout horizontal center-center" slot="actions">
            <md-text-button dialogAction="close"
              >${this.t("cancel")}</md-text-button
            >
          </div>
        </div>
      </md-dialog>
      <md-dialog id="dialog" modal ?audioRecording="${this.audioRecording}">
        <div class="layout vertical no-padding mainContainer">
          ${this.videoRecording
            ? html `
                <video
                  id="videoRecorder"
                  class="videoRecorder"
                  ?hidden="${this.previewActive}"
                ></video>
                <video
                  id="videoPreviewer"
                  preload="auto"
                  class="videoRecorder"
                  ?hidden="${!this.previewActive}"
                ></video>
              `
            : nothing}
          ${this.audioRecording
            ? html `
                <div class="layout vertical center-center">
                  <div class="layout horizontal center-center header">
                    ${this.t("voiceRecorder")}
                  </div>
                  <div
                    id="waveform"
                    ?hidden="${this.recordedData != null}"
                  ></div>
                  <audio
                    id="audioRecorder"
                    class="audioRecorder"
                    ?hidden
                  ></audio>
                  <audio
                    id="audioPreviewer"
                    controls
                    preload="auto"
                    class="audioRecorder"
                    ?hidden="${!this.previewActive}"
                  ></audio>
                </div>
              `
            : nothing}

          <div class="layout horizontal mainbuttons">
            <md-icon-button @click="${this._close}">
              <md-icon>clear</md-icon>
            </md-icon-button>
            <div class="layout horizontal" ?hidden="${!this.recorder}">
              <md-icon-button
                @click="${this._deleteRecording}"
                ?hidden="${!this.recordedData}"
              >
                <md-icon>delete</md-icon>
              </md-icon-button>
              <md-text-button
                @click="${this._startRecording}"
                ?hidden="${this.recordedData != null}"
              >
                <md-icon>fiber_manual_record</md-icon>
                ${this.t("record")}
              </md-text-button>
              <div id="secondsLeft" ?hidden="${this.recordedData != null}">
                ${this.recordSecondsLeft} ${this.t("seconds")}
              </div>
              <md-text-button
                @click="${this._stopRecording}"
                ?hidden="${!this.isRecording}"
              >
                <md-icon>stop</md-icon>
                ${this.t("stop")}
              </md-text-button>
            </div>
            <span ?hidden="${this.isRecording || this.audioRecording}">
              <div class="layout horizontal">
                <md-text-button
                  id="uploadFileButton"
                  @click="${this._uploadFile}"
                  ?hidden="${this.recordedData != null}"
                >
                  <md-icon>file_upload</md-icon>
                  ${this.t("uploadFile")}
                </md-text-button>
                <label>
                  <md-radio
                    name="videoAspect"
                    @change="${this._setVideoAspect}"
                    value="landscape"
                  >
                  </md-radio>
                  landscape
                </label>
                <label>
                  <md-radio
                    name="videoAspect"
                    @change="${this._setVideoAspect}"
                    value="portrait"
                  >
                  </md-radio>
                  portrait
                </label>
              </div>
            </span>
            <md-text-button
              @click="${this._sendBack}"
              ?hidden="${!this.recordedData}"
            >
              <md-icon>send</md-icon>
              ${this.t("send")}
            </md-text-button>
          </div>
        </div>
        <div ?hidden="${!this.error}">${this.error}</div>
      </md-dialog>
      ${this.allDevices
            ? html `
            <md-dialog id="selectDevices" modal>
              <div slot="headline">${this.selectDeviceTitle}</div>
              <md-select id="deviceListBox">
                ${this.allDevices.map((item) => html `
                    <md-select-option
                      @click="${this.selectDeviceFunction}"
                      value="${item.deviceId}"
                    >
                      ${item.label}
                    </md-select-option>
                  `)}
              </md-select>
              <div class="layout horizontal rememberBox">
                <div>${this.t("rememberDevice")}</div>
                <md-checkbox id="checkBox"></md-checkbox>
              </div>
            </md-dialog>
          `
            : nothing}
      <md-dialog id="noDevices">
        <div slot="headline">${this.t("noDevicesFound")}</div>
        <div class="button layout horizontal center-center">
          <md-text-button
            slot="actions"
            raised
            @click="${() => this.$$("#noDevices").close()}"
          >
            ${this.t("ok")}
          </md-text-button>
        </div>
      </md-dialog>
    `;
    }
    _setVideoAspect(event) {
        debugger;
        this.videoAspect = event.target.value;
        debugger;
    }
    _selectAudioDevice(event) {
        const target = event.target;
        if (target.id) {
            this.selectedAudioDeviceId = target.id;
        }
        if (this.$$("#checkBox").checked) {
            localStorage.setItem("selectedAudioDeviceId", this.selectedAudioDeviceId);
        }
        this.$$("#selectDevices").open = false;
        this._openMediaSession(this.captureCallback);
    }
    _selectVideoDevice(event) {
        if (event.target.id) {
            this.selectedVideoDeviceId = event.target.id;
        }
        if (this.$$("#checkBox").checked) {
            localStorage.setItem("selectedVideoDeviceId", this.selectedVideoDeviceId);
        }
        this.$$("#selectDevices").open = false;
        this._checkAudioDevices();
    }
    async _checkAudioDevices() {
        if (this.audioDevices && this.audioDevices.length > 1) {
            if (localStorage.getItem("selectedAudioDeviceId")) {
                this.selectedAudioDeviceId = localStorage.getItem("selectedAudioDeviceId");
                this._openMediaSession(this.captureCallback);
            }
            else {
                this.selectDeviceTitle = this.t("selectAudioDevice");
                this.selectDeviceFunction = this._selectAudioDevice.bind(this);
                this.allDevices = this.audioDevices;
                //TODO: Fix this back in
                //this.$$('#deviceListBox').selected = null;
                await this.updateComplete;
                this.$$("#checkBox").checked = false;
                this.$$("#selectDevices").open = true;
            }
        }
        else {
            this._openMediaSession(this.captureCallback);
        }
    }
    async _checkVideoDevices() {
        if (this.videoRecording &&
            this.videoDevices &&
            this.videoDevices.length > 1) {
            if (localStorage.getItem("selectedVideoDeviceId")) {
                this.selectedVideoDeviceId = localStorage.getItem("selectedVideoDeviceId");
                await this._checkAudioDevices();
            }
            else {
                this.selectDeviceTitle = this.t("selectVideoDevice");
                this.rememberDevice = false;
                this.selectDeviceFunction = this._selectVideoDevice.bind(this);
                this.allDevices = this.videoDevices;
                //TODO: Fix this back in
                //this.$$('#deviceListBox').selected = null;
                await this.updateComplete;
                this.$$("#checkBox").checked = false;
                this.$$("#selectDevices").open = true;
            }
        }
        else {
            await this._checkAudioDevices();
        }
    }
    _close() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        if (this.surfer) {
            this.surfer.getActivePlugins()[0].stop();
            this.surfer.destroy();
        }
        this.previewActive = false;
        this.$$("#optionsDialog").open = false;
    }
    _uploadFile() {
        this._close();
        this.uploadFileFunction(this.videoAspect);
    }
    _sendBack() {
        if (this.callbackFunction && this.recorder) {
            this.callbackFunction(this.recordedData);
            this.recordedData = undefined;
            this.recorder.clearRecordedData();
            this.recorder.reset();
            this.recorder = undefined;
            this._close();
        }
        else {
            console.error("No callback function for media player");
        }
    }
    checkDevices() {
        navigator.mediaDevices.enumerateDevices().then((devicesIn) => {
            this.audioDevices = devicesIn.filter((d) => {
                return d.kind === "audioinput";
            });
            this.videoDevices = devicesIn.filter((d) => {
                return d.kind === "videoinput";
            });
            let hasLabels = false;
            this.videoDevices.forEach(function (device) {
                if (device.label && device.label != "") {
                    hasLabels = true;
                }
            });
            if (!hasLabels) {
                this.videoDevices = undefined;
                this.audioDevices = undefined;
            }
            this._checkVideoDevices();
        });
    }
    connectedCallback() {
        super.connectedCallback();
        if (window.innerHeight > window.innerWidth) {
            this.videoAspect = "portrait";
        }
        else {
            this.videoAspect = "landscape";
        }
    }
    captureUserMedia(callback) {
        this.captureCallback = callback;
        this.checkDevices();
    }
    _openMediaSession(callback) {
        debugger;
        if (callback) {
            if (this.selectedVideoDeviceId) {
                this.videoSettings.deviceId = this.selectedVideoDeviceId;
            }
            const constraints = {
                audio: this.selectedAudioDeviceId
                    ? { deviceId: this.selectedAudioDeviceId }
                    : true,
                video: this.videoRecording ? this.videoSettings : undefined,
            };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                stream.getTracks().forEach(function (track) {
                    console.info(track.getCapabilities());
                });
                callback(stream);
            })
                .catch(function (error) {
                console.error(error);
                //TODO: Fire user error
                callback(null);
            });
        }
    }
    async open(options) {
        this.callbackFunction = options.callbackFunction;
        this.recordingFinished = false;
        this.error = undefined;
        this.audioRecording = options.audioRecording;
        this.videoRecording = options.videoRecording;
        this.maxLength = options.maxLength;
        this.uploadFileFunction = options.uploadFileFunction;
        this.recordSecondsLeft = this.maxLength;
        // Determine if the device is mobile
        this.isMobile =
            /Android|iPhone|iPad/i.test(navigator.userAgent) ||
                window.matchMedia("only screen and (max-width: 480px)").matches;
        // Set the video aspect based on the orientation
        this.videoAspect =
            window.innerHeight > window.innerWidth ? "portrait" : "landscape";
        await this.requestUpdate();
        if (this.videoRecording) {
            // Open the options dialog
            this.$$("#optionsDialog").open = true;
        }
        else {
            // Open the dialog and set up the recorders
            this.$$("#dialog").open = true;
            this.setupRecorders();
        }
    }
    _generateRandomString() {
        if (window.crypto) {
            const a = window.crypto.getRandomValues(new Uint32Array(3));
            let token = "";
            for (let i = 0, l = a.length; i < l; i++)
                token += a[i].toString(36);
            return token;
        }
        else {
            return (Math.random() * new Date().getTime())
                .toString(36)
                .replace(/\./g, "");
        }
    }
    _startRecording() {
        if (!this.isRecording) {
            this.recorder.startRecording();
            this.recordSecondsLeft = this.maxLength;
            this.isRecording = true;
            this.$$("#recordingIcon").className = "recording";
            this._recordingTimer();
        }
        else {
            this._stopRecording();
        }
    }
    _stopRecording() {
        this.$$("#recordingIcon").className = "";
        this.isRecording = false;
        this.recorder.stopRecording(this._storeRecordedData.bind(this));
        this.$$("#secondsLeft").className = "";
    }
    _deleteRecording() {
        this.recorder.reset();
        this.previewActive = false;
        this.recordedData = undefined;
        this.recordSecondsLeft = this.maxLength;
        this.$$("#secondsLeft").className = "";
        this.$$("#recordingIcon").className = "";
    }
    _storeRecordedData() {
        const blob = this.recorder.getBlob();
        let fileName;
        if (this.videoRecording) {
            const videoElement = this.shadowRoot.querySelector("#videoRecorder");
            const videoPreviewer = this.shadowRoot.querySelector("#videoPreviewer");
            fileName = this._generateRandomString() + ".webm";
            this.recordedData = new File([blob], fileName, {
                type: "video/webm",
            });
            videoElement.controls = true;
            this.recorder.reset();
            videoPreviewer.src = window.URL.createObjectURL(this.recordedData);
            videoPreviewer.controls = true;
            this.previewActive = true;
        }
        else if (this.audioRecording) {
            const audioElement = this.shadowRoot.querySelector("#audioRecorder");
            const audioPreviewer = this.shadowRoot.querySelector("#audioPreviewer");
            fileName = this._generateRandomString() + ".mp3";
            this.recordedData = new File([blob], fileName, {
                type: "audio/mp3",
            });
            audioElement.controls = true;
            audioElement.pause();
            audioPreviewer.src = window.URL.createObjectURL(this.recordedData);
            audioPreviewer.controls = true;
            this.previewActive = true;
        }
    }
    _recordingTimer() {
        if (this.isRecording) {
            setTimeout(() => {
                if (this.isRecording) {
                    if (this.recordSecondsLeft > 0) {
                        this._recordingTimer();
                    }
                    else {
                        this._stopRecording();
                    }
                    if (this.recordSecondsLeft > 0)
                        this.recordSecondsLeft -= 1;
                    if (this.recordSecondsLeft <= 5) {
                        this.$$("#secondsLeft").className =
                            "recordingTime";
                    }
                }
            }, 1000);
        }
        else {
            console.error("_recordingTimer called without in recording mode");
        }
    }
    setupRecorders() {
        this.recordSecondsLeft = this.maxLength;
        if (this.videoRecording) {
            const videoElement = this.shadowRoot.querySelector("#videoRecorder");
            this.captureUserMedia((stream) => {
                if (stream) {
                    this.mediaStream = stream;
                    try {
                        videoElement.srcObject = stream;
                    }
                    catch (error) {
                        console.error(error);
                        videoElement.src = window.URL.createObjectURL(stream);
                    }
                    videoElement.play();
                    videoElement.muted = true;
                    videoElement.controls = false;
                    //@ts-ignore
                    this.recorder = RecordRTC(stream, {
                        type: "video",
                    });
                }
                else {
                    console.error("Can't find stream");
                    this.$$("#noDevices").open = true;
                    this.$$("#uploadFileButton").style.color = "#F00";
                }
            });
        }
        else if (this.audioRecording) {
            const audioElement = this.shadowRoot.querySelector("#audioRecorder");
            this.captureUserMedia((stream) => {
                if (stream) {
                    this.mediaStream = stream;
                    try {
                        audioElement.srcObject = stream;
                    }
                    catch (error) {
                        console.error(error);
                        audioElement.src = window.URL.createObjectURL(stream);
                    }
                    audioElement.play();
                    audioElement.muted = true;
                    audioElement.controls = false;
                    this.surfer = WaveSurfer.create({
                        container: this.$$("#waveform"),
                        waveColor: "#ff3d00",
                        progressColor: "#ff3d00",
                        cursorWidth: 0,
                        plugins: [RecorderPlugin.create({ stream: this.mediaStream })],
                    });
                    this.surfer.getActivePlugins()[0].play();
                    this.recorder = new RecordRTC(stream, {
                        type: "audio",
                    });
                }
                else {
                    console.error("Can't find stream");
                    this.$$("#noDevices").open = true;
                    this.$$("#uploadFileButton").style.color = "#F00";
                }
            });
        }
        setTimeout(() => {
            //TODO: Check this and add back if needed
            //(this.$$('#dialog') as Dialog).center();
        });
    }
};
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "recorder", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "mediaStream", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "captureStream", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "audioRecording", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "videoRecording", void 0);
__decorate([
    property({ type: Number })
], YpMediaRecorder.prototype, "maxLength", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "recordedData", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "recordingFinished", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "isRecording", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "rememberDevice", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "previewActive", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "callbackFunction", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "captureCallback", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "uploadFileFunction", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "selectDeviceFunction", void 0);
__decorate([
    property({ type: String })
], YpMediaRecorder.prototype, "error", void 0);
__decorate([
    property({ type: String })
], YpMediaRecorder.prototype, "selectDeviceTitle", void 0);
__decorate([
    property({ type: Number })
], YpMediaRecorder.prototype, "recordSecondsLeft", void 0);
__decorate([
    property({ type: Array })
], YpMediaRecorder.prototype, "audioDevices", void 0);
__decorate([
    property({ type: Array })
], YpMediaRecorder.prototype, "videoDevices", void 0);
__decorate([
    property({ type: Array })
], YpMediaRecorder.prototype, "allDevices", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "videoOptions", void 0);
__decorate([
    property({ type: Object })
], YpMediaRecorder.prototype, "surfer", void 0);
__decorate([
    state()
], YpMediaRecorder.prototype, "videoAspect", void 0);
__decorate([
    property({ type: String })
], YpMediaRecorder.prototype, "selectedCamera", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "hasFacingMode", void 0);
__decorate([
    property({ type: Boolean })
], YpMediaRecorder.prototype, "isMobile", void 0);
YpMediaRecorder = __decorate([
    customElement("yp-media-recorder")
], YpMediaRecorder);
export { YpMediaRecorder };
//# sourceMappingURL=yp-media-recorder.js.map