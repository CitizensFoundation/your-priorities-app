Polymer({
  is: 'yp-post-map-info',

  properties: {
    elevation: { type: Number, notify: true, value: 4 },

    fadeIn: { type: Boolean, notify: true, value: false },

    isShowing: { type: Boolean, notify: true, value: false },

    _dim: { type: Object, notify: true },

    map: { type: Object, notify: true, observer: '_mapChanged' },

    _mapListeners: { type: Array, notify: true, value: [] },

    _marker: { type: Object, notify: true },

    _overlay: { type: Object, notify: true },

    _bk: { type: Object },

    _nbk: { type: Object },

    _isCustomBeak: { type: Boolean, notify: true, value: false },

    _watchingSize: { type: Boolean, notify: true, value: false },
  },

  /**
   * close infowindow
   */
  close: function () {
    this._releaseListeners();
    // turn off the resize-aware ??
    this.isShowing = false;
    this.$.infocarddiv.style.opacity = 0;
    this.$.infocarddiv.style.left = 0;
    this.$.infocarddiv.style.display = "none";
    this.$.stdbeak.style.display = "none";
    this.$.custombeak.style.display = "none";
    this.$.stdbeak.style.opacity = 0;
    this.$.custombeak.style.opacity = 0;
    //this._marker = undefined;
  },
  /**
   * handle change to content
   */
  _contentChanged: function () {
    if (this.isShowing) {
      this._getInfowindowSize();
      var placement = this._setInfowindowPosition();
      if (!this._placementInBounds(placement)) {
        this._panToShowInfowindow(placement);
      }
    }
  },
  /**
   * clean up when this element is detached from the DOM
   */
  detached: function () {
    this._releaseListeners();
    this.isShowing = false;
    this.$.infocarddiv.style.left = 0;
    this.$.infocarddiv.style.opacity = this.fadeIn ? 0 : 1;
    this.$.infocarddiv.style.display = "none";
    this.$.stdbeak.display = "none";
    this.$.custombeak.display = "none";
    this.$.stdbeak.opacity = 0;
    this.$.custombeak.opacity = 0;
    this._marker = undefined;
    this.map = undefined;
  },
  /**
   * perform fade in animation for card
   */
  _doFadeIn: function () {
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
  },
  /**
   * get infowindow size
   */
  _getInfowindowSize: function () {
    var icd = this.$.infocarddiv;
    this._dim.card.width = icd.offsetWidth;
    this._dim.card.height = icd.offsetHeight;
    // and the beak
    if (this._isCustomBeak) {
      this._dim.beak.height = this._bk.offsetHeight;
      this._dim.beak.width = this._bk.offsetWidth;
      this._dim.customBeak = true;
    }
    else {
      this._dim.beak = { height: 20, width: 20 },
        this._dim.customBeak = false;
    }
  },
  /**
   * get marker size
   */
  _getMarkerSize: function () {
    if (this._marker && this._marker.getIcon()) {
      var mIcon = this._marker.getIcon();
      this._dim.marker.y = mIcon.anchor.y;
      this._dim.marker.x = 0;
    }
    else {
      this._dim.marker = { x: 0, y: 42 }; // height of standard pin
    }
  },
  /**
   * get map size
   */
  _getMapSize: function () {
    var gm = this.map.getDiv();
    this._dim.map.width = gm.offsetWidth;
    this._dim.map.height = gm.offsetHeight;
  },
  /**
   * initialize map event listeners
   */
  _initListeners: function () {
    var _this = this;
    this._mapListeners = [];
    this._overlay = new google.maps.OverlayView();
    this._overlay.draw = function () { };
    this._overlay.setMap(this.map);
    var reposition = function () {
      if (_this.isShowing) {
        _this._getInfowindowSize();
        _this._setInfowindowPosition();
      }
    };
    this._mapListeners.push(google.maps.event.addListener(this.map, 'projection_changed', function () {
      _this._overlay = new google.maps.OverlayView();
      _this._overlay.draw = function () { },
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
    if (!this._watchingSize) {
      //this.$$('resize-aware').addEventListener('element-resize', function () { _this._contentChanged(); });
    }
  },
  /**
   * when the map is set, initialize the overlay,
   * which can take a moment since it is not loaded automatically
   * with the rest of the map apis
   */
  _mapChanged: function (newVal, oldVal) {
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () { };
      this._overlay.setMap(this.map);
    }
  },
  /**
   * Pan the map to move the info card into view
   * @param {Iplacement} placement current info card placement
   */
  _panToShowInfowindow: function (placement) {
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
  },
  /**
   * Is the current info card placement within the bounds of the map's containing div?
   * @param  {Iplacement} placement current placement of the info card (top, left)
   * @return {boolean}              true if the info card fits inside the map's containing div
   */
  _placementInBounds: function (placement) {
    var result = (placement.top >= 0
      && placement.left >= 0
      && (placement.left + this._dim.card.width) < this._dim.map.width
      && (placement.top + this._dim.card.height + this._dim.marker.y + 10) < this._dim.map.height);
    return result;
  },
  /**
   * initialize component
   */
  ready: function () {
    this.set('_dim', { card: { height: 10, width: 10 }, map: { height: 100, width: 100 }, marker: { x: 0, y: 42 }, beak: { width: 20, height: 20, customBeak: false } });
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () { };
      this._overlay.setMap(this.map);
    }
  },
  /**
   * release event listeners
   */
  _releaseListeners: function () {
    for (var _i = 0, _a = this._mapListeners; _i < _a.length; _i++) {
      var l = _a[_i];
      google.maps.event.removeListener(l);
    }
    this._mapListeners = [];
    // turn off resize listener?
  },
  /**
   * Sets the info card's position relative to the map's containing div
   * @return {Iplacement} New position of the info card
   */
  _setInfowindowPosition: function () {
    if (!this._overlay) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = function () { };
      this._overlay.setMap(this.map);
      console.log("overlay not set");
    }
    var result = { left: 0, top: 0 };
    try {
      var point = this._overlay.getProjection().fromLatLngToContainerPixel(this._marker.getPosition());
      // calculate placement
      var pleft = Math.round(point.x - this._dim.card.width / 2);
      var ptop = Math.round(point.y - this._dim.card.height - this._dim.marker.y - this._dim.beak.height + 10); // beak tucks 10px above bottom edge of window
      this.$.infocarddiv.style.left = pleft + 'px';
      this.$.infocarddiv.style.top = ptop + 'px';
      this._bk.style.left = (point.x - this._dim.beak.width / 2) + "px";
      this._bk.style.top = Math.floor(ptop - 10 + this._dim.card.height) + "px"; // beak tucks 10px above bottom edge of window
      result = { left: pleft, top: ptop };
    }
    catch (err) {
      console.log("setInfowindowPosition error");
      console.log(err);
    };
    return result;
  },
  /**
   * Shows the info card on top of the given google map marker
   * @param {google.maps.Marker} marker  The marker to attach the card to
   */
  showInfoWindow: function (marker) {
    var _this = this;
    if (this.map && marker) {
      if (this.isShowing) {
        this.close();
      }
      this._marker = marker;
      this._getMapSize();
      this._getMarkerSize();
      this.$.infocarddiv.style.display = "block";
      if (Polymer.dom(this.$.custombeakcontent).getDistributedNodes().length > 0) {
        this._bk = this.$.custombeak;
        this._nbk = this.$.stdbeak;
        this._isCustomBeak = true;
      }
      else {
        this._bk = this.$.stdbeak;
        this._nbk = this.$.custombeak;
        this._isCustomBeak = false;
      }
      this._bk.style.opacity = "0";
      this._bk.style.display = "block";
      this._nbk.style.opacity = "0";
      this._nbk.style.display = "none";
      // to minimize repositioning due to content size changes
      // as polymer instantiates webcomponents in the <content>,
      // we will pause a few ms before instantiating the infowindow.
      setTimeout(function () {
        _this._getInfowindowSize();
        var placement = _this._setInfowindowPosition();
        _this.$.infocarddiv.style.opacity = _this.fadeIn ? 0 : 1;
        _this._bk.style.opacity = "1";
        _this._initListeners();
        _this.isShowing = true;
        if (_this.fadeIn) {
          _this._doFadeIn();
        }
        if (!_this._placementInBounds(placement)) {
          _this._panToShowInfowindow(placement);
        }
      }, 33);
    }
  }
});
