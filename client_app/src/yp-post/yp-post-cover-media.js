import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../google-streetview-pano/google-streetview-pano.js';
import '../../../../google-map/google-map.js';
import '../../../../google-map/google-map-marker.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
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

      .main-image {
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
    </style>

    <div class="mapCanvas">
      <template is="dom-if" if="[[noneActive]]">
        <iron-image header-mode\$="[[headerMode]]" sizing="cover" hidden\$="[[defaultPostImageEnabled]]" class="main-image pointer" src="https://i.imgur.com/sdsFAoT.png" on-tap="goToPost"></iron-image>

        <template is="dom-if" if="[[defaultPostImageEnabled]]" restamp="">
          <iron-image header-mode\$="[[headerMode]]" sizing="cover" class="main-image pointer" src="/api/groups/[[defaultImageGroupId]]/default_post_image/[[uploadedDefaultPostImageId]]" on-tap="goToPost"></iron-image>
        </template>
      </template>

      <template is="dom-if" if="[[categoryActive]]">
        <div id="categoryImageId" class="layout horizontal center-center">
          <iron-image header-mode\$="[[headerMode]]" tiny\$="[[tiny]]" on-tap="goToPost" class="category-icon pointer" title="[[post.Category.name]]" sizing="contain" src\$="[[getCategoryImagePath]]"></iron-image>
        </div>
      </template>

      <template is="dom-if" if="[[categoryLargeActive]]">
        <iron-image header-mode\$="[[headerMode]]" large="" on-tap="goToPost" class="category-icon pointer" title="[[post.Category.name]]" sizing="cover" src\$="[[getCategoryImagePath]]"></iron-image>
      </template>

      <template is="dom-if" if="[[imageActive]]">
        <iron-image header-mode\$="[[headerMode]]" on-tap="goToPost" sizing="cover" class="main-image pointer" src="[[postImagePath]]"></iron-image>
      </template>

      <template is="dom-if" if="[[!disableMaps]]">

        <template is="dom-if" if="[[streetViewActive]]">
          <iron-image on-tap="goToPost" class="main-image pointer" sizing="cover" src="https://maps.googleapis.com/maps/api/staticmap?center=[[latitude]],[[longitude]]&amp;zoom=[[zoomLevel]]&amp;size=432x243&amp;maptype=hybrid&amp;markers=color:red%7Clabel:%7C[[latitude]],[[longitude]]&amp;key=[[staticMapsApiKey]]" hidden\$="[[streetViewActivated]]"></iron-image>

          <template is="dom-if" if="[[streetViewActivated]]">
            <google-streetview-pano position\$="[[mapPosition]]" heading="330" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" pitch="2" zoom="0.8" disable-default-ui="">
            </google-streetview-pano>
          </template>

        </template>

        <template is="dom-if" if="[[mapActive]]">
          <iron-image on-tap="goToPost" class="main-image pointer" hidden\$="[[mapActivated]]" sizing="cover" src="https://maps.googleapis.com/maps/api/staticmap?center=[[latitude]],[[longitude]]&amp;size=432x243&amp;zoom=[[zoomLevel]]&amp;maptype=[[mapType]]&amp;markers=color:red%7Clabel:%7C[[latitude]],[[longitude]]&amp;key=[[staticMapsApiKey]]"></iron-image>

          <template is="dom-if" if="[[mapActivated]]">
            <google-map additional-map-options="{&quot;keyboardShortcuts&quot;:false}" id="coverMediaMap" class="map" libraries="places" fit-to-markers="" zoom\$="[[zoomLevel]]" map-type\$="[[mapType]]" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0">
              <google-map-marker slot="markers" latitude="[[latitude]]" longitude="[[longitude]]"></google-map-marker>
            </google-map>
          </template>
        </template>
      </template>
    </div>
`,

  is: 'yp-post-cover-media',

  behaviors: [
    ypLanguageBehavior,
    ypImageFormatsBehavior,
    ypGotoBehavior
  ],

  properties: {


    post: {
      type: Object,
      notify: true,
      observer: "_postChanged"
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

    headerMode: {
      type: Boolean,
      value: false,
      observer: '_headerModeChanged'
    },

    disableMaps: {
      type: Boolean,
      value: false
    },

    mapActivated: {
      type: Boolean,
      value: false
    },

    streetViewActivated: {
      type: Boolean,
      value: false
    },

    staticMapsApiKey: {
      type: String,
      value: "AIzaSyBYy8UvdDD650mz7k1pY0j2hBFQmCPVnxA"
    },

    tiny: {
      type: Boolean,
      value: false
    },

    uploadedDefaultPostImageId: {
      type: String,
      value: null
    },

    defaultImageGroupId: {
      type: String,
      value: null
    },

    defaultPostImageEnabled: {
      type: Boolean,
      value: false
    }

  },

  _headerModeChanged: function (headerMode) {
    if (headerMode===true) {
      this.async(function () {
        this.set('mapActivated', true);
        this.set('streetViewActivated', true);
      });
    }
  },

  _getLatitute: function (latitude) {
    if (latitude)
      return latitude;
    else
      return 0.0;
  },

  _getLongitude: function (longitude) {
    if (longitude)
      return longitude;
    else
      return 0.0;
  },

  _isNoneActive: function (post) {
    if (this._withCoverMediaType(post, 'none'))
      return true;
    else
      return false
  },

  _isCategoryActive: function (post) {
    if (this._withCoverMediaType(post, 'category') && post.id<=11000)
      return true;
    else
      return false
  },

  // We switch over to 100% category images
  _isCategoryLargeActive: function (post) {
    if (post && this._withCoverMediaType(post, 'category') && post.id>11000)
      return true;
    else
      return false
  },

  _isImageActive: function (post) {
    if (this._withCoverMediaType(post,'image')) {
      return true;
    } else {
      return false;
    }
  },

  _isMapActive: function (post) {
    if (post && post.location && post.location.latitude && this._withCoverMediaType(post,'map'))
      return true;
    else
      return false
  },

  _isStreetViewActive: function (post) {
    if (post && post.location && post.location.latitude && this._withCoverMediaType(post,'streetView')) {
      return true;
    }
    else
      return false;
  },

  _postChanged: function(post, oldValue) {
    if (post && post.Group && post.Group.configuration && post.Group.configuration.uploadedDefaultPostImageId && post.Group.configuration.uploadedDefaultPostImageId!="") {
      this.set('uploadedDefaultPostImageId', post.Group.configuration.uploadedDefaultPostImageId);
      this.set('defaultImageGroupId', post.Group.id);
      this.set('defaultPostImageEnabled', true);
    } else {
      this.set('defaultPostImageEnabled', false);
      this.async(function () {
        this.set('defaultImageGroupId', null);
        this.set('uploadedDefaultPostImageId', null);
      });
    }
  },

  _zoomLevel: function (location) {
    if (location && location.map_zoom && location.map_zoom!="") {
      return location.map_zoom;
    }
    else
      return "10";
  },

  _mapType: function (location) {
    if (location && location.mapType && location.mapType != "")
      return location.mapType;
    else
      return "roadmap";
  },

  _withCoverMediaType: function (post, mediaType) {
    if (!post) {
      console.error("No post for "+mediaType);
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
  },

  _getMapPosition: function (location) {
    if (location) {
      return { lat: location.latitude, lng: location.longitude }
    } else {
      return { lat: 0, lng: 0 }
    }
  },

  _postImagePath: function (post) {
    if (post) {
      return this.getImageFormatUrl(post.PostHeaderImages, 0);
    } else {
      return "";
    }
  },

  _getCategoryImagePath: function (post) {
    if (post && post.Category && post.Category.CategoryIconImages) {
      return this.getImageFormatUrl(post.Category.CategoryIconImages, 0);
    } else {
      return "";
    }
  }
});
