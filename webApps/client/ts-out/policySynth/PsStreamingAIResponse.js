import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { PsServerApi } from './PsServerApi.js';
import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export class PsStreamingAIResponse extends YpCodeBase {
    constructor(caller, targetContainer = undefined) {
        super();
        this.isActive = false;
        this.caller = caller;
        this.api = new PsServerApi();
        this.targetContainer = targetContainer;
    }
    close() {
        this.ws.close();
        this.isActive = false;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            let wsEndpoint;
            this.isActive = true;
            if (window.location.hostname === 'localhost' ||
                window.location.hostname === '192.1.168') {
                wsEndpoint = `ws://${window.location.hostname}:8000`;
            }
            else {
                wsEndpoint = `wss://${window.location.hostname}:443`;
            }
            this.ws = new WebSocket(wsEndpoint);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onopen = event => {
                this.onWsOpen(event, resolve);
            };
            this.ws.onerror = reject; // Handle connection errors
        });
    }
    onWsOpen(event, resolve) {
        // Assuming the server sends the clientId immediately after connection
        this.ws.onmessage = messageEvent => {
            const data = JSON.parse(messageEvent.data);
            if (data.clientId) {
                this.wsClientId = data.clientId;
                resolve(this.wsClientId); // Resolve the promise with the clientId
                this.ws.onmessage = this.onMessage.bind(this); // Reset the onmessage handler
            }
        };
    }
    onMessage(event) {
        if (!this.isActive)
            return;
        const data = JSON.parse(event.data);
        if (data.type === 'part') {
            if (this.targetContainer) {
                this.targetContainer.innerHTML += data.text;
            }
        }
        this.caller.fire('wsMessage', { data, wsClientId: this.wsClientId });
    }
}
//# sourceMappingURL=PsStreamingAIResponse.js.map