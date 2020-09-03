import { property, customElement, LitElement, css, html } from 'lit-element';

class ScriptLoaderMap {
    constructor() {
        this.apiMap = {};
    }
    require(url, notifyCallback, jsonpCallbackName) {
        var name = this.nameFromUrl(url);
        if (!this.apiMap[name])
            this.apiMap[name] = new ScriptLoader(name, url, jsonpCallbackName);
        this.apiMap[name].requestNotify(notifyCallback);
    }
    static getInstance() {
        if (!ScriptLoaderMap.instance) {
            ScriptLoaderMap.instance = new ScriptLoaderMap();
        }
        return ScriptLoaderMap.instance;
    }
    nameFromUrl(url) {
        return url.replace(/[\:\/\%\?\&\.\=\-\,]/g, '_') + '_api';
    }
}
class ScriptLoader {
    constructor(name, url, callbackName) {
        this.callbackMacro = '%%callback%%';
        this.loaded = false;
        this.script = null;
        this.notifiers = [];
        if (!callbackName) {
            if (url.indexOf(this.callbackMacro) >= 0) {
                callbackName = name + '_loaded';
                url = url.replace(this.callbackMacro, callbackName);
            }
            else {
                console.error('ScriptLoader class: a %%callback%% parameter is required in libraryUrl');
                return;
            }
        }
        this.callbackName = callbackName;
        window[this.callbackName] = this.success.bind(this);
        this.addScript(url);
    }
    addScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.onerror = this.handleError.bind(this);
        var s = document.querySelector('script') || document.body;
        s.parentNode.insertBefore(script, s);
        this.script = script;
    }
    removeScript() {
        if (this.script.parentNode) {
            this.script.parentNode.removeChild(this.script);
        }
        this.script = null;
    }
    handleError(ev) {
        this.error = new Error('Library failed to load');
        this.notifyAll();
        this.cleanup();
    }
    success() {
        this.loaded = true;
        this.result = Array.prototype.slice.call(arguments);
        this.notifyAll();
        this.cleanup();
    }
    cleanup() {
        delete window[this.callbackName];
    }
    notifyAll() {
        this.notifiers.forEach(function (notifyCallback) {
            notifyCallback(this.error, this.result);
        }.bind(this));
        this.notifiers = [];
    }
    requestNotify(notifyCallback) {
        if (this.loaded || this.error) {
            notifyCallback(this.error, this.result);
        }
        else {
            this.notifiers.push(notifyCallback);
        }
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class JsonpLibraryElement extends LitElement {
    constructor() {
        super(...arguments);
        this.libraryLoaded = false;
        this.libraryErrorMessage = null;
        this.isReady = false;
    }
    get callbackName() {
        return null;
    }
    libraryUrlChanged() {
        if (this.isReady && this.libraryUrl != null)
            this.loadLibrary();
    }
    libraryLoadCallback(error, detail) {
        if (error) {
            console.warn('Library load failed:', error.message);
            this.libraryErrorMessage = error.message;
        }
        else {
            this.libraryErrorMessage = null;
            this.libraryLoaded = true;
            if (this.notifyEvent != null) {
                this.dispatchEvent(new CustomEvent(this.notifyEvent, { detail: detail, composed: true }));
            }
        }
    }
    loadLibrary() {
        ScriptLoaderMap.getInstance().require(this.libraryUrl, this.libraryLoadCallback.bind(this), this.callbackName);
    }
    connectedCallback() {
        super.connectedCallback();
        this.isReady = true;
        if (this.libraryUrl != null)
            this.loadLibrary();
    }
}
let LitGoogleMapsApi = class LitGoogleMapsApi extends JsonpLibraryElement {
    constructor() {
        super(...arguments);
        this.apiKey = '';
        this.clientId = '';
        this.mapsUrl = 'https://maps.googleapis.com/maps/api/js?callback=%%callback%%';
        this.version = '3.39';
        this.language = '';
    }
    get libraryUrl() {
        return this.computeUrl(this.mapsUrl, this.version, this.apiKey, this.clientId, this.language);
    }
    get notifyEvent() {
        return 'api-load';
    }
    computeUrl(mapsUrl, version, apiKey, clientId, language) {
        var url = mapsUrl + '&v=' + version;
        url += '&libraries=drawing,geometry,places,visualization';
        if (apiKey && !clientId) {
            url += '&key=' + apiKey;
        }
        if (clientId) {
            url += '&client=' + clientId;
        }
        if (!apiKey && !clientId) {
            var warning = 'No Google Maps API Key or Client ID specified. ' +
                'See https://developers.google.com/maps/documentation/javascript/get-api-key ' +
                'for instructions to get started with a key or client id.';
            console.warn(warning);
        }
        if (language) {
            url += '&language=' + language;
        }
        return url;
    }
};
__decorate([
    property({ type: String, attribute: 'api-key' }),
    __metadata("design:type", Object)
], LitGoogleMapsApi.prototype, "apiKey", void 0);
__decorate([
    property({ type: String, attribute: 'client-id' }),
    __metadata("design:type", Object)
], LitGoogleMapsApi.prototype, "clientId", void 0);
__decorate([
    property({ type: String, attribute: 'maps-url' }),
    __metadata("design:type", Object)
], LitGoogleMapsApi.prototype, "mapsUrl", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], LitGoogleMapsApi.prototype, "version", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], LitGoogleMapsApi.prototype, "language", void 0);
LitGoogleMapsApi = __decorate([
    customElement('lit-google-maps-api')
], LitGoogleMapsApi);

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let LitGoogleMapMarker = class LitGoogleMapMarker extends LitElement {
    constructor() {
        super(...arguments);
        this.latitude = 0;
        this.longitude = 0;
        this.label = null;
        this.zIndex = 0;
        this.open = false;
        this.map = null;
        this.marker = null;
    }
    attributeChangedCallback(name, oldval, newval) {
        var _a, _b;
        super.attributeChangedCallback(name, oldval, newval);
        switch (name) {
            case 'open': {
                this.openChanged();
                break;
            }
            case 'latitude': {
                this.updatePosition();
                break;
            }
            case 'longitude': {
                this.updatePosition();
                break;
            }
            case 'label': {
                (_a = this.marker) === null || _a === void 0 ? void 0 : _a.setLabel(newval);
                break;
            }
            case 'z-index': {
                (_b = this.marker) === null || _b === void 0 ? void 0 : _b.setZIndex(newval);
                break;
            }
        }
    }
    openChanged() {
        if (!this.info)
            return;
        if (this.open) {
            this.info.open(this.map, this.marker);
            this.dispatchEvent(new CustomEvent('google-map-marker-open', { bubbles: true }));
        }
        else {
            this.info.close();
            this.dispatchEvent(new CustomEvent('google-map-marker-close', { bubbles: true }));
        }
    }
    updatePosition() {
        var _a;
        (_a = this.marker) === null || _a === void 0 ? void 0 : _a.setPosition(new google.maps.LatLng(this.latitude, this.longitude));
    }
    changeMap(newMap) {
        this.map = newMap;
        this.mapChanged();
    }
    mapChanged() {
        if (this.marker) {
            this.marker.setMap(null);
            google.maps.event.clearInstanceListeners(this.marker);
        }
        if (this.map && this.map instanceof google.maps.Map) {
            this.mapReady();
        }
    }
    mapReady() {
        this.marker = new google.maps.Marker({
            map: this.map,
            position: {
                lat: this.latitude,
                lng: this.longitude
            },
            label: this.label,
            zIndex: this.zIndex
        });
        this.contentChanged();
    }
    contentChanged() {
        if (this.contentObserver)
            this.contentObserver.disconnect();
        this.contentObserver = new MutationObserver(this.contentChanged.bind(this));
        this.contentObserver.observe(this, {
            childList: true,
            subtree: true
        });
        var content = this.innerHTML.trim();
        if (content) {
            if (!this.info) {
                this.info = new google.maps.InfoWindow();
                this.openInfoHandler = google.maps.event.addListener(this.marker, 'click', function () {
                    this.open = true;
                }.bind(this));
                this.closeInfoHandler = google.maps.event.addListener(this.info, 'closeclick', function () {
                    this.open = false;
                }.bind(this));
            }
            this.info.setContent(content);
        }
        else {
            if (this.info) {
                google.maps.event.removeListener(this.openInfoHandler);
                google.maps.event.removeListener(this.closeInfoHandler);
                this.info = null;
            }
        }
    }
};
__decorate$1([
    property({ type: Number, reflect: true }),
    __metadata$1("design:type", Number)
], LitGoogleMapMarker.prototype, "latitude", void 0);
__decorate$1([
    property({ type: Number, reflect: true }),
    __metadata$1("design:type", Number)
], LitGoogleMapMarker.prototype, "longitude", void 0);
__decorate$1([
    property({ type: String, reflect: true }),
    __metadata$1("design:type", String)
], LitGoogleMapMarker.prototype, "label", void 0);
__decorate$1([
    property({ type: Number, reflect: true, attribute: 'z-index' }),
    __metadata$1("design:type", Number)
], LitGoogleMapMarker.prototype, "zIndex", void 0);
__decorate$1([
    property({ type: Boolean, reflect: true }),
    __metadata$1("design:type", Boolean)
], LitGoogleMapMarker.prototype, "open", void 0);
LitGoogleMapMarker = __decorate$1([
    customElement('lit-google-map-marker')
], LitGoogleMapMarker);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let LitGoogleMap = class LitGoogleMap extends LitElement {
    constructor() {
        super(...arguments);
        this.apiKey = '';
        this.version = '3.39';
        this.styles = {};
        this.zoom = 8;
        this.fitToMarkers = false;
        this.mapType = 'roadmap';
        this.centerLatitude = -34.397;
        this.centerLongitude = 150.644;
        this.map = null;
    }
    initGMap() {
        if (this.map != null) {
            return;
        }
        var gMapApiElement = this.shadowRoot.getElementById('api');
        if (gMapApiElement == null || gMapApiElement.libraryLoaded != true) {
            return;
        }
        this.map = new google.maps.Map(this.shadowRoot.getElementById('map'), this.getMapOptions());
        this.updateMarkers();
    }
    getMapOptions() {
        return {
            zoom: this.zoom,
            center: { lat: this.centerLatitude, lng: this.centerLongitude },
            mapTypeId: this.mapType,
            styles: this.styles
        };
    }
    mapApiLoaded() {
        this.initGMap();
    }
    connectedCallback() {
        super.connectedCallback();
        this.initGMap();
    }
    attachChildrenToMap(children) {
        if (this.map) {
            for (var i = 0, child; child = children[i]; ++i) {
                child.changeMap(this.map);
            }
        }
    }
    observeMarkers() {
        if (this.marketObserverSet)
            return;
        this.addEventListener("items-changed", event => { this.updateMarkers(); });
        this.marketObserverSet = true;
    }
    updateMarkers() {
        this.observeMarkers();
        var markersSelector = this.shadowRoot.getElementById("markers-selector");
        if (!markersSelector)
            return;
        var newMarkers = markersSelector.items;
        if (this.markers && newMarkers.length === this.markers.length) {
            var added = newMarkers.filter(m => {
                return this.markers && this.markers.indexOf(m) === -1;
            });
            if (added.length == 0)
                return;
        }
        this.markers = newMarkers;
        this.attachChildrenToMap(this.markers);
        if (this.fitToMarkers) {
            this.fitToMarkersChanged();
        }
    }
    fitToMarkersChanged() {
        if (this.map && this.fitToMarkers && this.markers.length > 0) {
            var latLngBounds = new google.maps.LatLngBounds();
            for (var i = 0, m; m = this.markers[i]; ++i) {
                latLngBounds.extend(new google.maps.LatLng(m.latitude, m.longitude));
            }
            if (this.markers.length > 1) {
                this.map.fitBounds(latLngBounds);
            }
            this.map.setCenter(latLngBounds.getCenter());
        }
    }
    deselectMarker(event) {
    }
    static get styles() {
        return css `
            #map {
                width: 100%;
                height: 100%;
            }
        `;
    }
    render() {
        return html `
            <lit-google-maps-api id="api" api-key="${this.apiKey}" version="${this.version}" @api-load=${() => this.mapApiLoaded()}></lit-google-maps-api>
            <lit-selector 
                id="markers-selector"
                selected-attribute="open"
                activate-event="google-map-marker-open"
                @google-map-marker-close=${(e) => this.deselectMarker(e)}>
                    <slot id="markers" name="markers"></slot>
            </lit-selector>
            <div id="map">
            </div>
        `;
    }
};
__decorate$2([
    property({ type: String, attribute: 'api-key' }),
    __metadata$2("design:type", String)
], LitGoogleMap.prototype, "apiKey", void 0);
__decorate$2([
    property({ type: String }),
    __metadata$2("design:type", String)
], LitGoogleMap.prototype, "version", void 0);
__decorate$2([
    property({ type: Object }),
    __metadata$2("design:type", Object)
], LitGoogleMap.prototype, "styles", void 0);
__decorate$2([
    property({ type: Number }),
    __metadata$2("design:type", Number)
], LitGoogleMap.prototype, "zoom", void 0);
__decorate$2([
    property({ type: Boolean, attribute: 'fit-to-markers' }),
    __metadata$2("design:type", Boolean)
], LitGoogleMap.prototype, "fitToMarkers", void 0);
__decorate$2([
    property({ type: String, attribute: 'map-type' }),
    __metadata$2("design:type", String)
], LitGoogleMap.prototype, "mapType", void 0);
__decorate$2([
    property({ type: Number, attribute: 'center-latitude' }),
    __metadata$2("design:type", Number)
], LitGoogleMap.prototype, "centerLatitude", void 0);
__decorate$2([
    property({ type: Number, attribute: 'center-longitude' }),
    __metadata$2("design:type", Number)
], LitGoogleMap.prototype, "centerLongitude", void 0);
LitGoogleMap = __decorate$2([
    customElement('lit-google-map')
], LitGoogleMap);

class XSelection {
    constructor(selectCallback) {
        this.multi = false;
        this.selection = [];
        this.selectCallback = selectCallback;
    }
    get() {
        return this.multi ? this.selection.slice() : this.selection[0];
    }
    clear(excludes) {
        this.selection.slice().forEach(item => {
            if (!excludes || excludes.indexOf(item) < 0)
                this.setItemSelected(item, false);
        });
    }
    isSelected(item) {
        return this.selection.indexOf(item) >= 0;
    }
    setItemSelected(item, isSelected) {
        if (item == null || isSelected == this.isSelected(item))
            return;
        if (isSelected) {
            this.selection.push(item);
        }
        else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
                this.selection.splice(i, 1);
            }
        }
        if (this.selectCallback) {
            this.selectCallback(item, isSelected);
        }
    }
    select(item) {
        if (this.multi) {
            this.toggle(item);
        }
        else if (this.get() !== item) {
            this.setItemSelected(this.get(), false);
            this.setItemSelected(item, true);
        }
    }
    toggle(item) {
        this.setItemSelected(item, !this.isSelected(item));
    }
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let LitSelector = class LitSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.activateEvent = 'tap';
        this.selectedAttribute = null;
        this.selected = null;
        this._selection = new XSelection((item, isSelected) => this.applySelection(item, isSelected));
        this._items = [];
    }
    get items() {
        return this._items;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('slotchange', event => {
            event.stopPropagation();
            this.updateItems();
            this.dispatchEvent(new CustomEvent("selector-items-changed", { detail: {}, composed: true }));
        });
        this.addListener(this.activateEvent);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener(this.activateEvent);
    }
    attributeChangedCallback(name, oldval, newval) {
        super.attributeChangedCallback(name, oldval, newval);
        switch (name) {
            case 'selected': {
                this.updateSelected();
                break;
            }
        }
    }
    applySelection(item, isSelected) {
        if (this.selectedAttribute && item instanceof Element) {
            if (isSelected != item.hasAttribute(this.selectedAttribute))
                item.toggleAttribute(this.selectedAttribute);
        }
    }
    updateItems() {
        var _a, _b;
        var slotElement = this.querySelector("slot");
        this._items = (_b = (_a = slotElement) === null || _a === void 0 ? void 0 : _a.assignedNodes(), (_b !== null && _b !== void 0 ? _b : []));
    }
    addListener(eventName) {
        this.addEventListener(eventName, (event) => this.activateHandler(event));
    }
    removeListener(eventName) {
        this.removeEventListener(eventName, (event) => this.activateHandler(event));
    }
    activateHandler(event) {
        var t = event.target;
        var items = this.items;
        while (t && t != this) {
            var i = items.indexOf(t);
            if (i >= 0) {
                var value = this.indexToValue(i);
                this.itemActivate(value, t);
                return;
            }
            t = t.parentNode;
        }
    }
    itemActivate(value, item) {
        if (this.dispatchEvent(new CustomEvent('selector-item-activate', { detail: { selected: value, item: item }, composed: true, cancelable: true })))
            this.select(value);
    }
    select(value) {
        this.selected = value;
    }
    updateSelected() {
        this.selectSelected(this.selected);
    }
    selectSelected(selected) {
        if (!this._items)
            return;
        var item = this.valueToItem(this.selected);
        if (item) {
            this._selection.select(item);
        }
        else {
            this._selection.clear();
        }
    }
    valueToItem(value) {
        return (value == null) ? null : this._items[this.valueToIndex(value)];
    }
    valueToIndex(value) {
        return Number(value);
    }
    indexToValue(index) {
        return index;
    }
    indexOf(item) {
        return this._items ? this._items.indexOf(item) : -1;
    }
};
__decorate$3([
    property({ type: String, attribute: 'activate-event' }),
    __metadata$3("design:type", String)
], LitSelector.prototype, "activateEvent", void 0);
__decorate$3([
    property({ type: String, attribute: 'selected-attribute' }),
    __metadata$3("design:type", String)
], LitSelector.prototype, "selectedAttribute", void 0);
__decorate$3([
    property({ type: Number, reflect: true }),
    __metadata$3("design:type", Object)
], LitSelector.prototype, "selected", void 0);
LitSelector = __decorate$3([
    customElement('lit-selector')
], LitSelector);

export { LitGoogleMap, LitGoogleMapMarker, LitGoogleMapsApi, LitSelector };
