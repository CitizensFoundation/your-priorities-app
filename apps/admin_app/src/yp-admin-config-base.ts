import { LitElement, css, property, html } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from './yp-admin-page.js';

export abstract class YpAdminConfigBase extends YpAdminPage {
  @property({ type: String })
  configTabs: Array<YpConfigTabData>;

  constructor() {
    super();
    this.configTabs = this.setupConfigTabs();
  }

  abstract setupConfigTabs(): Array<YpConfigTabData>;

  renderTabHeader() {
    return html`
      ${ this.configTabs.map( item => html`

      `)}
    `
  }
}
