import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export declare class YpOffline extends YpCodeBase {
    sendLaterStoragePrefix: string;
    _onlineEvent(): void;
    _offlineEvent(): void;
    _urlWithQuery(url: string, params: any): string;
    _getItemsFromLocalStorage(): YpLocaleStorageItemToSendLater[];
    _sendItems(items: YpLocaleStorageItemToSendLater[]): void;
    _checkContentToSend(): void;
    checkContentToSendForLoggedInUser(): void;
    sendWhenOnlineNext(contentToSendLater: YpContentToSendLater): void;
    constructor();
}
//# sourceMappingURL=YpOffline.d.ts.map