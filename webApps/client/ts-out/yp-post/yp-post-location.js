var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/button/outlined-button.js';
import '@material/web/progress/circular-progress.js';
import 'lit-google-map';
import { YpBaseElement } from '../common/yp-base-element.js';
import { ifDefined } from 'lit/directives/if-defined.js';
let YpPostLocation = class YpPostLocation extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.defaultLatitude = 64.13897027178841;
        this.defaultLongitude = -21.876912117004395;
        this.mapSearchString = '';
        this.mapSearchResultAddress = '';
        this.active = false;
        this.narrowPad = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('group')) {
            this._groupChanged();
        }
        if (changedProperties.has('location')) {
            this._locationChanged();
        }
        if (changedProperties.has('post')) {
            this._postChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
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

        @media screen and (-ms-high-contrast: active),
          (-ms-high-contrast: none) {
          #map {
            min-height: 220px;
          }
        }

        .mapSearchInput {
          width: 100%;
          margin-top: 8px;
        }

        md-outlined-text-field {
          width: 250px;
        }

        .searchResultText {
          width: 100%;
          text-align: right;
          padding-top: 8px;
        }

        md-outlined-button {
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

        .mapContainer {
          width: 450px;
          height: 250px;
        }
      `,
        ];
    }
    render() {
        return this.group
            ? html `<div class="mapContainer">
            <lit-google-map
              id="map"
              @map-zoom-changed="${this._mapZoomChanged}"
              api-key="${ifDefined(window.appGlobals.googleMapsApiKey)}"
              version="weekly"
              @map-type-changed="${this._mapTypeChanged}"
              class="map"
              @zoom-changed="${this._zoomChanged}"
              fit-to-markers>
              <lit-google-map-marker
                slot="markers"
                .latitude="${this.location ? this.location.latitude : this.defaultLatitude}"
                .longitude="${this.location ? this.location.longitude : this.defaultLongitude}"
                id="marker"></lit-google-map-marker>
            </lit-google-map>
          </div>
          <div class="mapSearchInput layout vertical center-center">
            <div class="layout horizontal center-center wrap">
              <md-outlined-text-field
                maxlength="60"
                id="mapSearchInput"
                .label="${this.t('maps.searchInput')}"
                .value="${this.mapSearchString}"
                @keydown="${this._submitOnEnter}"></md-outlined-text-field>
              <md-outlined-button
                @click="${this._searchMap}"
                .label="${this.t('maps.search')}"></md-outlined-button>
            </div>
            <div class="searchResultText layout horizontal center-center">
              ${this.mapSearchResultAddress}
            </div>
            <md-circular-progress
              hidden indeterminate
              id="spinner"></md-circular-progress>
          </div> `
            : nothing;
    }
    _mapZoomChanged(event) {
        if (this.location)
            this.location.map_zoom = event.detail;
    }
    get mapZoom() {
        if (this.location && this.location.map_zoom)
            return this.location.map_zoom;
        else
            return 15;
    }
    _submitOnEnter(event) {
        if (event.keyCode === 13) {
            this._searchMap();
        }
    }
    _searchMap() {
        const map = this.$$('#map');
        //@ts-ignore
        const service = new google.maps.places.PlacesService(map);
        this.$$('#spinner').hidden = false;
        const request = {
            query: this.$$("#mapSearchInput").value,
            fields: ['name', 'geometry'],
        };
        //@ts-ignore
        service.findPlaceFromQuery(request, (results, status) => {
            //@ts-ignore
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.$$('#spinner').hidden = true;
                if (results && results.length > 0) {
                    this.mapSearchResultAddress = results[0].formatted_address;
                    this.$$('#map').zoom = 15;
                    this.location = {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng(),
                        map_zoom: 15,
                    };
                    this.$$('#map').updateMarkers();
                    //this.$$('#map').resize();
                }
            }
        });
        this.mapSearchResultAddress = '';
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.location) {
            setTimeout(() => {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(position => {
                        if (!this.location)
                            this.location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                map_zoom: 13,
                            };
                    });
                }
            }, 50);
        }
    }
    _zoomChanged(event) {
        if (this.location && event.detail && event.detail.value) {
            this.location.map_zoom = event.detail.value;
        }
        this.encodedLocation = JSON.stringify(this.location);
    }
    _mapTypeChanged(event) {
        if (this.location && event.detail && event.detail.value) {
            this.location.mapType = event.detail.value;
        }
        this.encodedLocation = JSON.stringify(this.location);
    }
    _locationChanged() {
        if (this.location) {
            const map = this.$$('#map');
            if (this.location.map_zoom)
                map.zoom = this.location.map_zoom;
            if (this.location.mapType)
                map.mapType = this.location.mapType;
            //      map.updateMarkers()
            //      map.fitToMarkersChanged()
            map.requestUpdate();
            //TODO: See if this is needed
            //this.$$('#map').resize();
            this.encodedLocation = JSON.stringify(this.location);
        }
    }
    _setLocation(event) {
        this.location = {
            latitude: event.detail.latLng.lat(),
            longitude: event.detail.latLng.lng(),
            mapType: this.$$('#map').mapType,
            map_zoom: this.$$('#map').zoom,
        };
    }
    _groupChanged() {
        const group = this.group;
        if (group) {
            let longLat;
            if (group.configuration &&
                group.configuration.defaultLocationLongLat &&
                group.configuration.defaultLocationLongLat != '' &&
                group.configuration.defaultLocationLongLat.split(',').length > 1) {
                longLat = group.configuration.defaultLocationLongLat.trim().split(',');
                this.defaultLongitude = parseFloat(longLat[0]);
                this.defaultLatitude = parseFloat(longLat[1]);
            }
            else if (group.Community &&
                group.Community.configuration &&
                group.Community.configuration.defaultLocationLongLat &&
                group.Community.configuration.defaultLocationLongLat != '' &&
                group.Community.configuration.defaultLocationLongLat.split(',').length >
                    1) {
                longLat = group.Community.configuration.defaultLocationLongLat
                    .trim()
                    .split(',');
                this.defaultLongitude = parseFloat(longLat[0]);
                this.defaultLatitude = parseFloat(longLat[1]);
            }
        }
    }
    _postChanged() {
        if (!this.post) {
            this.location = undefined;
        }
    }
};
__decorate([
    property({ type: Object })
], YpPostLocation.prototype, "map", void 0);
__decorate([
    property({ type: Object })
], YpPostLocation.prototype, "group", void 0);
__decorate([
    property({ type: Object })
], YpPostLocation.prototype, "post", void 0);
__decorate([
    property({ type: Number })
], YpPostLocation.prototype, "defaultLatitude", void 0);
__decorate([
    property({ type: Number })
], YpPostLocation.prototype, "defaultLongitude", void 0);
__decorate([
    property({ type: String })
], YpPostLocation.prototype, "mapSearchString", void 0);
__decorate([
    property({ type: String })
], YpPostLocation.prototype, "mapSearchResultAddress", void 0);
__decorate([
    property({ type: Object })
], YpPostLocation.prototype, "location", void 0);
__decorate([
    property({ type: String })
], YpPostLocation.prototype, "encodedLocation", void 0);
__decorate([
    property({ type: Object })
], YpPostLocation.prototype, "marker", void 0);
__decorate([
    property({ type: Boolean })
], YpPostLocation.prototype, "active", void 0);
__decorate([
    property({ type: Boolean })
], YpPostLocation.prototype, "narrowPad", void 0);
YpPostLocation = __decorate([
    customElement('yp-post-location')
], YpPostLocation);
export { YpPostLocation };
//# sourceMappingURL=yp-post-location.js.map