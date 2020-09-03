import {LitElement, customElement, property} from 'lit-element';
import {ScriptLoaderMap} from './script-loader-map';

abstract class JsonpLibraryElement extends LitElement {

    public libraryLoaded : boolean = false;

    public libraryErrorMessage : string | null = null;

    abstract get libraryUrl() : string;

    abstract get notifyEvent() : string;

    get callbackName() : string | null {
        return null;
    }

    private isReady : boolean = false;

    libraryUrlChanged() {
        // can't load before ready because notifyEvent might not be set
        if (this.isReady && this.libraryUrl != null)
          this.loadLibrary();
    }

    libraryLoadCallback(error : Error, detail : any) {
        if (error) {
            console.warn('Library load failed:', error.message);
            this.libraryErrorMessage = error.message;
        } else {
            this.libraryErrorMessage = null;
            this.libraryLoaded = true;
            if (this.notifyEvent != null) {
                this.dispatchEvent(new CustomEvent(this.notifyEvent, { detail: detail, composed: true}));
            }
        }
    }

    /** loads the library, and fires this.notifyEvent upon completion */
    loadLibrary() {
        ScriptLoaderMap.getInstance().require(
            this.libraryUrl,
            this.libraryLoadCallback.bind(this),
            this.callbackName);
    }

    connectedCallback() {
        super.connectedCallback();

        this.isReady = true;
        if (this.libraryUrl != null)
            this.loadLibrary();
    }
}

@customElement('lit-google-maps-api')
export class LitGoogleMapsApi extends JsonpLibraryElement {

    @property({type : String, attribute: 'api-key'})
    apiKey = '';

    @property({type : String, attribute: 'client-id'})
    clientId = '';

    @property({type : String, attribute: 'maps-url'})
    mapsUrl = 'https://maps.googleapis.com/maps/api/js?callback=%%callback%%';

    @property({type : String})
    version = '3.39';

    @property({type : String})
    language = '';

    get libraryUrl() : string {
        return this.computeUrl(this.mapsUrl, this.version, this.apiKey, this.clientId, this.language);
    }

    get notifyEvent() : string {
        return 'api-load';
    }

    computeUrl(mapsUrl : string, version : string, apiKey : string, clientId : string, language : string) : string {
        var url = mapsUrl + '&v=' + version;

        // Always load all Maps API libraries.
        url += '&libraries=drawing,geometry,places,visualization';

        if (apiKey && !clientId) {
            url += '&key=' + apiKey;
        }
      
        if (clientId) {
            url += '&client=' + clientId;
        }

        // Log a warning if the user is not using an API Key or Client ID.
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
}