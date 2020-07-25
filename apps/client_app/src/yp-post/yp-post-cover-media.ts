import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { Menu } from '@material/mwc-menu';
import { YpCollectionHelpers } from '../@yrpri/YpCollectionHelpers.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('yp-post-cover-media')
export class YpPostCoverMedia extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Boolean })
  topRadius = false

  @property({ type: Boolean })
  topLeftRadius = false

  @property({ type: String })
  altTag: string | undefined;

  @property({ type: Number })
  postAudioId: number | undefined;

  @property({ type: Number })
  postVideoId: number | undefined;

  @property({ type: Boolean })
  headerMode = false

  @property({ type: Boolean })
  disableMaps = false

  @property({ type: Boolean })
  mapActivated = false

  @property({ type: Boolean })
  streetViewActivated = false

  @property({ type: Boolean })
  tiny = false

  //TODO: Make this dynamic from server, even if this key is host protected
  @property({ type: String })
  staticMapsApiKey = "AIzaSyBYy8UvdDD650mz7k1pY0j2hBFQmCPVnxA";

  @property({ type: Number })
  uploadedDefaultPostImageId: number | undefined;

  @property({ type: Number })
  defaultImageGroupId: number | undefined;

  @property({ type: Boolean })
  defaultPostImageEnabled = false

  @property({ type: Boolean })
  showVideo = false

  @property({ type: Boolean })
  showAudio = false

  @property({ type: Boolean })
  portraitVideo = false

  static get prosperties() {

    return {

      post: {
        type: Object,
        notify: true,
        observer: "_postChanged"
      },

      headerMode: {
        type: Boolean,
        value: false,
        observer: '_headerModeChanged'
      },

      noneActive: {
        type: Boolean,
        value: false,
        computed: '_isNoneActive(post)'
      },

      categoryActive: {
        type: Boolean,
        value: false,
        computed: '_isCategoryActive(post)'
      },

      categoryLargeActive: {
        type: Boolean,
        value: false,
        computed: '_isCategoryLargeActive(post)'
      },

      imageActive: {
        type: Boolean,
        value: false,
        computed: '_isImageActive(post)'
      },

      videoActive: {
        type: Boolean,
        value: false,
        computed: '_isVideoActive(post)'
      },

      audioActive: {
        type: Boolean,
        value: false,
        computed: '_isAudioActive(post)'
      },

      mapActive: {
        type: Boolean,
        value: false,
        computed: '_isMapActive(post)'
      },

      streetViewActive: {
        type: Boolean,
        value: false,
        computed: '_isStreetViewActive(post)'
      },

      mapType: {
        type: String,
        computed: '_mapType(post.location)'
      },

      zoomLevel: {
        type: String,
        computed: '_zoomLevel(post.location)'
      },

      latitude: {
        type: Number,
        computed: '_getLatitute(post.location.latitude)'
      },

      longitude: {
        type: Number,
        computed: '_getLongitude(post.location.longitude)'
      },

      mapPosition: {
        type: Object,
        computed: '_getMapPosition(post.location)'
      },

      getCategoryImagePath: {
        type: String,
        computed: '_getCategoryImagePath(post)'
      },

      postImagePath: {
        type: String,
        computed: '_postImagePath(post)'
      },

      postVideoPath: {
        type: String,
        computed: '_postVideoPath(post)'
      },

      postVideoPosterPath: {
        type: String,
        computed: '_postVideoPosterPath(post)'
      },

      postAudioPath: {
        type: String,
        computed: '_postAudioPath(post)'
      },

      activeDefaultImageUrl: {
        type: String,
        computed: '_activeDefaultImageUrl(defaultPostImageEnabled, defaultImageGroupId, uploadedDefaultPostImageId)',
        value: null
      },

      sizingMode: {
        type: String,
        computed: '_sizingMode(post)'
      }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .topContainer[top-radius] > iron-image, #videoPreviewImage {
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
        }

        video {
          outline: none !important;
        }

        .topContainer[top-left-radius] > iron-image, #videoPreviewImage, google-streetview-pano, google-map {
          border-top-left-radius: 4px;
        }

        .topContainer[top-left-radius] > video {
          border-top-left-radius: 4px;
        }

        google-streetview-pano {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        google-map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .main-image, video {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .mapCanvas {
          width: 100%;
          height: 100%;
        }

        .category-icon {
          width: 200px;
          height: 200px;
          padding-top: 32px;
        }

        .category-icon[tiny] {
          width: 100px;
          height: 100px;
          padding-top: 24px;
        }

        .category-icon[large] {
          width: 100%;
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 960px) {
          .topContainer[top-left-radius] > iron-image {
            border-top-left-radius: 0;
          }
        }

        @media (max-width: 600px) {
          .category-icon {
            width: 130px;
            height: 130px;
          }

          .category-icon[large] {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .main-image[header-mode] {
            height: 100%;
          }

          video {
            height: 100%;
          }
        }

        .pointer {
          cursor: pointer;
        }

        .pointer[header-mode] {
          cursor: default;
        }

        [hidden] {
          display: none !important;
        }

        .videoCamStatic {
          width: 32px;
          height: 32px;
          color: var(--primary-background-color);
          margin-top: -68px;
          margin-left: 8px;
        }

        .voiceIcon {
          height: 42px;
          width: 42px;
          color: #333;
          margin-top: 96px;
        }

        @media (max-width: 600px) {
          .voiceIcon {
            height: 42px;
            width: 42px;
            color: #333;
            margin-top: 35px;
          }
        }

        audio {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .playInfo {
          font-style: italic;
        }

        @media (max-width: 960px) {
          .voiceIcon {
            margin-top: 35px;
          }
        }

        @media (max-width: 430px) {
          .voiceIcon {
            margin-top: 28px;
          }
        }

        video {
          background-color: #777;
        }

        #videoPlayer[portrait] {
          width: 100% !important;
          height: 100%;
        }

        .topContainer[portrait] {
          background-color: #777;
        }

        #videoPreviewImage[portrait] {
          width: 40%;
        }

        .videoPreviewContainer {
          width: 100%;
          height: 100%;
        }

        .videoPreviewContainer[portrait] {
          background-color: #777;
        }
      `, YpFlexLayout];
    }

    render() {
      return html`
      <div class="topContainer" top-radius="${this.topRadius}" top-left-radius="${this.topLeftRadius}">

      ${ this.noneActive ? html`
          <iron-image .header-mode="${this.headerMode}" .sizing="cover" ?hidden="${this.defaultPostImageEnabled}" class="main-image pointer" src="https://i.imgur.com/sdsFAoT.png" @tap="${this._goToPost}"></iron-image>

        ${ this.activeDefaultImageUrl ? html`
          <iron-image ?headerMode="${this.headerMode}" alt="${this.altTag}" .sizing="cover" class="main-image pointer" src="${this.activeDefaultImageUrl}" @click="${this._goToPost}"></iron-image>
        ` : html``}
      ` : html``}

        ${ this.categoryActive ? html`
          <div id="categoryImageId" class="layout horizontal center-center">
            <iron-image .header-mode="${this.headerMode}" alt="${this.altTag}" .tiny="${this.tiny}" @tap="${this._goToPost}" class="category-icon pointer" .title="${this.post.Category.name}" .sizing="contain" src="${this.getCategoryImagePath}"></iron-image>
          </div>
        ` : html``}

        ${ this.categoryLargeActive ? html`
          <iron-image .header-mode="${this.headerMode}" alt="${this.altTag}" large @click="${this._goToPost}" class="category-icon pointer" .title="${this.post.Category.name}" .sizing="cover" src="${this.getCategoryImagePath}"></iron-image>
        ` : html``}

        ${ this.imageActive ? html`
          <iron-image .header-mode="${this.headerMode}" @tap="${this._goToPost}" .sizing="${this.sizingMode}" class="main-image pointer" src="${this.postImagePath}"></iron-image>
        ` : html``}

        ${ this.videoActive ? html`

          ${ this.showVideo ? html`
            <video id="videoPlayer" portrait="${this.portraitVideo}" .data-id="${this.postVideoId}" .header-mode="${this.headerMode}" .controls="" @tap="${this._goToPost}" .preload="meta" class="pointer" src="${this.postVideoPath}" .playsinline="" .poster="${this.postVideoPosterPath}"></video>
          ` : html`
            <div class="layout vertical center-center videoPreviewContainer" .portrait="${this.portraitVideo}">
              <iron-image id="videoPreviewImage layout-self-center" .portrait="${this.portraitVideo}" ?headerMode="${this.headerMode}" @tap="${this._goToPost}" .sizing="cover" class="main-image pointer" src="${this.postVideoPosterPath}"></iron-image>
            </div>
            <iron-icon icon="videocam" class="videoCamStatic"></iron-icon>
          `}
        ` : html``}

        ${ this.showAudio ? html`
          <div class="layout vertical center-center">
            <audio id="audioPlayer" .data-id="${this.postAudioId}" .header-mode="${this.headerMode}" controls preload="meta" class="pointer" src="${this.postAudioPath}" ?hidden="${!this.postAudioPath}" playsinline></audio>
          </div>
        ` : html``}

        ${ this.audioActive ? html`
          <div class="layout vertical center-center">
            <audio id="audioPlayer" .data-id="${this.postAudioId}" .header-mode="${this.headerMode}" controls preload="meta" class="pointer" src="${this.postAudioPath}" ?hidden="${!this.postAudioPath}" playsinline></audio>
          </div>
          <div ?hidden="${this.showAudio}" class="layout horizontal center-center pointer" @tap="${this._goToPost}">
            <iron-icon icon="keyboard-voice" class="voiceIcon"></iron-icon>
          </div>
        ` : html``}

        ${ !this.disableMaps ? html`

          ${ this.streetViewActive ? html`
            <iron-image @tap="${this._goToPost}" class="main-image pointer" .sizing="cover" src="https://maps.googleapis.com/maps/api/staticmap?center=[[latitude]],[[longitude]]&amp;zoom=[[zoomLevel]]&amp;size=432x243&amp;maptype=hybrid&amp;markers=color:red%7Clabel:%7C[[latitude]],[[longitude]]&amp;key=[[staticMapsApiKey]]" ?hidden="${this.streetViewActivated}"></iron-image>


            ${ this.streetViewActivated ? html`
              <google-streetview-pano .position="${this.mapPosition}" .heading="330" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" .pitch="2" .zoom="0.8" disable-default-ui=""></google-streetview-pano>
            ` : html``}

          ` : html``}

          ${ this.mapActive ? html`
            <iron-image @tap="${this._goToPost}" class="main-image pointer" ?hidden="${this.mapActivated}" sizing="cover" src="https://maps.googleapis.com/maps/api/staticmap?center=[[latitude]],[[longitude]]&amp;size=432x243&amp;zoom=[[zoomLevel]]&amp;maptype=[[mapType]]&amp;markers=color:red%7Clabel:%7C[[latitude]],[[longitude]]&amp;key=[[staticMapsApiKey]]"></iron-image>

            ${ this.mapActivated ? html`
              <google-map additional-map-options="{keyboardShortcuts:false}" id="coverMediaMap" class="map" .libraries="places" .fit-to-markers="" .zoom="${this.zoomLevel}" .map-type="${this.mapType}" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0">
                <google-map-marker slot="markers" .latitude="${this.latitude}" .longitude="${this.longitude}"></google-map-marker>
              </google-map>
            ` : html``}
          ` : html``}
        ` : html``}

      </div>

      <lite-signal @lite-signal-yp-pause-media-playback="${this._pauseMediaPlayback}"></lite-signal>
    `;
  }

/*
  behaviors: [
    ypMediaFormatsBehavior,
    ypGotoBehavior
  ],
*/

  get sizingMode() {
    if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.useContainImageMode) {
      return 'contain';
    } else {
      return 'cover';
    }
  }

  get activeDefaultImageUrl() {
    if (this.defaultPostImageEnabled && this.defaultImageGroupId && this.uploadedDefaultPostImageId) {
      return "/api/groups/"+this.defaultImageGroupId+"/default_post_image/"+this.uploadedDefaultPostImageId;
    } else {
      return null;
    }
  }

  _goToPost() {
    if (this.post && this.post.Group.configuration && this.post.Group.configuration.resourceLibraryLinkMode) {
      // Do nothing
    } else {
      if (this.post) {
        if (this.headerMode) {
          YpNavHelpers.goToPost(this.post.id)
        } else {
          YpNavHelpers.goToPost(this.post.id, undefined, undefined, this.post);
        }
      } else {
        console.error("No post in post cover media on goToPost");
      }
    }
  }

  _headerModeChanged(headerMode) {
    if (headerMode===true) {
      this.async(function () {
        this.set('mapActivated', true);
        this.set('streetViewActivated', true);
      });
    }
  }

  _getLatitute(latitude) {
    if (latitude)
      return latitude;
    else
      return 0.0;
  }

  _getLongitude(longitude) {
    if (longitude)
      return longitude;
    else
      return 0.0;
  }

  _isNoneActive(post) {
    if (this._withCoverMediaType(post, 'none'))
      return true;
    else
      return false
  }

  _isCategoryActive(post) {
    if (post && this._withCoverMediaType(post, 'category') && (post.id<=11000 && this._isDomainWithOldCategories()))
      return true;
    else
      return false
  }

  _isDomainWithOldCategories() {
    // Workaround to support old square category images on Citizens Foundation websites running since 2010
    const hostname = window.location.hostname;
    return (hostname.indexOf("betrireykjavik.is") >-1 ||
            hostname.indexOf("betraisland.is") >-1 ||
            hostname.indexOf("yrpri.org") >-1)
  }

  _isCategoryLargeActive(post) {
    if (post && this._withCoverMediaType(post, 'category') && (post.id>11000 || !this._isDomainWithOldCategories()))
      return true;
    else
      return false
  }

  _isImageActive(post) {
    if (this._withCoverMediaType(post,'image')) {
      return true;
    } else {
      return false;
    }
  }

  _isVideoActive(post) {
    if (this._withCoverMediaType(post,'video')) {
      return true;
    } else {
      return false;
    }
  }

  _isAudioActive(post) {
    if (this._withCoverMediaType(post,'audio')) {
      return true;
    } else {
      return false;
    }
  }

  _isMapActive(post) {
    if (post && post.location && post.location.latitude && this._withCoverMediaType(post,'map'))
      return true;
    else
      return false
  }

  _isStreetViewActive(post) {
    if (post && post.location && post.location.latitude && this._withCoverMediaType(post,'streetView')) {
      return true;
    }
    else
      return false;
  }

  _postChanged(post, previousPost) {
    if (post && post.Group && post.Group.configuration && post.Group.configuration.uploadedDefaultPostImageId && post.Group.configuration.uploadedDefaultPostImageId!="") {
      this.set('uploadedDefaultPostImageId', post.Group.configuration.uploadedDefaultPostImageId);
      this.set('defaultImageGroupId', post.Group.id);
      this.set('defaultPostImageEnabled', true);
    } else {
      this.set('defaultPostImageEnabled', false);
      this.set('defaultImageGroupId', null);
      this.set('uploadedDefaultPostImageId', null);
    }

    if (this.headerMode) {
      this.setupMediaEventListeners(post, previousPost);
    }
  }

  _zoomLevel(location) {
    if (location && location.map_zoom && location.map_zoom!="") {
      return location.map_zoom;
    }
    else
      return "10";
  }

  _mapType(location) {
    if (location && location.mapType && location.mapType != "")
      return location.mapType;
    else
      return "roadmap";
  }

  _withCoverMediaType(post, mediaType) {
    if (!post) {
      console.info("No post for "+mediaType);
      return false;
    } else {
      if (mediaType == 'none') {
        return (!post.Category && (!post.cover_media_type || post.cover_media_type == 'none'));
      } else  if ((mediaType=='category' && post.Category) && (!post.cover_media_type || post.cover_media_type == 'none')) {
        return true;
      } else {
        return (post && post.cover_media_type == mediaType);
      }
    }
  }

  _getMapPosition(location) {
    if (location) {
      return { lat: location.latitude, lng: location.longitude }
    } else {
      return { lat: 0, lng: 0 }
    }
  }

  _postImagePath(post) {
    if (post) {
      return this.getImageFormatUrl(post.PostHeaderImages, 0);
    } else {
      return "";
    }
  }

  _postVideoPath(post) {
    if (post && post.PostVideos) {
      const videoURL = this._getVideoURL(post.PostVideos);
      this.set('portraitVideo', this._isPortraitVideo(post.PostVideos))
      if (videoURL) {
        this.set('postVideoId', post.PostVideos[0].id);
        return videoURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _postAudioPath(post) {
    if (post && post.PostAudios) {
      const audioURL = this._getAudioURL(post.PostAudios);
      if (audioURL) {
        this.set('postAudioId', post.PostAudios[0].id);
        return audioURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _postVideoPosterPath(post) {
    if (post && post.PostVideos) {
      const videoPosterURL = this._getVideoPosterURL(post.PostVideos, post.PostHeaderImages);
      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _getCategoryImagePath(post) {
    if (post && post.Category && post.Category.CategoryIconImages) {
      return this.getImageFormatUrl(post.Category.CategoryIconImages, 0);
    } else {
      return "";
    }
  }
}
