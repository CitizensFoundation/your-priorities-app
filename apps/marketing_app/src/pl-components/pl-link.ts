import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import tailwind from 'lit-tailwindcss';

@customElement('pl-link')
export class PlausibleLink extends LitElement {
  @property({type: Number}) counter = 0;
  private _privateProp = 'private';

  static get styles() {
    return [
      super.styles,
      tailwind
    ];
  }

  render() {
    return html`
      <a href="https://www.plausible.io"></a>
    `
  }
}