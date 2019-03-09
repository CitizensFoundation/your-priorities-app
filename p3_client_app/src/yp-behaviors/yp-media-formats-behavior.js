import '@polymer/polymer/polymer-legacy.js';

/** @polymerBehavior Polymer.ypMediaFormatsBehavior */
export const ypMediaFormatsBehavior = {

  properties: {
    playStartedAt: {
      type: Date,
      value: null
    }
  },

  _checkVideoLongPlayTimeAndReset(videoPlayer) {
    var videoId = videoPlayer.getAttribute('data-id');
    if (this.playStartedAt && videoId) {
      var seconds = (new Date().getTime() - this.playStartedAt.getTime()) / 1000;
      if (seconds>5) {
        window.appGlobals.sendLongVideoView(videoId)
      }
      window.appGlobals.activity("completed",'video',seconds);
      this.playStartedAt = null;
    } else if (this.playStartedAt) {
      console.error("Got long view check without id");
      this.playStartedAt = null;
    }
  },

  _checkAudioLongPlayTimeAndReset(audioPlayer) {
    var audioId = audioPlayer.getAttribute('data-id');
    if (this.playStartedAt && audioId) {
      var seconds = (new Date().getTime() - this.playStartedAt.getTime()) / 1000;
      if (seconds>5) {
        window.appGlobals.sendLongAudioListen(audioId)
      }
      window.appGlobals.activity("completed",'audio',seconds);
      this.playStartedAt = null;
    } else if (this.playStartedAt) {
      console.error("Got long view check without audio id");
      this.playStartedAt = null;
    }
  },

  getImageFormatUrl: function(images, formatId) {
    if (images && images.length>0) {
      var formats = JSON.parse(images[images.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  },

  setupMediaEventListeners: function (current, previous) {
    if (previous && current) {
      this.detachMediaListeners();
      this.attachMediaListeners();
    } else if (current) {
      this.attachMediaListeners();
    } else if (!current && previous) {
      this.detachMediaListeners();
    }
  },

  attachMediaListeners: function () {
    this.async(function () {
      var videoPlayer = this.$$("#videoPlayer");
      var audioPlayer = this.$$("#audioPlayer");
      if (videoPlayer) {
        var videoId = videoPlayer.getAttribute('data-id');
        if (videoId) {
          this.videoPlayListener = function () {
            this.set('playStartedAt', new Date());
            window.appGlobals.sendVideoView(videoId)
          }.bind(this);
          this.videoPauseListener = function () {
            this._checkVideoLongPlayTimeAndReset(videoPlayer);
          }.bind(this);
          this.videoEndedListener = function () {
            this._checkVideoLongPlayTimeAndReset(videoPlayer);
          }.bind(this);
          videoPlayer.addEventListener("play", this.videoPlayListener);
          videoPlayer.addEventListener("pause", this.videoPauseListener);
          videoPlayer.addEventListener("ended", this.videoEndedListener);
        }
      }

      if (audioPlayer) {
        var audioId = audioPlayer.getAttribute('data-id');
        if (audioId) {
          this.audioPlayListener =  function () {
            this.set('playStartedAt', new Date());
            window.appGlobals.sendAudioListen(audioId)
          }.bind(this);
          this.audioPauseListener = function () {
            this._checkAudioLongPlayTimeAndReset(audioPlayer);
          }.bind(this);
          this.audioEndedListener = function () {
            this._checkAudioLongPlayTimeAndReset(audioPlayer);
          }.bind(this);
          audioPlayer.addEventListener("play", this.audioPlayListener);
          audioPlayer.addEventListener("pause", this.audioPauseListener);
          audioPlayer.addEventListener("ended", this.audioEndedListener);
        }
      }
    }, 200);

  },

  detachMediaListeners: function () {
    var videoPlayer = this.$$("#videoPlayer");
    var audioPlayer = this.$$("#audioPlayer");
    if (videoPlayer) {
      if (this.videoPlayListener) {
        videoPlayer.removeEventListener("play", this.videoPlayListener);
        this.videoPlayListener = null;
      }
      if (this.videoPauseListener) {
        videoPlayer.removeEventListener("pause", this.videoPauseListener);
        this.videoPauseListener = null;
      }
      if (this.videoEndedListener) {
        videoPlayer.removeEventListener("ended", this.videoEndedListener);
        this.videoEndedListener = null;
      }
      this._checkVideoLongPlayTimeAndReset(videoPlayer);
    }

    if (audioPlayer) {
      if (this.audioPlayListener) {
        audioPlayer.removeEventListener("play", this.audioPlayListener);
        this.audioPlayListener = null;
      }
      if (this.audioPauseListener) {
        audioPlayer.removeEventListener("pause", this.audioPauseListener);
        this.audioPauseListener = null;
      }
      if (this.audioEndedListener) {
        audioPlayer.removeEventListener("ended", this.audioEndedListener);
        this.audioEndedListener = null;
      }
      this._checkVideoLongPlayTimeAndReset(audioPlayer);
    }
  },

  _pauseMediaPlayback: function () {
    var videoPlayer = this.$$("#videoPlayer");
    var audioPlayer = this.$$("#audioPlayer");
    if (videoPlayer) {
      videoPlayer.pause();
    }
    if (audioPlayer) {
      audioPlayer.pause();
    }
  },

  _getVideoURL: function (videos) {
    if (videos &&
        videos.length>0 &&
        videos[0].formats &&
        videos[0].formats.length>0) {
      return videos[0].formats[0];
    } else {
      return null;
    }
  },

  _isPortraitVideo: function (videos) {
    if (videos &&
      videos.length>0 &&
      videos[0].formats &&
      videos[0].formats.length>0) {
        if (videos[0].public_meta && videos[0].public_meta.aspect && videos[0].public_meta.aspect==='portrait') {
          return true;
        } else {
          return false;
        }
    } else {
      return false;
    }
  },

  _getAudioURL: function (audios) {
    if (audios &&
        audios.length>0 &&
        audios[0].formats &&
        audios[0].formats.length>0) {
        return audios[0].formats[0];
    } else {
      return null;
    }
  },

  _getVideoPosterURL: function (videos, selectedImageIndex) {
    if (videos &&
      videos.length>0 &&
      videos[0].VideoImages &&
      videos[0].VideoImages.length>0) {
        if (!selectedImageIndex)
          selectedImageIndex = 0;
        if (videos[0].public_meta && videos[0].public_meta.selectedVideoFrameIndex) {
          selectedImageIndex = parseInt(videos[0].public_meta.selectedVideoFrameIndex);
        }
        if (selectedImageIndex>videos[0].VideoImages.length-1) {
          selectedImageIndex = 0;
        }
        return JSON.parse(videos[0].VideoImages[selectedImageIndex].formats)[0];
    } else {
      return null;
    }
  }
};
