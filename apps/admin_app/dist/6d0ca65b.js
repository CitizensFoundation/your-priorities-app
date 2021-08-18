import"./2e043d37.js";import{p as t,c as e,L as i,a as o,h as s,_ as a,e as n,n as r,Y as d,i as l,T as c,A as p,b as h}from"./f69f9111.js";import{Y as u}from"./7b062c34.js";import{m}from"./ec134414.js";let g,y,f=t=>t;class v{constructor(){this.apiMap={}}require(t,e,i){var o=this.nameFromUrl(t);this.apiMap[o]||(this.apiMap[o]=new b(o,t,i)),this.apiMap[o].requestNotify(e)}static getInstance(){return v.instance||(v.instance=new v),v.instance}nameFromUrl(t){return t.replace(/[\:\/\%\?\&\.\=\-\,]/g,"_")+"_api"}}class b{constructor(t,e,i){if(this.callbackMacro="%%callback%%",this.loaded=!1,this.script=null,this.notifiers=[],!i){if(!(e.indexOf(this.callbackMacro)>=0))return void console.error("ScriptLoader class: a %%callback%% parameter is required in libraryUrl");i=t+"_loaded",e=e.replace(this.callbackMacro,i)}this.callbackName=i,window[this.callbackName]=this.success.bind(this),this.addScript(e)}addScript(t){var e=document.createElement("script");e.src=t,e.onerror=this.handleError.bind(this);var i=document.querySelector("script")||document.body;i.parentNode.insertBefore(e,i),this.script=e}removeScript(){this.script.parentNode&&this.script.parentNode.removeChild(this.script),this.script=null}handleError(t){this.error=new Error("Library failed to load"),this.notifyAll(),this.cleanup()}success(){this.loaded=!0,this.result=Array.prototype.slice.call(arguments),this.notifyAll(),this.cleanup()}cleanup(){delete window[this.callbackName]}notifyAll(){this.notifiers.forEach(function(t){t(this.error,this.result)}.bind(this)),this.notifiers=[]}requestNotify(t){this.loaded||this.error?t(this.error,this.result):this.notifiers.push(t)}}var w=function(t,e,i,o){var s,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(n=(a<3?s(n):a>3?s(e,i,n):s(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n},$=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};class x extends i{constructor(){super(...arguments),this.libraryLoaded=!1,this.libraryErrorMessage=null,this.isReady=!1}get callbackName(){return null}libraryUrlChanged(){this.isReady&&null!=this.libraryUrl&&this.loadLibrary()}libraryLoadCallback(t,e){t?(console.warn("Library load failed:",t.message),this.libraryErrorMessage=t.message):(this.libraryErrorMessage=null,this.libraryLoaded=!0,null!=this.notifyEvent&&this.dispatchEvent(new CustomEvent(this.notifyEvent,{detail:e,composed:!0})))}loadLibrary(){v.getInstance().require(this.libraryUrl,this.libraryLoadCallback.bind(this),this.callbackName)}connectedCallback(){super.connectedCallback(),this.isReady=!0,null!=this.libraryUrl&&this.loadLibrary()}}let I=class extends x{constructor(){super(...arguments),this.apiKey="",this.clientId="",this.mapsUrl="https://maps.googleapis.com/maps/api/js?callback=%%callback%%",this.version="3.39",this.language=""}get libraryUrl(){return this.computeUrl(this.mapsUrl,this.version,this.apiKey,this.clientId,this.language)}get notifyEvent(){return"api-load"}computeUrl(t,e,i,o,s){var a=t+"&v="+e;return a+="&libraries=drawing,geometry,places,visualization",i&&!o&&(a+="&key="+i),o&&(a+="&client="+o),i||o||console.warn("No Google Maps API Key or Client ID specified. See https://developers.google.com/maps/documentation/javascript/get-api-key for instructions to get started with a key or client id."),s&&(a+="&language="+s),a}};w([t({type:String,attribute:"api-key"}),$("design:type",Object)],I.prototype,"apiKey",void 0),w([t({type:String,attribute:"client-id"}),$("design:type",Object)],I.prototype,"clientId",void 0),w([t({type:String,attribute:"maps-url"}),$("design:type",Object)],I.prototype,"mapsUrl",void 0),w([t({type:String}),$("design:type",Object)],I.prototype,"version",void 0),w([t({type:String}),$("design:type",Object)],I.prototype,"language",void 0),I=w([e("lit-google-maps-api")],I);var T=function(t,e,i,o){var s,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(n=(a<3?s(n):a>3?s(e,i,n):s(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n},C=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let _=class extends i{constructor(){super(...arguments),this.latitude=0,this.longitude=0,this.label=null,this.zIndex=0,this.open=!1,this.map=null,this.marker=null}attributeChangedCallback(t,e,i){var o,s;switch(super.attributeChangedCallback(t,e,i),t){case"open":this.openChanged();break;case"latitude":case"longitude":this.updatePosition();break;case"label":null===(o=this.marker)||void 0===o||o.setLabel(i);break;case"z-index":null===(s=this.marker)||void 0===s||s.setZIndex(i)}}openChanged(){this.info&&(this.open?(this.info.open(this.map,this.marker),this.dispatchEvent(new CustomEvent("google-map-marker-open",{bubbles:!0}))):(this.info.close(),this.dispatchEvent(new CustomEvent("google-map-marker-close",{bubbles:!0}))))}updatePosition(){var t;null===(t=this.marker)||void 0===t||t.setPosition(new google.maps.LatLng(this.latitude,this.longitude))}changeMap(t){this.map=t,this.mapChanged()}mapChanged(){this.marker&&(this.marker.setMap(null),google.maps.event.clearInstanceListeners(this.marker)),this.map&&this.map instanceof google.maps.Map&&this.mapReady()}mapReady(){this.marker=new google.maps.Marker({map:this.map,position:{lat:this.latitude,lng:this.longitude},label:this.label,zIndex:this.zIndex}),this.contentChanged()}contentChanged(){this.contentObserver&&this.contentObserver.disconnect(),this.contentObserver=new MutationObserver(this.contentChanged.bind(this)),this.contentObserver.observe(this,{childList:!0,subtree:!0});var t=this.innerHTML.trim();t?(this.info||(this.info=new google.maps.InfoWindow,this.openInfoHandler=google.maps.event.addListener(this.marker,"click",function(){this.open=!0}.bind(this)),this.closeInfoHandler=google.maps.event.addListener(this.info,"closeclick",function(){this.open=!1}.bind(this))),this.info.setContent(t)):this.info&&(google.maps.event.removeListener(this.openInfoHandler),google.maps.event.removeListener(this.closeInfoHandler),this.info=null)}};T([t({type:Number,reflect:!0}),C("design:type",Number)],_.prototype,"latitude",void 0),T([t({type:Number,reflect:!0}),C("design:type",Number)],_.prototype,"longitude",void 0),T([t({type:String,reflect:!0}),C("design:type",String)],_.prototype,"label",void 0),T([t({type:Number,reflect:!0,attribute:"z-index"}),C("design:type",Number)],_.prototype,"zIndex",void 0),T([t({type:Boolean,reflect:!0}),C("design:type",Boolean)],_.prototype,"open",void 0),_=T([e("lit-google-map-marker")],_);var S=function(t,e,i,o){var s,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(n=(a<3?s(n):a>3?s(e,i,n):s(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n},k=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let L=class extends i{constructor(){super(...arguments),this.apiKey="",this.version="3.39",this.styles={},this.zoom=8,this.fitToMarkers=!1,this.mapType="roadmap",this.centerLatitude=-34.397,this.centerLongitude=150.644,this.map=null}initGMap(){if(null==this.map){var t=this.shadowRoot.getElementById("api");null!=t&&1==t.libraryLoaded&&(this.map=new google.maps.Map(this.shadowRoot.getElementById("map"),this.getMapOptions()),this.updateMarkers())}}getMapOptions(){return{zoom:this.zoom,center:{lat:this.centerLatitude,lng:this.centerLongitude},mapTypeId:this.mapType,styles:this.styles}}mapApiLoaded(){this.initGMap()}connectedCallback(){super.connectedCallback(),this.initGMap()}attachChildrenToMap(t){if(this.map)for(var e,i=0;e=t[i];++i)e.changeMap(this.map)}observeMarkers(){this.marketObserverSet||(this.addEventListener("items-changed",(t=>{this.updateMarkers()})),this.marketObserverSet=!0)}updateMarkers(){this.observeMarkers();var t=this.shadowRoot.getElementById("markers-selector");if(t){var e=t.items;if(this.markers&&e.length===this.markers.length&&0==e.filter((t=>this.markers&&-1===this.markers.indexOf(t))).length)return;this.markers=e,this.attachChildrenToMap(this.markers),this.fitToMarkers&&this.fitToMarkersChanged()}}fitToMarkersChanged(){if(this.map&&this.fitToMarkers&&this.markers.length>0){for(var t,e=new google.maps.LatLngBounds,i=0;t=this.markers[i];++i)e.extend(new google.maps.LatLng(t.latitude,t.longitude));this.markers.length>1&&this.map.fitBounds(e),this.map.setCenter(e.getCenter())}}deselectMarker(t){}static get styles(){return o(g||(g=f`#map{width:100%;height:100%}`))}render(){return s(y||(y=f` <lit-google-maps-api id="api" api-key="${0}" version="${0}" @api-load="${0}"></lit-google-maps-api> <lit-selector id="markers-selector" selected-attribute="open" activate-event="google-map-marker-open" @google-map-marker-close="${0}"> <slot id="markers" name="markers"></slot> </lit-selector> <div id="map"> </div> `),this.apiKey,this.version,(()=>this.mapApiLoaded()),(t=>this.deselectMarker(t)))}};S([t({type:String,attribute:"api-key"}),k("design:type",String)],L.prototype,"apiKey",void 0),S([t({type:String}),k("design:type",String)],L.prototype,"version",void 0),S([t({type:Object}),k("design:type",Object)],L.prototype,"styles",void 0),S([t({type:Number}),k("design:type",Number)],L.prototype,"zoom",void 0),S([t({type:Boolean,attribute:"fit-to-markers"}),k("design:type",Boolean)],L.prototype,"fitToMarkers",void 0),S([t({type:String,attribute:"map-type"}),k("design:type",String)],L.prototype,"mapType",void 0),S([t({type:Number,attribute:"center-latitude"}),k("design:type",Number)],L.prototype,"centerLatitude",void 0),S([t({type:Number,attribute:"center-longitude"}),k("design:type",Number)],L.prototype,"centerLongitude",void 0),L=S([e("lit-google-map")],L);class A{constructor(t){this.multi=!1,this.selection=[],this.selectCallback=t}get(){return this.multi?this.selection.slice():this.selection[0]}clear(t){this.selection.slice().forEach((e=>{(!t||t.indexOf(e)<0)&&this.setItemSelected(e,!1)}))}isSelected(t){return this.selection.indexOf(t)>=0}setItemSelected(t,e){if(null!=t&&e!=this.isSelected(t)){if(e)this.selection.push(t);else{var i=this.selection.indexOf(t);i>=0&&this.selection.splice(i,1)}this.selectCallback&&this.selectCallback(t,e)}}select(t){this.multi?this.toggle(t):this.get()!==t&&(this.setItemSelected(this.get(),!1),this.setItemSelected(t,!0))}toggle(t){this.setItemSelected(t,!this.isSelected(t))}}var M=function(t,e,i,o){var s,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(n=(a<3?s(n):a>3?s(e,i,n):s(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n},P=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let N=class extends i{constructor(){super(...arguments),this.activateEvent="tap",this.selectedAttribute=null,this.selected=null,this._selection=new A(((t,e)=>this.applySelection(t,e))),this._items=[]}get items(){return this._items}connectedCallback(){super.connectedCallback(),this.addEventListener("slotchange",(t=>{t.stopPropagation(),this.updateItems(),this.dispatchEvent(new CustomEvent("selector-items-changed",{detail:{},composed:!0}))})),this.addListener(this.activateEvent)}disconnectedCallback(){super.disconnectedCallback(),this.removeListener(this.activateEvent)}attributeChangedCallback(t,e,i){switch(super.attributeChangedCallback(t,e,i),t){case"selected":this.updateSelected()}}applySelection(t,e){this.selectedAttribute&&t instanceof Element&&e!=t.hasAttribute(this.selectedAttribute)&&t.toggleAttribute(this.selectedAttribute)}updateItems(){var t,e,i=this.querySelector("slot");this._items=null!=(e=null===(t=i)||void 0===t?void 0:t.assignedNodes())?e:[]}addListener(t){this.addEventListener(t,(t=>this.activateHandler(t)))}removeListener(t){this.removeEventListener(t,(t=>this.activateHandler(t)))}activateHandler(t){for(var e=t.target,i=this.items;e&&e!=this;){var o=i.indexOf(e);if(o>=0){var s=this.indexToValue(o);return void this.itemActivate(s,e)}e=e.parentNode}}itemActivate(t,e){this.dispatchEvent(new CustomEvent("selector-item-activate",{detail:{selected:t,item:e},composed:!0,cancelable:!0}))&&this.select(t)}select(t){this.selected=t}updateSelected(){this.selectSelected(this.selected)}selectSelected(t){if(this._items){var e=this.valueToItem(this.selected);e?this._selection.select(e):this._selection.clear()}}valueToItem(t){return null==t?null:this._items[this.valueToIndex(t)]}valueToIndex(t){return Number(t)}indexToValue(t){return t}indexOf(t){return this._items?this._items.indexOf(t):-1}};M([t({type:String,attribute:"activate-event"}),P("design:type",String)],N.prototype,"activateEvent",void 0),M([t({type:String,attribute:"selected-attribute"}),P("design:type",String)],N.prototype,"selectedAttribute",void 0),M([t({type:Number,reflect:!0}),P("design:type",Object)],N.prototype,"selected",void 0),N=M([e("lit-selector")],N);let O,Q,H=t=>t,R=class extends d{constructor(){super(...arguments),this.defaultLatitude=64.13897027178841,this.defaultLongitude=-21.876912117004395,this.mapSearchString="",this.mapSearchResultAddress="",this.active=!1,this.narrowPad=!1}updated(t){super.updated(t),t.has("group")&&this._groupChanged(),t.has("location")&&this._locationChanged(),t.has("post")&&this._postChanged()}static get styles(){return[super.styles,l(O||(O=H`
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

        mwc-input {
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

        .mapContainer {
          width: 450px;
          height: 250px;
        }
      `))]}render(){return this.group?c(Q||(Q=H`<div class="mapContainer">
            <lit-google-map
              id="map"
              @map-zoom-changed="${0}"
              api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0"
              version="weekly"
              @map-type-changed="${0}"
              class="map"
              @zoom-changed="${0}"
              fit-to-markers>
              <lit-google-map-marker
                slot="markers"
                .latitude="${0}"
                .longitude="${0}"
                id="marker"></lit-google-map-marker>
            </lit-google-map>
          </div>
          <div class="mapSearchInput layout vertical center-center">
            <div class="layout horizontal center-center wrap">
              <mwc-textfield
                maxlength="60"
                id="mapSearchInput"
                .label="${0}"
                .value="${0}"
                @keydown="${0}"></mwc-textfield>
              <mwc-button
                @click="${0}"
                .label="${0}"></mwc-button>
            </div>
            <div class="searchResultText layout horizontal center-center">
              ${0}
            </div>
            <mwc-circular-progress-four-color
              hidden
              id="spinner"></mwc-circular-progress-four-color>
          </div> `),this._mapZoomChanged,this._mapTypeChanged,this._zoomChanged,this.location?this.location.latitude:this.defaultLatitude,this.location?this.location.longitude:this.defaultLongitude,this.t("maps.searchInput"),this.mapSearchString,this._submitOnEnter,this._searchMap,this.t("maps.search"),this.mapSearchResultAddress):p}_mapZoomChanged(t){this.location&&(this.location.map_zoom=t.detail)}get mapZoom(){return this.location&&this.location.map_zoom?this.location.map_zoom:15}_submitOnEnter(t){13===t.keyCode&&this._searchMap()}_searchMap(){const t=this.$$("#map"),e=new google.maps.places.PlacesService(t);this.$$("#spinner").hidden=!1;const i={query:this.$$("#mapSearchInput").value,fields:["name","geometry"]};e.findPlaceFromQuery(i,((t,e)=>{e===google.maps.places.PlacesServiceStatus.OK&&(this.$$("#spinner").hidden=!0,t&&t.length>0&&(this.mapSearchResultAddress=t[0].formatted_address,this.$$("#map").zoom=15,this.location={latitude:t[0].geometry.location.lat(),longitude:t[0].geometry.location.lng(),map_zoom:15},this.$$("#map").updateMarkers()))})),this.mapSearchResultAddress=""}connectedCallback(){super.connectedCallback(),this.location||setTimeout((()=>{"geolocation"in navigator&&navigator.geolocation.getCurrentPosition((t=>{this.location||(this.location={latitude:t.coords.latitude,longitude:t.coords.longitude,map_zoom:13})}))}),50)}_zoomChanged(t){this.location&&t.detail&&t.detail.value&&(this.location.map_zoom=t.detail.value),this.encodedLocation=JSON.stringify(this.location)}_mapTypeChanged(t){this.location&&t.detail&&t.detail.value&&(this.location.mapType=t.detail.value),this.encodedLocation=JSON.stringify(this.location)}_locationChanged(){if(this.location){const t=this.$$("#map");this.location.map_zoom&&(t.zoom=this.location.map_zoom),this.location.mapType&&(t.mapType=this.location.mapType),t.requestUpdate(),this.encodedLocation=JSON.stringify(this.location)}}_setLocation(t){this.location={latitude:t.detail.latLng.lat(),longitude:t.detail.latLng.lng(),mapType:this.$$("#map").mapType,map_zoom:this.$$("#map").zoom}}_groupChanged(){const t=this.group;if(t){let e;t.configuration&&t.configuration.defaultLocationLongLat&&""!=t.configuration.defaultLocationLongLat&&t.configuration.defaultLocationLongLat.split(",").length>1?(e=t.configuration.defaultLocationLongLat.trim().split(","),this.defaultLongitude=parseFloat(e[0]),this.defaultLatitude=parseFloat(e[1])):t.Community&&t.Community.configuration&&t.Community.configuration.defaultLocationLongLat&&""!=t.Community.configuration.defaultLocationLongLat&&t.Community.configuration.defaultLocationLongLat.split(",").length>1&&(e=t.Community.configuration.defaultLocationLongLat.trim().split(","),this.defaultLongitude=parseFloat(e[0]),this.defaultLatitude=parseFloat(e[1]))}}_postChanged(){this.post||(this.location=void 0)}};a([n({type:Object})],R.prototype,"map",void 0),a([n({type:Object})],R.prototype,"group",void 0),a([n({type:Object})],R.prototype,"post",void 0),a([n({type:Number})],R.prototype,"defaultLatitude",void 0),a([n({type:Number})],R.prototype,"defaultLongitude",void 0),a([n({type:String})],R.prototype,"mapSearchString",void 0),a([n({type:String})],R.prototype,"mapSearchResultAddress",void 0),a([n({type:Object})],R.prototype,"location",void 0),a([n({type:String})],R.prototype,"encodedLocation",void 0),a([n({type:Object})],R.prototype,"marker",void 0),a([n({type:Boolean})],R.prototype,"active",void 0),a([n({type:Boolean})],R.prototype,"narrowPad",void 0),R=a([r("yp-post-location")],R);let E,j,D,z,U,q,F,B,V,J,Y,W,G,Z,K,X,tt,et,it,ot,st,at,nt,rt,dt,lt,ct,pt,ht,ut,mt,gt=t=>t;const yt=0,ft=1,vt=3;let bt=class extends u{constructor(){super(...arguments),this.action="/posts",this.newPost=!1,this.locationHidden=!1,this.selected=0,this.mapActive=!1,this.hasOnlyOneTab=!1,this.structuredAnswersJson="",this.structuredAnswersString="",this.selectedCoverMediaType="none",this.emailValidationPattern="^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$",this.liveQuestionIds=[],this.uniqueIdsToElementIndexes={},this.liveUniqueIds=[]}updated(t){super.updated(t),t.has("post")&&this._postChanged(),t.has("locationHidden")&&this._locationHiddenChanged(),t.has("location")&&this._locationChanged(),t.has("selectedCategoryArrayId")&&this._selectedCategoryChanged(),t.has("selectedCoverMediaType")&&this._uploadedHeaderImageIdChanged(),t.has("selected")&&(this._selectedChanged(),this.selected),this._setupStructuredQuestions()}static get styles(){return[super.styles,l(E||(E=gt`
        .access {
        }

        mwc-button {
          background-color: var(--accent-color);
          color: #fff;
        }

        yp-file-upload {
          margin-top: 16px;
        }

        .accessHeader {
          color: var(--primary-color, #777);
          font-weight: normal;
          margin-bottom: 0;
        }

        mwc-radio {
          display: block;
        }

        .container {
          width: 100%;
          width: 100%;
        }

        yp-post-location {
          min-height: 320px;
        }

        @media (max-width: 600px) {
          .container {
            padding-right: 16px;
          }

          .subContainer {
          }

          mwc-tab {
            font-size: 12px;
          }
        }

        yp-post-location {
        }

        section {
          margin-top: 32px;
        }

        .imageSizeInfo {
          font-size: 12px;
          padding-bottom: 16px;
          color: #444;
        }

        mwc-select {
          max-width: 250px;
        }

        .optional {
          font-size: 12px;
        }

        .icon {
          padding-right: 8px;
        }

        [hidden] {
          display: none !important;
        }

        mwc-checkbox {
          margin-left: 8px;
          margin-top: 4px;
        }

        section {
          width: 100%;
        }

        .contactInfo {
          margin-top: 16px;
        }

        #description {
          --mwc-textfield-container-input: {
            max-height: 125px;
          }
        }

        .postEmoji {
          margin-left: 16px;
          direction: ltr !important;
        }

        .pointEmoji {
          direction: ltr !important;
        }

        .uploadSection {
          max-width: 220px;
          vertical-align: top;
          margin-left: 8px;
          margin-right: 8px;
        }

        @media (max-width: 600px) {
          .uploadSection {
            max-width: 100%;
          }

          .videoCam {
          }

          yp-structured-question-edit {
            max-width: calc(100vw - 64px);
          }
        }

        .postCoverVideoInfo {
          margin-top: 8px;
        }

        .videoUploadDisclamer {
          margin-top: 6px;
          font-size: 12px;
          padding: 0;
          max-width: 200px;
        }

        .categoryDropDown {
          margin-bottom: 8px;
        }

        .topNewPostContainer[no-title] {
          margin-top: -42px;
        }

        mwc-tab-bar[title-disabled] {
          margin-bottom: 24px;
        }

        .videoCamIcon {
          margin-left: 6px;
          margin-bottom: 2px;
        }

        .mediaTab {
          vertical-align: center;
        }

        #pointFor {
          width: 100%;
        }

        .attachmentInfo {
          margin-top: -8px;
          margin-left: 8px;
        }
      `))]}_setSelectedTab(t){this.selected=t.detail.index}renderTabs(){return c(j||(j=gt`
      <mwc-tab-bar
        ?title-disabled="${0}"
        .activeIndex="${0}"
        @MDCTabBar:activated="${0}"
        id="paperTabs"
        focused
        ?hidden="${0}">
        <mwc-tab
          stacked
          .label="${0}"
          icon="lightbulb_outline"></mwc-tab>

        ${0}
        ${0}
        ${0}
      </mwc-tab-bar>
    `),this.group.configuration.hideNameInputAndReplaceWith,this.selected,this._setSelectedTab,this.hasOnlyOneTab,this.t("post.yourPost"),this.newPointShown?c(D||(D=gt`
              <mwc-tab
                stacked
                icon="comment"
                .label="${0}">
              </mwc-tab>
            `),this.t("post.yourPoint")):p,this.locationHidden?p:c(z||(z=gt`
              <mwc-tab
                stacked
                icon="location_on"
                .label="${0}"></mwc-tab>
            `),this.t("post.location")),this.mediaHidden?p:c(U||(U=gt`
              <mwc-tab stacked icon="videocam" .label=" ${0}">
              </mwc-tab>
            `),this.t("media")))}renderMoreContactInfo(){return c(q||(q=gt`
      <h2 class="contactInfo">
        ${0}
      </h2>
      <mwc-textfield
        id="contactName"
        name="contactName"
        type="text"
        .label="${0}"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactEmail"
        name="contactEmail"
        type="text"
        .label="${0}"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactTelephone"
        name="contacTelephone"
        type="text"
        .label="${0}"
        maxlength="20"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactAddress"
        name="contactAddress"
        type="text"
        ?hidden="${0}"
        .label="${0}"
        maxlength="300"
        charCounter>
      </mwc-textfield>
    `),this.t("contactInformation"),this.t("user.name"),this.t("user.email"),this.t("contactTelephone"),!this.group.configuration.moreContactInformationAddress,this.t("contactAddress"))}get titleQuestionText(){return this.post&&this.group&&this.customTitleQuestionText?this.customTitleQuestionText:this.post&&this.group&&this.group.configuration&&this.group.configuration.customTitleQuestionText?this.group.configuration.customTitleQuestionText:this.t("title")}renderDescriptionTab(){var t,e;return this.group?c(F||(F=gt`
          <section>
            <div class="layout vertical flex">
              ${0}
              ${0}
              ${0}
              ${0}
              ${0}
              ${0}
            </div>
          </section>
        `),this.group.configuration.hideNameInputAndReplaceWith?c(B||(B=gt`
                    <input
                      type="hidden"
                      name="name"
                      .value="${0}" />
                  `),this.replacedName||""):this.post?c(V||(V=gt`
                    <mwc-textfield
                      id="name"
                      required
                      minlength="1"
                      name="name"
                      type="text"
                      .label="${0}"
                      .value="${0}"
                      maxlength="60"
                      charCounter>
                    </mwc-textfield>
                  `),this.titleQuestionText,this.post.name):p,this.showCategories&&this.group.Categories?c(J||(J=gt`
                    <mwc-select
                      class="categoryDropDown"
                      .label="${0}"
                      @selected="${0}"
                      ?required="${0}">
                      ${0}
                    </mwc-select>
                    <input
                      type="hidden"
                      name="categoryId"
                      .value="${0}" />
                  `),this.t("category.select"),this._selectedCategory,this.group.configuration.makeCategoryRequiredOnNewPost,this.group.Categories.map((t=>c(Y||(Y=gt`
                          <mwc-list-item .data-category-id="${0}"
                            >${0}</mwc-list-item
                          >
                        `),t.id,t.name))),this.selectedCategoryId?this.selectedCategoryId.toString():""):p,this.postDescriptionLimit?c(W||(W=gt`
                    <mwc-textarea
                      id="description"
                      ?hidden="${0}"
                      ?required="${0}"
                      minlength="1"
                      name="description"
                      .value="${0}"
                      .label="${0}"
                      @change="${0}"
                      char-counter
                      rows="2"
                      max-rows="5"
                      maxrows="5"
                      maxlength="${0}">
                    </mwc-textarea>

                    <div
                      class="horizontal end-justified layout postEmoji"
                      ?hidden="${0}">
                      <emoji-selector
                        id="emojiSelectorDescription"
                        ?hidden="${0}"></emoji-selector>
                    </div>
                  `),null!=this.structuredQuestions,null==this.structuredQuestions,this.post.description,this.t("post.description"),this._resizeScrollerIfNeeded,this.postDescriptionLimit,this.group.configuration.hideEmoji,null!=this.structuredQuestions):p,null!=this.structuredQuestions?c(G||(G=gt`
                    ${0}
                  `),this.structuredQuestions.map(((t,e)=>c(Z||(Z=gt`
                        <yp-structured-question-edit
                          .index="${0}"
                          is-from-new-post
                          use-small-font
                          id="structuredQuestionContainer_${0}"
                          ?dontFocusFirstQuestion="${0}"
                          @resize-scroller="${0}"
                          .structuredAnswers="${0}"
                          ?isLastRating="${0}"
                          ?isFirstRating="${0}"
                          ?hideQuestionIndex="${0}"
                          .question="${0}">
                        </yp-structured-question-edit>
                      `),e,e,!this.group.configuration.hideNameInputAndReplaceWith,this._resizeScrollerIfNeeded,this.initialStructuredAnswersJson,this._isLastRating(e),this._isFirstRating(e),this.group.configuration.hideQuestionIndexOnNewPost,t)))):p,this.group.configuration.attachmentsEnabled?c(K||(K=gt`
                    <yp-file-upload
                      id="attachmentFileUpload"
                      raised
                      attachmentUpload
                      buttonIcon="attach_file"
                      .group="${0}"
                      .buttonText="${0}"
                      accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,image/*"
                      .target="/api/groups/${0}/upload_document"
                      method="POST"
                      @success="${0}">
                    </yp-file-upload>
                    <small class="attachmentInfo">${0}</small>

                    ${0}
                  `),this.group,this.t("uploadAttachment"),this.group.id,this._documentUploaded,this.t("documentOnlyVisibleToAdmins"),(null===(e=null===(t=this.post.data)||void 0===t?void 0:t.attachment)||void 0===e?void 0:e.url)?c(X||(X=gt`
                          <mwc-checkbox name="deleteAttachment"
                            >${0}:
                            ${0}</mwc-checkbox
                          >
                        `),this.t("deleteAttachment"),this.post.data.attachment.filename):p):p,this.group.configuration.moreContactInformation?this.renderMoreContactInfo():p):p}renderPointTab(){return this.newPointShown?c(tt||(tt=gt`
          <section class="subContainer">
            <mwc-textarea
              id="pointFor"
              ?required="${0}"
              minlength="1"
              name="pointFor"
              .value="${0}"
              .label="${0}"
              charCounter
              rows="2"
              max-rows="5"
              .maxlength="${0}">
            </mwc-textarea>
            <div
              class="horizontal end-justified layout pointEmoji"
              ?hidden="${0}">
              <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
            </div>
          </section>
        `),!this.group.configuration.newPointOptional,this.post.pointFor||"",this.t("point.for"),this.pointMaxLength,this.group.configuration.hideEmoji):p}renderLocationTab(){return this.locationHidden?p:c(et||(et=gt`
          <section>
            ${0}
          </section>
        `),this.mapActive&&this.group?c(it||(it=gt`
                  <yp-post-location
                    .encodedLocation="${0}"
                    .location="${0}"
                    .group="${0}"
                    .post="${0}"></yp-post-location>
                `),this.encodedLocation,this.location,this.group,this.post):p)}renderCoverMediaSelection(){return c(ot||(ot=gt`
      <h3 class="accessHeader">${0}</h3>
      <div
        id="coverMediaType"
        name="coverMediaType"
        class="coverMediaType layout horizontal wrap"
        .selected="${0}">
        <mwc-formfield label="${0}">
          <mwc-radio
            value="none"
            id="mediaNone"
            ?checked="${0}"
            @change="${0}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${0}"
          ?hidden="${0}">
          <mwc-radio
            value="image"
            id="mediaImage"
            ?checked="${0}"
            @change="${0}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${0}"
          ?hidden="${0}">
          <mwc-radio
            value="video"
            id="mediaVideo"
            ?checked="${0}"
            @change="${0}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${0}"
          ?hidden="${0}">
          <mwc-radio
            value="audio"
            id="mediaAudio"
            ?checked="${0}"
            @change="${0}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        ${0}
      </div>
    `),this.t("post.cover.media"),this.selectedCoverMediaType,this.t("post.cover.none"),"none"===this.selectedCoverMediaType,this._setSelectedCoverMediaType,this.t("post.cover.image"),!this.uploadedHeaderImageId,"image"===this.selectedCoverMediaType,this._setSelectedCoverMediaType,this.t("postCoverVideo"),!this.showVideoCover,"video"===this.selectedCoverMediaType,this._setSelectedCoverMediaType,this.t("postCoverAudio"),!this.showAudioCover,"audio"===this.selectedCoverMediaType,this._setSelectedCoverMediaType,this.location?c(st||(st=gt`
              <mwc-formfield label="${0}">
                <mwc-radio
                  value="map"
                  ?checked="${0}"
                  id="mediaMap"
                  @change="${0}"
                  name="radioButtonsMedia">
                </mwc-radio>
              </mwc-formfield>

              <mwc-formfield label="${0}">
                <mwc-radio
                  value="streetView"
                  id="mediaStreetview"
                  ?checked="${0}"
                  @change="${0}"
                  name="radioButtonsMedia">
                </mwc-radio>
              </mwc-formfield>
            `),this.t("post.cover.map"),"map"===this.selectedCoverMediaType,this._setSelectedCoverMediaType,this.t("post.cover.streetview"),"streetView"===this.selectedCoverMediaType,this._setSelectedCoverMediaType):p)}renderMediaTab(){return c(at||(at=gt`
      <section>
        <div class="layout vertical center-center">
          <div class="layout horizontal center-center wrap">
            <div
              class="layout vertical center-center self-start uploadSection"
              ?hidden="${0}">
              <yp-file-upload
                id="imageFileUpload"
                raised
                target="/api/images?itemType=post-header"
                method="POST"
                buttonIcon="photo_camera"
                .buttonText="${0}"
                @success="${0}">
              </yp-file-upload>
              <div class="imageSizeInfo layout horizontal">
                <div>864 x 486 (16/9 widescreen)</div>
              </div>
              <div>${0}</div>
            </div>

            ${0}
            ${0}
          </div>
          <br />
          ${0}
        </div>
      </section>
    `),this.group.configuration.hidePostImageUploads,this.t("image.upload"),this._imageUploaded,this.t("post.cover.imageInfo"),this.group.configuration.allowPostVideoUploads?c(nt||(nt=gt`
                  <div
                    class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload
                      id="videoFileUpload"
                      container-type="posts"
                      .group="${0}"
                      raised
                      .uploadLimitSeconds="${0}"
                      videoUpload
                      buttonIcon="videocam"
                      .buttonText="${0}"
                      method="POST"
                      @success="${0}">
                    </yp-file-upload>
                    <div
                      class="videoUploadDisclamer"
                      ?hidden="${0}">
                      ${0}
                    </div>
                  </div>
                `),this.group,this.group.configuration.videoPostUploadLimitSec,this.t("uploadVideo"),this._videoUploaded,!this.group.configuration.showVideoUploadDisclaimer||!this.uploadedVideoId,this.t("videoUploadDisclaimer")):p,this.group.configuration.allowPostAudioUploads?c(rt||(rt=gt`
                  <div
                    class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload
                      id="audioFileUpload"
                      containerType="posts"
                      .group="${0}"
                      raised
                      .uploadLimitSeconds="${0}"
                      .multi="false"
                      audioUpload
                      method="POST"
                      buttonIcon="keyboard_voice"
                      .buttonText="${0}"
                      @success="${0}">
                    </yp-file-upload>
                  </div>
                `),this.group,this.group.configuration.audioPostUploadLimitSec,this.t("uploadAudio"),this._audioUploaded):p,this.renderCoverMediaSelection())}_setSelectedCoverMediaType(t){this.selectedCoverMediaType=t.target.value}get _pointPageHidden(){return!this.newPointShown||this.selected!==ft}get _mediaPageHidden(){return!!this.mediaHidden||(!(!this.newPointShown||this.locationHidden||this.selected===vt)||(!(!this.newPointShown||!this.locationHidden||this.selected===vt-1)||(!(this.newPointShown||!this.locationHidden||this.selected===vt-2)||!this.newPointShown&&!this.locationHidden&&this.selected!==vt-1)))}renderCurrentTabPage(){return c(dt||(dt=gt`
      <div ?hidden="${0}">
        ${0}
      </div>
      <div ?hidden="${0}">
        ${0}
      </div>
      <div ?hidden="${0}">
        ${0}
      </div>
      <div ?hidden="${0}">
        ${0}
      </div>
    `),this.selected!==yt,this.renderDescriptionTab(),this._pointPageHidden,this.renderPointTab(),!1,this.renderLocationTab(),this._mediaPageHidden,this.renderMediaTab())}renderHiddenInputs(){return c(lt||(lt=gt` <input
        type="hidden"
        name="location"
        .value="${0}" />
      <input
        type="hidden"
        name="coverMediaType"
        .value="${0}" />
      <input
        type="hidden"
        name="uploadedHeaderImageId"
        .value="${0}" />
      <input
        type="hidden"
        name="uploadedDocumentUrl"
        .value="${0}" />
      <input
        type="hidden"
        name="uploadedDocumentFilename"
        .value="${0}" />
      <input
        type="hidden"
        name="structuredAnswers"
        .value="${0}" />
      <input
        type="hidden"
        name="structuredAnswersJson"
        .value="${0}" />`),this.encodedLocation||"",this.selectedCoverMediaType,this.uploadedHeaderImageId?this.uploadedHeaderImageId.toString():"",this.uploadedDocumentUrl||"",this.uploadedDocumentFilename||"",this.structuredAnswersString,this.structuredAnswersJson)}render(){return c(ct||(ct=gt`
      <yp-edit-dialog
        name="postEdit"
        doubleWidth
        id="editDialog"
        icon="lightbulb_outline"
        .action="${0}"
        .useNextTabAction="${0}"
        @next-tab-action="${0}"
        .method="${0}"
        .heading="${0}"
        .saveText="${0}"
        class="container"
        customSubmit
        .nextActionText="${0}"
        .snackbarText="${0}"
        .params="${0}">
        ${0}
      </yp-edit-dialog>

      ${0}
      ${0}
      ${0}
    `),this.action,this.newPost,this._nextTab,this.method,this.editHeaderText?this.editHeaderText:"",this.saveText,this.t("next"),this.snackbarText,this.params,this.group&&this.post?c(pt||(pt=gt`
              <div
                class="layout vertical wrap topNewPostContainer"
                ?no-title="${0}">
                ${0} ${0}
              </div>
              ${0}
            `),this.group.configuration.hideNameInputAndReplaceWith,this.renderTabs(),this.renderCurrentTabPage(),this.renderHiddenInputs()):p,this.group&&this.group.configuration.alternativeTextForNewIdeaButtonHeader?c(ht||(ht=gt`
            <yp-magic-text
              id="alternativeTextForNewIdeaButtonHeaderId"
              hidden
              .contentId="${0}"
              textOnly
              .content="${0}"
              .contentLanguage="${0}"
              @new-translation="${0}"
              text-type="alternativeTextForNewIdeaButtonHeader"></yp-magic-text>
          `),this.group.id,this.group.configuration.alternativeTextForNewIdeaButtonHeader,this.group.language,this._alternativeTextForNewIdeaButtonHeaderTranslation):p,this.group&&this.group.configuration.customThankYouTextNewPosts?c(ut||(ut=gt`
            <yp-magic-text
              id="customThankYouTextNewPostsId"
              hidden
              .contentId="${0}"
              text-only
              .content="${0}"
              .contentLanguage="${0}"
              text-type="customThankYouTextNewPosts"></yp-magic-text>
          `),this.group.id,this.group.configuration.customThankYouTextNewPosts,this.group.language):p,this.group&&this.group.configuration.customTitleQuestionText?c(mt||(mt=gt`
            <yp-magic-text
              id="customTitleQuestionTextId"
              hidden
              .contentId="${0}"
              text-only
              .content="${0}"
              .contentLanguage="${0}"
              @new-translation="${0}"
              text-type="customTitleQuestionText"></yp-magic-text>
          `),this.group.id,this.group.configuration.customTitleQuestionText,this.group.language,this._updatePostTitle):p)}_updatePostTitle(){setTimeout((()=>{const t=this.$$("#customTitleQuestionTextId");t&&t.finalContent&&(this.customTitleQuestionText=t.finalContent)}))}connectedCallback(){super.connectedCallback(),this.addListener("yp-form-invalid",this._formInvalid),this.addListener("yp-custom-form-submit",this._customSubmit),this.addListener("yp-skip-to-unique-id",this._skipToId),this.addListener("yp-open-to-unique-id",this._openToId),this.addListener("yp-goto-next-index",this._goToNextIndex)}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-form-invalid",this._formInvalid),this.removeListener("yp-custom-form-submit",this._customSubmit),this.removeListener("yp-skip-to-unique-id",this._skipToId),this.removeListener("yp-open-to-unique-id",this._openToId),this.removeListener("yp-goto-next-index",this._goToNextIndex)}_isLastRating(t){return this.structuredQuestions&&"rating"===this.structuredQuestions[t].subType&&t+2<this.structuredQuestions.length&&"rating"!==this.structuredQuestions[t+1].subType}_isFirstRating(t){return this.structuredQuestions&&"rating"===this.structuredQuestions[t].subType&&this.structuredQuestions[t-1]&&"rating"!==this.structuredQuestions[t-1].subType}_openToId(t){this._skipToId(t,!0)}_goToNextIndex(t){const e=this.liveQuestionIds.indexOf(t.detail.currentIndex);if(e<this.liveQuestionIds.length-1){const t=this.$$("#structuredQuestionContainer_"+this.liveQuestionIds[e+1]);t.scrollIntoView({block:"center",inline:"center",behavior:"smooth"}),t.focus()}}_skipToId(t,e){let i=!1;if(this.$$("#surveyContainer")){const o=this.$$("#surveyContainer").children;for(let s=0;s<o.length;s++){const a=t.detail.toId.replace(/]/g,""),n=t.detail.fromId.replace(/]/g,"");if(o[s+1]&&o[s+1].question&&o[s+1].question.uniqueId&&"a"===o[s+1].question.uniqueId.substring(o[s+1].question.uniqueId.length-1)&&(o[s].question.uniqueId=o[s+1].question.uniqueId.substring(0,o[s+1].question.uniqueId.length-1)),o[s].question&&t.detail.fromId&&o[s].question.uniqueId===n)i=!0;else{if(o[s].question&&t.detail.toId&&(o[s].question.uniqueId===a||o[s].question.uniqueId===a+"a"))break;i&&(o[s].hidden=!e)}}}else console.error("No survey container found")}get replacedName(){const t=this.post,e=this.group;if(t&&e&&e.configuration.hideNameInputAndReplaceWith){let t=e.configuration.hideNameInputAndReplaceWith;return t=t.replace("<DATESECONDS>",m(new Date).format("DD/MM/YYYY hh:mm:ss")),t=t.replace("<DATEMINUTES>",m(new Date).format("DD/MM/YYYY hh:mm")),t=t.replace("<DATE>",m(new Date).format("DD/MM/YYYY")),t}return null}get pointMaxLength(){const t=this.group;return t&&t.configuration&&t.configuration.pointCharLimit?t.configuration.pointCharLimit:500}_floatIfValueOrIE(t){return/Trident.*rv[ :]*11\./.test(navigator.userAgent)||t}get newPointShown(){let t=!1;return this.group&&this.group.configuration&&!0===this.group.configuration.hideNewPointOnNewIdea&&(t=!0),this.newPost&&!t}_submitWithStructuredQuestionsJson(){const t=[];this.liveQuestionIds.forEach((e=>{const i=this.$$("#structuredQuestionContainer_"+e);if(i){const e=i.getAnswer();e?t.push(e):console.error("Can't find answer to question")}})),this.structuredAnswersJson=JSON.stringify(t),this.$$("#editDialog")._reallySubmit()}_submitWithStructuredQuestionsString(){let t="",e="";for(let i=0;i<this.structuredQuestions.length;i+=1)t+=this.structuredQuestions[i].text,this.structuredQuestions[i].text&&"?"!==this.structuredQuestions[i].text[this.structuredQuestions[i].text.length-1]&&(t+=":"),t+="\n",t+=this.structuredQuestions[i].value,e+=this.structuredQuestions[i].value,i!==this.structuredQuestions.length-1&&(e+="%!#x",t+="\n\n");this.post&&(this.post.description=t),this.structuredAnswersString=e,this.$$("#editDialog")._reallySubmit()}_customSubmit(){this.group&&this.group.configuration&&this.group.configuration.structuredQuestionsJson?this._submitWithStructuredQuestionsJson():this.structuredQuestions&&this.structuredQuestions.length>0?this._submitWithStructuredQuestionsString():this.$$("#editDialog")._reallySubmit()}_resizeScrollerIfNeeded(){this.$$("#editDialog").scrollResize()}_getStructuredQuestionsString(){const t=[],e=this.group.configuration.structuredQuestions.split(",");for(let i=0;i<e.length;i+=2){const o=e[i],s=e[i+1];t.push({text:o,maxLength:parseInt(s),value:""})}if(!this.newPost&&this.post&&this.post.public_data&&this.post.public_data.structuredAnswers&&""!==this.post.public_data.structuredAnswers){const e=this.post.public_data.structuredAnswers.split("%!#x");for(let i=0;i<e.length;i+=1)t[i]&&(t[i].value=e[i])}return t}_setupStructuredQuestions(){const t=this.post,e=this.group;if(t&&e&&e.configuration.structuredQuestionsJson)this.structuredQuestions=e.configuration.structuredQuestionsJson;else{if(!(t&&e&&e.configuration.structuredQuestions&&""!==e.configuration.structuredQuestions))return;this.structuredQuestions=this._getStructuredQuestionsString()}}get showVideoCover(){return this.uploadedVideoId||this.currentVideoId}get showAudioCover(){return this.uploadedAudioId||this.currentAudioId}_videoUploaded(t){this.uploadedVideoId=t.detail.videoId,this.$$("#mediaVideo").checked=!0,setTimeout((()=>{this.fire("iron-resize")}),50)}_audioUploaded(t){this.uploadedAudioId=t.detail.audioId,this.selectedCoverMediaType="audio",setTimeout((()=>{this.fire("iron-resize")}))}_documentUploaded(t){const e=t.detail.xhr.responseURL.split("?")[0];this.uploadedDocumentUrl=e,this.uploadedDocumentFilename=t.detail.filename}customFormResponse(){window.appGlobals.groupLoadNewPost=!0}_updateEmojiBindings(){setTimeout((()=>{const t=this.$$("#description"),e=this.$$("#emojiSelectorDescription");t&&e?e.inputTarget=t:console.warn("Post edit: Can't bind emojis :(");const i=this.$$("#emojiSelectorPointFor"),o=this.$$("#pointFor");i&&o&&(i.inputTarget=o)}),500)}_locationHiddenChanged(){}_formInvalid(){this.newPointShown&&!this.$$("#pointFor").checkValidity()?this.selected=1:this.selected=0,this.$$("#name")&&(this.$$("#name").autoValidate=!0),this.$$("#description")&&(this.$$("#description").autoValidate=!0),this.newPointShown&&(this.$$("#pointFor").autoValidate=!0)}_locationChanged(){!this.location||this.selectedCoverMediaType&&""!=this.selectedCoverMediaType&&"none"!=this.selectedCoverMediaType||(this.selectedCoverMediaType="map")}_uploadedHeaderImageIdChanged(){this.uploadedHeaderImageId&&(this.selectedCoverMediaType="image")}_getTabLength(){let t=4;return this.newPointShown||(t-=1),this.locationHidden&&(t-=1),this.mediaHidden&&(t-=1),t}_nextTab(){const t=this._getTabLength();this.selected<t&&(this.selected=this.selected+1)}_selectedChanged(){const t=this.selected;setTimeout((()=>{this.locationHidden||t!=(this.newPointShown?2:1)?this.mapActive=!1:this.mapActive=!0;const e=this._getTabLength()-1;if(0===e&&(this.hasOnlyOneTab=!0),this.$$("#editDialog").useNextTabAction=t!=e,0==t){const t=this.$$("#name");t&&t.focus()}if(1==t&&this.newPointShown){const t=this.$$("#pointFor");t&&t.focus()}setTimeout((()=>{this._resizeScrollerIfNeeded()}),50)}))}_selectedCategory(t){this.selectedCategoryArrayId=t.detail.index}_selectedCategoryChanged(){this.selectedCategoryArrayId&&this.group&&this.group.Categories&&(this.selectedCategoryId=this.group.Categories[this.selectedCategoryArrayId].id)}get showCategories(){return!(!this.group||!this.group.Categories)&&this.group.Categories.length>0}getPositionInArrayFromId(t,e){for(let i=0;i<t.length;i++)if(t[i].id==e)return i}_postChanged(){this.newPost&&this.post&&(this.post.location&&(this.location=this.post.location,this.encodedLocation=JSON.stringify(this.location)),this.post.cover_media_type&&(this.selectedCoverMediaType=this.post.cover_media_type)),this._updateEmojiBindings()}_updateInitialCategory(t){t&&this.post&&this.post.category_id&&t.Categories&&(this.selectedCategoryId=this.post.category_id,this.selectedCategoryArrayId=this.getPositionInArrayFromId(t.Categories,this.post.category_id))}_imageUploaded(t){const e=JSON.parse(t.detail.xhr.response);this.uploadedHeaderImageId=e.id}async _redirectAfterVideo(t){this.post=t,await window.serverApi.completeMediaPost("videos","PUT",this.post.id,{videoId:this.uploadedVideoId,appLanguage:this.language}),this._finishRedirect(t),setTimeout((()=>{window.appGlobals.showSpeechToTextInfoIfNeeded()}),20)}async _redirectAfterAudio(t){this.post=t,await window.serverApi.completeMediaPost("audios","PUT",this.post.id,{audioId:this.uploadedAudioId,appLanguage:this.language}),this._finishRedirect(t),setTimeout((()=>{window.appGlobals.showSpeechToTextInfoIfNeeded()}),20)}customRedirect(t){t?(t.newEndorsement&&window.appUser&&window.appUser.endorsementPostsIndex&&(window.appUser.endorsementPostsIndex[t.id]=t.newEndorsement),this.uploadedVideoId?this._redirectAfterVideo(t):this.uploadedAudioId&&this.newPost?this._redirectAfterAudio(t):this._finishRedirect(t)):console.warn("No post found on custom redirect")}_finishRedirect(t){var e;this.fire("yp-reset-keep-open-for-page"),window.appGlobals.activity("completed","newPost");let i=this.t("thankYouForYourSubmission");const o=this.$$("#customThankYouTextNewPostsId");this.group&&this.group.configuration&&this.group.configuration.customThankYouTextNewPosts&&o&&o.content&&(i=o.finalContent?o.finalContent:o.content),window.appDialogs.getDialogAsync("mastersnackbar",(t=>{t.textContent=i,t.timeoutMs=5e3,t.open=!0})),this.group&&this.group.configuration&&this.group.configuration.allPostsBlockedByDefault||h.redirectTo("/post/"+(t?t.id:null===(e=this.post)||void 0===e?void 0:e.id))}clear(){this.newPost&&(this.post={name:"",description:"",pointFor:"",categoryId:void 0},this.location=void 0,this.selectedCategoryArrayId=void 0,this.selectedCategoryId=void 0,this.selected=0,this.uploadedHeaderImageId=void 0,this.uploadedVideoId=void 0,this.uploadedAudioId=void 0,this.currentVideoId=void 0,this.currentAudioId=void 0,this.selectedCoverMediaType="none",this.requestUpdate(),this.$$("#imageFileUpload")&&this.$$("#imageFileUpload").clear())}setup(t,e,i,o){this._setupGroup(o),t?(this.post=t,t.PostVideos&&t.PostVideos.length>0&&(this.currentVideoId=t.PostVideos[0].id),t.PostAudios&&t.PostAudios.length>0&&(this.currentAudioId=t.PostAudios[0].id)):this.post=void 0,this._updateInitialCategory(o),this.newPost=e,this.refreshFunction=i,this.setupTranslation(),this.clear()}_setupGroup(t){t&&(this.group=t,t.configuration?(t.configuration.locationHidden&&1==t.configuration.locationHidden?this.locationHidden=!0:this.locationHidden=!1,t.configuration.postDescriptionLimit?this.postDescriptionLimit=t.configuration.postDescriptionLimit:this.postDescriptionLimit=500,t.configuration.structuredQuestionsJson&&setTimeout((()=>{this.liveQuestionIds=[],this.uniqueIdsToElementIndexes={},this.liveUniqueIds=[],t.configuration.structuredQuestionsJson.forEach(((t,e)=>{"textfield"!==t.type.toLowerCase()&&"textfieldlong"!==t.type.toLowerCase()&&"textarea"!==t.type.toLowerCase()&&"textarealong"!==t.type.toLowerCase()&&"numberfield"!==t.type.toLowerCase()&&"checkboxes"!==t.type.toLowerCase()&&"radios"!==t.type.toLowerCase()&&"dropdown"!==t.type.toLowerCase()||(this.liveQuestionIds.push(e),this.uniqueIdsToElementIndexes[t.uniqueId]=e,this.liveUniqueIds.push(t.uniqueId))}))}))):this.postDescriptionLimit=500,setTimeout((()=>{this.structuredQuestions&&(this.postDescriptionLimit=9999)}),50))}get mediaHidden(){return!(!this.group||!this.group.configuration||!0!==this.group.configuration.hideMediaInput)}setupAfterOpen(t){this._setupGroup(t.group),setTimeout((()=>{const t=this.$$("#name");t&&t.focus()}),250),this.post&&!this.newPost&&this.post.public_data&&this.post.public_data.structuredAnswersJson&&(this.initialStructuredAnswersJson=this.post.public_data.structuredAnswersJson)}_alternativeTextForNewIdeaButtonHeaderTranslation(){setTimeout((()=>{const t=this.$$("#alternativeTextForNewIdeaButtonHeaderId");t&&t.finalContent&&(this.editHeaderText=t.finalContent)}))}setupTranslation(){setTimeout((()=>{if(this.t)if(this.newPost){if(this.group&&this.group.configuration&&this.group.configuration.alternativeTextForNewIdeaButtonHeader){const t=this.$$("#alternativeTextForNewIdeaButtonHeaderId");this.editHeaderText=t&&t.finalContent?t.finalContent:this.group.configuration.alternativeTextForNewIdeaButtonHeader}else this.editHeaderText=this.t("post.new");this.snackbarText=this.t("postCreated"),this.saveText=this.t("create")}else this.saveText=this.t("save"),this.editHeaderText=this.t("post.edit"),this.snackbarText=this.t("postUpdated")}),20)}};a([n({type:String})],bt.prototype,"action",void 0),a([n({type:Boolean})],bt.prototype,"newPost",void 0),a([n({type:Number})],bt.prototype,"selectedCategoryArrayId",void 0),a([n({type:Array})],bt.prototype,"initialStructuredAnswersJson",void 0),a([n({type:Array})],bt.prototype,"structuredQuestions",void 0),a([n({type:Object})],bt.prototype,"post",void 0),a([n({type:Object})],bt.prototype,"group",void 0),a([n({type:Boolean})],bt.prototype,"locationHidden",void 0),a([n({type:Object})],bt.prototype,"location",void 0),a([n({type:String})],bt.prototype,"encodedLocation",void 0),a([n({type:Number})],bt.prototype,"selectedCategoryId",void 0),a([n({type:Number})],bt.prototype,"uploadedVideoId",void 0),a([n({type:Number})],bt.prototype,"uploadedAudioId",void 0),a([n({type:Number})],bt.prototype,"currentVideoId",void 0),a([n({type:Number})],bt.prototype,"currentAudioId",void 0),a([n({type:Number})],bt.prototype,"selected",void 0),a([n({type:Boolean})],bt.prototype,"mapActive",void 0),a([n({type:Boolean})],bt.prototype,"hasOnlyOneTab",void 0),a([n({type:Number})],bt.prototype,"postDescriptionLimit",void 0),a([n({type:String})],bt.prototype,"sructuredAnswersString",void 0),a([n({type:String})],bt.prototype,"structuredAnswersJson",void 0),a([n({type:String})],bt.prototype,"structuredAnswersString",void 0),a([n({type:String})],bt.prototype,"uploadedDocumentUrl",void 0),a([n({type:String})],bt.prototype,"uploadedDocumentFilename",void 0),a([n({type:String})],bt.prototype,"selectedCoverMediaType",void 0),a([n({type:Number})],bt.prototype,"uploadedHeaderImageId",void 0),a([n({type:String})],bt.prototype,"customTitleQuestionText",void 0),bt=a([r("yp-post-edit")],bt);
