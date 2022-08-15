import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import tailwind from 'lit-tailwindcss';
import { PlausibleStyles } from './plausibleStyles';
import { PlausibleBaseElement } from './pl-base-element';

@customElement('pl-link')
export class PlausibleLink extends PlausibleBaseElement {
  @property({ type: String })
  to: string | undefined = undefined;

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          padding-top: 0.40rem;
          padding-bottom: 0.40rem;
        }
      `
    ];
  }

  render() {
    return html` <a href="${this.to}"><slot></slot></a> `;
  }
}
