import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import 'vanilla-colorful';

import { Layouts } from './flexbox-literals/classes';
import { YpBaseElement } from './yp-base-element';

@customElement('yp-promotion-settings')
export class YpPromotionSettings extends YpBaseElement {
  @property({ type: String })
  color: string | undefined;

  connectedCallback() {
    super.connectedCallback();
    const savedColor = localStorage.getItem('md3-yrpri-promotion-color');
    if (savedColor) {
      this.color = savedColor;
    } else {
      this.color = '#000000';
    }
  }

  static get styles() {
    return [
      Layouts,
      css`
        .topContainer {
          margin-top: 32px;
        }
      `,
    ];
  }

  render() {
    if (this.color) {
      return html`
        <div class="topContainer">
          <hex-color-picker
            .color="${this.color}"
            @color-changed="${this.handleColorChanged}"
          ></hex-color-picker>
        </div>
      `;
    }
  }

  handleColorChanged(event: CustomEvent) {
    this.color = event.detail.value;
    this.fire('color-changed', { value: this.color });
    localStorage.setItem('md3-yrpri-promotion-color', this.color!);
  }
}
