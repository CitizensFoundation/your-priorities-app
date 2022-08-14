import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { navigateToQuery, generateQueryString } from './query.js';
//import tailwind from 'lit-tailwindcss';
import { PlausibleStyles } from './plausibleStyles.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';

@customElement('pl-query-link')
export class PlausibleQueryLink extends YpBaseElement {
  @property({ type: Object })
  onClickFunction!: any;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  history!: any;

  @property({ type: Object })
  to!: PlausibleQueryData;

  constructor() {
    super();
    this.onClickFunction = this.onClick.bind(this);
  }

  onClick(e: CustomEvent) {
    e.preventDefault();
    navigateToQuery(this.history, this.query, this.to);
    //TODO Look into this
    if (this.onClickFunction) this.onClickFunction(e);
  }

  static get styles() {
    return [
      super.styles,
      //tailwind,
      PlausibleStyles
    ];
  }

  render() {
    return html`
      <pl-link
        .history=${this.history}
        .query=${this.query}
        .to=${{
          pathname: window.location.pathname,
          search: generateQueryString(this.to),
        }}
        @Click=${this.onClick}
      ></pl-link>
    `;
  }
}
