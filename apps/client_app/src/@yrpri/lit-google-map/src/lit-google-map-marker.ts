import {LitElement, customElement, property} from 'lit-element';

@customElement('lit-google-map-marker')
export class LitGoogleMapMarker extends LitElement {
    @property({type : Number, reflect: true})
    latitude : number = 0;

    @property({type : Number, reflect: true})
    longitude : number = 0;

    @property({type : String, reflect: true})
    label : string | null = null;

    @property({type : Number, reflect: true, attribute: 'z-index'})
    zIndex : number = 0;

    @property({type : Boolean, reflect: true})
    open : boolean = false;

    map : google.maps.Map = null;
    marker : google.maps.Marker = null;
    info : google.maps.InfoWindow;
    contentObserver : MutationObserver;
    openInfoHandler : google.maps.MapsEventListener;
    closeInfoHandler : google.maps.MapsEventListener;

    attributeChangedCallback(name : string, oldval : any, newval : any) {
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
                this.marker?.setLabel(newval);
                break;
            }
            case 'z-index': {
                this.marker?.setZIndex(newval);
                break;
            }
        }
    }

    openChanged() {
        if (!this.info)
            return;

        if (this.open) {
            this.info.open(this.map, this.marker);
            this.dispatchEvent(new CustomEvent('google-map-marker-open', { bubbles:true }));
        } else {
            this.info.close();
            this.dispatchEvent(new CustomEvent('google-map-marker-close', { bubbles:true }));
        }
    }

    updatePosition() {
        this.marker?.setPosition(new google.maps.LatLng(this.latitude, this.longitude));
    }

    changeMap(newMap : google.maps.Map) {
        this.map = newMap;
        this.mapChanged();
    }

    mapChanged() {
        // Marker will be rebuilt, so disconnect existing one from old map and listeners.
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
        this.contentObserver.observe( this, {
            childList: true,
            subtree: true
        });

        var content = this.innerHTML.trim();
        if (content) {
            if (!this.info) {
                this.info = new google.maps.InfoWindow();

                this.openInfoHandler = google.maps.event.addListener(this.marker, 'click', function() {
                    this.open = true;
                  }.bind(this));

                  this.closeInfoHandler = google.maps.event.addListener(this.info, 'closeclick', function() {
                    this.open = false;
                  }.bind(this));
            }
            this.info.setContent(content);
        } else {
            if (this.info) {
              // Destroy the existing infowindow.  It doesn't make sense to have an empty one.
              google.maps.event.removeListener(this.openInfoHandler);
              google.maps.event.removeListener(this.closeInfoHandler);
              this.info = null;
            }
        }
    }
}