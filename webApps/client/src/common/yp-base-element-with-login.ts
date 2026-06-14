import { property } from 'lit/decorators.js';

import { YpBaseElement } from './yp-base-element.js';

export class YpBaseElementWithLogin extends YpBaseElement {
  @property({ type: Object })
  loggedInUser: YpUserData|undefined;

  private _loggedInListener = this._loggedIn.bind(this);
  private _adminRightsListener = this.requestUpdate.bind(this);

  constructor() {
    super();

    if (window.appUser && window.appUser.user) {
      this.loggedInUser = window.appUser.user;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-logged-in',
      this._loggedInListener
    );
    this.addGlobalListener('yp-got-admin-rights', this._adminRightsListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-logged-in',
      this._loggedInListener
    );
    this.removeGlobalListener('yp-got-admin-rights', this._adminRightsListener);
  }

  get isLoggedIn() {
    return this.loggedInUser != undefined;
  }

  _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;
    this.requestUpdate();
  }
}
