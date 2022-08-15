import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import tailwind from 'lit-tailwindcss';
import { ifDefined } from 'lit/directives/if-defined';
import { PlausibleStyles } from '../plausibleStyles';
import { PlausibleBaseElement } from '../pl-base-element';

function barWidth(
  count: number,
  all: Array<Record<string, number>>,
  plot: string
) {
  let maxVal = all[0][plot];

  for (const val of all) {
    // @ts-ignore
    if (val > maxVal) maxVal = val[plot];
  }

  return (count / maxVal) * 100;
}

@customElement('pl-bar')
export class PlausibleBar extends PlausibleBaseElement {
  @property({ type: Number })
  count!: number;

  @property({ type: Array })
  all!: Array<Record<string, number>>;

  @property({ type: String })
  maxWidthDeduction!: string;

  @property({ type: String })
  plot = 'visitors';

  @property({ type: String })
  bg: string | undefined;

  static get styles() {
    return [
      ...super.styles,
     // tailwind,
      //PlausibleStyles,
      css`
        :host {
          width: 70%;
        }
      `,

      css``,
    ];
  }

  render() {
    const width = barWidth(this.count, this.all, this.plot);
    return html`
      <div
        class="w-full relative"
        .style="max-width: calc(100% - ${this.maxWidthDeduction});"
      >
        <div
          class="${`absolute top-0 left-0 h-full test ${
            this.bg || ''
          }`}"
          .style="width: ${width}%;"
        ></div>
        <slot></slot>
      </div>
    `;
  }
}
