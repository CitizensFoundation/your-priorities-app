import { Snackbar } from '@material/mwc-snackbar';
import { YpCodeBase } from '../common/YpCodeBaseclass.js'

export class YpOffline extends YpCodeBase {

  sendLaterStoragePrefix = "yp-send-later-";

  _onlineEvent() {
    this._showToast(this.t('youAreOnline'));
    this._checkContentToSend();
  }

  _offlineEvent() {
    this._showToast(this.t('youAreNowOffline'));
  }

  _urlWithQuery(url: string, params: any) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined && typeof params[k] !== 'object')
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    url += (url.indexOf('?') === -1 ? '?' : '&') + query;
    return url;
  }

  _getItemsFromLocalStorage() {
    const items = [] as YpLocaleStorageItemToSendLater[];
    for (let i = 0; i < localStorage.length; i++)
    {
      const key = localStorage.key(i);
      if (key && key.indexOf(this.sendLaterStoragePrefix) > -1) {
        items.push({ key: key, content: JSON.parse(localStorage.getItem(key)!) });
      }
    }

    return items;
  }

  _showToast(text: string) {
    window.appDialogs.getDialogAsync("masterToast", (toast: Snackbar) => {
      toast.labelText = text;
      toast.timeoutMs = 4000;
      toast.open = true;
    });
  }

  _sendItems(items: YpLocaleStorageItemToSendLater[]) {
    items.forEach((item) => {
      const content = item.content;
      fetch(this._urlWithQuery(content.url, content.params), {
        method: content.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content.body)
      }).then(() => {
        this._showToast(this.t('storedDataSent'));
        localStorage.removeItem(item.key);
      }).catch((error) => {
        console.error(error);
        this._showToast(this.t('errorSendingContentWhenOnline'));
      })
    })
  }

  _checkContentToSend() {
    setTimeout( () => {
      const items = this._getItemsFromLocalStorage();
      if (items.length>0) {
        if (!navigator.onLine) {
          this._showToast(this.t('offlineContentSentWhenOnline'));
        } else if (!window.appUser.user) {
          this._showToast(this.t('notLoggedInContentSentWhenLoggedIn'));
        } else {
          this._sendItems(items);
        }
      } else {
        if (!navigator.onLine) {
          this._showToast(this.t('youAreOffline'));
        }
      }
    }, 4000);
  }

  checkContentToSendForLoggedInUser() {
    this._checkContentToSend();
  }

  sendWhenOnlineNext(contentToSendLater: YpContentToSendLater) {
    setTimeout(() => {
      const key = this.sendLaterStoragePrefix+new Date().getTime();
      localStorage.setItem(key, JSON.stringify(contentToSendLater));
      this._showToast(this.t('offlineContentSentWhenOnline'));
    });
  }

  constructor() {
    super();
    window.addEventListener('online',  this._onlineEvent.bind(this));
    window.addEventListener('offline', this._offlineEvent.bind(this));
    this._checkContentToSend();
  }
}
