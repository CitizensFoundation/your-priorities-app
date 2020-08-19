import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-media-query/iron-media-query.js';
import 'lite-signal/lite-signal.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
//TODO: import 'google-map/google-map.js';
//TODO: import 'google-map/google-map-marker.js';
//TODO: import 'google-map/google-map-search.js';
import '../yp-app-globals/yp-app-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpPostLocationLit extends YpBaseElement {
  static get properties() {
    return {

      map: {
        type: Object
      },

      group: {
        type: Object,
        observer: '_groupChanged'
      },

      defaultLatitude: {
        type: String,
        value: "64.13897027178841"
      },

      defaultLongitude: {
        type: String,
        value: "-21.876912117004395"
      },

      mapSearchString: {
        type: String,
        value: ""
      },

      mapSearchResultAddress: {
        type: String,
        value: ""
      },

      location: {
        type: Object,
        observer: "_locationChanged",
        notify: true
      },

      mapZoom: {
        type: Number,
        value: 13,
        computed: '_computeMapZoom(location)'
      },

      encodedLocation: {
        type: String,
        notify: true
      },

      post: {
        type: Object,
        observer: "_postChanged"
      },

      marker: {
        type: Object
      },

      active: {
        type: Boolean,
        value: false
      },

      narrowPad: Boolean
    }
  }


  static get styles() {
    return [
      css`

      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .location-button {

      }

      #map {
        width: 100%;
        height: 100%;
      }

      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        #map {
          min-height: 220px;
        }
      }

      .mapSearchInput {
        width: 100%;
        margin-top: 8px;
      }

      paper-input {
        width: 250px;
      }

      .searchResultText {
        width: 100%;
        text-align: right;
        padding-top: 8px;
      }

      mwc-button {
        font-size: 16px;
        padding-top: 32px;
      }

      @media (max-width: 390px) {
        #map {
          max-height: 180px;
        }
      }

      @media (max-width: 320px) {
         #map {
           max-height: 160px;
         }
      }
    `, YpFlexLayout]
  }

  render() {
    return html`

    <iron-media-query query="(max-width: 1024px)" queryMatches="${this.narrowPad}"></iron-media-query>

    <google-map-search id="mapSearch" .map="${this.map}" @google-map-search-results="${this._mapSearchResults}"></google-map-search>

    <google-map .additionalMapOptions="{'keyboardShortcuts':false}" id="map" .zoom="${this.mapZoom}" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" .map="${this.map}" .libraries="places" @map-type-changed="${this._mapTypeChanged}" class="map" .clickEvents="" @zoom-changed="${this._zoomChanged}" @google-map-click="${this_setLocation}" .fitToMarkers="">
      <google-map-marker slot="markers" .latitude="${this.defaultLatitude}" .longitude="${this.defaultLongitude}" id="marker"></google-map-marker>
    </google-map>

    <div class="mapSearchInput layout vertical center-center">
      <div class="layout horizontal center-center wrap">
        <paper-input .max-length="60" .label="${this.t('maps.searchInput')}" .value="${this.mapSearchString}" @keydown="${this._submitOnEnter}"></paper-input>
        <mwc-button @click="${this._searchMap}" .label="${this.t('maps.search')}"></mwc-button>
      </div>
      <div class="searchResultText layout horizontal center-center">
        ${this.mapSearchResultAddress}
      </div>
      <paper-spinner id="spinner"></paper-spinner>
    </div>
    `
  }

  _computeMapZoom(location) {
    if (location && location.map_zoom)
      return location.map_zoom;
    else
      return this.mapZoom
  }

  _submitOnEnter(event) {
    if (event.keyCode === 13) {
      this._searchMap();
    }
  }

  _searchMap() {
    this.$$("#mapSearch").query = this.mapSearchString;
    this.$$("#mapSearch").search();
    this.$$("#spinner").active = true;
    this.mapSearchResultAddress = '';
  }

  _mapSearchResults(event, detail) {
    this.$$("#spinner").active = false;
    if (detail && detail.length > 0) {
      this.location = {latitude: detail[0].latitude, longitude: detail[0].longitude, map_zoom: 15};
      this.mapSearchResultAddress = detail[0].formatted_address;
      this.$$("#map").zoom = 15;
      this.$$("#map").resize();
    }
  }

  connectedCallback() {
    super.connectedCallback()
      if (!this.location) {
        this.async(function () {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
              if (!this.location)
                this.location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  map_zoom: 13
                }
            }.bind(this));
          }
        }, 50);
      }
  }

  _zoomChanged(event, detail) {
    if (detail && detail.value) {
      this.location.map_zoom = detail.value;
    }
    this.encodedLocation = JSON.stringify(this.location);
  }

  _mapTypeChanged(event, detail) {
    if (detail && detail.value) {
      this.location.mapType = detail.value;
    }
    this.encodedLocation = JSON.stringify(this.location);
  }

  _locationChanged(newLocationValue, oldValue) {
    if (newLocationValue) {
      this.$$("#marker").setAttribute('latitude', newLocationValue.latitude);
      this.$$("#marker").setAttribute('longitude', newLocationValue.longitude);
      if (newLocationValue.map_zoom)
        this.$$("#map").zoom = newLocationValue.map_zoom;
      if (newLocationValue.mapType)
        this.$$("#map").mapType = newLocationValue.mapType;
      this.$$("#map").resize();
      this.encodedLocation = JSON.stringify(newLocationValue);
    }
  }

  _setLocation(event, detail) {
    this.location = {
      latitude: detail.latLng.lat(),
      longitude: detail.latLng.lng(),
      mapType: this.$$("#map").mapType,
      map_zoom: this.$$("#map").zoom
    };
  }

  _groupChanged(group) {
    if (group) {
      let longLat;
      if (group.configuration && group.configuration.defaultLocationLongLat &&
        group.configuration.defaultLocationLongLat != "" &&
        group.configuration.defaultLocationLongLat.split(",").length > 1) {
        longLat = group.configuration.defaultLocationLongLat.trim().split(",");
        this.defaultLongitude = longLat[0];
        this.defaultLatitude = longLat[1];
      } else if (group.Community && group.Community.configuration && group.Community.configuration.defaultLocationLongLat &&
        group.Community.configuration.defaultLocationLongLat != "" &&
        group.Community.configuration.defaultLocationLongLat.split(",").length > 1) {
        longLat = group.Community.configuration.defaultLocationLongLat.trim().split(",");
        this.defaultLongitude = longLat[0];
        this.defaultLatitude = longLat[1];
      }
    }
  }

  _postChanged(post) {
    if (!post) {
      this.location = null;
    }
  }
}

window.customElements.define('yp-post-location-lit', YpPostLocationLit)