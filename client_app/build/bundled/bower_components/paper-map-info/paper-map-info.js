/// <reference path="bower_components/polymer-ts/polymer-ts.d.ts" />
/// <reference path="typings/underscore.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var paperMapInfo = (function (_super) {
    __extends(paperMapInfo, _super);
    function paperMapInfo() {
        _super.apply(this, arguments);
    }
    /**
     * close infowindow
     */
    paperMapInfo.prototype.close = function () {
        this.isShowing = false;
        this.$.infocarddiv.style.opacity = 0;
        this.$.infocarddiv.style.left = 0;
        this.$.infocarddiv.style.display = "none";
        this.$.stdbeak.style.display = "none";
        this.$.custombeak.style.display = "none";
        this.$.stdbeak.style.opacity = 0;
        this.$.custombeak.style.opacity = 0;
        this._releaseListeners();
        this._marker = undefined;
    };
    /**
     * handle change to content
     */
    paperMapInfo.prototype._contentChanged = function () {
        var _this = this;
        if (this.isShowing) {
            // disconnect while adjusting infowindow position
            if (this._contentObserver)
                this._contentObserver.disconnect();
            // give a moment for sequences of changes to complete,
            // such as ink effects and button elevation animations
            setTimeout(function () {
                _this._getInfowindowSize();
                var placement = _this._setInfowindowPosition();
                if (!_this._placementInBounds(placement)) {
                    _this._panToShowInfowindow(placement);
                }
                // Watch for future updates.
                _this._contentObserver = new MutationObserver(function () { _this._contentChanged(); });
                _this._contentObserver.observe(_this, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }, 300);
        }
    };
    /**
     * clean up when this element is detached from the DOM
     */
    paperMapInfo.prototype.detached = function () {
        this.isShowing = false;
        this.$.infocarddiv.style.left = 0;
        this.$.infocarddiv.style.opacity = this.fadeIn ? 0 : 1;
        this.$.infocarddiv.style.display = "none";
        this.$.stdbeak.display = "none";
        this.$.custombeak.display = "none";
        this.$.stdbeak.opacity = 0;
        this.$.custombeak.opacity = 0;
        this._releaseListeners();
        this._marker = undefined;
        this.map = undefined;
    };
    /**
     * perform fade in animation for card
     */
    paperMapInfo.prototype._doFadeIn = function () {
        var _this = this;
        if (this.isShowing) {
            var currentOpacity = parseFloat(this.$.infocarddiv.style.opacity);
            if (currentOpacity >= 0.9) {
                this.$.infocarddiv.style.opacity = "1";
            }
            else {
                currentOpacity += 0.1;
                this.$.infocarddiv.style.opacity = currentOpacity.toString();
                setTimeout(function () {
                    _this._doFadeIn();
                }, 40);
            }
        }
    };
    /**
     * get infowindow size
     */
    paperMapInfo.prototype._getInfowindowSize = function () {
        var icd = this.$.infocarddiv;
        this._dim.card.width = icd.offsetWidth;
        this._dim.card.height = icd.offsetHeight;
        // and the beak
        if (this.$.custombeak.innerHTML.trim()) {
            var bk = this.$.custombeak;
            this._dim.beak.height = bk.offsetHeight;
            this._dim.beak.width = bk.offsetWidth;
            this._dim.customBeak = true;
        }
        else {
            this._dim.beak = { height: 20, width: 20 };
            this._dim.customBeak = false;
        }
    };
    /**
     * get marker size
     */
    paperMapInfo.prototype._getMarkerSize = function () {
        if (this._marker && this._marker.getIcon()) {
            var mIcon = this._marker.getIcon();
            this._dim.marker.y = mIcon.anchor.y;
            this._dim.marker.x = 0;
        }
        else {
            this._dim.marker = { x: 0, y: 42 }; // height of standard pin
        }
    };
    /**
     * get map size
     */
    paperMapInfo.prototype._getMapSize = function () {
        var gm = this.map.getDiv();
        this._dim.map.width = gm.offsetWidth;
        this._dim.map.height = gm.offsetHeight;
    };
    /**
     * initialize map event listeners
     */
    paperMapInfo.prototype._initListeners = function () {
        var _this = this;
        this._mapListeners = [];
        this._overlay = new google.maps.OverlayView();
        this._overlay.draw = function () { };
        this._overlay.setMap(this.map);
        var reposition = _.throttle(function () {
            _this._getInfowindowSize();
            _this._setInfowindowPosition();
        }, 25);
        this._mapListeners.push(google.maps.event.addListener(this.map, 'projection_changed', function () {
            _this._overlay = new google.maps.OverlayView();
            _this._overlay.draw = function () { };
            _this._overlay.setMap(_this.map);
        }));
        this._mapListeners.push(google.maps.event.addListener(this.map, 'zoom_changed', function (e) {
            if (_this.isShowing) {
                _this._getInfowindowSize();
                _this._setInfowindowPosition();
            }
        }));
        this._mapListeners.push(google.maps.event.addListener(this.map, 'center_changed', function (e) {
            if (_this.isShowing) {
                reposition();
            }
        }));
        this._mapListeners.push(google.maps.event.addListener(this._marker, 'drag', function (e) {
            if (_this.isShowing) {
                _this._setInfowindowPosition();
            }
        }));
        if (this._contentObserver)
            this._contentObserver.disconnect();
        // Watch for future updates.
        this._contentObserver = new MutationObserver(function () { _this._contentChanged(); });
        this._contentObserver.observe(this, {
            childList: true,
            subtree: true,
            characterData: true
        });
    };
    /**
     * when the map is set, initialize the overlay,
     * which can take a moment since it is not loaded automatically
     * with the rest of the map apis
     */
    paperMapInfo.prototype._mapChanged = function (newVal, oldVal) {
        if (this.map) {
            this._overlay = new google.maps.OverlayView();
            this._overlay.draw = function () { };
            this._overlay.setMap(this.map);
        }
    };
    /**
     * Pan the map to move the info card into view
     * @param {Iplacement} placement current info card placement
     */
    paperMapInfo.prototype._panToShowInfowindow = function (placement) {
        var panby = { x: 0, y: 0 };
        if (placement.left < 0) {
            panby.x = placement.left - 10;
        }
        else {
            if ((placement.left + this._dim.card.width) > this._dim.map.width) {
                panby.x = (placement.left + this._dim.card.width) - this._dim.map.width + 10;
            }
        }
        if (placement.top < 0) {
            panby.y = placement.top - 10;
        }
        else {
            if ((placement.top + this._dim.card.height + this._dim.marker.y + 10) > this._dim.map.height) {
                panby.y = (placement.top + this._dim.card.height + this._dim.marker.y) - this._dim.map.height + 20;
            }
        }
        if (panby.x != 0 || panby.y != 0) {
            this.map.panBy(panby.x, panby.y);
        }
    };
    /**
     * Is the current info card placement within the bounds of the map's containing div?
     * @param  {Iplacement} placement current placement of the info card (top, left)
     * @return {boolean}              true if the info card fits inside the map's containing div
     */
    paperMapInfo.prototype._placementInBounds = function (placement) {
        var result = (placement.top >= 0
            && placement.left >= 0
            && (placement.left + this._dim.card.width) < this._dim.map.width
            && (placement.top + this._dim.card.height + this._dim.marker.y + 10) < this._dim.map.height);
        return result;
    };
    /**
     * initialize component
     */
    paperMapInfo.prototype.ready = function () {
        if (this.map) {
            this._overlay = new google.maps.OverlayView();
            this._overlay.draw = function () { };
            this._overlay.setMap(this.map);
        }
    };
    /**
     * release event listeners
     */
    paperMapInfo.prototype._releaseListeners = function () {
        for (var _i = 0, _a = this._mapListeners; _i < _a.length; _i++) {
            var l = _a[_i];
            google.maps.event.removeListener(l);
        }
        this._mapListeners = [];
        if (this._contentObserver) {
            this._contentObserver.disconnect();
            this._contentObserver = undefined;
        }
    };
    /**
     * Sets the info card's position relative to the map's containing div
     * @return {Iplacement} New position of the info card
     */
    paperMapInfo.prototype._setInfowindowPosition = function () {
        if (!this._overlay) {
            this._overlay = new google.maps.OverlayView();
            this._overlay.draw = function () { };
            this._overlay.setMap(this.map);
            console.log("overlay not set");
        }
        var point = this._overlay.getProjection().fromLatLngToContainerPixel(this._marker.getPosition());
        // calculate placement
        var pleft = Math.round(point.x - this._dim.card.width / 2);
        var ptop = Math.round(point.y - this._dim.card.height - this._dim.marker.y - this._dim.beak.height + 10); // beak tucks 10px above bottom edge of window
        this.$.infocarddiv.style.left = pleft + 'px';
        this.$.infocarddiv.style.top = ptop + 'px';
        var bk = this.$.custombeak.innerHTML.trim() ? this.$.custombeak : this.$.stdbeak;
        bk.style.left = (point.x - this._dim.beak.width / 2) + "px";
        bk.style.top = Math.floor(ptop - 10 + this._dim.card.height) + "px"; // beak tucks 10px above bottom edge of window
        return { left: pleft, top: ptop };
    };
    /**
     * Shows the info card on top of the given google map marker
     * @param {google.maps.Marker} marker  The marker to attach the card to
     */
    paperMapInfo.prototype.showInfoWindow = function (marker) {
        var _this = this;
        if (this.map && marker) {
            if (this.isShowing) {
                this.close();
            }
            this._marker = marker;
            this._initListeners();
            this.isShowing = true;
            this.$.infocarddiv.style.display = "block";
            var bk_1 = this.$.custombeak.innerHTML.trim() ? this.$.custombeak : this.$.stdbeak;
            var nbk = this.$.custombeak.innerHTML.trim() ? this.$.stdbeak : this.$.custombeak;
            bk_1.style.opacity = 0;
            bk_1.style.display = "block";
            nbk.style.opacity = 0;
            nbk.style.display = "none";
            // to minimize repositioning due to content size changes
            // as polymer instantiates webcomponents in the <content>,
            // we will pause a few ms before instantiating the infowindow.
            setTimeout(function () {
                _this._initListeners();
                _this._getInfowindowSize();
                _this._getMapSize();
                _this._getMarkerSize();
                var placement = _this._setInfowindowPosition();
                _this.$.infocarddiv.style.opacity = _this.fadeIn ? 0 : 1;
                bk_1.style.opacity = 1;
                if (_this.fadeIn) {
                    _this._doFadeIn();
                }
                if (!_this._placementInBounds(placement)) {
                    _this._panToShowInfowindow(placement);
                }
            }, 33);
        }
    };
    __decorate([
        property({ type: Object, notify: true })
    ], paperMapInfo.prototype, "_contentObserver", void 0);
    __decorate([
        property({ type: Number, notify: true, value: 4 })
    ], paperMapInfo.prototype, "elevation", void 0);
    __decorate([
        property({ type: Boolean, notify: true, value: false })
    ], paperMapInfo.prototype, "fadeIn", void 0);
    __decorate([
        property({ type: Boolean, notify: true, value: false })
    ], paperMapInfo.prototype, "isShowing", void 0);
    __decorate([
        property({ type: Object, notify: true, value: function () { return { card: { height: 10, width: 10 }, map: { height: 100, width: 100 }, marker: { x: 0, y: 42 }, beak: { width: 20, height: 20, customBeak: false } }; } })
    ], paperMapInfo.prototype, "_dim", void 0);
    __decorate([
        property({ type: Object, notify: true, observer: '_mapChanged' })
    ], paperMapInfo.prototype, "map", void 0);
    __decorate([
        property({ type: Array, notify: true, value: function () { return []; } })
    ], paperMapInfo.prototype, "_mapListeners", void 0);
    __decorate([
        property({ type: Object, notify: true })
    ], paperMapInfo.prototype, "_marker", void 0);
    __decorate([
        property({ type: Object, notify: true })
    ], paperMapInfo.prototype, "_overlay", void 0);
    paperMapInfo = __decorate([
        component('paper-map-info')
    ], paperMapInfo);
    return paperMapInfo;
}(polymer.Base));
paperMapInfo.register();
//# sourceMappingURL=paper-map-info.js.map