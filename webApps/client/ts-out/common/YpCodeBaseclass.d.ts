import { LitElement } from 'lit';
import { YpApp } from '../yp-app/yp-app.js';
import { YpAppGlobals } from '../yp-app/YpAppGlobals.js';
import { YpAppUser } from '../yp-app/YpAppUser.js';
import { YpAppDialogs } from '../yp-dialog-container/yp-app-dialogs.js';
import { YpServerApi } from './YpServerApi.js';
declare global {
    interface Window {
        appGlobals: YpAppGlobals;
        appUser: YpAppUser;
        appDialogs: YpAppDialogs;
        serverApi: YpServerApi;
        app: YpApp;
        locale: string;
        MSStream: any;
        PasswordCredential?: any;
        autoTranslate: boolean;
        FederatedCredential?: any;
    }
}
export declare class YpCodeBase {
    language: string | undefined;
    wide: boolean;
    constructor();
    installMediaQueryWatcher: (mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void) => void;
    _languageEvent(event: CustomEvent): void;
    fire(eventName: string, data: (object | string | boolean | number | null) | undefined, target: LitElement | Document): void;
    fireGlobal(eventName: string, data?: object | string | boolean | number | null): void;
    addListener(name: string, callback: Function, target: LitElement | Document): void;
    addGlobalListener(name: string, callback: Function): void;
    showToast(text: string, timeout?: number): void;
    removeListener(name: string, callback: Function, target: LitElement | Document): void;
    removeGlobalListener(name: string, callback: Function): void;
    t(...args: Array<string>): string;
}
//# sourceMappingURL=YpCodeBaseclass.d.ts.map