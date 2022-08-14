import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import tailwind from 'lit-tailwindcss';
import { PlausibleStyles } from './plausibleStyles';
import { PlausibleBaseElement } from './pl-base-element';
import { ifDefined } from 'lit/directives/if-defined';

@customElement('pl-link')
export class PlausibleLink extends PlausibleBaseElement {
  @property({ type: String })
  to: string | undefined = undefined;

  static get styles() {
    return [super.styles, tailwind, PlausibleStyles];
  }

  render() {
    return html` <a href="${ifDefined(this.to)}"><slot></slot></a> `;
  }
}
