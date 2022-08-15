import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { navigateToQuery, generateQueryString } from './query.js';
import tailwind from 'lit-tailwindcss';
import { PlausibleStyles } from './plausibleStyles.js';
import { PlausibleBaseElement } from './pl-base-element.js';

@customElement('pl-link')
export class PlausibleLink extends PlausibleBaseElement {
  @property({ type: Boolean })
  disabled = false;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  onClick: Function | undefined;

  @property({ type: Object })
  history!: any;

  @property({ type: String })
  className!: string;

  @property({ type: Object })
  to!: PlausibleQueryData;

  @property({ type: Object })
  children: any;

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  render() {
    return html`
      <button
        class="${this.className}"
        @click=${(event: CustomEvent) => {
          event.preventDefault();
          navigateToQuery(this.history, this.query, this.to);
          if (this.onClick) this.onClick(event);
          this.history.push({
            pathname: window.location.pathname,
            search: generateQueryString(this.to),
          });
        }}
        type="button"
        ?disabled=${this.disabled}
      >
        ${this.children}
      </button>
    `;
  }
}