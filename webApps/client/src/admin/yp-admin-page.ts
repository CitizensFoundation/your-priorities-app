import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';

export abstract class YpAdminPage extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;
}
