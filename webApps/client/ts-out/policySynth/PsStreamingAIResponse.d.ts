import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { PsServerApi } from './PsServerApi.js';
import { YpCodeBase } from '../common/YpCodeBaseclass.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class PsStreamingAIResponse extends YpCodeBase {
    wsClientId: string;
    targetContainer: HTMLElement | HTMLInputElement | undefined;
    caller: YpBaseElement;
    api: PsServerApi;
    ws: WebSocket;
    isActive: boolean;
    constructor(caller: YpBaseElement, targetContainer?: HTMLElement | HTMLInputElement | undefined);
    close(): void;
    connect(): Promise<string>;
    onWsOpen(event: Event, resolve: (wsClientId: string) => void): void;
    onMessage(event: MessageEvent): void;
}
//# sourceMappingURL=PsStreamingAIResponse.d.ts.map