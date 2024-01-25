import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export class YpOffline extends YpCodeBase {
    _onlineEvent() {
        this.showToast(this.t('youAreOnline'));
        this._checkContentToSend();
    }
    _offlineEvent() {
        this.showToast(this.t('youAreNowOffline'));
    }
    _urlWithQuery(url, params) {
        const query = Object.keys(params)
            .filter(k => params[k] !== undefined && typeof params[k] !== 'object')
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        url += (url.indexOf('?') === -1 ? '?' : '&') + query;
        return url;
    }
    _getItemsFromLocalStorage() {
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.indexOf(this.sendLaterStoragePrefix) > -1) {
                items.push({ key: key, content: JSON.parse(localStorage.getItem(key)) });
            }
        }
        return items;
    }
    _sendItems(items) {
        items.forEach((item) => {
            const content = item.content;
            fetch(content.url, {
                method: content.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content.body)
            }).then(() => {
                this.showToast(this.t('storedDataSent'));
                localStorage.removeItem(item.key);
            }).catch((error) => {
                console.error(error);
                this.showToast(this.t('errorSendingContentWhenOnline'));
            });
        });
    }
    _checkContentToSend() {
        setTimeout(() => {
            const items = this._getItemsFromLocalStorage();
            if (items.length > 0) {
                if (!navigator.onLine) {
                    this.showToast(this.t('offlineContentSentWhenOnline'));
                }
                else if (!window.appUser.user) {
                    this.showToast(this.t('notLoggedInContentSentWhenLoggedIn'));
                }
                else {
                    this._sendItems(items);
                }
            }
            else {
                if (!navigator.onLine) {
                    this.showToast(this.t('youAreOffline'));
                }
            }
        }, 4000);
    }
    checkContentToSendForLoggedInUser() {
        this._checkContentToSend();
    }
    sendWhenOnlineNext(contentToSendLater) {
        setTimeout(() => {
            const key = this.sendLaterStoragePrefix + new Date().getTime();
            localStorage.setItem(key, JSON.stringify(contentToSendLater));
            this.showToast(this.t('offlineContentSentWhenOnline'));
        });
    }
    constructor() {
        super();
        this.sendLaterStoragePrefix = "yp-send-later-";
        window.addEventListener('online', this._onlineEvent.bind(this));
        window.addEventListener('offline', this._offlineEvent.bind(this));
        this._checkContentToSend();
    }
}
//# sourceMappingURL=YpOffline.js.map