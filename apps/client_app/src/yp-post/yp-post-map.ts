import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
//TODO: import 'google-map/google-map.js';
//TODO: import 'google-map/google-map-marker.js';
import '../yp-ajax/yp-ajax.js';
import './yp-post-card.js';
import './yp-post-map-info.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

//TODO: CHECK THIS: https://github.com/jakelheknight/google-maps-limited and https://github.com/DoubleTrade/google-map
class YpPostMapLit extends YpBaseElement {
  static get properties() {
    return {
      posts: {
        type: Array,
        value: null
      },

      groupId: {
        type: Number,
        observer: "_groupIdChanged"
      },

      communityId: {
        type: Number,
        observer: "_communityIdChanged"
      },

      noPosts: {
        type: Boolean,
        value: false
      },

      wide: Boolean,
      selectedPost: Object
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

      .mapContainer {
        margin: 0;
        padding: 0;
        width: 960px;
        height: 500px;
        margin-top: 16px;
        margin-bottom: 48px;
      }

      .noMapContainer {
        padding: 32px;
        margin: 16px;
        background-color: #FFF;
        font-size: 22px;
        color: #222;
      }

      #map {
      }

      a {
        color: var(--primary-color-700);
      }

      h1 {
        padding: 24px;
      }

      @media (max-width: 934px) {
        .mapContainer {
          margin: 16px;
          width: 800px;
          height: 400px;
        }
      }

      @media (max-width: 832px) {
        .mapContainer {
          margin: 8px;
          width: 600px;
          height: 340px;
        }
      }

      @media (max-width: 632px) {
        .mapContainer {
          margin: 8px;
          width: 400px;
          height: 300px;
        }
      }

      @media (max-width: 420px) {
        .mapContainer {
          margin: 8px;
          width: 330px;
          height: 250px;
        }
      }

      @media (max-width: 360px) {
        .mapContainer {
          margin: 8px;
          width: 280px;
          height: 200px;
        }
      }

      #myInfoCard {
        background-color: #000;
        padding: 0;
        margin: 0 !important;
        --yp-post-map-info-mixin: {
          padding: 0;
          margin: 0 !important;
          max-width: 100%;
          max-height: 100%;
        };
        --yp-post-map-info-beak-mixin: {
          color: #F57C00;
        };
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <iron-media-query query="(min-width: 1000px)" query-matches="${this.wide}"></iron-media-query>
    <div class="layout vertical center-center">

      ${ this.posts ? html`
        <paper-material id="mapContainer" .elevation="2" class="mapContainer">
          <google-map .AdditionalMapOptions="{'keyboardShortcuts':false}" id="map" .apiKey="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" fit-to-markers="">

            ${ this.posts.map(post => html`
              <google-map-marker slot="markers" .latitude="${this.post.location.latitude}" .longitude="${this.post.location.longitude}" .click-events="" class="marker" @google-map-marker-click="${this.markerClick}">
              </google-map-marker>
            `)}

            <yp-post-map-info id="myInfoCard" .fade-in>
              <yp-post-card .mini .post="${this.selectedPost}"></yp-post-card>
            </yp-post-map-info>
          </google-map>
        </paper-material>
      `: html``}

      ${ this.noPosts ? html`
        <paper-material .elevation="1" class="noMapContainer">
          <div>${this.t('posts.noMapPosts')}</div>
        </paper-material>
      `: html``}

      <div class="layout horizontal center-center">
        <yp-ajax id="ajax" @response="${this._response}"></yp-ajax>
      </div>
    </div>
    `
  }

  resetMapHeight() {
    const map = this.$$("#mapContainer");
    if (map) {
      var windowHeight = window.innerHeight;
      var height;
      if (this.wide) {
        height = windowHeight/1.5;
        //map.style.height = Math.max(Math.min(height, window.innerHeight)),  + 'px';
      } else {
        height = windowHeight/1.5;
      }
      map.style.width = Math.min(window.innerWidth-(this.wide ? 96 : 32), 1920) + 'px';
      map.style.height = height + 'px';
      map.style.marginBottom = "64px";
      this.async(function () {
        var gMap=this.$$("#map");
        if (gMap) {
          gMap.fitToMarkers=true;
          this.async(function () {
            gMap.fitToMarkers=false;
          }, 1000);
        }
      });
    }
 }

  _groupIdChanged(newValue, oldValue) {
    if (newValue) {
      this.posts = null;
      this.$$("#ajax").url = '/api/groups/'+newValue+'/post_locations';
      this.$$("#ajax").generateRequest();
    } else {
      this.posts = null;
    }
  }

  _communityIdChanged(newValue, oldValue) {
    if (newValue) {
      this.posts = null;
      this.$$("#ajax").url = '/api/communities/'+newValue+'/post_locations';
      this.$$("#ajax").generateRequest();
    } else {
      this.posts = null;
    }
  }

  _response(event, detail) {
    if (detail.response && detail.response.length>0) {
      this.noPosts = false;
      this.posts = detail.response;
    } else {
      this.noPosts = true;
    }
    this.async(function () {
      this.resetMapHeight();
    });
  }

  markerClick(e) {
    window.appGlobals.activity('clicked', 'marker');
    this.selectedPost = e.model.get('post');
    const a = this.selectedPost;
    if (e.srcElement) {
      this.$$("#myInfoCard").showInfoWindow(e.srcElement.marker);
    } else {
      this.$$("#myInfoCard").showInfoWindow(e.currentTarget.marker);
    }
    const infocardDiv = this.$$("#myInfoCard").$$("#infocarddiv");
    infocardDiv.children[1].style.zIndex = "20";
  }
}

window.customElements.define('yp-post-map-lit', YpPostMapLit)